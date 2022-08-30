import { baseUrl } from "../configure";
import { postAction, postJSONAction } from "../methods";

// 学历信息采集-学习形式
export function getStudyType() {
  return postJSONAction(baseUrl + "education/queryModeList");
}

// 学历信息采集
export function getBatches(id, trainType) {
  const data = {
    trainType,
  };
  id && (data.pid = id);
  return postAction(baseUrl + "education/queryBatchList", data);
}

// 学历信息采集-学历层次
export function getEducationLevel() {
  return postJSONAction(baseUrl + "education/queryEducationList");
}

// 学历信息采集-学校名
export function getSchoolNames(id) {
  const data = {
    educationId: id,
  };
  return postAction(baseUrl + "education/querySchoolList", data);
}

// 学历信息采集-专业
export function getMajorNames(id) {
  const data = {
    schoolId: id,
  };
  return postAction(baseUrl + "education/queryCourseList", data);
}
