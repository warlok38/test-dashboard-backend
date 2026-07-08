export type AuthServiceOptions = {
  tokenTtlSeconds?: number
  tokenSecret?: string
}

export const AUTH_SERVICE_OPTIONS = Symbol('AUTH_SERVICE_OPTIONS')
