![Pokole](/assets/logo.png)

# 🔗 Pokole
Pokole is a simple URL shortener that uses NodeJS and RethinkDB.

## ⚙️ Configuration
Configurating Pokole is very simple, all you have to do is run the `npm run setup` command and you're good to go.

If you want to manually do this, you can always edit and rename the [config.example.json](/src/data/config.example.json) file.

Note: If you want to host static files alongside Pokole, replace or edit the files in the folder called static, which can be found in the src directory [here](/src/static).
<!-- to be used if pokole will be an NPM package -->
<!-- Note: If you want to host static files alongside Pokole, create a folder called static in the main folder (where your JS file is) and put your files there. The default files can be found [here](/src/static). -->
## ✏️ Usage
Configure it and then run `npm start`, it's that simple!

# 📃 API

| Endpoint | Type | Headers                                              | Returns (JSON)                                                                           |
| -------- | ---- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| /register| GET  |                                                      | Boolean                                                                                  |
| /register| POST | email, username, password                            | success: string \| error: string                                                         |
| /login   | POST | user: username \| email, password                    | Object: { token: string, expiresIn: number } \| error: string                            |
| /shorten | POST | authorization: bearer token, URL, custom?            | Object: { success: string, URL: link } \| error: string                                  | 
| /me/links| GET  | authorization: bearer token                          | Object: Array: { longURL: link, shortURL: link, clicks: number }, count: number          |

Note: the token is only valid for an hour, so you will have to request a new one after it!
