import { Request, Response } from "express";
import { CustomRequest, PokoleConfiguration } from "../Pokole";

function attachConfig(config: PokoleConfiguration) {
  return function (req: Request, _res: Response, next: () => void) {
    (req as CustomRequest).config = config;

    next();
  };
}

export { attachConfig };
