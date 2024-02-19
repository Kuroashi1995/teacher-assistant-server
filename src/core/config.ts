const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_DATABASE || "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION,
  },
  cryptr: {
    key: process.env.CRYPTR_KEY,
  },
  openai: {
    key: process.env.OPENAI_API_KEY,
  },
};

export { config };
