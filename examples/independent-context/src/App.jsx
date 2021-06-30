import React from 'react';
import { useCtrlState } from './../../../src/index';
import './App.css';

function forEach(num, multiple) {
  let arr = [];

  for (let i = 0; i < num; i++) arr.push("");

  return arr.map((Item, key) => <Father1 val={key} multiple={multiple} key={key} />)
};

function turn(obj){
  let i = 0;
  let arr = ['a','b','c','d','e'];

  return function(){
    if(i < 1) obj[ arr[0] ]=i;
    if(i < 5){
      obj = {};
      obj.a = i;
      obj[ arr[i] ] = 5;
    };
    i++;
    return obj;
  }
}
const fifthDoIt = turn({});
export default function App() {
  function getSearchObjFn() {
    const query = window.location.search.substring(1).split("&");
    return query.filter(item => item.match('=')).reduce((acc, cur) => {
      const innerArr = cur.split('=');

      acc[innerArr[0]] = innerArr[1];

      return acc;
    }, {});
  }
  const { multiple, num = 1 } = getSearchObjFn();
  return <>
    祖父组件 { forEach(num, multiple)}
  </>
}

function Father1({ val, multiple }) {
  const innerMulti = multiple === 'false' ? false : Boolean(multiple);
  const [state, dispatch] = useCtrlState(`${innerMulti ? 'MULTI-' : ''}SIGN-${val}`, { a: 3, b: 2 });
  console.log(state);
  return <div onClick={() => dispatch( fifthDoIt() )}>
    父组件{val}的state值：{state?.a || 0}
  </div>;
}

function Child1(props) {
  const [state] = useCtrlState('SIGN2');
  return <div>
    子组件1：
    和父亲组件2的使用相同的state：{state?.b}
  </div>
}