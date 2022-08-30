import { baseUrl } from "../configure";
import { getAction } from "../methods";

// 业绩列表
export function getPerformances(data) {
  return getAction(baseUrl + "performance/selectPerformanceDetail", data);
}
