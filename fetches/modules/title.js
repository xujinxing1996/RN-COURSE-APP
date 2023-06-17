import { baseUrl } from "../configure";
import { postJSONAction } from "../methods";

// 职称评审采集-职称等级
export function getTitleList() {
  return postJSONAction(baseUrl + "education/queryTitleList");
}

// 职称评审采集-职称系列
export function getProfessionalSeriesList() {
  return postJSONAction(baseUrl + "education/queryProfessionalSeriesList");
}
