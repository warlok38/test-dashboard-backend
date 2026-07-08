import { createHmac, timingSafeEqual } from 'node:crypto'
import { Inject, Injectable, Optional } from '@nestjs/common'

import { AUTH_SERVICE_OPTIONS, type AuthServiceOptions } from './auth.constants'
import type { AuthResponseDto } from './dto/auth-response.dto'
import type { AuthUser } from './types/auth-user'

type TokenPayload = AuthUser & {
  exp: number
}

const MOCK_USER: AuthUser = {
  id: 'dev-user',
  name: 'Товарищ Разработчик',
  avatar: null
}

const DEFAULT_TOKEN_TTL_SECONDS = 5 * 60

@Injectable()
export class AuthService {
  private readonly tokenTtlSeconds: number
  private readonly tokenSecret: string

  constructor(
    @Optional()
    @Inject(AUTH_SERVICE_OPTIONS)
    options: AuthServiceOptions = {}
  ) {
    const envTokenTtlSeconds = Number(process.env.AUTH_TOKEN_TTL_SECONDS)

    this.tokenTtlSeconds =
      options.tokenTtlSeconds ??
      (Number.isFinite(envTokenTtlSeconds) && envTokenTtlSeconds > 0
        ? envTokenTtlSeconds
        : DEFAULT_TOKEN_TTL_SECONDS)
    this.tokenSecret = options.tokenSecret ?? process.env.AUTH_TOKEN_SECRET ?? 'local-dev-auth-secret'
  }

  authorizeByKerb(): AuthResponseDto {
    const token = this.issueToken(MOCK_USER)

    return {
      token,
      name: MOCK_USER.name,
      avatar: MOCK_USER.avatar
    }
  }

  verifyToken(token: string): AuthUser | null {
    const [encodedPayload, signature] = token.split('.')

    if (!encodedPayload || !signature || !this.isValidSignature(encodedPayload, signature)) {
      return null
    }

    const payload = this.parsePayload(encodedPayload)

    if (!payload || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    return {
      id: payload.id,
      name: payload.name,
      avatar: payload.avatar
    }
  }

  private issueToken(user: AuthUser) {
    const payload: TokenPayload = {
      ...user,
      exp: Math.floor(Date.now() / 1000) + this.tokenTtlSeconds
    }
    const encodedPayload = this.encode(JSON.stringify(payload))
    const signature = this.sign(encodedPayload)

    return `${encodedPayload}.${signature}`
  }

  private parsePayload(encodedPayload: string): TokenPayload | null {
    try {
      const json = Buffer.from(encodedPayload, 'base64url').toString('utf8')
      const payload = JSON.parse(json) as Partial<TokenPayload>

      if (
        typeof payload.id !== 'string' ||
        typeof payload.name !== 'string' ||
        typeof payload.exp !== 'number' ||
        !('avatar' in payload)
      ) {
        return null
      }

      return {
        id: payload.id,
        name: payload.name,
        avatar: typeof payload.avatar === 'string' ? payload.avatar : null,
        exp: payload.exp
      }
    } catch {
      return null
    }
  }

  private encode(value: string) {
    return Buffer.from(value, 'utf8').toString('base64url')
  }

  private sign(value: string) {
    return createHmac('sha256', this.tokenSecret).update(value).digest('base64url')
  }

  private isValidSignature(encodedPayload: string, signature: string) {
    const expectedSignature = this.sign(encodedPayload)
    const expectedBuffer = Buffer.from(expectedSignature)
    const actualBuffer = Buffer.from(signature)

    return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer)
  }
}
