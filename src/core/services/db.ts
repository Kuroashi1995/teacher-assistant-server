import { Pool } from "pg";
import { config } from "../config";
export const pool = new Pool({
  host: config.database.host,
  database: config.database.database,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
});
pool.on("error", (err, client) => {
  throw new Error(`Unexpected error on idle client: ${err}`);
});
