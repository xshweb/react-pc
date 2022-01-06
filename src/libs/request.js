import axios from 'axios';
import { gotUserToken, clearAllToken } from './handleStorage';
import { createHashHistory } from 'history';
import { message, Modal } from 'antd';
const meskey = 'keyhttp';
let requestTimes = 0;
const history = createHashHistory();

// 请求的公共参数
let arg = {};
// 定义全部http
let http = {};

http.get = function (api, params = {}) {
  const data = { ...arg, ...params };
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: api,
      params: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          message.error(response.status);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

http.post = function (api, params = {}) {
  const data = { ...arg, ...params };
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: api,
      data: data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          message.error(response.status);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

http.downfile = function (api, params = {}) {
  const data = { ...arg, ...params };
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: api,
      params: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      responseType: 'arraybuffer'
    })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          message.error(response.status);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

http.upfile = function (api, data, callback) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: api,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progress) => {
        callback(progress);
      }
    })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          message.error(response.status);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    showFullScreenLoading();
    const token = gotUserToken() ? JSON.parse(gotUserToken()).token : '';
    // const token = "Bearer cafebabe";
    // const token = 'Bearer 0d03e2d6519542e9b9119046e4ef07f6';
    config.headers['Authorization'] = token;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    tryHideFullScreenLoading();
    return response;
  },
  (error) => {
    tryHideFullScreenLoading();
    if (error?.response) {
      const status = error.response.status;
      let message = '';
      switch (status) {
        case 400:
          message = '请求错误(400)';
          break;
        case 403:
          message = '拒绝访问(403)';
          break;
        case 404:
          message = '请求出错(404)';
          break;
        case 408:
          message = '请求超时(408)';
          break;
        case 500:
          message = '服务器错误(500)';
          break;
        case 501:
          message = '服务未实现(501)';
          break;
        case 502:
          message = '网络错误(502)';
          break;
        case 503:
          message = '服务不可用(503)';
          break;
        case 504:
          message = '网络超时(504)';
          break;
        case 505:
          message = 'HTTP版本不受支持(505)';
          break;
        default:
          message = `连接出错(${status})!`;
      }
      const value = {
        message: message,
        status: status
      };
      handleResponseData(value);
      return Promise.reject(value);
    } else {
      const value = {
        message: '网络出错, 请稍后重试',
        status: 999
      };
      handleResponseData(value);
      return Promise.reject(value);
    }
  }
);

// response 返回值

function handleResponseData(data) {
  switch (data.status) {
    case 401:
      if (requestTimes === 0) {
        Modal.confirm({
          title: '系统提示',
          content: '抱歉，您的登录状态已过期，需要重新登录',
          okText: '重新登录',
          cancelText: '取消',
          onOk() {
            requestTimes = 0;
            clearAllToken();
            history.replace('/login');
          },
          onCancel() {
            requestTimes = 0;
            clearAllToken();
            history.replace('/401');
          }
        });
      }
      requestTimes++;
      break;
    case 403:
      if (requestTimes === 0) {
        Modal.confirm({
          title: '系统提示',
          content: '抱歉，您暂无权限操作。请联系管理员授权，授权后需要重新登录',
          okText: '重新登录',
          cancelText: '取消',
          onOk() {
            requestTimes = 0;
            clearAllToken();
            history.replace('/login');
          },
          onCancel() {
            requestTimes = 0;
          }
        });
      }
      requestTimes++;
      break;
    default:
      message.error(data.message);
  }
}

// showFullScreenLoading() tryHideFullScreenLoading() 用于将同一时刻的请求合并。
// 声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1
// 调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1   needLoadingRequestCount为 0 时，结束 loading

let needLoadingRequestCount = 0;
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

function startLoading() {
  message.loading({ content: 'Loading...', meskey });
}

function endLoading() {
  message.destroy();
}

export default http;
