import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'

import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'

function createRequest(authorization?: string): {
  headers: {
    authorization?: string
  }
  user?: {
    id: string
    name: string
    avatar: string | null
  }
} {
  return {
    headers: authorization ? { authorization } : {}
  }
}

function createContext(authorization?: string): ExecutionContext {
  const request = createRequest(authorization)

  return {
    switchToHttp: () => ({
      getRequest: () => request
    })
  } as ExecutionContext
}

describe('AuthGuard', () => {
  const originalEnv = process.env.AUTH_DEBUG_API_STATUS

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.AUTH_DEBUG_API_STATUS
      return
    }

    process.env.AUTH_DEBUG_API_STATUS = originalEnv
  })

  it('allows requests with a valid bearer token', () => {
    const authService = new AuthService()
    const guard = new AuthGuard(authService)
    const auth = authService.authorizeByKerb()

    expect(guard.canActivate(createContext(`Bearer ${auth.token}`))).toBe(true)
  })

  it('stores verified user on the request', () => {
    const authService = new AuthService()
    const guard = new AuthGuard(authService)
    const auth = authService.authorizeByKerb()
    const request = createRequest(`Bearer ${auth.token}`)
    const context = {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as ExecutionContext

    guard.canActivate(context)

    expect(request.user).toEqual({
      id: 'dev-user',
      name: 'Товарищ Разработчик',
      avatar: null
    })
  })

  it('rejects requests without a bearer token', () => {
    const guard = new AuthGuard(new AuthService())

    expect(() => guard.canActivate(createContext())).toThrow(UnauthorizedException)
  })

  it('rejects requests with an invalid token', () => {
    const guard = new AuthGuard(new AuthService())

    expect(() => guard.canActivate(createContext('Bearer bad-token'))).toThrow(UnauthorizedException)
  })

  it('returns configured 401 debug status before token validation', () => {
    process.env.AUTH_DEBUG_API_STATUS = '401'
    const guard = new AuthGuard(new AuthService())

    expect(() => guard.canActivate(createContext())).toThrow(UnauthorizedException)
  })

  it('returns configured 403 debug status before token validation', () => {
    process.env.AUTH_DEBUG_API_STATUS = '403'
    const guard = new AuthGuard(new AuthService())

    expect(() => guard.canActivate(createContext())).toThrow(ForbiddenException)
  })

  it('returns configured 500 debug status before token validation', () => {
    process.env.AUTH_DEBUG_API_STATUS = '500'
    const guard = new AuthGuard(new AuthService())

    expect(() => guard.canActivate(createContext())).toThrow(InternalServerErrorException)
  })
})
