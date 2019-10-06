![Pokole](/assets/logo.png)

# 🔗 Pokole
Pokole is a simple URL shortener that uses NodeJS and RethinkDB.

## 📝 Requirements
- [Node.js](https://nodejs.org/en/) (12 or newer)
- [node-gyp](https://github.com/nodejs/node-gyp)
- [RethinkDB](https://rethinkdb.com) (latest)

## ⚙️ Configuration
- `git clone https://github.com/penfoldium/pokole`
- `cd pokole`
- `npm install`
- `npm run setup`

If you want to manually do set up Pokole, you can always edit and rename the [config.example.json](/src/data/config.example.json) file.

## 📂 Hosting Static Files
If you want to host static files alongside Pokole, replace or edit the files in the folder called static, which can be found in the src directory [here](/src/static).

Note: don't delete the 404 folder, since users get redirected there if a short URL does not exist (you can, however, replace it with a desired one)
<!-- to be used if pokole will be an NPM package -->
<!-- If you want to host static files alongside Pokole, create a folder called static in the main folder (where your JS file is) and put your files there. The default files can be found [here](/src/static). Also include a 404 folder with a index.html file (this is where users get redirected if a short URL does not exist)! -->
## ✏️ Usage
Configure it and then run `npm start`, it's that simple!

# 📃 API

| Endpoint | Type | Headers                                              |  Description                                                                                | Returns (JSON)                                                                   |
| -------- | ---- | ---------------------------------------------------- |  ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| /register| GET  |                                                      |  Check if registration is possible                                                          | Boolean                                                                          |
| /register| POST | email, username, password                            |  Register an account                                                                        | success: string \| error: string                                                 |
| /login   | POST | user: username \| email, password                    |  Login to an existing account                                                               | Object: { token: string, expiresIn: number } \| error: string                    |
| /shorten | POST | authorization: bearer token, URL, custom?            |  Shorten an URL                                                                             | Object: { success: string, URL: link } \| error: string                          |
| /me/links| GET  | authorization: bearer token                          |  Returns a an object containing the list of your shortened URL's and the how many there are | Object: Array: { longURL: link, shortURL: link, clicks: number }, count: number  |
Note: the token is only valid for an hour, so you will have to request a new one after it!
