import { baseUrl } from "../configure";
import { postAction } from "../methods";

// 财务审核通过
export function resolveFinance(data, token) {
  return postAction(baseUrl + `studentInfo/caiwuCheck`, data, {
    Authorization: token,
  });
}
