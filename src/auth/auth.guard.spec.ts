import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'

import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'

function createContext(authorization?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: authorization ? { authorization } : {}
      })
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
