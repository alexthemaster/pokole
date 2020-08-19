import { Router } from 'express';
import { CustomRequest, Link } from '../Pokole';
import { authenticate } from '../middlewares/Authenticate';

const router = Router();

router.get('/', authenticate, async (req, res) => {
    if (!(req as CustomRequest).authedUser) return;

    const user_id = (req as CustomRequest).authedUser;

    const { rows: shortlinks } = await (req as CustomRequest).db.query(/* sql */`
        SELECT * FROM LINKS WHERE user_id=$1
    `, [user_id]);

    const statistics: { longURL: string; shortURL: string; created_on: Date; stats: {}[] }[] = [];

    await Promise.all(shortlinks.map(async (link: Link) => {
        const { rows: tmpStats } = await (req as CustomRequest).db.query(/* sql */`
            SELECT * FROM STATISTICS WHERE short=$1
        `, [link.shortened]);

        statistics.push({ longURL: link.original, shortURL: link.shortened, created_on: link.created_on, stats: [...tmpStats] })
    }));

    return res.json(statistics);
});

export { router };