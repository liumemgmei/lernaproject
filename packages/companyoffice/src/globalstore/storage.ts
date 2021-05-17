import { tuple } from '../typings/utils';

const localStorageItem = tuple('defaultId','accessToken','refreshToken','refreshTokenTime');

type LocalStorageItem = typeof localStorageItem[number];
const getItemKey = (key = '') => {
  return `qibanshi_${key}`;
};

export const setItem = (key: LocalStorageItem, value: any) => {
  window.localStorage.setItem(getItemKey(key), value != null ? JSON.stringify(value) : '');
};

export const getItem = (key: LocalStorageItem) =>
  JSON.parse(window.localStorage.getItem(getItemKey(key)) as string);

export const clear = () => {
  window.localStorage.clear();
};

const storage = {
  setItem,
  getItem,
  clear,
}

export default storage;
