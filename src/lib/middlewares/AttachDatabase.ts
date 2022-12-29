import { Request, Response } from "express";
import { Pool } from "pg";
import { CustomRequest } from "../Pokole";

function attachDB(database: Pool) {
  return function (req: Request, _res: Response, next: () => void) {
    (req as CustomRequest).db = database;

    next();
  };
}

export { attachDB };
