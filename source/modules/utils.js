sea().define('sea.utils', function seaUtils () {
    'use strict';

    //
    // SCOPE DEFINITION

    const scope = {};

    //
    // UTILITIES

    scope.setConst = function setConst (obj, key, value) {
        if (obj.constructor !== {}.constructor) {
            throw new Error('[sea.utils.setConst] First parameter must be a object');
        }

        Object.defineProperty(obj, key, {value: value});
    };

    scope.setConst(scope, 'TYPE_ARRAY',     'array');
    scope.setConst(scope, 'TYPE_BOOLEAN',   'boolean');
    scope.setConst(scope, 'TYPE_JSON',      'json');
    scope.setConst(scope, 'TYPE_NULL',      'null');
    scope.setConst(scope, 'TYPE_NUMBER',    'number');
    scope.setConst(scope, 'TYPE_STRING',    'string');
    scope.setConst(scope, 'TYPE_UNDEFINED', 'undefined');

    scope.getTypeOf = function getTypeOf (value) {
        if (value === null) {
            return scope.TYPE_NULL;
        }

        if (typeof (value) === 'string') {
            return scope.TYPE_STRING;
        }

        if (typeof (value) === 'number') {
            return scope.TYPE_NUMBER;
        }

        if (typeof (value) === 'boolean') {
            return scope.TYPE_BOOLEAN;
        }

        if (typeof (value) === 'object') {

            if (value.constructor === [].constructor) {
                return scope.TYPE_ARRAY;
            }

            if (value.constructor === {}.constructor) {
                return scope.TYPE_JSON;
            }
        }

        return scope.TYPE_UNDEFINED;
    };

    scope.checkTypeOf = function checkTypeOf (value, isType) {
        return (scope.getTypeOf(value) === isType);
    };

    //
    // SCOPE EXPORT

    return scope;
});
