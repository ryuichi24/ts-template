import { blob } from "drizzle-orm/sqlite-core/columns";
import { generateUUIDBuffer } from "@ts-template/uuid-util";

export function makeUUIDBlobCol(colName: string) {
  return blob(colName, { mode: "buffer" }).$defaultFn(() => generateUUIDBuffer());
}
