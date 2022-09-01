import { baseUrl } from "../configure";
import { getAction } from "../methods";

// 业绩列表
export function getPerformances(data) {
  return getAction(baseUrl + "performance/selectResultsList", data);
}

// 个人业绩列表
export function getPersonalPerformances(data) {
  return getAction(baseUrl + "performance/getPerformanceById", data);
}
