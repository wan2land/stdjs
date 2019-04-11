
export interface OAuthStrategy {
  getCallbackUrl(redirectUri?: string): string
  getToken(code: string, redirectUri?: string): Promise<OAuthToken>
  getUser(token: OAuthToken): Promise<OAuthUser>
}

export interface OAuthToken {
  token: string
  refreshToken?: string
  expiresIn: number
  tokenType: string
  [key: string]: any
}

export interface OAuthUser {
  id: string
  nickname?: string
  name?: string
  email?: string
  avatar?: string
  raw?: any
}
