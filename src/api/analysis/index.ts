import request from '@/libs/http';
import { baseURL } from '@/config';
/**
 *
 * 纯销日报
 */

// 地址列表
export function areaList(data: any) {
  return request.get(`${baseURL}/sfa/cloud/screen/area`, data);
}
// 金刚云BI大屏日报数据折线图
export function daySalesChart(data: any) {
  return request.post(`${baseURL}/sfa/cloud/screen/dayChart`, data);
}
// 导出目标EXCEL操作列表
export function daySalesExcel(data: any) {
  return request.postdownfile(`${baseURL}/sfa/file/download/dayfile`, data);
}
// 列表
export function daySalesList(data: any) {
  return request.post(`${baseURL}/sfa/cloud/screen/daylist`, data);
}

/**
 *
 * 纯销月报
 */

// 金刚云BI大屏日报数据折线图
export function monthSalesChart(data: any) {
  return request.post(`${baseURL}/sfa/cloud/screen/monthChart`, data);
}
// 导出目标EXCEL操作列表
export function monthSalesExcel(data: any) {
  return request.postdownfile(`${baseURL}/sfa/file/download/monthfile`, data);
}
// 列表
export function monthSalesList(data: any) {
  return request.post(`${baseURL}/sfa/cloud/screen/monthlist`, data);
}

/**
 * 目标导入
 */
export function saleTargetExcel(data: any) {
  return request.downfile(`${baseURL}/sfa/file/download/mould`, data);
}
export function saleTargetRecord(data: any) {
  return request.post(`${baseURL}/sfa/cloud/screen/excelList`, data);
}
