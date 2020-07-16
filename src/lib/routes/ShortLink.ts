import { Router } from 'express';
import { DBQueries } from '../DatabaseQueries';
import { CustomRequest } from '../Pokole';

const router = Router();

router.get('/:short', async (req, res) => {
    const { short } = req.params;
    const [data] = await DBQueries.getLink((req as CustomRequest).db, short);
    if (!data) return res.redirect('/404');

    else res.redirect(data.original);

    // TODO: counters and stuff
});

export { router };