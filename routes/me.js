const polka = require('polka');
const jwt = require('jsonwebtoken');

const { frontURL, jwtSecret } = require('../data/config');

const router = polka();

router.get('/links', async (req, res) => {
    let auth = req.headers['authorization'];

    // Authentification
    if (!auth || !auth.includes('Bearer')) return res.status(403).json(error('Please provide a valid token! (login)'));
    auth = auth.substring(7);

    let verified;
    try {
        verified = jwt.verify(auth, jwtSecret);
    } catch (err) {
        return res.status(403).json(JWT[err.name](err))
    }

    // Get all the shortened URL's created by this user
    const data = await req.db.table('links').filter({ user_id: verified.data }).run();

    // Create a new object for each shortened URL
    const array = new Array();
    data.forEach(obj => {
        const temp = {
            longURL: obj.long,
            shortURL: `${frontURL}/${obj.short}`
        };
        array.push(temp)
    });

    return res.json(JSON.stringify({ data: array, count: array.length }));
})

const error = (text) => JSON.stringify({ error: text });

module.exports = router;