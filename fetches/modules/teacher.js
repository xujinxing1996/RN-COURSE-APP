import { baseUrl } from "../configure";
import { postAction } from "../methods";

// 教务审核通过
export function resolveTeacher(data, token) {
  return postAction(baseUrl + `studentInfo/jiaowuCheck`, data, {
    Authorization: token,
  });
}
