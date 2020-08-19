![Pokole](https://i.imgur.com/jGBJmfr.png)

# 🔗 Pokole
Pokole is a simple and fast URL shortener that uses NodeJS and PostgreSQL.

## 🤔 Meaning
Pokole stands for 'short' in Hawaiian.

## 💻 Features
- Simplicity
- Ease of use
- In-Depth statistics
- Written in TypeScript to ensure fast and bug-free code

## 📝 Requirements
- [Node.js](https://nodejs.org/en/) (12 or newer)
- [node-gyp](https://github.com/nodejs/node-gyp) (required for building bcrypt)
- [PostgreSQL](https://postgresql.org) (latest)

## 🔨 Usage
Here's an easy-to-follow tutorial:

- Install Node, node-gyp and PostgreSQL
- Create a new folder and install the package inside via npm (`npm install pokole`) or yarn (`yarn add pokole`)
- Create a JavaScript file inside the folder (e.g. server.js)
- Import the Pokole class from the package, create a new instance of the class, provide the required configuration and call the `.start()` function! You can find a sample script below:
```js
// We import the Pokole class from the Pokole package
const { Pokole } = require('pokole');

// You need to provide an object containing crucial information for the package, so we define that here 
const config = {
    // The database connection information
    db: { 
        // The database user
        user: 'penfoldium',
        // The password used by the PostgreSQL user
        password: 'PeNf0ldium',
        // The URL PostgreSQL is accessible at
        host: 'localhost',
        // The name of the database to use from PostgreSQL
        database: 'pokole',
        // The port PostgreSQL uses, defaults to 5432 if not defined
        port: 5432
    },
    // The URL the front-end of Pokole is accessible from
    frontURL: 'localhost',
    // The URL the back-end of Pokole is accessible from
    backURL: 'localhost:8080',
    server: {
        //  The port the front-end part of Pokole should run on, defaults to 80 if not defined
        port: 80,
        // The port the back-end part of Pokole should run on, defaults to 8080 if not defined
        backendPort: 8080
    },
    // The JWT (JSON Web Token) secret you want to use - make sure to keep this private, as this is what's used to encrypt user tokens
    jwtSecret: '33HdAiM$4zGs',
    // Whether or not registration is enabled, defaults to true
    registration: true
};

// We create a new Pokole instance, provide it with the required options and call the start function
new Pokole(config).start();
```

⚠ We recommend using a process manager such as [PM2](https://pm2.keymetrics.io) for keeping the script alive!

## 📂 Hosting Static Files
If you want to host static files alongside Pokole, create a file called "static" in the folder above and Pokole will serve the files inside it.

The default static files can be found [here](/src/static). Don't forget to include a 404 folder with a index.html file (this is where users get redirected if a short URL does not exist)!

[Pokole-Web](https://github.com/penfoldium/pokole-web) is a webpage you can use to manage your URLS.

## 🕸 Routes / API

| Endpoint  | Type | Headers                                   | Description                                                                                     | Returns (JSON)                                                 | Requires authentication |
| --------- | ---- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------- |
| /register | GET  |                                           | Check if registration is possible                                                               | enabled: boolean                                               | No                      |
| /register | POST | email, username, password                 | Register an account                                                                             | success: string \| error: string                               | No                      |
| /login    | POST | user: username \| email, password          | Login to an existing account                                                                   | { token: string, expiresIn: number } \| error: string          | No                      |
| /shorten  | POST | Authorization: Bearer token, URL, custom? | Shorten an URL                                                                                  | { success: string, URL: link } \| error: string                | Yes                     |
| /me/links	| GET  | Authorization: Bearer token               | Returns an array containing the list of your shortened URL's and and array of statistics for it | { longURL: link, shortURL: link, created_on: date, stats: [] } | Yes                     |

Legend: ? means the header is optional; | means OR; the string after the colon in the returns is the type of the returned thing

Note: the token is only valid for an hour, so you will have to request a new one after it!