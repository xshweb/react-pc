import request from '@/libs/http';
import { baseURL } from '@/config';

/**
 *
 * 获取SSO系统列表
 */
export function systemsList(data: any) {
  return request.get(`${baseURL}/open/sso/v1/systems`, data);
}

export function gotSystemsPath(data: any) {
  return request.get(`${baseURL}/open/sso/v1/ssoAddress`, data);
}
