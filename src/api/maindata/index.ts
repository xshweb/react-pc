import request from '@/libs/http';
import { baseURL } from '@/config';
/**
 *
 * 日志数据列表
 */
export function logList(data: any) {
  return request.post(`${baseURL}/um/log/info/list`, data);
}

export function syncLogList(data: any) {
  return request.post(`${baseURL}/um/log/info/synclist`, data);
}

export function syncLogExport(data: any) {
  return request.downfile(`${baseURL}/um/log/info/download`, data);
}
