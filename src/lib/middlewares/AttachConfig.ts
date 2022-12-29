import type { Request, Response } from "express";
import type { PokoleConfiguration } from "../Pokole";

function attachConfig(config: PokoleConfiguration) {
  return function (req: Request, _res: Response, next: () => void) {
    req.config = config;

    next();
  };
}

export { attachConfig };
