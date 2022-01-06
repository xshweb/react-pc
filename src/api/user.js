import request from '@/libs/request';
import { baseURL } from '@/config';
// 校验登录
export function checklogin(data) {
  return request.get(`${baseURL}/ewechat/isLogin`, data);
}
// 登录
export function login(data) {
  return request.get(`${baseURL}/auth/v1/ewechat/login`, data);
}

export function financehistory(data) {
  return request.get(`${baseURL}/admin/finance/history`, data);
}

export function financeadd(data) {
  return request.post(`${baseURL}/admin/finance/add`, data);
}
// hr3月内历史数据
export function hrhistory(data) {
  return request.get(`${baseURL}/admin/hr/history`, data);
}
// 更新岗位名称
// export function hrindicator(data) {
//   return request.get(`${baseURL}/admin/hr/indicator`, data);
// }
export function hrindicator(data) {
  return request.get(`${baseURL}/um/menu/info/list`, data);
}
// 录入数据
export function hradd(data) {
  return request.post(`${baseURL}/admin/hr/add`, data);
}

// 更新岗位名称
export function projectlist(data) {
  return request.get(`${baseURL}/admin/project/list`, data);
}
// 录入数据
export function projectupdate(data) {
  return request.post(`${baseURL}/admin/project/add`, data);
}
// 项目置顶
export function projectop(data) {
  return request.post(`${baseURL}/admin/project/top`, data);
}

/**
 * BI大屏
 */
export function largescreenlist(data) {
  return request.post(`${baseURL}/screen/backstage/list`, data);
}

export function largescreendownload(data) {
  return request.downfile(`${baseURL}/screen/excel/download`, data);
}

// 库存数据列表
export function stockList(data) {
  return request.get(`${baseURL}/screen/add/stockList`, data);
}

// 库存数据录入
export function stockAdd(data) {
  return request.post(`${baseURL}/screen/add/addStock`, data);
}

// 目标数据列表
export function stimateList(data) {
  return request.get(`${baseURL}/screen/stimate/stimateInfoList`, data);
}

// 目标数据录入
export function stimateAdd(data) {
  return request.post(`${baseURL}/screen/stimate/addStimate`, data);
}
