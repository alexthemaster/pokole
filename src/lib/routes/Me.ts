import { Router } from "express";
import { DBQueries } from "../DatabaseQueries";
import { authenticate } from "../middlewares/Authenticate";

const router = Router();

router.get("/links", authenticate, async (req, res) => {
  if (!req.authedUser) return;

  const user_id = req.authedUser;

  const statistics = await DBQueries.getAllUserStatistics(req.db, user_id!);

  return res.json(statistics);
});

export { router };
