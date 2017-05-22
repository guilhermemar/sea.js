sea().define('sea.utils', function seaUtils () {
    'use strict';

    ///
    /// SCOPES
    ///

    const PUBLIC = {};

    //
    // UTILITIES
    //

    PUBLIC.setConst = function setConst (obj, key, value) {
        if (obj.constructor !== {}.constructor) {
            throw new Error('[sea.utils.setConst] First parameter must be a object');
        }

        Object.defineProperty(obj, key, {
            value: value
        });
    };

    //
    // export module
    //

    return PUBLIC;

});
