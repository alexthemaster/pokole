![Pokole](/assets/logo.png)

# 🔗 Pokole
Pokole is a simple URL shortener that uses NodeJS and RethinkDB.

## ⚙️ Configuration
Configurating Pokole is very simple, all you have to do is run the `npm run setup` command and you're good to go.

If you want to manually do this, you can always edit and rename the [config.example.json](/src/data/config.example.json) file.

## ✏️ Usage
Configure it and then run `npm start`, it's that simple!

# 📃 API

| Endpoint | Type | Headers                     | Returns (JSON)                                                                           |
| -------- | ---- | --------------------------- | ---------------------------------------------------------------------------------------- |
| /register| POST | email, username, password   | success: string \| error: string                                                         |
| /login   | POST | email \| username, password | Object: { token: string, expiresIn: number } \| error: string                            |
| /shorten | POST | token, URL, custom?         | Object: { success: string, URL: link } \| error: string                                  | 
| /me/links| GET  | token                       | Object: Array: { longURL: link, shortURL: link, clicks: number }, count: number          |

Note: the token is only valid for an hour, so you will have to request a new one after it!