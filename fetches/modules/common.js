import { baseUrl } from "../configure";
import { getAction, postJSONAction } from "../methods";

// 学生、财务、教务-查询列表
export function getFinanceList(
  page,
  searchType,
  teacherMobile,
  trainType,
  token
) {
  return postJSONAction(
    baseUrl +
      `studentInfo/getStudentList?limit=10&offset=${page}&trainType=${trainType}&idNo=&teacherMobile=${teacherMobile}&teacherName=&commitFlag=&businessProgress=&name=&userType=${searchType}`,
    null,
    {
      Authorization: token,
    }
  );
}

// 信息采集-提交
export function submitCollection(data, token) {
  return postJSONAction(baseUrl + "studentInfo/saveStudentInfo", data, {
    Authorization: token,
  });
}

// 信息采集-费用信息-提交
export function submitFee(data, token) {
  return postJSONAction(baseUrl + "studentInfo/saveStudentFees", data, {
    Authorization: token,
  });
}

// 信息采集-信息采集-更新
export function updateCollection(data, token) {
  return postJSONAction(baseUrl + "studentInfo/updateStudentInfo", data, {
    Authorization: token,
  });
}

// 信息采集-费用信息-更新
export function updateCollectionFee(data, token) {
  return postJSONAction(baseUrl + "studentInfo/updateStudentFees", data, {
    Authorization: token,
  });
}

// 信息采集-费用信息-审核
export function updateFee(data, token) {
  return postJSONAction(baseUrl + "studentInfo/updateFee", data, {
    Authorization: token,
  });
}

// 获取采集信息
export function getStudentInfo(data) {
  return getAction(baseUrl + "studentInfo/getStudentInfo", data);
}
