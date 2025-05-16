import path from "path";

export const config = {
  db: {
    main: {
      path:
        process.env.NODE_ENV === "development" || process.env.NODE_ENV === "debug"
          ? path.resolve("./", `main.dev.db`)
          : path.join(process.env.ELECTRON_USER_DATA_PATH, `main.db`),
    },
  },
};
