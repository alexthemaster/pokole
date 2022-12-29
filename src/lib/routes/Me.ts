import { Router } from "express";
import { DBQueries } from "../DatabaseQueries";
import { authenticate } from "../middlewares/Authenticate";
import { CustomRequest } from "../Pokole";

const router = Router();

router.get("/links", authenticate, async (req, res) => {
  if (!(req as CustomRequest).authedUser) return;

  const user_id = (req as CustomRequest).authedUser;

  const statistics = await DBQueries.getAllUserStatistics(
    (req as CustomRequest).db,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user_id!
  );

  return res.json(statistics);
});

export { router };
