import { Router } from "express";
import fetch from "node-fetch";
import isPrivateIP from "private-ip";
import * as Constants from "../../Constants";
import { DBQueries } from "../DatabaseQueries";
import type { Statistics } from "../Pokole";

const router = Router();

router.get("/:short", async (req, res) => {
  const { short } = req.params;

  // Get the original (unshortened) URL from the database
  const [data] = await DBQueries.getLink(req.db, short);

  // Redirect the user to a 404 page if the shortlink doesn't exist
  if (!data) return res.redirect("/404");
  // Redirect the user to the original URL
  else res.redirect(data.original);

  // Used in case the route is accessed from inside the server's network
  // Taken from https://stackoverflow.com/a/39473073
  let IP =
    req.headers["x-forwarded-for"]?.toString() ??
    req.socket.remoteAddress?.toString() ??
    "127.0.0.1";

  if (IP.substring(0, 7) == "::ffff:") {
    IP = IP.substring(7);
  }

  // If the IP is a private one (so accessed from inside the server's network) don't add to the URL's statistics
  if (isPrivateIP(IP)) return;

  const IPInfo = await fetch(Constants.IP_INFO(IP)).then(
    (res) => res.json() as IpInfo
  );

  const statistics: Statistics = {
    IP,
    country: IPInfo.data?.located_resources[0].locations?.country,
    city: IPInfo.data?.located_resources[0].locations?.city,
    latitude: IPInfo.data?.located_resources[0].locations?.latitude,
    longitude: IPInfo.data?.located_resources[0].locations?.longitude,
  };

  return DBQueries.addStatistics(req.db, short, statistics);
});

export { router };

interface IpInfo {
  data?: {
    located_resources: {
      locations?: {
        country: string;
        city: string;
        latitude: string;
        longitude: string;
      };
    }[];
  };
}
