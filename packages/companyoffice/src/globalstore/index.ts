import {observable,makeObservable, runInAction} from 'mobx'
import { createContext,useContext } from 'react'
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
    await new Promise((res)=>{
      setTimeout(() => {
        runInAction(()=>{
          this.theme ='ll'
        })
        res({})
      }, 2000);
    })
  }

}
export const Context = createContext<GlobalStore>({} as GlobalStore);
export const useStore = () => useContext(Context);
 