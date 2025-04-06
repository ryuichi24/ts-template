export type Config = {
  server: {
    port: number;
  };
  auth: {
    oauth: {
      desktop: {
        provider: {
          google: {
            clientId: string;
            clientSecret: string;
            authURL: string;
            redirectUri: string;
            tokenUrl?: string;
          };
          discord: {};
          github: {};
        };
        protocol: string;
      };
      mobile: {
        provider: { google: {}; discord: {}; github: {} };
        protocol: string;
      };
      web: {
        provider: { google: {}; discord: {}; github: {} };
        protocol: string;
      };
    };
    jwt: {
      accessToken: {
        secret: string;
        expiresIn: string;
      };
      refreshToken: {
        secret: string;
        expiresIn: string;
      };
    };
    admin: {
      emails: string[];
    };
  };
  api: {
    strapi: {
      baseUrl: string;
      token: string;
    };
  };
};
