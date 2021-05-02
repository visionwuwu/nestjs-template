/**
 * 请求接口地址，授权标识
 */
export enum PermissionUrl {
  /** 用户相关接口权限标识 */
  SYSTEM_USER_LIST = 'system:user:list',
  SYSTEM_USER_INFO = 'system:user:info',
  SYSTEM_USER_QUERY = 'system:user:query',
  SYSTEM_USER_ADD = 'system:user:add',
  SYSTEM_USER_UPDATE = 'system:user:update',
  SYSTEM_USER_REMOVE = 'system:user:remove',
  SYSTEM_USER_RESETPWD = 'system:user:resetPwd',

  /** 角色相关接口权限 */
  SYSTEM_ROLE_LIST = 'system:role:list',
  SYSTEM_ROLE_INFO = 'system:role:info',
  SYSTEM_ROLE_QUERY = 'system:role:query',
  SYSTEM_ROLE_ADD = 'system:role:add',
  SYSTEM_ROLE_UPDATE = 'system:role:update',
  SYSTEM_ROLE_REMOVE = 'system:role:remove',
  SYSTEM_ROLE_DATASCOPE = 'system:role:dataScope',

  /** 菜单相关接口权限 */
  SYSTEM_MENU_LIST = 'system:menu:list',
  SYSTEM_MENU_INFO = 'system:menu:info',
  SYSTEM_MENU_QUERY = 'system:menu:query',
  SYSTEM_MENU_ADD = 'system:menu:add',
  SYSTEM_MENU_UPDATE = 'system:menu:update',
  SYSTEM_MENU_REMOVE = 'system:menu:remove',

  /** 部门相关接口权限标识 */
  SYSTEM_DEPARTMENT_LIST = 'system:dept:list',
  SYSTEM_DEPARTMENT_INFO = 'system:dept:info',
  SYSTEM_DEPARTMENT_QUERY = 'system:dept:query',
  SYSTEM_DEPARTMENT_ADD = 'system:dept:add',
  SYSTEM_DEPARTMENT_UPDATE = 'system:dept:update',
  SYSTEM_DEPARTMENT_REMOVE = 'system:dept:remove',
}
