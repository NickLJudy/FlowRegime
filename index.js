import { createElement, createContext, useReducer, useContext,} from 'react';
import { isType, variableRelation, compose, } from './util';

let ctrlState;
const SingleContextType = Symbol("A separate context type.");
const repos = new Map([[SingleContextType, createContext()]]);
const isMulti = str => String(str).indexOf('MULTI-') === 0;

function StateWrapper({ children }) {
  const [state, dispatch] = useReducer(reducer, { types: new Set([SingleContextType]) });

  function reducer(state, action) {
    let { type, value } = action;
    let { types } = state;

    types.add(type);

    if (!value) {
      repos.set(type, createContext());

      return state;
    }
    const Relation = variableRelation(state[type], value);
    let obj = {}

    if (Relation === 'same') throw new Error('the state shouldn\'t appear in dispatch.');
    if (Relation !== 'different') return state;

    obj[type] = isType(state[type]) && isType(value) ? { ...state[type], ...value } : value;

    return { ...state, ...obj };
  };

  ctrlState = (type,initState) => {
    let { types } = state;

    if (isMulti(type) && !types.has(type)) dispatch({ type });

    if (isMulti(type)) return [
      useContext(repos.get(type)),
      value => dispatch({ type, value }),
    ];

    const singleState = useContext(repos.get(SingleContextType));

    return [
      singleState?.[type] || initState,
      val => {
        let valueObj = {};
        valueObj[type] = val;

        return dispatch({
          type: SingleContextType,
          value: {
            ...SingleContextType?.[type] || {},
            ...valueObj,
          }
        });
      }
    ]
  }

  function renderTmp([type, store]) {
    const { Provider } = store;

    return children => createElement(Provider,{value:state[type]},children); 
  }

  const reposArr = Array.from(repos).map(repo => renderTmp(repo));
  if (repos.size > 0) return compose(...reposArr, children);

  return children;
}

export { 
  StateWrapper, 
  ctrlState, 
};