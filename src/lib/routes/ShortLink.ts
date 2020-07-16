import fetch from 'node-fetch';
import isPrivateIP from 'private-ip';
import { Router } from 'express';
import { DBQueries } from '../DatabaseQueries';
import { CustomRequest, Statistics } from '../Pokole';
import * as Constants from '../../Constants';

const router = Router();

router.get('/:short', async (req, res) => {
    const { short } = req.params;

    // Get the original (unshortened) URL from the database 
    const [data] = await DBQueries.getLink((req as CustomRequest).db, short);

    // Redirect the user to a 404 page if the shortlink doesn't exist
    if (!data) return res.redirect('/404');

    // Redirect the user to the original URL
    else res.redirect(data.original);

    // Used in case the route is accessed from inside the server's network
    // Taken from https://stackoverflow.com/a/39473073
    let IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if ((IP as string).substr(0, 7) == "::ffff:") {
        IP = (IP as string).substr(7);
    }

    // If the IP is a private one (so accessed from inside the server's network) don't add to the URL's statistics
    if (isPrivateIP(IP as string)) return;

    const IPInfo = await fetch(Constants.IP_INFO(IP as string)).then(res => res.json());

    const statistics: Statistics = {
        IP: IP as string,
        country: IPInfo.data?.located_resources[0]?.locations?.country,
        city: IPInfo.data?.located_resources[0]?.locations?.city,
        latitude: IPInfo.data?.located_resources[0]?.locations?.latitude,
        longitude: IPInfo.data?.located_resources[0]?.locations?.longitude
    };

    return DBQueries.addStatistics((req as CustomRequest).db, short, statistics);
});

export { router };