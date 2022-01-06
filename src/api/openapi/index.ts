import request from '@/libs/http';
import { baseURL } from '@/config';

/**
 *
 * 租户管理
 */
export function clientList(data: any) {
  return request.get(`${baseURL}/open/manager/client/v1/list`, data);
}
export function clientAdd(data: any) {
  return request.post(`${baseURL}/open/manager/client/v1/add`, data);
}
export function clientUpdate(data: any) {
  return request.post(`${baseURL}/open/manager/client/v1/modify`, data);
}
export function getClientSecret(data: any) {
  return request.get(`${baseURL}/open/manager/client/v1/viewSecret`, data);
}
export function resetClientSecret(data: any) {
  return request.get(`${baseURL}/open/manager/client/v1/resetSecret`, data);
}
export function getClientApis(data: any) {
  return request.get(`${baseURL}/open/manager/client/v1/getClientApis`, data);
}
export function getUnbindApis(data: any) {
  return request.get(`${baseURL}/open/manager/client/v1/getUnbindApis`, data);
}
export function bindClientApis(data: any) {
  return request.post(`${baseURL}/open/manager/client/v1/bindApi`, data);
}
export function unbindClientApis(data: any) {
  return request.get(`${baseURL}/open/manager/client/v1/unbindApi`, data);
}
export function modifyApiPath(data: any) {
  return request.post(`${baseURL}/open/manager/client/v1/modifyApiPath`, data);
}

/**
 *
 * API列表
 */

export function apiList(data: any) {
  return request.get(`${baseURL}/open/manager/api/v1/list`, data);
}
export function apiAdd(data: any) {
  return request.post(`${baseURL}/open/manager/api/v1/add`, data);
}
export function apiUpdate(data: any) {
  return request.post(`${baseURL}/open/manager/api/v1/modify`, data);
}
export function apiRemove(data: any) {
  return request.get(`${baseURL}/open/manager/api/v1/remove`, data);
}
