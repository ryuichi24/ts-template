import { customType } from "drizzle-orm/sqlite-core";

const pad = (num: number, size = 3) => String(num).padStart(size, "0");

// https://orm.drizzle.team/docs/custom-types
export const c_timestamp = customType<{
  data: Date;
  driverData: string;
  config: {};
}>({
  dataType(config) {
    return "TEXT";
  },
  fromDriver(value: string): Date {
    return new Date(value);
  },
  toDriver(value) {
    const date = value.toISOString().split("T")[0];
    const time = value.toTimeString().split(" ")[0].replace(/:/g, ":");
    const milliseconds = pad(value.getMilliseconds());
    return `${date} ${time}.${milliseconds}`;
  },
});
