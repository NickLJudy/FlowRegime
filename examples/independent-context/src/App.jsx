import React from 'react';
import { useCtrlState } from './../../../src/index';
import './App.css';

function forEach(num, multiple) {
  let arr = [];

  for (let i = 0; i < num; i++) arr.push("");

  return arr.map((Item, key) => <Father1 val={key} multiple={multiple} key={key} />)
};

export default function App() {
  function getSearchObjFn() {
    const query = window.location.search.substring(1).split("&");
    return query.filter(item => item.match('=')).reduce((acc, cur) => {
      const innerArr = cur.split('=');

      acc[innerArr[0]] = innerArr[1];

      return acc;
    }, {});
  }
  const { multiple, num = 10 } = getSearchObjFn();
  return <>
    祖父组件 { forEach(num, multiple)}
  </>
}

function Father1({ val, multiple }) {
  const innerMulti = multiple === 'false' ? false : Boolean(multiple);
  const [state, dispatch] = useCtrlState(`${innerMulti ? 'MULTI-' : ''}SIGN-${val}`, { a: 3, b: 2 });
  console.log(state);
  return <div onClick={() => dispatch({ a: state.a + 1, c: 1 })}>
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