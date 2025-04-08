import axios from "axios";
import { IOauthApiClient, UserInfo } from "./oauth-api-client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleOauthApiClient implements IOauthApiClient {
  async requestToken(dto: {
    tokenUrl: string;
    tokenCode: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    grantType: string;
  }): Promise<{ accessToken: string; refreshToken: string; expiresIn: number; idToken: string }> {
    const params = new URLSearchParams({
      code: dto.tokenCode,
      client_id: dto.clientId,
      client_secret: dto.clientSecret,
      redirect_uri: dto.redirectUri,
      grant_type: "authorization_code",
    });

    const url = `${dto.tokenUrl}?${params.toString()}`;
    const response = await axios.post(url);

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    const idToken = response.data.id_token;
    const expiresIn = response.data.expires_in;

    return {
      accessToken,
      refreshToken,
      idToken,
      expiresIn,
    };
  }
  async requestUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response.data;
    const {
      id,
      email,
      verified_email: isEmailVerified,
      name: username,
      given_name: givenName,
      family_name: familyName,
      picture: avatarUrl,
    } = data;

    return { id, email, isEmailVerified, username, givenName, familyName, avatarUrl };
  }
}
