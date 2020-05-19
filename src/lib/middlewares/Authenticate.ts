import { Pool } from 'pg';
import { CustomRequest } from '../Pokole';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as Constants from '../../Constants';

function authenticate(database: Pool) {
    return function(req: Request, res: Response, next: () => void) {
        const { auth } = req.headers;

        if (!auth || !auth.toString().startsWith('Bearer')) return res.status(401).json(Constants.ERROR(Constants.VALID_TOKEN));
        const token = auth.toString().trim().substring(7);

        let verified;
        try {
            verified = jwt.verify(token, (req as CustomRequest).config.jwtSecret);
            (req as CustomRequest).authedUser = (verified as token).data;
        } catch (err) {
            res.status(403).json(Constants.JWT[(err.name as JWTErr)](err));
        }

        return next();
    }
};

interface token {
    data: number;
    exp: number;
};

type JWTErr = 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError';

export { authenticate };