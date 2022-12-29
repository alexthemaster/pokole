![Pokole](https://i.imgur.com/jGBJmfr.png)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/alexthemaster/pokole.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/alexthemaster/pokole/context:javascript)

# 🔗 Pokole
Pokole is a simple and fast URL shortener that uses NodeJS and PostgreSQL.

## 🤔 Meaning
Pokole stands for 'short' in Hawaiian.

## 💻 Features
- Simplicity
- Ease of use
- In-depth statistics
- Written in TypeScript to ensure fast and bug-free code

## 🐳 Docker
Using Pokole in Docker is easier, faster and more convenient! Head over to [Docker Hub](https://hub.docker.com/r/alexthemaster/pokole) for more information.

## 📝 Requirements
- [Node.js](https://nodejs.org/en/) (12 or newer)
- [node-gyp](https://github.com/nodejs/node-gyp) (required for building bcrypt)
- [PostgreSQL](https://postgresql.org) (latest)

## 🔨 Usage
Here's an easy-to-follow tutorial:

- Install Node, node-gyp and PostgreSQL
- Create a new folder and install the package inside via npm (`npm install pokole`) or yarn (`yarn add pokole`)
- Create a JavaScript file inside the folder (e.g. `server.js`)
- Import the Pokole class from the package, create a new instance of the class, provide the required configuration and call the `.start()` function! You can find a sample script below:
```js
// We import the Pokole class from the Pokole package
const { Pokole } = require('pokole');

// You need to provide an object containing crucial information for the package, so we define it here 
const config = {
    // The database connection information
    db: { 
        // The database user
        user: 'alexthemaster',
        // The password used by the PostgreSQL user
        password: 'eee23EfgZ',
        // The URL PostgreSQL can be accessed from
        host: 'localhost',
        // The name of the database to use from PostgreSQL
        database: 'pokole',
        // The port PostgreSQL uses (defaults to 5432)
        port: 5432
    },
    // The URL the front-end of Pokole can be accessed from
    frontURL: 'localhost',
    // The URL the back-end of Pokole can be accessed from
    backURL: 'localhost:8080',
    server: {
        //  The port the front-end part of Pokole should run on, (defaults to 80)
        port: 80,
        // The port the back-end part of Pokole should run on, (defaults to 8080)
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

⚠ We recommend using a process manager such as [PM2](https://pm2.keymetrics.io) to keep the script running!

## 📂 Hosting Static Files
If you want to host static files alongside Pokole, create a folder called `static` in the folder above and Pokole will serve the files inside this folder.

The default static files can be found [here](/src/static). Don't forget to include a 404 folder with an `index.html` file (this is where users get redirected if a short URL does not exist!)

[Pokole-Web](https://github.com/alexthemaster/pokole-web) is a webpage you can use to manage your URLs.

## 🕸 Routes / API

| Endpoint  | Type | Headers                                     | Description                                                                                     | Returns (JSON)                                                    | Requires authentication |
| --------- | ---- | ------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------- |
| /register | GET  |                                             | Check if registration is possible                                                               | `enabled: boolean`                                                | No                      |
| /register | POST | `email, username, password`                 | Register an account                                                                             | `success: string \| error: string`                                 | No                      |
| /login    | POST | `user: username \| email, password`          | Login to an existing account                                                                    | `{ token: string, expiresIn: number } \| error: string`            | No                      |
| /shorten  | POST | `Authorization: Bearer token, URL, custom?` | Shorten an URL                                                                                  | `{ success: string, URL: link } \| error: string`                  | Yes                     |
| /me/links	| GET  | `Authorization: Bearer token`               | Returns an array containing the list of your shortened URL's and and array of statistics for it | `{ longURL: link, shortURL: link, created_on: date, stats: [] }`  | Yes                     |

Legend: `?` means the header is optional; `|` means OR; the string after `:` in the Returns column is the type of the returned object

Note: the token is only valid for an hour, so you will have to request a new one after that!
