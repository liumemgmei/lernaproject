import axios, { Method, AxiosRequestOptions } from 'happy-axios';

const PARAM_REGEXP = /(\/:\w+)/;

export const formatURL = (url: string, data: any = {}): string => {
  let newUrl = '';

  // 匹配动态参数
  if (PARAM_REGEXP.test(url)) {
    url.split(PARAM_REGEXP).forEach((path) => {
      if (path.startsWith('/:')) {
        const key = path.substr(2);
        newUrl += data[key] !== undefined ? `/${data[key]}` : '/';
        // eslint-disable-next-line no-param-reassign
        delete data[key];
      } else {
        newUrl += path;
      }
    });
  } else {
    newUrl = url;
  }

  return newUrl;
};
export const isObjectLike = (obj: any) => obj && !Array.isArray(obj) && typeof obj === 'object';

export function beforeAxios(req: string, data:any) {
  const array = req.trim().split(/\s+/);
  let method:Method = array[0].toUpperCase() as Method;
  let url = array[1] || '';
  url = formatURL(url, data);

  return {
    method,
    url,
    data,
  };
}
interface axiosProps {
  method: Method;
  url: string;
  data?: any;
  options?: any;
  mockResponseData?: any;
}
function mockData({ mockResponseData, method, url, data, options }:any) {
  return axios({
    method,
    url,
    data,
    adapter: (opts: AxiosRequestOptions) => {
      let responseData = mockResponseData;
      if (typeof mockResponseData === 'function') {
        responseData = mockResponseData(data, opts);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: responseData,
            status: 200,
            statusText: 'ok',
            config: opts,
            headers: opts.headers,
          });
        }, opts.delay || 300);
      });
    },
    ...options,
  });
}
async function myAxios<T>({
  url,
  method,
  data,
  options = {},
  mockResponseData,
}: axiosProps): Promise<T> {
  let res: unknown;
  if (isObjectLike(mockResponseData)) {
    res = mockData({ mockResponseData, url, method, data, options });
  } else {
    let config = {};
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      config = { data: data };
    } else {
      config = { params: { ...data, ...options.params } };
    }
    // await checkRefreshToken();
    res = axios({
      url,
      method,
      ...options,
      ...config,
    });
  }

  return res as Promise<T>;
}

export default function createServiceT<T = undefined, TCode = number>(
  req: string,
  data?:any,
  options?:any,
  mockResponseData?: any,
): Promise<{ code: TCode; data: T; message: string }> {
  const parameter = beforeAxios(req, { ...data });
  return myAxios<{ code: TCode; data: T; message: string }>({
    options,
    mockResponseData,
    ...parameter,
  });
}
