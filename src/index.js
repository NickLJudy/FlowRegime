import { createElement, createContext, useReducer, useContext, } from 'react';
import { isType, variableRelation, compose, } from './util';

const SingleContextType = Symbol("A separate context type.");
const multi = str => String(str).indexOf('MULTI-') === 0;
let repos = new Map([[SingleContextType, createContext()]]);
let types = new Set([SingleContextType]);
let _dispatch;

export function StateWrapper({ children }) {
  const [globalState, dispatch] = useReducer(reducer, {});
  _dispatch = dispatch;
  function reducer(state, action) {
    let { type, value } = action;
    types.add(type);

    if (!value) {
      repos.set(type, createContext());

      return state;
    }
    const Relation = variableRelation(state[type], value);
    let obj = {}

    if (Relation === 'SAME') throw new Error('The state shouldn\'t appear in dispatch.');
    if (Relation !== 'DIFF') return state;

    obj[type] = isType(state[type]) && isType(value) ? { ...state[type], ...value } : value;

    return {
      ...state,
      ...obj,
    };
  };

  function renderTmp([type, store]) {
    const { Provider } = store;

    return children => createElement(Provider, { value: globalState[type] }, children);
  }

  const reposArr = Array.from(repos).map(repo => renderTmp(repo));
  if (repos.size > 0) return compose(...reposArr, children);

  return children;
}

export function useCtrlState(type, initState) {
  if (multi(type) && !types.has(type)) _dispatch({ type });

  if (multi(type)) return [
    useContext(repos.get(type)) || initState,
    value => _dispatch({ type, value }),
  ];

  const singleState = useContext(repos.get(SingleContextType));

  return [
    singleState?.[type] || initState,
    val => {
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