import { DELETE, GET, POST, PUT, fetchNumber } from "./configure";
import { profileTypes } from "../constants/profileTypes";
import { activeProfile } from "../constants/activeProfile";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const defaultPostHeaders = {
  "Content-Type": "multipart/form-data",
};

const shouldBuildResponseLogger = (
  method,
  url,
  data,
  headers,
  text,
  hasError = false
) => {
  if (activeProfile === profileTypes.PROFILE_PRODUCTION) {
    console.log("");
    console.log("----------------请求开始-------------");
    console.log("| method:", method);
    console.log("| url:", url);
    console.log("| data:", data);
    console.log("| headers:", headers || "暂无");
    console.log("----------------请求结束-------------");
    console.log("|");
    console.log("----------------响应开始-------------");
    if (hasError) {
      console.error("| error content:", text.replace(/\r\n/, ""));
    } else {
      console.log("| response body:", text.replace(/\r\n/, ""));
    }
    console.log("----------------响应结束-------------");
    console.log("");
  }
};

/**
 * 构建超时Promise对象
 *
 * @returns {Promise<unknown>}
 * @private
 */
const _buildTimeoutPromise = () => {
  return new Promise((resolve, reject) => {
    setTimeout(reject, fetchNumber.MAX_TIMEOUT, "请求超时");
  });
};

/**
 * 内置封装请求方法
 *
 * @param url
 * @param query
 * @param headers
 * @param method
 * @param show
 * @returns {Promise<unknown>}
 * @private
 */
const _buildQueryFetchPromise = (url, query, headers, method, show = true) => {
  let newUrl = url;
  let keys = Object.keys(query);
  if (keys.length > 0) {
    keys.forEach((item, index) => {
      let queryPair = item + "=" + query[item];
      newUrl += index === 0 ? "?" + queryPair : "&" + queryPair;
    });
  }
  return new Promise((resolve, reject) => {
    fetch(newUrl, {
      headers: { ...headers },
      method: method,
    })
      .then(async (response) => {
        const promise = await response.text();
        if (show) {
          shouldBuildResponseLogger(method, url, query, headers, promise);
        }
        try {
          const json = promise && JSON.parse(promise);
          resolve(json);
        } catch (e) {
          reject("解析数据失败1");
        }
      })
      .catch((error) => {
        shouldBuildResponseLogger(
          method,
          url,
          query,
          headers,
          error.message,
          true
        );
        reject(error);
      });
  });
};

/**
 * DELETE方法封装
 * @param url
 * @param query
 * @param headers
 * @param show
 * @returns Promise对象
 */
export const deleteAction = (url, query, headers, show = true) => {
  const fetchPromise = _buildQueryFetchPromise(
    url,
    query,
    headers,
    DELETE,
    show
  );
  const timeoutPromise = _buildTimeoutPromise();
  return Promise.race([fetchPromise, timeoutPromise]);
};

/**
 * GET方法封装
 * @param url
 * @param query
 * @param headers
 * @param show
 * @returns Promise对象
 */
export const getAction = (url, query, headers, show = true) => {
  const fetchPromise = _buildQueryFetchPromise(url, query, headers, GET, show);
  const timeoutPromise = _buildTimeoutPromise();
  return Promise.race([fetchPromise, timeoutPromise]);
};

/**
 * POST-form-url方法封装
 * @param url
 * @param query
 * @param headers
 * @param show
 * @returns Promise对象
 */
