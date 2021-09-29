export function checkType(param: any) {
  if (param === null) return null;
  if (typeof param !== "object") return typeof param;

  const objTypes = [
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

  let type = 'object';

  objTypes.some(({ key, value }) => {
    const bool = param instanceof value;

    if (bool) type = key;

    return bool;
  });

  return type;
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
export function variableRelation(...rest: any[]) {
  if (rest.length < 2) throw new Error('Util-variableRelation: Missing parameter!');

  const [param1, param2] = rest;

  if (checkType(param1) !== checkType(param2)) return 'DIFF';

  const deterministicType = (t: string | undefined, p = param1) => checkType(p) === t;

  if (typeof param1 !== 'object' && typeof param2 !== 'object') {

    if (deterministicType('function')) return String(param1) === String(param2) ? 'EQUAL' : 'DIFF';

    if (isNaN(param1) && isNaN(param2)) return 'EQUAL';

    //includes symbol
    return param1 === param2 ? 'EQUAL' : 'DIFF';
  }

  if (param1 === param2) return 'SAME';

  if (deterministicType('date') && +param1 === +param2) return 'SIMILAR';

  if (deterministicType('regexp') && String(param1) === String(param2)) return 'SIMILAR';

  if (deterministicType('array')) {
    if (param1.length !== param2.length) return 'DIFF';

    if (param1.some((v: any, i: number) => !isEqual(v, param2[i]))) return 'DIFF';

    return 'SIMILAR';
  }

  if (deterministicType('object')) {
    const param1Keys = Object.getOwnPropertyNames(param1);
    const param2Keys = Object.getOwnPropertyNames(param2);

    if (param1Keys.length !== param2Keys.length) return 'DIFF';

    if (param1Keys.some((v, i) => !isEqual(param1[v], param2[v]))) return 'DIFF';

    return 'SIMILAR';
  }

  return 'DIFF';
};

export function isEqual(...rest: any[]) {
  return variableRelation(...rest) !== 'DIFF';
}

export function compose(...rest: any[]) {
  if (rest.length === 0) return;
  if (rest.length === 1) {
    const [param] = rest;
    return typeof param === 'function' ? param() : param;
  }

  return rest.reverse().reduce((acc, fn) => fn(acc));
};

export const isDev = process.env.NODE_ENV !== 'production';

export function objAssign(...rest: (object[])) {
  return Object.assign({}, ...rest);
}

export default {
  checkType,
  variableRelation,
  isEqual,
  compose,
  objAssign,
  isDev,
}