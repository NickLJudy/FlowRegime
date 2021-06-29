var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
export function checkType(param) {
    if (param === null)
        return null;
    if (typeof param !== "object")
        return typeof param;
    var objTypes = [
        {
            key: 'map',
            value: Map
        },
        {
            key: 'weakmap',
            value: WeakMap,
        },
        {
            key: 'set',
            value: Set,
        },
        {
            key: 'weakset',
            value: WeakSet,
        },
        {
            key: 'array',
            value: Array,
        },
        {
            key: 'date',
            value: Date,
        },
        {
            key: 'regexp',
            value: RegExp,
        },
        {
            key: 'error',
            value: Error,
        },
        {
            key: 'promise',
            value: Promise,
        },
        {
            key: 'event',
            value: Event,
        },
    ];
    var type = 'object';
    objTypes.some(function (_a) {
        var key = _a.key, value = _a.value;
        var bool = param instanceof value;
        if (bool)
            type = key;
        return bool;
    });
    return type;
}
export function isType(param, type) {
    if (type === void 0) { type = 'object'; }
    return checkType(param) === type;
}
export function assignDeep() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    return objects.reduce(function (accumulator, currentValue) {
        Object.keys(currentValue).forEach(function (key) {
            var pVal = accumulator[key];
            var oVal = currentValue[key];
            // if (Array.isArray(pVal) && Array.isArray(oVal)) {
            //   accumulator[key] = pVal.concat(...oVal);
            // } else 
            if (isType(pVal) && isType(oVal)) {
                accumulator[key] = assignDeep(pVal, oVal);
            }
            else {
                accumulator[key] = oVal;
            }
        });
        return accumulator;
    }, {});
}
/**
 * @description: determine the relationship between two variables.
 * @param {any} Must
 * @param {any} Must
 * @returns {string}
 *  possible values
 *    EQUAL
 *      primitive types => equality
 *      includes: undefined
 *    DIFF
 *    SAME
 *      structural types => same memory address
 *      includes: null
 *    SIMILAR
 *      structural type => the memory address is DIFF, the data is consistent
*/
export function variableRelation() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    if (rest.length < 2)
        throw new Error('Util-variableRelation: Missing parameter!');
    var param1 = rest[0], param2 = rest[1];
    if (checkType(param1) !== checkType(param2))
        return 'DIFF';
    var deterministicType = function (t, p) {
        if (p === void 0) { p = param1; }
        return isType(p, t);
    };
    if (typeof param1 !== 'object' && typeof param2 !== 'object') {
        if (deterministicType('function'))
            return String(param1) === String(param2) ? 'EQUAL' : 'DIFF';
        if (isNaN(param1) && isNaN(param2))
            return 'EQUAL';
        //includes symbol
        return param1 === param2 ? 'EQUAL' : 'DIFF';
    }
    if (param1 === param2)
        return 'SAME';
    if (deterministicType('date') && +param1 === +param2)
        return 'SIMILAR';
    if (deterministicType('regexp') && String(param1) === String(param2))
        return 'SIMILAR';
    if (deterministicType('array')) {
        if (param1.length !== param2.length)
            return 'DIFF';
        if (param1.some(function (v, i) { return !isEqual(v, param2[i]); }))
            return 'DIFF';
        return 'SIMILAR';
    }
    if (deterministicType('object')) {
        var param1Keys = Object.getOwnPropertyNames(param1);
        var param2Keys = Object.getOwnPropertyNames(param2);
        if (param1Keys.length !== param2Keys.length)
            return 'DIFF';
        if (param1Keys.some(function (v, i) { return !isEqual(param1[v], param2[v]); }))
            return 'DIFF';
        return 'SIMILAR';
    }
    return 'DIFF';
}
export function isEqual() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    return variableRelation.apply(void 0, rest) !== 'DIFF';
}
export function compose() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    if (rest.length === 0)
        return;
    if (rest.length === 1) {
        var param = rest[0];
        return typeof param === 'function' ? param() : param;
    }
    return rest.reverse().reduce(function (acc, fn) { return fn(acc); });
}
export function mergeMap() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    return new Map(rest.reduce(function (acc, item) { return __spreadArray(__spreadArray([], acc), item); }, []));
}
export default {
    checkType: checkType,
    isType: isType,
    assignDeep: assignDeep,
    variableRelation: variableRelation,
    isEqual: isEqual,
    compose: compose,
    mergeMap: mergeMap,
};
