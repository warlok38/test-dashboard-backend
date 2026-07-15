import type { PERMISSION_ACTIONS } from '../permissions.constants'

export type ValueOf<T> = T[keyof T]

export type PermissionAction = ValueOf<typeof PERMISSION_ACTIONS>

export type PermissionAcl = {
  [key: string]: PermissionAction
}

export type Permission = {
  acl: PermissionAcl
  user: string
}
