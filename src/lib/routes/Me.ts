import { Router } from 'express';
import { CustomRequest } from '../Pokole';
import { authenticate } from '../middlewares/Authenticate';
import { DBQueries } from '../DatabaseQueries';

const router = Router();

router.get('/links', authenticate, async (req, res) => {
    if (!(req as CustomRequest).authedUser) return;

    const user_id = (req as CustomRequest).authedUser;

    const statistics = await DBQueries.getAllUserStatistics((req as CustomRequest).db, user_id!);

    return res.json(statistics);
});

export { router };