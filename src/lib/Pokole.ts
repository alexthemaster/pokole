import { Pool } from 'pg';
import express, { Express, Request } from 'express';
import cors from 'cors';
import serve from 'serve-static';
import fs from 'fs-extra';
import path from 'path';
import * as Constants from '../Constants';

// Routes
import { router as Register } from './routes/Register';
import { router as Login } from './routes/Login';
import { router as Me } from './routes/Me';
import { router as Shorten } from './routes/Shorten';
import { router as ShortLink } from './routes/ShortLink';

// Middlewares 
import { attachConfig } from './middlewares/AttachConfig';
import { attachDB } from './middlewares/AttachDatabase';

class Pokole {
    #config: PokoleConfiguration;
    #frontServer!: Express;
    #backServer!: Express;
    #database!: Pool;
    /** Initiates a database pool */
    #connectDB: () => Promise<void>;
    #exit: Function;
    #init: () => Promise<void>;

    /**
     * @param config The configuration object for Pokole
     */
    constructor(config: PokoleConfiguration) {
        // If something needed isn't defined in the config object, throw a specific error

        // DB
        if (!config) throw new Error(Constants.NO_CONFIG);
        if (!config.db) throw new Error(Constants.DB.NO_DB);
        if (!config.db.user) throw new Error(Constants.DB.NO_USER);
        if (!config.db.host) throw new Error(Constants.DB.NO_HOST);
        if (!config.db.password) throw new Error(Constants.DB.NO_PASS(config.db.user));
        if (!config.db.database) throw new Error(Constants.DB.NO_DATABASE);

        // URLs
        if (!config.frontURL) throw new Error(Constants.NO_FRONT_URL);
        if (!config.backURL) throw new Error(Constants.NO_BACK_URL);

        // Registration
        if (!config.registration) config.registration = true;

        // JWT
        if (!config.jwtSecret) throw new Error(Constants.NO_JWT);

        // Set the default bcrypt salt, if not provided by the user
        if (!config.bcrypt) config.bcrypt = 12;

        // Set the default length of the characters used in the shortlink, if not provided by the user
        if (!config.shortLength) config.shortLength = 12;

        // Set the default server ports, if not provided by the user
        if (!config.server.port) config.server.port = 80;
        if (!config.server.backendPort) config.server.backendPort = 8080;

        // Set default database info, if not provided by the user
        if (!config.db.port) config.db.port = 5432;

        this.#config = config;

        // Initiate the front-end and back-end servers
        this.#frontServer = express();
        this.#backServer = express();

        this.#connectDB = async () => {
            // Create the database pool
            this.#database = new Pool(this.#config.db);

            // Connect and disconnect to the database to make sure the provided data is correct
            const connection = await this.#database.connect();
            console.info(Constants.DB.CONNECTED);
            connection.release();

            // If the database errors out emit an error
            this.#database.on('error', (err) => {
                console.error(Constants.DB.ERROR(err));
            });
        };

        // This runs right before the application exits
        this.#exit = () => {
            console.info(Constants.DB.EXIT);
            this.#database.end();
            process.exit();
        };

        this.#init = async () => {
            const client = await this.#database.connect();

            await client.query(/* sql */`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR (50) UNIQUE NOT NULL,
                password CHAR (60) NOT NULL,
                email VARCHAR (350) UNIQUE NOT NULL,
                created_on TIMESTAMP NOT NULL
           ) 
            `);

            await client.query(/* sql */`
            CREATE TABLE IF NOT EXISTS links (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR (50) NOT NULL,
                original TEXT NOT NULL,
                shortened TEXT UNIQUE NOT NULL,
                created_on TIMESTAMPTZ NOT NULL
            ) 
            `);

            await client.query(/* sql */`
            CREATE TABLE IF NOT EXISTS statistics (
                id SERIAL PRIMARY KEY,
                short TEXT NOT NULL,
                IP VARCHAR(39) NOT NULL,
                country TEXT,
                city TEXT,
                latitude TEXT,
                longitude TEXT
            )`);

            client.release();
        };

        // Close the database pool before the application finally exits
        // Taken from https://stackoverflow.com/a/49392671
        ['SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach(eventType => {
            // @ts-ignore
            process.on(eventType, () => this.#exit());
        });
    }

    /** Start the Pokole shortener */
    public async start() {
        await this.#connectDB();
        await this.#init();

        // Get the directory that's going to be used to serve static files
        const userDir: string = path.join(path.dirname(require!.main!.filename), 'static');
        const directory: string = await fs.pathExists(userDir) ? userDir : path.join(__dirname, '../static');
        console.info(Constants.SERVE_STATIC(directory));

        this.#frontServer
            .use(serve(directory))
            .use(attachDB(this.#database))
            .use(attachConfig(this.#config))
            .use('/', ShortLink)
            .listen(this.#config.server.port, () => console.info(Constants.SERVER.FRONT_START(this.#config.server.port!))).on('error', (err) => new Error(Constants.SERVER.FRONT_ERROR(err)));
        this.#backServer
            .use(cors())
            .use(attachDB(this.#database))
            .use(attachConfig(this.#config))
            .use('/register', Register)
            .use('/login', Login)
            .use('/shorten', Shorten)
            .use('/me', Me)
            .listen(this.#config.server.backendPort, () => console.info(Constants.SERVER.BACK_START(this.#config.server.backendPort!))).on('error', (err) => new Error(Constants.SERVER.BACK_ERROR(err)));
    }
}

/**
 * Configuration interface for Pokole
 * @example
 * const config: PokoleConfiguration = {
 *      db: {
 *          user: 'alexthemaster',
 *          password: 'eee23EfgZ',
 *          host: 'localhost',
 *          database: 'pokole'
 *      },
 *      frontURL: 'localhost',
 *      backURL: 'localhost:8080',
 *      server: { port: 80, backendPort: 8080 },
 *      jwtSecret: '33HdAiM$4zGs',
 *      registration: true
 * };
 */
interface PokoleConfiguration {
    /** The database connection information */
    db: Database;
    /** Pokole's server options */
    server: PokoleServerOptions;
    /** The salt number bcrypt should use */
    bcrypt?: number;
    /** The URL the front-end of Pokole is accessible from */
    frontURL: string;
    /** The URL the back-end of Pokole is accessible from */
    backURL: string;
    /** The length of the characters used in the shortlink */
    shortLength?: number;
    /** The JWT (JSON Web Token) secret you want to use - make sure to keep this private, as this is what's used to encrypt user tokens */
    jwtSecret: string;
    /** Whether or not registration is enabled */
    registration?: boolean;
}

interface PokoleServerOptions {
    /** The port the front-end part of Pokole should run on */
    port?: number;
    /** The port the back-end part of Pokole should run on */
    backendPort?: number;
}

interface Database {
    /** The database user */
    user: string;
    /** The URL PostgreSQL host is located */
    host: string;
    /** The name of the database to use from PostgreSQL */
    database: string;
    /** The password used by the PostgreSQL user */
    password: string;
    /** The port number PostgreSQL uses */
    port?: number;
}

interface CustomRequest extends Request {
    db: Pool;
    config: PokoleConfiguration;
    authedUser?: number;
}

interface Statistics {
    IP: string;
    country?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
}

interface User {
    user_id: number;
    username: string;
    password: string;
    email: string;
    created_on: Date;
}

interface Link {
    id: number;
    user_id: number;
    original: string;
    shortened: string;
    created_on: Date;
}

export { Pokole, PokoleConfiguration, User, Link, Statistics, CustomRequest };