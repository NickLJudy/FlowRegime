import { createElement, createContext, useReducer, useContext, } from 'react';
import { typeCheck, variableRelation, compose, objAssign, } from './util';

const SingleContextType = Symbol("A separate context type.");
const multi = (str: any) => String(str).indexOf('MULTI-') === 0;
let repos: any = new Map([[SingleContextType, createContext(null)]]);
let types: any = new Set([SingleContextType]);

let _dispatch: Function;
let _globalState: any;
// function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
//   return key in object;
// };

export function StateWrapper({ children }: any) {
  const [globalState, dispatch]: any[] = useReducer(reducer, {});
  _dispatch = dispatch;
  function reducer(state: { [x: string]: any; }, action: { type: any; value: any; }) {
    let { type, value } = action;
    types.add(type);

    if (!value) {
      repos.set(type, createContext(null));

      return state;
    }
    const Relation = variableRelation(state[type], value);
    let obj: { [index: string]: any } = {}

    if (Relation === 'SAME') throw new Error('The state shouldn\'t appear in dispatch.');
    if (Relation !== 'DIFF') return state;

    obj[type] = typeCheck(state[type]) && typeCheck(value) ? objAssign(state[type], value) : value;

    _globalState = objAssign(state, obj);

    return _globalState;
  };

  function renderTmp([type, store]: [any, any]) {
    const { Provider } = store;

    return (children: any) => createElement(Provider, { value: globalState[type] }, children);
  }

  const reposArr = Array.from(repos).map((repo: any) => renderTmp(repo));
  if (repos.size > 0) return compose(...reposArr, children);

  return children;
}

export function useCtrlState(type: string | number | symbol, initState: any) {
  if (multi(type) && !types.has(type)) _dispatch({ type });

  if (multi(type)) return [
    useContext(repos.get(type)) || initState,
    (value: any) => _dispatch({ type, value }),
  ];

  const singleState: any = useContext(repos.get(SingleContextType));

  return [
    singleState?.[type] || initState,
    (val: any) => {
      let value:any = {};
      value[type] = typeCheck(val) ?
        objAssign(_globalState?.[SingleContextType]?.[type] || {}, val) :
        val;

      return _dispatch({
        type: SingleContextType,
        value,
      });
    }
  ]
}

export default {
  StateWrapper,
  useCtrlState,
};