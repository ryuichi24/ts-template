import Database from "better-sqlite3";

export class DBClient {
  private static _instance: DBClient;
  private container: Map<string, Database.Database> = new Map();

  static get instance() {
    if (DBClient._instance === undefined) {
      DBClient._instance = new DBClient();
    }
    return DBClient._instance;
  }

  public getConn(dbPath: string) {
    const conn = this.container.get(dbPath);
    if (conn === undefined) {
      const newDbConn = new Database(dbPath);
      this.container.set(dbPath, newDbConn);
      return newDbConn;
    }
    return conn;
  }
}
