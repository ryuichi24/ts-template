import { makeUUIDCol } from "./make-uuid-col.js";

export const id = (col: string = "id") => makeUUIDCol(col).primaryKey().notNull();
