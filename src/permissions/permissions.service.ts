import { ForbiddenException, Injectable } from '@nestjs/common'

import type { AuthUser } from '../auth/types/auth-user'
import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
  SERVICE_ACCESS_GROUP
} from './permissions.constants'
import type { Permission } from './types/permission'

const USER_GROUPS: Record<string, string[]> = {
  'dev-user': [SERVICE_ACCESS_GROUP]
}

@Injectable()
export class PermissionsService {
  findByUser(user: AuthUser): Permission {
    const groups = USER_GROUPS[user.id] ?? []

    if (!groups.includes(SERVICE_ACCESS_GROUP)) {
      throw new ForbiddenException('User does not have access to the service')
    }

    return {
      user: user.id,
      acl: {
        [PERMISSION_RESOURCES.ServiceAccess]: PERMISSION_ACTIONS.R
      }
    }
  }
}
