import {observable,makeObservable, runInAction} from 'mobx'
import { createContext,useContext } from 'react'
import service from '../service'
import { loading } from '../utils'

export class GlobalStore {
  theme = 'default'
  loadings:any={}
  constructor(){
    makeObservable(this,{
      theme:observable,
      loadings:observable
    })
  }
  @loading
  async init(){
    const res =  await service.login();
    console.log(res);
  }
}
export const Context = createContext<GlobalStore>({} as GlobalStore);
export const useStore = () => useContext(Context);
 