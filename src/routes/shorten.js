const polka = require('polka');
const strings = require('../strings');

const URLRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const WordRegex = /^[\w\-\_]+/;

const { shortLength } = require('../data/config');

const router = polka();

router.post('/', async (req, res) => {
    const url = req.headers['url'];
    const custom = req.headers['custom'];

    const id = await req.auth();
    if (!id) return;

    // If the URL is not provided, json the request
    if (!url) return res.status(403).json(strings.ERROR(strings.NO_URL));

    // Check if the provided URL is valid
    if (!URLRegex.test(url)) return res.status(403).json(strings.ERROR(strings.INVALID_URL));

    // Check if the provided URL contains any banned words
    if (strings.BLOCKED.some(el => url.toLowerCase().includes(el))) return res.status(403).json(strings.ERROR(strings.BANNED_URL));

    // Do this if there is a user desired shortlink
    if (custom) {
        // If the user desired shortlink has a blocked character or word in it, return an error
        // The WordRegex makes sure that only A-Z characters, numbers, dashes and underscores are usable
        if (!WordRegex.test(custom) || strings.BLOCKED.some(el => custom.toLowerCase().includes(el))) return res.status(403).json(strings.ERROR(strings.BANNED_WORD));

        // If the user desired shortlink is in use, return an error
        if (await req.db.table('links').filter({ short: custom }).count().run()) return res.status(403).json(strings.ERROR(strings.URL_IN_USE));

        return await insertURL(res, req.db, url, custom, id);
    }

    let short = generateString(shortLength);

    // Small fail-safe
    if (await req.db.table('links').filter({ short }).count().run()) short = generateString(shortLength);

    return await insertURL(res, req.db, url, short, id);
})

async function insertURL(res, db, long, short, id) {
    const inserted = await db.table('links').insert({ long, short, user_id: id }).run();
    if (inserted.inserted) return res.json(strings.SUCCESS_ADD_URL(short));
    else return res.status(500).json(strings.ERROR(strings.SOMETHING_WENT_WRONG));
}

function generateString(length = 5) {
    const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('');
    let final = '';

    for (let i = 0; i < length; i++) {
        final += ABC[Math.floor(Math.random() * ABC.length)]
    }

    return final;
}

module.exports = router;