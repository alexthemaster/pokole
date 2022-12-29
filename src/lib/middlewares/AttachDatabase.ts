import type { Request, Response } from "express";
import { Pool } from "pg";

function attachDB(database: Pool) {
  return function (req: Request, _res: Response, next: () => void) {
    req.db = database;

    next();
  };
}

export { attachDB };
