import { PermissionsController } from './permissions.controller'
import { PermissionsService } from './permissions.service'

describe('PermissionsController', () => {
  it('returns permissions for the authenticated request user', () => {
    const controller = new PermissionsController(new PermissionsService())

    expect(
      controller.findPermissions({
        user: {
          id: 'dev-user',
          name: 'Товарищ Разработчик',
          avatar: null
        }
      })
    ).toEqual({
      user: 'dev-user',
      acl: {
        serviceAccess: 'R'
      }
    })
  })
})
