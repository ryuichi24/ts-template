import axios, { AxiosError, AxiosInstance } from "axios";
import { logger } from "./logger.js";

export namespace HTTPClient {
  export type Config = {
    baseURL: string;
    baseUrlForPublic?: string;
    refreshTokenUrl: string;
    auth?: {
      setAccessToken: (accessToken: string) => void;
      getAccessToken: () => string | null;
      getRefreshToken?: () => string | null;
    };
  };
}

export class HTTPClient {
  _axiosInstance: AxiosInstance;
  _publicAxiosInstance: AxiosInstance;
  _refreshTokenUrl: string;
  _auth?: {
    setAccessToken: (accessToken: string) => void;
    getAccessToken: () => string | null;
    getRefreshToken?: () => string | null;
  };

  constructor(props: HTTPClient.Config) {
    this._refreshTokenUrl = props.refreshTokenUrl;
    this._axiosInstance = axios.create({
      baseURL: props.baseURL,
      withCredentials: true,
    });

    this._publicAxiosInstance = axios.create({
      baseURL: props.baseUrlForPublic ?? props.baseURL,
    });

    const hasAuth = !!props.auth;
    if (hasAuth) {
      this._auth = props.auth;
      this._setupAuth();
    }
  }

  public async get(url: string, params?: Record<string, any>) {
    return await this._axiosInstance.get.bind(this._axiosInstance)(url, {
      params,
    });
  }

  private _setupAuth() {
    this._axiosInstance.interceptors.request.use((request) => {
      if (!this._auth) return request;
      logger.debug("Adding access token to request...");
      const accessToken = this._auth.getAccessToken();
      if (!accessToken) {
        logger.debug("No access token found, skipping...");
        return request;
      }
      request.headers.Authorization = `Bearer ${accessToken}`;
      return request;
    });

    this._axiosInstance.interceptors.response.use(
      (res) => res,
      async (err: AxiosError) => {
        if (!this._auth) throw err;

        const { config, response } = err;

        if (!config || !response) {
          throw err;
        }

        // If the error is not due to authentication, do not refresh the access token
        if (response.status !== 401) throw err;

        // If the error is due to the refresh token, do not retry
        if (config.url === this._refreshTokenUrl) throw err;

        logger.debug("Refreshing access token...");
        const refreshToken = this._auth.getRefreshToken?.();
        if (!refreshToken) {
          logger.debug("No refresh token found, cannot refresh access token.");
          throw err;
        }

        const res = await this._publicAxiosInstance.post(this._refreshTokenUrl, {
          refreshToken: refreshToken,
        });

        const { accessToken } = res.data;
        if (!accessToken) throw err;

        logger.debug(`Access token refreshed successfully. ${accessToken}`);

        // Save the new access token
        this._auth.setAccessToken(accessToken);

        // Update the original request with the new access token
        config.headers.Authorization = `Bearer ${accessToken}`;

        // retry the original request with the new access token
        return await this._axiosInstance(config);
      },
    );
  }
}
