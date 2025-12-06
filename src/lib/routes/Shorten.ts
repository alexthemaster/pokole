import { Router, type Request, type Response } from "express";
import { nanoid } from "nanoid";
import * as Constants from "../../Constants";
import { DBQueries } from "../DatabaseQueries";
import { authenticate } from "../middlewares/Authenticate";

const router = Router();

router.post("/", authenticate, async (req, res) => {
  if (!req.authedUser) return;

  const { url, custom } = req.headers;

  if (!url) return res.status(400).json(Constants.ERROR(Constants.NO_URL));

  // Check if the provided URL is valid
  if (!Constants.URLRegex.test(url.toString()))
    return res.status(400).json(Constants.ERROR(Constants.INVALID_URL));

  // Check if the provided URL contains any banned words
  if (hasBannedWord(url.toString()))
    return res.status(400).json(Constants.ERROR(Constants.BANNED_URL));

  // Do this if there is a user desired shortlink
  if (custom) {
    // If the user desired shortlink has a blocked character or word in it, return an error
    // The WordRegex makes sure that only A-Z characters, numbers, dashes and underscores are usable
    if (!Constants.WordRegex.test(custom.toString()))
      return res.status(400).json(Constants.ERROR(Constants.BAD_CHARACTERS));
    if (hasBannedWord(custom.toString()))
      return res.status(400).json(Constants.ERROR(Constants.BANNED_WORD));

    // If the user desired shortlink is in use, return an error
    const existing = (await DBQueries.getLink(req.db, custom.toString()))
      .length;
    if (existing)
      return res.status(409).json(Constants.ERROR(Constants.URL_IN_USE));

    return await insertURL(
      req,
      res,
      req.authedUser!,
      url.toString(),
      custom.toString()
    );
  }

  let shortlink = nanoid(req.config.shortLength);

  // A small fail-safe
  if ((await DBQueries.getLink(req.db, shortlink)).length) {
    shortlink = nanoid(req.config.shortLength);
  }

  return await insertURL(req, res, req.authedUser!, url.toString(), shortlink);
});

function hasBannedWord(url: string): boolean {
  if (
    Constants.BLOCKED.some((word) =>
      url.toString().toLowerCase().includes(word)
    )
  )
    return true;
  else return false;
}

async function insertURL(
  req: Request,
  res: Response,
  userID: number,
  url: string,
  shortlink: string
): Promise<Response> {
  try {
    await DBQueries.addLink(req.db, userID, url, shortlink);
    return res.json(Constants.SUCCESS_ADD_URL(shortlink, req.config.frontURL));
  } catch {
    return res
      .status(500)
      .json(Constants.ERROR(Constants.SOMETHING_WENT_WRONG));
  }
}

export { router };
