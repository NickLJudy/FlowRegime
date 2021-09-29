import { createElement, createContext, useReducer, useContext, FunctionComponent, ComponentClass, } from 'react';
import { variableRelation, compose, objAssign, isDev, } from './util';

const SingleContextType = Symbol("A separate context type.");

type IStatusVal = object | string | number | bigint;
type childrenProps = { children: JSX.Element | JSX.Element[]; };

interface IContextProps {
  Provider: FunctionComponent | ComponentClass;
  Consumer: FunctionComponent | ComponentClass;
  [propName: string]: IStatusVal | FunctionComponent | ComponentClass;
};

interface IPlainObj {
  [SingleContextType]?: IPlainObj;
  [propName: string]: IStatusVal;
};

function flowregime() {
  const isMulti = (param: string): boolean => String(param).indexOf('MULTI-') === 0;

  let _dispatch: Function;
  let types = new Set<symbol | string>([SingleContextType]);
  let repos = new Map();
  repos.set(SingleContextType, createContext(null));

  function StateWrapper({ children }: childrenProps) {
    const [globalState, dispatch]: [IPlainObj, Function] = useReducer(reducer, {});

    _dispatch = dispatch;

    function reducer(state: IPlainObj, action: { type: string; value: IStatusVal; }) {
      function comparison(
        upLevelState: IPlainObj,
        detailType: string,
        isIndependent = true,
        nextState = value): IPlainObj {
        const Relation = variableRelation(upLevelState[detailType], nextState);

        if (Relation === 'SAME' && isDev) console.warn('The state shouldn\'t appear in dispatch.');
        if (Relation !== 'DIFF') return state;

        if (isIndependent) return objAssign(upLevelState, { [detailType]: nextState });

        return objAssign(
          state,
          { [SingleContextType]: objAssign(upLevelState, { [detailType]: value }) },
        );
      };

      let { type, value } = action;

      if (isMulti(type)) {
        types.add(type);

        if (!value) {
          repos.set(type, createContext(null));

          return state;
        }

        return comparison(state, type);
      };

      const shared: IPlainObj = state[SingleContextType] || {};

      return comparison(shared, type, false);
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
    if (isMulti(type) && !types.has(type)) _dispatch({ type });

    if (isMulti(type)) return [
      useContext(repos.get(type)) || initState,
      (value: object | string | number | bigint) => _dispatch({ type, value }),
    ];

    const singleState: IPlainObj = useContext(repos.get(SingleContextType));

    return [
      singleState?.[type] || initState,
      (value: IStatusVal) => _dispatch({ type, value, }),
    ]
  }

  return {
    StateWrapper,
    useCtrlState,
  };
}

export default flowregime();