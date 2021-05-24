import React, { FunctionComponent, useRef, useState } from 'react';
import { AutoComplete as AntdAutoComplete } from 'antd';

// 函数防抖
export function delay(func: Function, times: number) {
  //上一次数组
  let lastArgs: any[];
  return function (...args: any[]) {
    let newArgs = [...args];
    //如果没有新的参数进来，则执行函数；
    setTimeout(() => {
      //判断两个条件是否相同，以及当前的作用于是否存在；
      if (JSON.stringify(lastArgs) === JSON.stringify(newArgs)) {
        func.apply(this, lastArgs);
      }
    }, times);
    lastArgs = newArgs;
  };
}
interface Props {
  value: string;
  getData: Function;
}
// 只有选择输入框的值才会有效
const AutoComplete: FunctionComponent<Props> = (props) => {
  const { value: defaultValue, getData } = props;
  const [options, setOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [val, setValue] = useState(defaultValue);
  const selectValue = useRef(defaultValue);
  const _change = () => {};
  // 查询接口参数

  const _search = delay(async (value) => {
    const { data } = await getData(value);
    setOptions(data);
  }, 200);
  const onSearch = (value) => {
    _search(value);
  };
  const onBlur = () => {};
  const onSelect = (value, option) => {
    selectValue.current = value;
    setValue(value);
  };
  return (
    <AntdAutoComplete
      options={options}
      value={val}
      onChange={_change}
      onSearch={onSearch}
      onBlur={onBlur}
      onSelect={onSelect}
    />
  );
};

export default AutoComplete;
