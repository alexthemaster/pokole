import { Router } from 'express';
import { DBQueries } from '../DatabaseQueries';
import { CustomRequest } from '../Pokole';

const router = Router();

router.get('/:short', async (req, res) => {
    const { short } = req.params;

    // Get the original (unshortened) URL from the database 
    const [data] = await DBQueries.getLink((req as CustomRequest).db, short);

    // Redirect the user to a 404 page if the shortlink doesn't exist
    if (!data) return res.redirect('/404');

    // Redirect the user to the original URL
    else res.redirect(data.original);

    // TODO: counters and stuff
});

export { router };