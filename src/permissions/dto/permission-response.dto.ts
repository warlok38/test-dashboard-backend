import { ApiProperty } from '@nestjs/swagger'

import { PERMISSION_ACTIONS } from '../permissions.constants'
import type { Permission, PermissionAcl } from '../types/permission'

export class PermissionResponseDto implements Permission {
  @ApiProperty({ example: 'dev-user' })
  user!: string

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      enum: Object.values(PERMISSION_ACTIONS)
    },
    example: {
      serviceAccess: PERMISSION_ACTIONS.R
    }
  })
  acl!: PermissionAcl
}
