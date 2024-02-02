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
};

export { config };
