const polka = require('polka');
const jwt = require('jsonwebtoken');
const strings = require('../strings');

const URLRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

const { JWT } = require('../strings');
const { jwtSecret, shortLength } = require('../data/config');

const router = polka();

router.post('/', async (req, res) => {
    const url = req.headers['url'];
    let auth = req.headers['authorization'];
    const custom = req.headers['custom'];

    // Authentification
    if (!auth || !auth.includes('Bearer')) return res.status(403).end(error('Please provide a valid token! (login)'));
    auth = auth.substring(7);

    let verified;
    try {
        verified = jwt.verify(auth, jwtSecret);
    } catch (err) {
        return res.status(403).end(JWT[err.name](err))
    }

    // If the URL is not provided, end the request
    if (!url) return res.status(403).end(error(strings.NO_URL));

    // Check if the provided URL is valid
    if (!URLRegex.test(url)) return res.status(403).end(error(strings.INVALID_URL));

    // Do this if there is a custom desired short URL 
    if (custom) {
        if (await req.db.table('links').filter({ short: custom }).count().run()) return res.status(403).end(error(strings.URL_IN_USE));
        return await insertURL(res, req.db, url, custom, verified.data);
    }

    let short = generateString(shortLength);

    // Small fail-safe
    if (await req.db.table('links').filter({ short }).count().run()) short = generateString(shortLength);

    return await insertURL(res, req.db, url, short, verified.data);
})

async function insertURL(res, db, long, short, id) {
    const inserted = await db.table('links').insert({ long, short, user_id: id }).run();
    if (inserted.inserted) return res.end(success(strings.SUCCESS_ADD_URL(short)));
    else return res.status(500).end(error(strings.SOMETHING_WENT_WRONG));
}

function generateString(length = 5) {
    const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('');
    let final = '';

    for (let i = 0; i < 5; i++) {
        final += ABC[Math.floor(Math.random() * ABC.length)]
    }

    return final;
}

const error = (text) => JSON.stringify({ error: text });
const success = (text) => JSON.stringify({ success: text });

module.exports = router;