const { r } = require('rethinkdb-ts');
const polka = require('polka');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const strings = require('./strings');

async function init() {
    if (!await fs.pathExists('./data/config.json')) { console.log(strings.NO_CONFIG); process.exit(-1) };
    const { rethink, server: { port, backendPort }, jwtSecret } = require('./data/config.json');

    const db = rethink.database || 'pokole';

    // Connect to RethinkDB
    try {
        await r.connectPool({ host: rethink.host, port: rethink.port, user: rethink.user, password: rethink.password, db })
    } catch (err) {
        exit(strings.DB_CONNECT_ERROR(err));
    } finally {
        console.log(strings.DB_CONNECTED)
    }

    // If RethinkDB doesn't have the needed database then create it
    await r.branch(r.dbList().contains(db), null, r.dbCreate(db)).run().catch(err => exit(strings.DB_CREATE_ERROR));

    // If RethinkDB doesn't have a `users` table in the database then create it
    await r.branch(r.tableList().contains('users'), null, r.tableCreate('users')).run().catch(err => exit(strings.TABLE_CREATE_ERROR('users')));

    // If RethinkDB doesn't have a `links` table in the database then create it
    await r.branch(r.tableList().contains('links'), null, r.tableCreate('links')).run().catch(err => exit(strings.TABLE_CREATE_ERROR('links')));


    if (!jwtSecret) exit(strings.NO_JWT);

    // Polka Middleware: Attach the RethinkDB instance to all the requests
    const attachRethink = (req, res, next) => {
        req.db = r;
        next();
    }

    // Frontend
    polka()
        .use(attachRethink)
        .use(middleware.status)
        .use(middleware.redirect)
        .get('/:short', async (req, res) => {
            const { short } = req.params;
            const data = await r.table('links').filter({ short }).run();
            if (!data[0]) return res.redirect('/');
            else return res.redirect(data[0].long);
        })
        .listen(port, err => {
            if (err) exit(strings.SERVER_ERROR(err));
            console.log(strings.SERVER_START(port));
        });

    // Backend
    polka()
        .use(attachRethink)
        .use(middleware.authentificate)
        .use(middleware.status)
        .use(middleware.redirect)
        .use(middleware.json)
        .use('/register', require('./routes/register'))
        .use('/login', require('./routes/login'))
        .use('/me', require('./routes/me'))
        .use('/shorten', require('./routes/shorten'))
        .listen(backendPort, err => {
            if (err) exit(strings.SERVER_ERROR(err));
            console.log(strings.SERVER_BACKEND_START(backendPort));
        });
}

// Log a message and exit the process
function exit(text, code = -1) {
    console.log(text);
    process.exit(code);
}

// Middlewares for Polka
const middleware = {
    // Easy way to set a status of a response
    status: function (req, res, next) {
        res.status = function (code) {
            this.setHeader('status', code);
            return this;
        };

        return next();
    },

    // Easy way to redirect
    redirect: function (req, res, next) {
        res.redirect = function (url) {
            this.writeHead(302, { "Location": url });
            return this.end();
        }

        return next();
    },

    // Return a JSON response
    json: function (req, res, next) {
        res.json = function (data) {
            this.writeHead(200, { "Content-Type": "application/json" });
            return this.end(data);
        }

        return next();
    },

    authentificate: function (req, res, next) {
        req.auth = async function () {
            let auth = req.headers['authorization'];

            // Authentification
            if (!auth || !auth.includes('Bearer')) return res.status(403).json(error(strings.VALID_TOKEN));
            auth = auth.substring(7);

            let verified;
            try {
                verified = jwt.verify(auth, require('./data/config').jwtSecret);
            } catch (err) {
                res.status(403).json(strings.JWT[err.name](err))
                return null;
            }

            return verified.data;
        }

        return next();
    }
}

init();