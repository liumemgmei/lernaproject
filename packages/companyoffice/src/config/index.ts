// 配置 mobx 
import {configure} from 'mobx'
import {axiosconfig} from './axios'
export function mobxconfig() {
  configure({
    enforceActions: 'observed'
  })
}
export default  function config() {
  mobxconfig();
  axiosconfig();
}