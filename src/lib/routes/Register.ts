import { Router } from 'express';
import { CustomRequest } from '../Pokole';
import { DBQueries } from '../DatabaseQueries';
import bcrypt from 'bcrypt';
import * as Constants from '../../Constants';

const router = Router();

router.get('/', (req, res) => res.status(200).json(Constants.REGISTRATION((req as CustomRequest).config.registration!)));

router.post('/', async (req, res) => {
    const { email, username, password } = req.headers;

    // If registration is disabled then end the request
    if (!(req as CustomRequest).config.registration) return res.status(403).json(Constants.ERROR(Constants.REGISTRATION_DISABLED));

    // If one of these three is not provided, end the request
    if (!email) return res.status(400).json(Constants.ERROR(Constants.NO_EMAIL));
    if (!username) return res.status(400).json(Constants.ERROR(Constants.NO_USERNAME));
    if (!password) return res.status(400).json(Constants.ERROR(Constants.NO_PASSWORD));

    // Check if the e-mail is a valid one
    if (!Constants.emailRegex.test(email.toString())) return res.status(400).json(Constants.ERROR(Constants.INVALID_EMAIL));

    // Check if a user exists with the same username or e-mail
    const users = await DBQueries.findUsers((req as CustomRequest).db, username.toString(), email.toString());
    if (users) {
        users.forEach(user => {
            if (user.username === username) return res.status(409).json(Constants.ERROR(Constants.TAKEN_USERNAME));
            if (user.email === email) return res.status(409).json(Constants.ERROR(Constants.TAKEN_EMAIL));
        });
    };

    // We hash the password provided by the user
    const hash = await bcrypt.hash(password, (req as CustomRequest).config.bcrypt!);

    try {
        await DBQueries.addUser((req as CustomRequest).db, username.toString(), email.toString(), hash);
        return res.status(201).json(Constants.SUCCESS(Constants.SUCCESS_REGISTER));
    } catch {
        return res.status(500).json(Constants.ERROR(Constants.SOMETHING_WENT_WRONG));
    }

});

export { router };