import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'

type AuthDebugTarget = 'api' | 'kerb'
type AuthDebugStatus = 401 | 403 | 500

const AUTH_DEBUG_STATUS_BY_TARGET: Record<AuthDebugTarget, AuthDebugStatus | null> = {
  api: null,
  kerb: null
}

const AUTH_DEBUG_ENV_BY_TARGET: Record<AuthDebugTarget, string> = {
  api: 'AUTH_DEBUG_API_STATUS',
  kerb: 'AUTH_DEBUG_KERB_STATUS'
}

export function throwConfiguredAuthDebugStatus(target: AuthDebugTarget) {
  const status = getConfiguredAuthDebugStatus(target)

  if (!status) {
    return
  }

  if (status === 401) {
    throw new UnauthorizedException(getDebugMessage(target, status))
  }

  if (status === 403) {
    throw new ForbiddenException(getDebugMessage(target, status))
  }

  throw new InternalServerErrorException(getDebugMessage(target, status))
}

function getConfiguredAuthDebugStatus(target: AuthDebugTarget): AuthDebugStatus | null {
  return (
    AUTH_DEBUG_STATUS_BY_TARGET[target] ??
    parseAuthDebugStatus(process.env[AUTH_DEBUG_ENV_BY_TARGET[target]])
  )
}

function parseAuthDebugStatus(status: string | undefined): AuthDebugStatus | null {
  if (status === '401' || status === '403' || status === '500') {
    return Number(status) as AuthDebugStatus
  }

  return null
}

function getDebugMessage(target: AuthDebugTarget, status: AuthDebugStatus) {
  return `Auth debug ${target} response: ${status}`
}
