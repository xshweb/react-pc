import request from '@/libs/http';
import { baseURL } from '@/config';

/**
 *
 * 登录
 */
export function login(data: any) {
  return request.get(`${baseURL}/auth/v1/ewechat/login`, data);
}
export function userinfo(data?: any) {
  return request.get(`${baseURL}/um/user/info/detail`, data);
}
export function userlogout(data?: any) {
  return request.get(`${baseURL}/auth/v1/user/logout`, data);
}
/**
 *
 * 菜单API
 */

export function menuList(data: any) {
  return request.get(`${baseURL}/um/menu/info/list`, data);
}
export function menuUpdate(data: any) {
  return request.post(`${baseURL}/um/menu/info/add`, data);
}
export function menuDelete(data: any) {
  return request.get(`${baseURL}/um/menu/info/delete`, data);
}
export function menuDetail(data: any) {
  return request.get(`${baseURL}/um/menu/info/detail`, data);
}

/**
 *
 * 角色API
 */

export function roleList(data?: any) {
  return request.get(`${baseURL}/um/role/info/list`, data);
}
export function roleListAll(data: any) {
  return request.get(`${baseURL}/um/role/info/all`, data);
}
export function roleUpdate(data: any) {
  return request.post(`${baseURL}/um/role/info/add`, data);
}
export function roleDelete(data: any) {
  return request.get(`${baseURL}/um/role/info/delete`, data);
}
export function roleDetail(data: any) {
  return request.get(`${baseURL}/um/role/info/detail`, data);
}

/**
 *
 * 用户
 */
export function userList(data: any) {
  return request.post(`${baseURL}/um/user/info/list`, data);
}
// 用户权限菜单
export function menusList(data?: any): any {
  return request.get(`${baseURL}/um/user/info/menulist`, data);
}
// 用户角色
export function gotUserRole(data: any) {
  return request.get(`${baseURL}/um/user/info/roleuser`, data);
}
// 角色更新
export function userRoleUpdate(data: any) {
  return request.post(`${baseURL}/um/user/info/distribution`, data);
}
// 部门菜单
export function depList(data: any) {
  return request.post(`${baseURL}/um/dep/info/list`, data);
}
// 用户详情
export function userDetail(data: any) {
  return request.get(`${baseURL}/um/user/info/opeardetail`, data);
}
/**
 *
 * 字典管理
 */

export function dictList(data: any) {
  return request.post(`${baseURL}/um/dictionary/info/list`, data);
}
export function dictUpdate(data: any) {
  return request.post(`${baseURL}/um/dictionary/info/add`, data);
}
export function dictDel(data: any) {
  return request.get(`${baseURL}/um/dictionary/info/delete`, data);
}
export function dictDetailList(data: any) {
  return request.post(`${baseURL}/um/dictionary/info/detailedlist`, data);
}
export function dictDetailUpdate(data: any) {
  return request.post(`${baseURL}/um/dictionary/info/detailedadd`, data);
}
export function dictDetailDel(data: any) {
  return request.get(`${baseURL}/um/dictionary/info/detaileddelete`, data);
}

/**
 *
 * 白名单
 */

// 侧边栏菜单
export function getSiderMenu(data?: any): any {
  return request.get(`${baseURL}/um/sys/white/menulist`, data);
}
// 登录用户信息
export function getAdminInfo(data?: any) {
  return request.get(`${baseURL}/um/sys/white/detail`, data);
}
