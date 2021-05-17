import axios, { axiosConfig, AxiosRequestConfig } from 'happy-axios';
import { message } from 'antd';
import qs from 'qs';
import moment from 'moment';
import * as secret from '../service/secret';
import storage from '../globalstore/storage';




// 检测刷新token
export const checkRefreshToken = async () => {
  try {
    // 获取上一次刷新token时间
    const lastRefreshTokenTime = storage.getItem('refreshTokenTime');
    const current = moment();
    // 和当前时间比较，超过3小时则刷新token
    if (lastRefreshTokenTime && current.diff(moment(lastRefreshTokenTime), 'hours') >= 3) {
      const oldRefreshToken = storage.getItem('refreshToken');
      const {
        data: { accessToken, refreshToken },
      } = await axios.post(
        '/chat/auth/refreshTicket',
        { deviceType: 'web' },
        { headers: { token: oldRefreshToken } },
      );
      if (accessToken) {
        storage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        storage.setItem('refreshToken', refreshToken);
      }
      storage.setItem('refreshTokenTime', current.valueOf());
    }
  } catch (e) {}
};


export function axiosconfig() {
  // 公共配置
  axiosConfig({
    baseURL: 'HUIHE_HOST_API',
  });

  // 请求拦截
  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    if (/^https?:\/\//.test(config.url as string)) {
      return config;
    }
    const { randomKey, encryptKey, encrypt } = secret;
    const key = randomKey();
    let encryptData = '';
    const token = storage.getItem('accessToken');

    if (token && !config.headers.token) {
      config.headers.token = token;
    }

    if (config.method === 'get') {
      console.log('请求', config.url, config.params);
      encryptData = encrypt(qs.stringify(config.params), key);
    } else {
      console.log('请求', config.url, config.data);
      // 后端解密+号会被解析成空格，因此转换处理
      const dataString = JSON.stringify(config.data).replace(/\+/g, '%2B');
      encryptData = encrypt(dataString, key);
    }

    const data = {
      m_d: encryptData,
      m_e: encryptKey(key),
    };

    if (config.method === 'get') {
      config.params = data;
    } else if (config.method === 'post') {
      config.data = data;
    }

    return config;
  });

  // 响应拦截
  axios.interceptors.response.use((response) => {
    const { decryptKey, decrypt } = secret;
    const { config }: any = response;
    let { data } = response;
    const key = decryptKey(data.m_e) as string;

    if (data.m_d) {
      data = JSON.parse(decrypt(data.m_d, key) || '{}');
    }
    const fail = () => {
      if (config.message !== false) {
        message.error(data.data || data.message);
      }
      return Promise.reject(data);
    };
    console.log('响应', config.url, data);

    switch (data.code) {
      // 业务逻辑错误，统一处理消息提醒
      // 可以在调用service方法时添加message为false控制是否显示消息
      case -1:
        return fail();
      // token过期重新登录
      case 401:
        // navigate('/login');
        return Promise.reject(data);
      case undefined:
        if (data.body && data.body.data) {
          // 服务不可用
          message.error(data.body.data);
          return Promise.reject(data);
        }
        return fail();
      default:
        return data;
    }
  });
}