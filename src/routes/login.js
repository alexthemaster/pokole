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
    if (!user) return res.status(403).json(strings.ERROR(strings.NO_LOGIN));
    if (!password) return res.status(403).json(strings.ERROR(strings.NO_PASSWORD));

    const filter = emailRegex.test(user) ? { email: user.toLowerCase() } : { username: user.toLowerCase() };

    // Check if the username exists in the database
    const account = await req.db.table('users').filter(filter).run();
    if (!account[0]) return res.status(403).json(strings.ERROR(strings.NO_ACCOUNT));

    // Check if the provided password is the correct one
    const pass = await bcrypt.compare(password, account[0].password)
    if (!pass) return res.status(403).json(strings.ERROR(strings.WRONG_PASSWORD));

    // Return a token the user will be able to use
    return res.json(strings.TOKEN(jwt.sign({ data: account[0].id, exp: Math.floor(Date.now() / 1000) + strings.EXPIRES }, jwtSecret), strings.EXPIRES))
})


module.exports = router;