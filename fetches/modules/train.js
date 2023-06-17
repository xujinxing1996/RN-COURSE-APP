import { baseUrl } from "../configure";
import { postAction, postJSONAction } from "../methods";

// 执业资格采集-职称系列
export function getTrainList() {
  return postJSONAction(baseUrl + "education/queryTrainList");
}

// 执业资格采集-班次
export function getClasssList() {
  return postJSONAction(baseUrl + "education/queryClasssList");
}

// 执业资格采集-考试科目
export function getExamList(id) {
  const data = {
    trainId: id,
  };
  return postAction(baseUrl + "education/queryTrainInfoList", data);
}
