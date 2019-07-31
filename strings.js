module.exports = {
    NO_CONFIG: 'The configuration file cannot be found, exiting.',
    NO_JWT: '[JWT] Please provide a JWT Secret!',

    // Database
    DB_CONNECT_ERROR: (err) => `[RethinkDB] There was a problem connecting to RethinkDB: ${err}\nExiting.`,
    DB_CONNECTED: '[RethinkDB] Successfully connected to RethinkDB!',
    DB_CREATE_ERROR: (err) => `[RethinkDB] There was an error creating the ${db} database. Exiting.`,
    TABLE_CREATE_ERROR: (name) => `[RethinkDB] There was an error creating the ${name} table. Exiting.`,

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
    INVALID_EMAIL: 'Invalid e-mail provided.',
    TAKEN_USERNAME: 'This username is taken.',
    TAKEN_EMAIL: 'This e-mail is taken.',
    WRONG_PASSWORD: 'Wrong password.',
    SUCCESS_REGISTER: 'Succesfully registered, you can now login!',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again later.',

    NO_URL: 'No URL to shorten provided.',
    INVALID_URL: 'The provided URL is invalid.',
    URL_IN_USE: 'This short URL is currently in use.',
    SUCCESS_ADD_URL: (url) => `The ${url} short URL has been added!`,

    JWT: {
        TokenExpiredError: () => 'The token is expired',
        JsonWebTokenError: (err) => err.message,
        NotBeforeError: () => 'Thrown if current time is before the nbf claim.'
    }
}