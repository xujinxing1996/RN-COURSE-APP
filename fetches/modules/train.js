import { baseUrl } from "../configure";
import { postAction, postJSONAction } from "../methods";

// 培训信息采集-职称系列
export function getTrainList() {
  return postJSONAction(baseUrl + "education/queryTrainList");
}

// 培训信息采集-班次
export function getClasssList() {
  return postJSONAction(baseUrl + "education/queryClasssList");
}

// 培训信息采集-考试科目
export function getExamList(id) {
  const data = {
    trainId: id,
  };
  return postAction(baseUrl + "education/queryTrainInfoList", data);
}
