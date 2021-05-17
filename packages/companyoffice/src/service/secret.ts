import { JSEncrypt } from 'jsencrypt';
//@ts-ignore
import CryptoJS from 'crypto-js'; 

// 十六位十六进制数作为密钥
const defaulKey = CryptoJS.enc.Utf8.parse('1234123412ABCDEF');
const cipherOption = {
  // 十六位十六进制数作为密钥偏移量
  iv: CryptoJS.enc.Utf8.parse('90d3348c2d10aa3d'),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
};
// 公钥
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfqhg/SotY/yKAxm34WHht37RJNKdktcOKNedhCnUhG7R8zlojgzTT78ZTMhgiDBMGEqeSTqy/hYz1qDlvU8CGpkP7BnEaiDgvF9ddckK5UDchN0CXNHygRXfq+1ylF3kFZmNk/5/uj6UJ4A2hpPcfcjARbWGhAgLpiBSn2iFDCQIDAQAB';
// 私钥
const privateKey =
  'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAPeqKbHli73SfMPVIdW+5Du8o2dfX9DmMrCDlNmdjyxJgl2Wz5BQ02EO32LWPiILJvPhrWwrKBz+ppkJ5YcSe7pdR88lwU6mhYbLmilk2d+pkN7oeg4dXqaWkv2kMA6ugHpFBAaBNSu+n3j0pJYReqj74ccpaOZa3ozVlrFAdYSrAgMBAAECgYEAyg5ODhFUvP1pROwxuo0O752rQr8REQF+AXyYiCJ/mIYwkeJkXT1T9y+HGL/p2SR4FyjbsBBVnbI0gU8Nr/FodryepzIB412SSh8hGxtYsP+2VO7Mh5Emfi9LNdIFVAubezlnSvRCKJHZPdY3zFBe0JQTzIg7iJOqKm66WVEg/mECQQD8hN/cP+6in4O26UtjZPGZ/mxjgPGHdiDKtp/7Vr+i/NyuyryFjQc52o6TELb8W+XkjsnQ0H98v7Bo3q0XGC0dAkEA+xQoYADcaGEU+xa+RO3QPWLQah2Qp9fwxNNSKaXRuzarfJY67pcOMBJsexlTu/4anpI+nV5ZbVLKTY4rcbB2ZwJBAM4NCrIpROtUKGFHyqlnRDH5Rq6HGA8GGEnxbWfk6Gjx1o2WhvCfHGdb7P0aJYaU4ml3Dj0i9PRxYlygXzM6Gg0CQQDUSfLpWVECoDMRKeWuejT78jStxFmu0JIumU57EE0IsezE5nDlkqrYUnuOiZeW9/6h3J08ia2rFbkfYfmxorY5AkAdysveuvltqfenHV4jekxxucp6I1TQJafrIseBYDTeDM9lpJ1LVBmcyLMLj5Ib2XN4hLQn98giGRfpGJH5YNDY';

// 随机秘钥
export const randomKey = (len = 16) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const size = chars.length;
  let key = '';

  for (let i = 0; i < len; i++) {
    key += chars.charAt(Math.floor(Math.random() * size));
  }

  return key;
};

// 加密key
export const encryptKey = (key: string) => {
  //@ts-ignore
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);

  return encryptor.encrypt(key);
};

// 解密key
export const decryptKey = (key: string) => {
  //@ts-ignore
  const decryptor = new JSEncrypt();
  decryptor.setPrivateKey(privateKey);

  return decryptor.decrypt(key);
};

// 加密数据
export const encrypt = (data: string, key: string) => {
  key = key ? CryptoJS.enc.Utf8.parse(key) : defaulKey;
  const res = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(res, key, cipherOption);

  return encrypted.toString();
};

// 解密数据
export const decrypt = (data: string, key: string) => {
  key = key ? CryptoJS.enc.Utf8.parse(key) : defaulKey;
  const decrypt = CryptoJS.AES.decrypt(data, key, cipherOption);
  const decrypted = decrypt.toString(CryptoJS.enc.Utf8);

  return decrypted.toString();
};
