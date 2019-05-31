import axios from "axios"
import { escape, parse } from "querystring"

import { OAuthStrategy, OAuthToken, OAuthUser } from "../interfaces/oauth"

interface UserResponse {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  bio: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  private_gists: number
  total_private_repos: number
  owned_private_repos: number
  disk_usage: number
  collaborators: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    collaborators: number
    private_repos: number
  }
}

export interface GithubStrategyOptions {
  clientId: string
  redirectUri: string
  clientSecret: string
}

export class GithubStrategy implements OAuthStrategy {

  public constructor(
    public options: GithubStrategyOptions
  ) {}

  public getCallbackUrl(redirectUri?: string) {
    return `https://github.com/login/oauth/authorize?client_id=${this.options.clientId}&redirect_uri=${escape(redirectUri || this.options.redirectUri)}&scope=user`
  }

  public async getToken(code: string, redirectUri?: string): Promise<OAuthToken> {
    try {
      const response = await axios.post<string>("https://github.com/login/oauth/access_token", {
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        redirect_uri: redirectUri || this.options.redirectUri,
        code,
      })
      const data = parse(response.data)
      return {
        token: data.access_token as string,
        tokenType: data.token_type as string,
        scope: data.scope as string,
      }
    } catch (e) {
      throw e
    }
  }

  public async getUser(token: OAuthToken): Promise<OAuthUser> {
    try {
      const response = await axios.get<UserResponse>("https://api.github.com/user", {
        params: {
          access_token: token.token,
        },
      })
      return {
        id: `${response.data.id}`,
        email: response.data.email,
        name: response.data.name,
        avatar: response.data.avatar_url,
        raw: response.data,
      }
    } catch (e) {
      throw e
    }
  }
}
