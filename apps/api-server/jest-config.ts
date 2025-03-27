import type { Config } from "jest";

// https://jestjs.io/docs/next/configuration
export default async (): Promise<Config> => {
  return {
    verbose: true,
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverageFrom: ["**/*.(t|j)s"],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
  };
};
