import { CustomRequest, PokoleConfiguration } from '../Pokole';
import { Request, Response } from 'express';

function attachConfig(config: PokoleConfiguration) {
    return function (req: Request, _res: Response, next: () => void) {
        (req as CustomRequest).config = config;

        next();
    }
};

export { attachConfig };