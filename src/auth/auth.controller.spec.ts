import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  const originalEnv = process.env.AUTH_DEBUG_KERB_STATUS

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.AUTH_DEBUG_KERB_STATUS
      return
    }

    process.env.AUTH_DEBUG_KERB_STATUS = originalEnv
  })

  it('returns auth response without debug status', () => {
    const controller = new AuthController(new AuthService())

    expect(controller.authorizeByKerb()).toEqual({
      token: expect.any(String),
      name: 'Товарищ Разработчик',
      avatar: null
    })
  })

  it('returns configured 401 debug status', () => {
    process.env.AUTH_DEBUG_KERB_STATUS = '401'
    const controller = new AuthController(new AuthService())

    expect(() => controller.authorizeByKerb()).toThrow(UnauthorizedException)
  })

  it('returns configured 403 debug status', () => {
    process.env.AUTH_DEBUG_KERB_STATUS = '403'
    const controller = new AuthController(new AuthService())

    expect(() => controller.authorizeByKerb()).toThrow(ForbiddenException)
  })

  it('returns configured 500 debug status', () => {
    process.env.AUTH_DEBUG_KERB_STATUS = '500'
    const controller = new AuthController(new AuthService())

    expect(() => controller.authorizeByKerb()).toThrow(InternalServerErrorException)
  })
})
