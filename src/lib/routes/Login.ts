import { Router } from 'express';
import { CustomRequest } from '../Pokole';
import { DBQueries } from '../DatabaseQueries';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Constants from '../../Constants';

const router = Router();

router.post('/', async (req, res) => {
    const { user, password } = req.headers;

    // If one of these two is not provided, end the request
    if (!user) return res.status(400).json(Constants.ERROR(Constants.NO_LOGIN));
    if (!password) return res.status(400).json(Constants.ERROR(Constants.NO_PASSWORD));

    // Check if the user header provided is actually an e-mail
    const isEmail: boolean = Constants.emailRegex.test(user.toString());

    // Get the user from the database, if it exists
    const account = await DBQueries.getUser((req as CustomRequest).db, user.toString(), isEmail);
    if (!account) return res.status(401).json(Constants.ERROR(Constants.NO_ACCOUNT));

    // Check if the provided password is the correct one
    if (!await bcrypt.compare(password, account.password)) return res.status(401).json(Constants.ERROR(Constants.WRONG_PASSWORD));

    // Return a token the user will be able to use
    return res.json(Constants.TOKEN(jwt.sign({ data: account.user_id, exp: Math.floor(Date.now() / 1000) + Constants.EXPIRES }, (req as CustomRequest).config.jwtSecret), Constants.EXPIRES));
});

export { router };