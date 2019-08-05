const polka = require('polka');
const strings = require('../strings');

const { frontURL } = require('../data/config');

const router = polka();

router.get('/links', async (req, res) => {

    const id = await req.auth();
    if (!id) return;

    // Get all the shortened URL's created by this user
    const data = await req.db.table('links').filter({ user_id: id }).run();

    // Create a new object for each shortened URL
    const array = new Array();
    data.forEach(obj => {
        const temp = {
            longURL: obj.long,
            shortURL: `${frontURL}/${obj.short}`,
            clicks: obj.clicks || 0
        };
        array.push(temp)
    });

    return res.json(strings.ME_LINKS);
})

module.exports = router;