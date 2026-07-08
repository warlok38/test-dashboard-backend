import { AuthService } from './auth.service'

describe('AuthService', () => {
  it('issues a token that can be verified', () => {
    const authService = new AuthService()

    const auth = authService.authorizeByKerb()

    expect(auth.token).toEqual(expect.any(String))
    expect(auth.name).toBe('Товарищ Разработчик')
    expect(auth.avatar).toBeNull()
    expect(authService.verifyToken(auth.token)).toEqual({
      id: 'dev-user',
      name: 'Товарищ Разработчик',
      avatar: null
    })
  })

  it('does not verify an expired token', () => {
    const authService = new AuthService({ tokenTtlSeconds: -1 })
    const auth = authService.authorizeByKerb()

    expect(authService.verifyToken(auth.token)).toBeNull()
  })
})
