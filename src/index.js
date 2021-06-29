var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { createElement, createContext, useReducer, useContext, } from 'react';
import { isType, variableRelation, compose, } from './util';
var SingleContextType = Symbol("A separate context type.");
var multi = function (str) { return String(str).indexOf('MULTI-') === 0; };
var repos = new Map([[SingleContextType, createContext(null)]]);
var types = new Set([SingleContextType]);
var _dispatch;
var _globalState;
// function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
//   return key in object;
// };
export function StateWrapper(_a) {
    var children = _a.children;
    var _b = useReducer(reducer, {}), globalState = _b[0], dispatch = _b[1];
    _dispatch = dispatch;
    function reducer(state, action) {
        var type = action.type, value = action.value;
        types.add(type);
        if (!value) {
            repos.set(type, createContext(null));
            return state;
        }
        var Relation = variableRelation(state[type], value);
        var obj = {};
        if (Relation === 'SAME')
            throw new Error('The state shouldn\'t appear in dispatch.');
        if (Relation !== 'DIFF')
            return state;
        obj[type] = isType(state[type]) && isType(value) ? __assign(__assign({}, state[type]), value) : value;
        _globalState = __assign(__assign({}, state), obj);
        return _globalState;
    }
    ;
    function renderTmp(_a) {
        var type = _a[0], store = _a[1];
        var Provider = store.Provider;
        return function (children) { return createElement(Provider, { value: globalState[type] }, children); };
    }
    var reposArr = Array.from(repos).map(function (repo) { return renderTmp(repo); });
    if (repos.size > 0)
        return compose.apply(void 0, __spreadArray(__spreadArray([], reposArr), [children]));
    return children;
}
export function useCtrlState(type, initState) {
    if (multi(type) && !types.has(type))
        _dispatch({ type: type });
    if (multi(type))
        return [
            useContext(repos.get(type)) || initState,
            function (value) { return _dispatch({ type: type, value: value }); },
        ];
    var singleState = useContext(repos.get(SingleContextType));
    return [
        (singleState === null || singleState === void 0 ? void 0 : singleState[type]) || initState,
        function (val) {
            var _a;
            var valueObj = {};
            valueObj[type] = val;
            return _dispatch({
                type: SingleContextType,
                value: __assign(__assign({}, ((_a = _globalState === null || _globalState === void 0 ? void 0 : _globalState[SingleContextType]) === null || _a === void 0 ? void 0 : _a[type]) || {}), valueObj)
            });
        }
    ];
}
export default {
    StateWrapper: StateWrapper,
    useCtrlState: useCtrlState,
};
