import { Controller, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { throwConfiguredAuthDebugStatus } from './auth-debug'
import { AuthService } from './auth.service'
import { AuthResponseDto } from './dto/auth-response.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kerb')
  @ApiOkResponse({ type: AuthResponseDto })
  authorizeByKerb(): AuthResponseDto {
    throwConfiguredAuthDebugStatus('kerb')

    return this.authService.authorizeByKerb()
  }
}
