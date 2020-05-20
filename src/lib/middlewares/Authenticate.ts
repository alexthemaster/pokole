import { CustomRequest } from '../Pokole';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as Constants from '../../Constants';

function authenticate(req: Request, res: Response, next: () => void) {
    const { authorization } = req.headers;

    if (!authorization || !authorization.toString().startsWith('Bearer')) {
        res.status(401).json(Constants.ERROR(Constants.VALID_TOKEN));
        return next();
    };

    const token = authorization!.toString().trim().substring(7);

    let verified;
    try {
        verified = jwt.verify(token, (req as CustomRequest).config.jwtSecret);
        (req as CustomRequest).authedUser = (verified as token).data;
    } catch (err) {
        res.status(403).json(Constants.JWT[(err.name as JWTErr)](err));
    }

    return next();
};

interface token {
    /** The data property stores the user_id */
    data: number;
    /** The time until the token expires in seconds */
    exp: number;
};

type JWTErr = 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError';

export { authenticate };