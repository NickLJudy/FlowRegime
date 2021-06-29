import { createElement, createContext, useReducer, useContext, } from 'react';
import { isType, variableRelation, compose, } from './util';

const SingleContextType = Symbol("A separate context type.");
const multi = (str: any) => String(str).indexOf('MULTI-') === 0;
let repos = new Map([[SingleContextType, createContext(null)]]);
let types = new Set([SingleContextType]);
let _dispatch: any;
function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
};

export function StateWrapper({ children }:any) {
  const [globalState, dispatch] = useReducer(reducer, {});
  _dispatch = dispatch;
  function reducer(state: { [x: string]: any; }, action: { type: any; value: any; }) {
    let { type, value } = action;
    types.add(type);

    if (!value) {
      repos.set(type, createContext(null));

      return state;
    }
    const Relation = variableRelation(state[type], value);
    let obj = {}

    if (Relation === 'SAME') throw new Error('The state shouldn\'t appear in dispatch.');
    if (Relation !== 'DIFF') return state;

    if(isValidKey(type,obj)){
      obj[type] = isType(state[type]) && isType(value) ? { ...state[type], ...value } : value;
    }
    
    return {
      ...state,
      ...obj,
    };
  };

  function renderTmp([type, store]:[any,any]) {
    const { Provider } = store;

    return (children:any) => createElement(Provider, { value: globalState[type] }, children);
  }

  const reposArr = Array.from(repos).map(repo => renderTmp(repo));
  if (repos.size > 0) return compose(...reposArr, children);

  return children;
}

export function useCtrlState(type: string | number | symbol, initState: any) {
  if (multi(type) && !types.has(type)) _dispatch({ type });

  if (multi(type)) return [
    useContext(repos.get(type)) || initState,
    (value: any) => _dispatch({ type, value }),
  ];

  const singleState = useContext(repos.get(SingleContextType));

  return [
    singleState?.[type] || initState,
    (val: any) => {
      let valueObj = {};
      valueObj[type] = val;

      return _dispatch({
        type: SingleContextType,
        value: {
          ...SingleContextType?.[type] || {},
          ...valueObj,
        }
      });
    }
  ]
}

export default {
  StateWrapper,
  useCtrlState,
};