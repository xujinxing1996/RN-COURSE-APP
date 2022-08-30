import { baseUrl } from "../configure";
import { postAction } from "../methods";

// 学历信息采集-学习形式
export function signIn(phone, password) {
  const data = {
    userName: phone,
    password,
  };
  return postAction(baseUrl + "webLogin", data);
}
