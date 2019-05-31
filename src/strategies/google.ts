import axios from "axios"
import { escape, stringify } from "querystring"

import { OAuthStrategy, OAuthToken, OAuthUser } from "../interfaces/oauth"

interface TokenResponse {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
  id_token: string
}

interface UserResponse {
  sub: string
  name: string
  given_name: string
  family_name: string
  profile: string
  picture: string
  email: string
  email_verified: boolean
  locale: string
}

export interface GoogleStrategyOptions {
  clientId: string
  redirectUri: string
  clientSecret: string
  scopes?: string[]
}

export class GoogleStrategy implements OAuthStrategy {

  public constructor(
    public options: GoogleStrategyOptions
  ) {}

  public getCallbackUrl(redirectUri?: string) {
    const scopes = this.options.scopes || ["openid", "profile", "email"]
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.options.clientId}&redirect_uri=${escape(redirectUri || this.options.redirectUri)}&scope=${escape(scopes.join(" "))}&response_type=code`
  }

  public async getToken(code: string, redirectUri?: string): Promise<OAuthToken> {
    try {
      const response = await axios.post<TokenResponse>("https://www.googleapis.com/oauth2/v4/token", stringify({
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        redirect_uri: redirectUri || this.options.redirectUri,
        code,
        grant_type: "authorization_code",
      }))
      return {
        token: response.data.access_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
        idToken: response.data.id_token,
        scope: response.data.scope,
      }
    } catch (e) {
      throw e
    }
  }

  public async getUser(token: OAuthToken): Promise<OAuthUser> {
    try {
      const response = await axios.get<UserResponse>("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        params: {
          prettyPrint: "false",
        },
      })
      return {
        id: response.data.sub,
        email: response.data.email,
        name: response.data.name,
        avatar: response.data.picture,
      }
    } catch (e) {
      throw e
    }
  }
}
