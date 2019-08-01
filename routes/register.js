const polka = require('polka');
const bcrypt = require('bcrypt');
const strings = require('../strings');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const { bcrypt: { salt } } = require('../data/config');

const router = polka();

router.post('/', async (req, res) => {
    const email = req.headers['email'];
    const username = req.headers['username'];
    const password = req.headers['password'];

    // If one of these three is not provided, end the requests
    if (!username) return res.status(403).json(error(strings.NO_USERNAME));
    if (!password) return res.status(403).json(error(strings.NO_PASSWORD));
    if (!email) return res.status(403).json(error(strings.NO_EMAIL));

    // Check if the e-mail is a valid one
    if (!emailRegex.test(email)) return res.status(403).end(error(strings.INVALID_EMAIL));

    // We check if the username or e-mail is already in use
    if (await req.db.table('users').filter({ username }).count().run()) return res.status(403).json(error(strings.TAKEN_USERNAME));
    if (await req.db.table('users').filter({ email }).count().run()) return res.status(403).json(error(strings.TAKEN_EMAIL));

    // We hash the password provided by the user
    const hash = await bcrypt.hash(password, salt);

    // We insert the user in the database
    const inserted = await req.db.table('users').insert({ username, email, password: hash }).run();
    if (inserted.inserted) return res.json(success(strings.SUCCESS_REGISTER));
    else return res.status(500).json(error(strings.SOMETHING_WENT_WRONG));
})

const error = (text) => JSON.stringify({ error: text });
const success = (text) => JSON.stringify({ success: text });

module.exports = router;