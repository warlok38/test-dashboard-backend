import { ForbiddenException } from '@nestjs/common'

import { PermissionsService } from './permissions.service'

describe('PermissionsService', () => {
  it('returns service access permissions for a user in the service access group', () => {
    const service = new PermissionsService()

    expect(service.findByUser({ id: 'dev-user', name: 'Товарищ Разработчик', avatar: null })).toEqual({
      user: 'dev-user',
      acl: {
        serviceAccess: 'R'
      }
    })
  })

  it('rejects a user without the service access group', () => {
    const service = new PermissionsService()

    expect(() =>
      service.findByUser({ id: 'restricted-user', name: 'Restricted User', avatar: null })
    ).toThrow(ForbiddenException)
  })
})