export const postURLAction = (url, body = {}, headers) => {
  const fetchPromise = new Promise((resolve, reject) => {
    let formBody = [];
    for (const property in body) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(body[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(url, {
      body: formBody,
      headers: { ...headers },
      method: POST,
    })
      .then(async (response) => {
        const promise = await response.text();
        shouldBuildResponseLogger(POST, url, body, headers, promise);
        try {
          const json = JSON.parse(promise);
          resolve(json);
        } catch (e) {
          reject("解析数据失败6");
        }
      })
      .catch((error) => {
        shouldBuildResponseLogger(
          POST,
          url,
          body,
          headers,
          error.message,
          true
        );
        reject(error);
      });
  });
  const timeoutPromise = _buildTimeoutPromise();
  return Promise.race([fetchPromise, timeoutPromise]);
};

/**
 * POST方法封装
 * @param url
 * @param body
 * @param headers
 * @returns Promise对象
 */
export const postAction = (url, body = {}, headers) => {
  const fetchPromise = new Promise((resolve, reject) => {
    const formData = new FormData();
    for (const key of Object.keys(body)) {
      formData.append(key, body[key]);
    }
    fetch(url, {
      body: formData,
      headers: { ...defaultPostHeaders, ...headers },
      method: POST,
    })
      .then(async (response) => {
        const promise = await response.text();
        shouldBuildResponseLogger(POST, url, body, headers, promise);
        try {
          const json = JSON.parse(promise);
          resolve(json);
        } catch (e) {
          reject("解析数据失败2");
        }
      })
      .catch((error) => {
        shouldBuildResponseLogger(
          POST,
          url,
          body,
          headers,
          error.message,
          true
        );
        reject(error);
      });
  });
  const timeoutPromise = _buildTimeoutPromise();
  return Promise.race([fetchPromise, timeoutPromise]);
};

/**
 * POST方法封装
 * @param url
 * @param body
 * @param headers
 * @returns Promise对象
 */
export const postUploadFileAction = (url, body = {}, headers) => {
  const fetchPromise = new Promise((resolve, reject) => {
    fetch(url, {
      body,
      headers: { ...defaultPostHeaders, ...headers },
      method: POST,
    })
      .then(async (response) => {
        const promise = (await response.text()) || "";
        shouldBuildResponseLogger(POST, url, body, headers, promise);
        try {
          const json = promise && JSON.parse(promise);
          resolve(json);
        } catch (e) {
          reject("解析数据失败3");
        }
      })
      .catch((error) => {
        shouldBuildResponseLogger(
          POST,
          url,
          body,
          headers,
          error.message,
          true
        );
        reject(error);
      });
  });
  const timeoutPromise = _buildTimeoutPromise();
  return Promise.race([fetchPromise, timeoutPromise]);
};

/**
 * POST-JSON方法封装
 * @param url
 * @param body
 * @param headers
 * @returns Promise对象
 */
export const postJSONAction = (url, body = {}, headers) => {
  const fetchPromise = new Promise((resolve, reject) => {
    fetch(url, {
      body: JSON.stringify(body),
      headers: { ...defaultHeaders, ...headers },
      method: POST,
    })
      .then(async (response) => {
        const promise = await response.text();
        shouldBuildResponseLogger(POST, url, body, headers, promise);
        try {
          const json = JSON.parse(promise);
          resolve(json);
        } catch (e) {
          reject("解析数据失败4");
        }
      })
      .catch((error) => {
        shouldBuildResponseLogger(
          POST,
          url,
          body,
          headers,
          error.message,
          true
        );
        reject(error);
      });
  });
  const timeoutPromise = _buildTimeoutPromise();
  return Promise.race([fetchPromise, timeoutPromise]);
};

/**
 * PUT方法封装
 * @param url
 * @param body
 * @param headers
 * @returns Promise对象
 */
export const putAction = (url, body, headers) => {
  const fetchPromise = new Promise((resolve, reject) => {
    fetch(url, {
      body,
      headers: { ...defaultHeaders, ...headers },
      method: PUT,
    })
      .then(async (response) => {
        const promise = await response.text();
        shouldBuildResponseLogger(PUT, url, body, headers, promise);
        try {
          const json = JSON.parse(promise);
          resolve(json);
        } catch (e) {
          reject("解析数据失败5");
        }
      })
      .catch((error) => {
        shouldBuildResponseLogger(PUT, url, body, headers, error.message, true);
        reject(error);
      });
  });
  const timeoutPromise = _buildTimeoutPromise();
  return Promise.race([fetchPromise, timeoutPromise]);
};
