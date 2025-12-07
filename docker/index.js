const { Pokole } = require("./dist/index");

const config = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || process.env.DB_USER,
    port: Number(process.env.DB_PORT) || 5432,
  },
  URL: process.env.URL || "localhost",
  server: {
    port: Number(process.env.PORT) || 80,
  },
  jwtSecret: process.env.JWT,
  registration:
    process.env.REGISTRATION.toLowerCase() == "true" ? true : false ?? true,
};

new Pokole(config).start();
