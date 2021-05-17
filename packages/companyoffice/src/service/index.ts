import createService from './createService'

const service = {
  login(){
    return createService('GET /login',{},{},()=>{
      return {data:'success'}
    })
  }
}

export default service;