const { Pokole } = require("pokole");

const config = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || process.env.DB_USER,
    port: Number(process.env.DB_PORT) || 5432,
  },
  frontURL: process.env.FRONT_URL || "localhost",
  backURL: process.env.BACK_URL || "localhost:8080",
  server: {
    port: Number(process.env.FRONT_PORT) || 80,
    backendPort: Number(process.env.BACK_PORT) || 8080,
  },
  jwtSecret: process.env.JWT,
  registration:
    process.env.REGISTRATION.toLowerCase() == "true" ? true : false ?? true,
};

new Pokole(config).start();
