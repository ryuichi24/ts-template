import { credentialStore } from "../stores/credential-store.js";
import { HTTPClient } from "../utils/http-client.js";
import { logger } from "../utils/logger.js";

const API_BASE_URL = process.env.CLOUD_SERVER_BASE_URL ?? "http://localhost:3000/api";
const REFRESH_TOKEN_URL = `${API_BASE_URL}/auth/refresh-token`;

export const apiClient = new HTTPClient({
  baseURL: API_BASE_URL,
  refreshTokenUrl: REFRESH_TOKEN_URL,
  auth: {
    setAccessToken: (accessToken: string) => {
      logger.debug(`Setting access token: ${accessToken}`);
      credentialStore.set("accessToken.value", accessToken);
    },
    getAccessToken: async () => {
      const token = await credentialStore.get("accessToken.value");
      logger.debug(`access token: ${token}`);
      if (token) {
        return token;
      }
      return null;
    },
    getRefreshToken: async () => {
      const token = await credentialStore.get("refreshToken.value");
      logger.debug(`refresh token: ${token}`);
      if (token) {
        return token;
      }
      return null;
    },
  },
});
