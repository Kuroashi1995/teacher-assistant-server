import { Pool } from "pg";
import { config } from "../config";

export class Database {
  dbConnection: Pool;
  constructor() {
    this.dbConnection = new Pool({
      host: config.database.host,
      database: config.database.database,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
    });
    this.dbConnection.on("error", (err, client) => {
      throw new Error(`Unexpected error on idle client: ${err}`);
    });
  }

  async callDatabase<T>({
    query,
    operation,
    data,
  }: {
    /**
     * The query for the database
     */
    query: string;
    /**
     * The operation to be applied to each object in the response
     */
    operation: Function;
    /**
     * The data that corresponds to the query
     */
    data?: string[];
  }): Promise<T[] | null> {
    try {
      const client = await this.dbConnection.connect();
      const res = await client.query(query, data);
      client.release();
      if (res.rowCount === 0) {
        return null;
      } else if (res.rowCount === 1) {
        return [operation(res.rows[0])];
      } else if (res.rowCount > 1) {
        return res.rows.map((result) => operation(result));
      }
    } catch (err) {
      throw new Error(`Error connecting to the database: ${err}`);
    }
  }
}
