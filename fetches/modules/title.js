import { baseUrl } from "../configure";
import { postJSONAction } from "../methods";

// 职称信息采集-职称等级
export function getTitleList() {
  return postJSONAction(baseUrl + "education/queryTitleList");
}

// 职称信息采集-职称系列
export function getProfessionalSeriesList() {
  return postJSONAction(baseUrl + "education/queryProfessionalSeriesList");
}
