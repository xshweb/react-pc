import request from '@/libs/http';
import { baseURL } from '@/config';
/**
 *
 * 绿谷战略研究接口文档
 */

// 板块列表接口
export function plateList(data?: any) {
  return request.post(`${baseURL}/strategy/v1/plate/list`, data);
}

// 分类列表接口
export function classifyList(data: any) {
  return request.post(`${baseURL}/strategy/v1/classify/list`, data);
}

// 材料列表接口
export function materialList(data: any) {
  return request.post(`${baseURL}/strategy/v1/material/list`, data);
}

// 材料导入接口 
export function materialUpload(data: any) {
  return request.upfile(`${baseURL}/strategy/v1/material/upload`, data);
}

// 材料编辑接口
export function materialUpdate(data: any) {
  return request.post(`${baseURL}/strategy/v1/material/update`, data);
}

// 删除材料接口 
export function materialDelete(data: any) {
  return request.post(`${baseURL}/strategy/v1/material/delete`, data);
}

// 关键字搜索文章接口 
export function materialSearch(data: any) {
  return request.post(`${baseURL}/strategy/v1/material/search`, data);
}

// 预览文章
export function materialPreview(data: any) {
  return request.postdownfile(`${baseURL}/strategy/v1/material/preview`, data);
}
