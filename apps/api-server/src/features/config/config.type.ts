export type Config = {
  server: {
    port: number;
  };
  auth: {
    oauth: {
      desktop: {
        google: {
          clientId: string;
          clientSecret: string;
          authURL: string;
          redirectUri: string;
          tokenUrl?: string;
        };
        discord: {};
      };
      mobile: {};
      web: {};
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
};
