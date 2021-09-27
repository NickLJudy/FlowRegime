import { createElement, createContext, useReducer, useContext, FunctionComponent, ComponentClass, } from 'react';
import { variableRelation, compose, isDev, } from './util';

function flowregime() {
  const SingleContextType = Symbol("A separate context type.");
  const multi = (param: string): boolean => String(param).indexOf('MULTI-') === 0;
  interface IContextProps {
    Provider: FunctionComponent | ComponentClass;
    Consumer: FunctionComponent | ComponentClass;
    [propName: string]: IStatusVal | FunctionComponent | ComponentClass;
  };

  interface IPlainObj {
    [SingleContextType]?: IPlainObj;
    [propName: string]: IStatusVal;
  };

  type IStatusVal = object | string | number | bigint;

  let repos = new Map();
  repos.set(SingleContextType, createContext(null));
  let types = new Set<symbol | string>([SingleContextType]);

  let _dispatch: Function;
  let _globalState: IPlainObj;

  type childrenProps = {
    children: JSX.Element | JSX.Element[];
  };
  function StateWrapper({ children }: childrenProps) {
    const [globalState, dispatch]: [IPlainObj, Function] = useReducer(reducer, {});

    _dispatch = dispatch;

    function reducer(state: IPlainObj, action: { type: string; value: IStatusVal; }) {
      let { type, value } = action;
      types.add(type);

      if (!value) {
        repos.set(type, createContext(null));

        return state;
      }
      const Relation = variableRelation(state[type], value);
      let obj: IPlainObj = {};

      if (Relation === 'SAME' && isDev) console.warn('The state shouldn\'t appear in dispatch.');
      if (Relation !== 'DIFF') return state;

      obj[type] = value;

      _globalState = Object.assign({}, state, obj);

      return _globalState;
    };

    function renderTmp([type, store]: [string | symbol, IContextProps]) {
      const { Provider } = store;
      const config: object = { value: globalState[type as string] };

      return (children: JSX.Element) => createElement(Provider, config, children);
    }

    const reposArr = Array.from(repos).map(repo => renderTmp(repo));
    if (repos.size > 0) return compose(...reposArr, children);

    return children;
  }

  function useCtrlState(type: string, initState: IStatusVal) {
    if (multi(type) && !types.has(type)) _dispatch({ type });

    if (multi(type)) return [
      useContext(repos.get(type)) || initState,
      (value: object | string | number | bigint) => _dispatch({ type, value }),
    ];

    const singleState: IPlainObj = useContext(repos.get(SingleContextType));

    return [
      singleState?.[type] || initState,
      (val: IStatusVal) => {
        let value: IPlainObj = {};

        value[type] = val;

        return _dispatch({
          type: SingleContextType,
          value,
        });
      }
    ]
  }

  return {
    StateWrapper,
    useCtrlState,
  };
}

export default flowregime();