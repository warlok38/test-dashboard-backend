import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AuthGuard } from '../auth/auth.guard'
import type { AuthUser } from '../auth/types/auth-user'
import { PermissionResponseDto } from './dto/permission-response.dto'
import { PermissionsService } from './permissions.service'

type RequestWithAuthUser = {
  user: AuthUser
}

@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOkResponse({ type: PermissionResponseDto })
  findPermissions(@Req() request: RequestWithAuthUser): PermissionResponseDto {
    return this.permissionsService.findByUser(request.user)
  }
}
