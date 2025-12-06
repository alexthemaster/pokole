import { Router, type Request, type Response } from "express";
import * as Constants from "../../Constants";
import { DBQueries } from "../DatabaseQueries";
import { authenticate } from "../middlewares/Authenticate";

const router = Router();

router.get("/links", authenticate, async (req, res) => {
  if (!req.authedUser) return;

  const user_id = req.authedUser;

  const statistics = await DBQueries.getAllUserStatistics(req.db, user_id!);

  return res.json(statistics);
});

router.delete("/links/:link", authenticate, async (req, res) => {
  if (!req.authedUser) return;

  const { link } = req.params;

  const [data] = await DBQueries.getLink(req.db, link);
  if (!link || data.user_id != req.authedUser)
    return res.status(400).json(Constants.ERROR(Constants.NO_URL_DELETE));

  return await deleteLink(req, res, link);
});

async function deleteLink(
  req: Request,
  res: Response,
  link: string
): Promise<Response> {
  try {
    await DBQueries.deleteLink(req.db, link);
    return res.json(Constants.DELETED(link));
  } catch {
    return res
      .status(500)
      .json(Constants.ERROR(Constants.SOMETHING_WENT_WRONG));
  }
}

export { router };
