import { ConfigFactory } from "@nestjs/config";
import { Config } from "./config.type";

// https://docs.nestjs.com/techniques/configuration#custom-configuration-files
export const configFactory: ConfigFactory = (): Config => ({
  server: {
    port: parseInt(process.env.PORT ?? "3000", 10),
  },
  auth: {
    // https://stackoverflow.com/questions/63092165/should-refresh-tokens-in-jwt-authentication-schemes-be-signed-with-a-different-s
    jwt: {
      accessToken: {
        secret: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET ?? "",
        expiresIn: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN ?? "15m",
      },
      refreshToken: {
        secret: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET ?? "",
        expiresIn: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN ?? "7d",
      },
    },
    oauth: {
      desktop: {
        provider: {
          google: {
            clientId: process.env.DESKTOP_OAUTH_GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.DESKTOP_OAUTH_GOOGLE_CLIENT_SECRET ?? "",
            authURL: process.env.DESKTOP_OAUTH_GOOGLE_AUTH_URL ?? "https://accounts.google.com/o/oauth2/v2/auth",
            redirectUri:
              process.env.DESKTOP_OAUTH_GOOGLE_REDIRECT_URL ??
              "http://localhost:3000/auth/oauth/desktop/google/callback",
            tokenUrl: process.env.DESKTOP_OAUTH_GOOGLE_TOKEN_URL ?? "https://oauth2.googleapis.com/token",
          },
          discord: {},
          github: {},
        },
        protocol: process.env.OAUTH_DESKTOP_PROTOCOL ?? "ts-template",
      },
      mobile: {
        provider: {
          google: {},
          discord: {},
          github: {},
        },
        protocol: process.env.OAUTH_MOBILE_PROTOCOL ?? "ts-template",
      },
      web: {
        provider: {
          google: {},
          discord: {},
          github: {},
        },
        protocol: process.env.OAUTH_WEB_PROTOCOL ?? "https",
      },
    },
    admin: {
      emails: [...(process.env.ADMIN_EMAILS?.split(",") ?? [])],
    },
  },
  api: {
    strapi: {
      baseUrl: process.env.STRAPI_BASE_URL ?? "http://localhost:1337",
      token: process.env.STRAPI_TOKEN ?? "",
    },
  },
  db: {
    main: {
      postgres: {
        host: process.env.POSTGRES_HOST ?? "localhost",
        port: parseInt(process.env.POSTGRES_PORT ?? "5432", 10),
        username: process.env.POSTGRES_USER ?? "postgres",
        password: process.env.POSTGRES_PASSWORD ?? "",
        database: process.env.POSTGRES_DB ?? "postgres",
      },
    },
    cache: {
      sqlite: {
        filename: process.env.DB_CACHE_SQLITE_DATABASE ?? "./cache.db",
      },
    },
  },
});
