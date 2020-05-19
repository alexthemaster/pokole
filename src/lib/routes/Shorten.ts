import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { CustomRequest } from '../Pokole';
import { authenticate } from '../middlewares/Authenticate';
import { DBQueries } from '../DatabaseQueries';
import * as Constants from '../../Constants';

const router = Router();

router.post('/', authenticate, async (req, res) => {
    if (!(req as CustomRequest).authedUser) return;

    const { url, custom } = req.headers;

    if (!url) return res.status(400).json(Constants.ERROR(Constants.NO_URL));

    // Check if the provided URL is valid
    if (!Constants.URLRegex.test(url as string)) return res.status(400).json(Constants.ERROR(Constants.INVALID_URL));

    // Check if the provided URL contains any banned words
    if (hasBannedWord(url.toString())) return res.status(400).json(Constants.ERROR(Constants.BANNED_URL));
    
    // Do this if there is a user desired shortlink
    if (custom) {
        // If the user desired shortlink has a blocked character or word in it, return an error
        // The WordRegex makes sure that only A-Z characters, numbers, dashes and underscores are usable
        if (Constants.WordRegex.test(custom.toString())) return res.status(400).json(Constants.ERROR(Constants.BAD_CHARACTERS));
        if (hasBannedWord(custom.toString())) return res.status(400).json(Constants.ERROR(Constants.BANNED_WORD));

        // If the user desired shortlink is in use, return an error
        const existing = (await DBQueries.getLink((req as CustomRequest).db, custom.toString())).length;
        if (existing) return res.status(409).json(Constants.ERROR(Constants.URL_IN_USE));

        return await insertURL(req, res, (req as CustomRequest).authedUser!, url.toString(), custom.toString());
    }

    let shortlink = nanoid((req as CustomRequest).config.shortLength);

    // A small fail-safe
    if ((await DBQueries.getLink((req as CustomRequest).db, shortlink)).length) shortlink = nanoid((req as CustomRequest).config.shortLength);

    return await insertURL(req, res, (req as CustomRequest).authedUser!, url.toString(), shortlink);
});

function hasBannedWord(url: string) {
    if (Constants.BLOCKED.some(word => url.toString().toLowerCase().includes(word))) return true;
};

async function insertURL(req: Request, res: Response, userID: number, url: string, shortlink: string) {
    try {
        await DBQueries.addLink((req as CustomRequest).db, userID, url, shortlink);
        return res.json(Constants.SUCCESS_ADD_URL(shortlink, (req as CustomRequest).config.frontURL));
    } catch {
        return res.status(500).json(Constants.ERROR(Constants.SOMETHING_WENT_WRONG));
    }
};

export { router };