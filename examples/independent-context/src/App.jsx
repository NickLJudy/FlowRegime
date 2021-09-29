import React,{useState} from 'react';
import { useCtrlState } from './../../../src/index';
import './App.css';

function forEach(num, multiple) {
  return new Array(Number(num)).fill("").map((Item, key) => <Father val={key} multiple={multiple} key={key} />)
};

function turn(obj) {
  let i = 0;

  return function () {

    i++;

    return {
      a:i+1,
    };
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

  return <> 祖父组件 {forEach(num, multiple)} </>;
}

function Father({ val, multiple }) {
  const innerMulti = multiple === 'false' ? false : Boolean(multiple);
  const [state, dispatch] = useCtrlState(`${innerMulti ? 'MULTI-' : ''}SIGN-${val}`, { a: 3, b: 2 });
  const [innerBox,setInnerBox] = useState(false);

  return <div onClick={() => {
      const v = fifthDoIt();
      setInnerBox(true);
      dispatch(v);
    }}>
    父组件{val}的state值：{state?.a || 0}
    { innerBox && <Child /> }
  </div>;
}

function Child(props) {
  const [state,dispatch] = useCtrlState('SIGN-2',{a:100});
  console.log(state);
  return <div onClick={e =>{
    e.stopPropagation();

    dispatch({a: (state.a + 1)})
  }}>
    子组件1：
    和父亲组件2的使用相同的state：{state?.a}
  </div>
}