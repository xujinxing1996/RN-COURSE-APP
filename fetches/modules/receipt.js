import { baseUrl } from "../configure";
import { postUploadFileAction, postURLAction } from "../methods";

// 上传凭证文件
export function uploadReceiptFile(data, token) {
  return postUploadFileAction(
    baseUrl + "studentInfo/uploadStuCertificate",
    data,
    {
      Authorization: token,
    }
  );
}

// 提交凭证
export function submitReceipt(data, token) {
  return postURLAction(baseUrl + "studentInfo/addPz", data, {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Authorization: token,
  });
}
