export const NO_CONFIG = "Please provide the configuration object when creating a new Pokole instance.";

export const NO_FRONT_URL = "Please provide the URL the front-end of Pokole is located at.";
export const NO_BACK_URL = "Please provide the URL the back-end of Pokole is located at.";

export const NO_LOGIN = "Username / E-Mail not provided.";
export const NO_ACCOUNT = "This account doesn't exist.";
export const NO_USERNAME = "username header not provided.";
export const NO_PASSWORD = "password header not provided.";
export const NO_EMAIL = "email header not provided.";
export const VALID_TOKEN = "Please provide a valid token! (login)";
export const INVALID_EMAIL = "Invalid e-mail provided.";
export const TAKEN_USERNAME = "This username is taken.";
export const TAKEN_EMAIL = "This e-mail is taken.";
export const WRONG_PASSWORD = "Wrong password.";
export const SUCCESS_REGISTER = "Succesfully registered, you can now login!";
export const REGISTRATION_DISABLED = "Registration is currently disabled.";
export const SOMETHING_WENT_WRONG = "Something went wrong, please try again later.";

export const NO_JWT = "Please provide a JWT secret token (used for encrypting user tokens)";

export const SERVE_STATIC = (directory: string) => `[Server] Serving static files from directory ${directory}!`;

export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const REGISTRATION = (enabled: boolean) => { return { enabled } };

export const SUCCESS = (message: string) => { return { success: message } };
export const ERROR = (error: string) => { return { error } };

export const EXPIRES = 3600;

export const SERVER = {
    FRONT_ERROR: (error: Error) => `[Server] Something went wrong with the front-end server: ${error}`,
    BACK_ERROR: (error: Error) => `[Server] Something went wrong with the back-end server: ${error}`,
    FRONT_START: (port: number) => `[Server] Front-end server started on port ${port}`,
    BACK_START: (port: number) => `[Server] Back-end server started on port ${port}`
}

// A list of blocked words
export const BLOCKED = [
    'porn',
    'gay',
    'faggot',
    'lesbian',
    'nazi',
    'nigga',
    'nigger',
    'loli',
    'shota',
    'fuck',
    'pussy',
    'dick',
    'asshole',
    'butthole',
    'dildo'
];

export const DB = {
    EXIT: "Safely ending the database pool before exiting the script.",
    CONNECTED: "[DB] Successfully connected to the database.",
    NO_DB: "[DB] Please provide a database configuration object inside the Pokole configuration object.",
    NO_USER: "[DB] Please provide a database user.",
    NO_HOST: "[DB] Please provide the database's host URL.",
    NO_DATABASE: "[DB] Please provide the name of the database you want to use with Pokole.",
    NO_PASS: (user: string) => `[DB] Please provide the password for ${user}.`,
    ERROR: (err: Error) => `[DB] Unexpected error on database idle client: ${err}`
} 
