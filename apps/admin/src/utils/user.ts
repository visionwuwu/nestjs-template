import { Department } from 'libs/db/models/department.model';
import { MenuDocumentType, MenuType } from 'libs/db/models/menu.model';
import { RoleDocumentType } from 'libs/db/models/role.model';
import {
  SexEnum,
  UserDocumentType,
  UserStatus,
} from 'libs/db/models/user.model';
import { LeanDocument } from 'mongoose';

/** 用户信息 */
export interface UserInfo {
  _id?: string;
  username?: string;
  nickname?: string;
  roleNames?: string[];
  roles?: LeanDocument<RoleDocumentType>[];
  menus?: MenuDocumentType[];
  permissions?: string[];
  roleIdList?: string[];
  deptId?: Department | string;
  mobile?: string;
  email?: string;
  avatar?: string;
  sex?: SexEnum;
  status?: UserStatus;
  remark?: string;
  [propName: string]: any;
}

/**
 * 获取角色ids
 * @param roles
 * @returns
 */
export const getRoleIds = (
  roles: LeanDocument<RoleDocumentType>[],
): string[] => {
  return roles.map((role) => role._id);
};

/**
 * 获取角色拥有的菜单
 * @param roles
 */
export const getMenusInRoles = (roles: LeanDocument<RoleDocumentType>[]) => {
  if (!roles || roles.length === 0) {
    return [];
  }
  /** 扁平化数组 */
  const flattenArr = (roles.map(
    (role) => role.menuIdList,
  ) as any).flat() as LeanDocument<MenuDocumentType>[];
  /** 数组去重 */
  return flattenArr.reduce((prev, next) => {
    const isExist = prev.find((item) => item._id === next._id);
    if (!isExist) {
      prev.push(next);
    }
    return prev;
  }, []);
};

/**
 * 获取用户拥有的路由
 * @param menus
 * @returns
 */
export const getUserRoutes = (menus: MenuDocumentType[]) => {
  return menus.filter((menu) => menu.type !== MenuType.B);
};

/**
 * 获取用户拥有的权限
 * @param menus
 * @returns
 */
export const getUserPermissions = (menus: MenuDocumentType[]) => {
  return menus.filter((menu) => !!menu.perms).map((item) => item.perms);
};

/** 生成前端需要的角色列表 */
export const generatorRoleNames = (roles: LeanDocument<RoleDocumentType>[]) => {
  return roles.map((role) => role.name);
};

/** 格式化角色信息 */
export const formatRoles = (roles: LeanDocument<RoleDocumentType>[]) => {
  return roles.map((role) => ({
    ...role,
    menuIdList: role.menuIdList.map((menu) => (menu as any)._id),
  }));
};

/** 生成用户信息 */
export const generatorUserInfo = (user: LeanDocument<UserDocumentType>) => {
  if (!user) return {};
  let roles = user.roleIdList;
  const roleIdList = getRoleIds(roles);
  const menus = getMenusInRoles(roles);
  const permissions = getUserPermissions(menus);
  const roleNames = generatorRoleNames(roles);
  roles = formatRoles(roles);
  const userInfo: UserInfo = {
    ...user,
    roleIdList,
    roleNames: roleNames,
    roles,
    menus,
    permissions,
  };

  return userInfo;
};
