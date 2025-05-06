import { generateUUID } from "@ts-template/uuid-util";
import { text } from "drizzle-orm/sqlite-core/columns";

export function makeUUIDCol(colName: string) {
  return text(colName).$defaultFn(() => generateUUID());
}
