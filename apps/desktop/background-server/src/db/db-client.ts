import path from "path";
import Database from "better-sqlite3";

const getDvDbName = (id: string) => path.join("./", `${id}.dev.db`);
const getProdDbName = (id: string) => path.join(process.env.ELECTRON_USER_DATA_PATH, `${id}.db`);
const getDbFileName = (id: string) => (process.env.NODE_ENV === "development" ? getDvDbName(id) : getProdDbName(id));

export class DBClient {
  private static _instance: DBClient;
  private container: Map<string, Database.Database> = new Map();

  static get instance() {
    if (DBClient._instance === undefined) {
      DBClient._instance = new DBClient();
    }
    return DBClient._instance;
  }

  public getConn(id: string) {
    const conn = this.container.get(id);
    if (conn === undefined) {
      const newDbConn = new Database(getDbFileName(id));
      this.container.set(id, newDbConn);
      return newDbConn;
    }
    return conn;
  }
}
