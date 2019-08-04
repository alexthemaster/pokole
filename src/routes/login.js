const polka = require('polka');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const strings = require('../strings');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const { jwtSecret } = require('../data/config');

const router = polka();

router.post('/', async (req, res) => {
    const user = req.headers['user'];
    const password = req.headers['password'];

    // If one of these two is not provided, end the requests
    if (!user) return res.status(403).json(error(strings.NO_LOGIN));
    if (!password) return res.status(403).json(error(strings.NO_PASSWORD));

    const filter = emailRegex.test(user) ? { email: user } : { username: user };

    // Check if the username exists in the database
    const account = await req.db.table('users').filter(filter).run();
    if (!account[0]) return res.status(403).json(strings.NO_ACCOUNT);

    // Check if the provided password is the correct one
    const pass = await bcrypt.compare(password, account[0].password);
    if (!pass) return res.status(403).json(error(strings.WRONG_PASSWORD));

    // Set the expiration time to an hour
    const expirationTime = 3600;

    // Return a token the user will be able to use
    return res.json(token(jwt.sign({ data: account[0].id, exp: Math.floor(Date.now() / 1000) + expirationTime }, jwtSecret), expirationTime))
})

const error = (text) => JSON.stringify({ error: text });
const token = (text, time) => JSON.stringify({ token: text, expiresIn: time });

module.exports = router;