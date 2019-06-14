import axios from "axios"
import { escape } from "querystring"

import { OAuthStrategy, OAuthToken, OAuthUser } from "../interfaces/oauth"

interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: string
}

interface UserResponse {
  resultcode: string
  message: string
  response: {
    id: string
    enc_id: string
    profile_image: string
    age: string
    gender: string
    nickname: string
    email: string
    name: string
  }
}

export interface NaverStrategyInterface {
  clientId: string
  redirectUri: string
  clientSecret: string
}

export class NaverStrategy implements OAuthStrategy {

  public constructor(
    public options: NaverStrategyInterface
  ) {}

  public getCallbackUrl(redirectUri?: string) {
    return `https://nid.naver.com/oauth2.0/authorize?client_id=${this.options.clientId}&redirect_uri=${escape(redirectUri || this.options.redirectUri)}&response_type=code&state=randomstate`
  }

  public async getToken(code: string, redirectUri?: string): Promise<OAuthToken> {
    try {
      const response = await axios.get<TokenResponse>("https://nid.naver.com/oauth2.0/token", {
        params: {
          grant_type: "authorization_code",
          client_id: this.options.clientId,
          client_secret: this.options.clientSecret,
          redirect_uri: redirectUri || this.options.redirectUri,
          code,
          state: "randomstate",
        }
      })
      return {
        token: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: +response.data.expires_in,
        tokenType: response.data.token_type,
      }
    } catch (e) {
      throw e
    }
  }

  public async getUser(token: OAuthToken): Promise<OAuthUser> {
    try {
      const response = await axios.get<UserResponse>("https://openapi.naver.com/v1/nid/me", {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      })
      return {
        id: response.data.response.id,
        email: response.data.response.email,
        name: response.data.response.name,
        nickname: response.data.response.nickname,
        avatar: response.data.response.profile_image,
        raw: response.data.response,
      }
    } catch (e) {
      throw e
    }
  }
}
