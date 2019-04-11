import axios from "axios"
import { escape } from "querystring"

import { OAuthStrategy, OAuthToken } from "../interfaces/oauth"

interface TokenResponse {
  access_token: string
  token_type: "bearer"
  expires_in: number
}

interface UserResponse {
  id: string
  name: string
  email: string
}

export class FacebookStrategy implements OAuthStrategy {

  public constructor(
    public options: {clientId: string, redirectUri: string, clientSecret: string}
  ) {}

  public getCallbackUrl(redirectUri?: string) {
    return `https://www.facebook.com/v3.2/dialog/oauth?client_id=${this.options.clientId}&redirect_uri=${escape(redirectUri || this.options.redirectUri)}&response_type=code`
  }

  public async getToken(code: string, redirectUri?: string) {
    try {
      const response = await axios.get<TokenResponse>("https://graph.facebook.com/v3.2/oauth/access_token", {
        params: {
          client_id: this.options.clientId,
          client_secret: this.options.clientSecret,
          redirect_uri: redirectUri || this.options.redirectUri,
          code,
        }
      })
      return {
        token: response.data.access_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      }
    } catch (e) {
      if (e.response &&e.response.status === 401) {
        throw Object.assign(new Error("expired code"), {code: "EXPIRED_CODE"})
      }
      throw e
    }

  }

  public async getUser(token: OAuthToken) {
    try {
      const response = await axios.get<UserResponse>("https://graph.facebook.com/v3.2/me", {
        params: {
          access_token: token.token,
          fields: "id,email,name",
        },
      })
      return {
        id: response.data.id,
        ...(response.data.email ? {email: response.data.email} : {}),
        name: response.data.name,
        avatar: `https://graph.facebook.com/v3.2/${response.data.id}/picture?type=normal`,
      }
    } catch (e) {
      if (e.response &&e.response.status === 401) {
        throw Object.assign(new Error("expired code"), {code: "EXPIRED_CODE"})
      }
      throw e
    }
  }
}
