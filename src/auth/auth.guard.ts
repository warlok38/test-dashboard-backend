import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

import { throwConfiguredAuthDebugStatus } from './auth-debug'
import { AuthService } from './auth.service'
import type { AuthUser } from './types/auth-user'

type RequestWithHeaders = {
  headers: {
    authorization?: string
  }
  user?: AuthUser
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    throwConfiguredAuthDebugStatus('api')

    const request = context.switchToHttp().getRequest<RequestWithHeaders>()
    const token = this.getBearerToken(request.headers.authorization)

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing or invalid')
    }

    const user = this.authService.verifyToken(token)

    if (!user) {
      throw new UnauthorizedException('Authorization token is missing or invalid')
    }

    request.user = user

    return true
  }

  private getBearerToken(authorization: string | undefined) {
    if (!authorization) {
      return null
    }

    const [type, token] = authorization.split(' ')

    if (type !== 'Bearer' || !token) {
      return null
    }

    return token
  }
}
