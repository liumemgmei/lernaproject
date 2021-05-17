import  { useContext } from 'react';
import './App.css';
import {observer} from 'mobx-react-lite'
import {Context} from './globalstore/index';
import { Button } from 'antd';

function App() {
  const store = useContext(Context);
  console.log(store)
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and  to .
        </p>
     {store.theme}
     <Button onClick={()=>{
         store.init()
       console.log('liumm')
       console.log(store,'store');
     }} loading={store.loadings.init}>点我1</Button>
      </header>
    </div>
  );
}

export default observer(App);
