const { frontURL } = require('./data/config');

module.exports = {
    // Blocked list of words
    BLOCKED: [
        'porn',
        'gay',
        'faggot',
        'lesbian',
        'nazi',
        'nigga',
        'nigger',
        'loli',
        'shota',
        'cunt',
        'idiot',
        'fuck',
        'pussy',
        'dick',
        'asshole',
        'butthole',
        'dildo'
    ],
    BANNED_WORD: "We're sorry but the custom shortlink you're trying to use contains a blocked word / character",
    BANNED_URL: "We're sorry but the URLyou're trying to use contains a blocked word",

    NO_CONFIG: 'The configuration file cannot be found, please run the `npm run setup` command to set it up.',
    NO_JWT: '[JWT] Please provide a JWT Secret!',

    // Database
    DB_CONNECT_ERROR: (err) => `[RethinkDB] There was a problem connecting to RethinkDB: ${err}\nExiting.`,
    DB_CONNECTED: '[RethinkDB] Successfully connected to RethinkDB!',
    DB_CREATE_ERROR: (err) => `[RethinkDB] There was an error creating the ${db} database. Exiting.`,
    TABLE_CREATE_ERROR: (name) => `[RethinkDB] There was an error creating the ${name} table. Exiting.`,

    // Route returns
    ERROR: (text) => JSON.stringify({ error: text }),
    SUCCESS: (text) => JSON.stringify({ success: text }),
    TOKEN: (text, time) => JSON.stringify({ token: text, expiresIn: time }),
    ME_LINKS: (array) => JSON.stringify({ data: array, count: array.length }),

    // Set the token expiration time (in seconds)
    EXPIRES: 3600,

    //Server
    SERVER_ERROR: (err) => `[Server] There was a problem starting the server: ${err}\nExiting.`,
    SERVER_START: (port) => `[Server] Frontend server started on port ${port}!`,
    SERVER_BACKEND_START: (port) => `[Server] Backend server started on port ${port}!`,

    // Account
    NO_LOGIN: 'Username / E-Mail not provided.',
    NO_ACCOUNT: "This account doesn't exist.",
    NO_USERNAME: 'Username not provided.',
    NO_PASSWORD: 'Password not provided.',
    NO_EMAIL: 'E-mail not provided.',
    VALID_TOKEN: 'Please provide a valid token! (login)',
    INVALID_EMAIL: 'Invalid e-mail provided.',
    TAKEN_USERNAME: 'This username is taken.',
    TAKEN_EMAIL: 'This e-mail is taken.',
    WRONG_PASSWORD: 'Wrong password.',
    SUCCESS_REGISTER: 'Succesfully registered, you can now login!',
    REGISTER_DISABLED: 'Registration is currently disabled.',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again later.',

    // URL
    NO_URL: 'No URL to shorten provided.',
    INVALID_URL: 'The provided URL is invalid.',
    URL_IN_USE: 'This short URL is currently in use.',
    SUCCESS_ADD_URL: (url) => JSON.stringify({ succes: `The ${url} short URL has been added!`, URL: `${frontURL}/${url}` }),

    JWT: {
        TokenExpiredError: () => 'The token is expired',
        JsonWebTokenError: (err) => err.message,
        NotBeforeError: () => 'Thrown if current time is before the nbf claim.'
    },

    // Setup #1
    PROMPTS: {
        UNDERSTOOD: "Understood! Action aborted.",
        EXISTS: "A configuration file is already present, want to proceed?",
        REGISTER: "Do you want to have registrations enabled? (you can modify this later by accessing the *config.json* file in *src/data/*",

        // RethinkDB prompts
        RETHINKDB_HOST: "What is the address your RethinkDB server is running at?",
        RETHINKDB_PORT: "What is the port your RethinkDB server is running on?",
        RETHINKDB_USER: "What is the user account to use with RethinkDB?",
        RETHINKDB_PASSWORD: "What is the password of the RethinkDB user's account?",
        RETHINKDB_DB: "What is the name of the database to use in RethinkDB? (this will be automatically created, leave it blank if you want it to default to 'Pokole')",
    
        // Port prompts
        SERVER_PORT: "What is the port you want the front-end server to run on?",
        BACK_SERVER_PORT: "What is the port you want the back-end server to run on?",

        // Bcrypt salt prompt
        BCRYPT: "Please mention the the number you want bcrypt to use as salt (if you don't know what this is, leave it to the default one)",

        // URL prompts
        URL_FRONT: "What is the URL the front-end server will run on?",
        URL_BACK: "What is the URL the back-end server will run on?",

        // Shortlink length prompt
        SHORTLINK: "How short do you want the characters to be in the shortlink?",

        // JWT secret prompt
        JWT: "Please provide a secret for JWT (this will be used to encode the user tokens after login)",

        // Configuration strings
        CONF_WRITTEN: "Configuration file successfully written.",
        CONF_ERROR: (err) => `We encountered a problem while writing the configuration file: ${err}`
    },

    // Setup #2
    VALIDATION: {
        REGISTER: "Please input a valid boolean variable",

        // RethinkDB validations
        RETHINKDB_HOST: "This is not a valid RethinkDB host address (options: localhost, IP, URL)",
        RETHINKDB_PORT: "Please provide a valid port number",

        // Port validations
        SERVER_PORT: "Please provide a valid port number",
        BACK_SERVER_PORT: "Please provide a valid port number",

        // URL validation
        VALID_URL: "Please provide a valid URL",

        // Shortlink length validation
        SHORTLINK: "At least a 3 character length is required for optimal use",

        // JWT secret validation
        JWT: "We recommend at least a 5 character length password to use as a JWT secret, as it is *VERY IMPORTANT*"
    }
}