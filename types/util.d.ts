export declare function checkType(param: any): string | null;
export declare function isType(param: null, type?: string): boolean;
export declare function assignDeep(...objects: any[]): any;
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
export declare function variableRelation(...rest: any[]): "DIFF" | "EQUAL" | "SAME" | "SIMILAR";
export declare function isEqual(...rest: any[]): boolean;
export declare function compose(...rest: any[]): any;
export declare function mergeMap(...rest: any[]): Map<unknown, unknown>;
declare const _default: {
    checkType: typeof checkType;
    isType: typeof isType;
    assignDeep: typeof assignDeep;
    variableRelation: typeof variableRelation;
    isEqual: typeof isEqual;
    compose: typeof compose;
    mergeMap: typeof mergeMap;
};
export default _default;
