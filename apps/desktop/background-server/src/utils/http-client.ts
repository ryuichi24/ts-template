import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { logger } from "../logger/logger.js";

export namespace HTTPClient {
  export type Config = {
    baseURL: string;
    baseUrlForPublic?: string;
    refreshTokenUrl: string;
    auth?: {
      setAccessToken: (accessToken: string) => void;
      getAccessToken: () => Promise<string | null> | (string | null);
      getRefreshToken?: () => Promise<string | null> | (string | null);
    };
  };
}

export class HTTPClient {
  _axiosInstance: AxiosInstance;
  _publicAxiosInstance: AxiosInstance;
  _refreshTokenUrl: string;
  _auth?: {
    setAccessToken: (accessToken: string) => void;
    getAccessToken: () => Promise<string | null> | (string | null);
    getRefreshToken?: () => Promise<string | null> | (string | null);
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

  public async get(url: string, config?: AxiosRequestConfig<Record<string, any>>) {
    return await this._axiosInstance.get.bind(this._axiosInstance)(url, { ...config });
  }

  public async post(url: string, data?: Record<string, any>, config?: AxiosRequestConfig<Record<string, any>>) {
    return await this._axiosInstance.post.bind(this._axiosInstance)(url, data, config);
  }

  private _setupAuth() {
    this._axiosInstance.interceptors.request.use(async (request) => {
      if (!this._auth) return request;
      logger.debug("Adding access token to request...");
      const accessToken = await this._auth.getAccessToken();
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
        if (!this._auth) return err;

        const { config, response } = err;

        if (!config || !response) {
          return err;
        }

        // If the error is not due to authentication, do not refresh the access token
        if (response.status !== 401) return err;

        // If the error is due to the refresh token, do not retry
        if (config.url === this._refreshTokenUrl) return err;

        logger.debug("Refreshing access token...");
        const refreshToken = await this._auth.getRefreshToken?.();
        if (!refreshToken) {
          logger.debug("No refresh token found, cannot refresh access token.");
          return err;
        }

        try {
          const res = await this._publicAxiosInstance.post(this._refreshTokenUrl, {
            refreshToken: refreshToken,
          });
          const { accessToken } = res.data;
          if (!accessToken) return err;

          logger.debug(`Access token refreshed successfully. ${accessToken}`);

          // Save the new access token
          this._auth.setAccessToken(accessToken);

          // Update the original request with the new access token
          config.headers.Authorization = `Bearer ${accessToken}`;

          // retry the original request with the new access token
          return await this._axiosInstance(config);
        } catch (error) {
          logger.debug("Error refreshing access token");
          return err;
        }
      },
    );
  }
}
