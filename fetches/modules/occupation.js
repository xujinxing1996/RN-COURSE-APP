import { baseUrl } from "../configure";
import { postAction, postJSONAction } from "../methods";

// 职业技能采集-职业类别
export function getJobType() {
  return postJSONAction(baseUrl + "education/queryOccupationList");
}

// 职业技能采集-职业类别
export function getOccupationMajorTypes(id) {
  const data = {
    occupationId: id,
  };
  return postAction(baseUrl + "education/queryOccupationInfoList", data);
}
