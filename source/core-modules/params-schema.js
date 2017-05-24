sea(function aSeaScope (res) {
    'use strict';

    res.load(['sea.utils'], function ready (require, define) {
        const utils = require('sea.utils');

        define('sea.params-schema', function defSeaParamsSchema () {

            //
            // SCOPE DEFINITION
            //

            const scope = {};

            // // // // // //
            // PUBLIC METHODS

            scope.create = function create (schema) {
                Object.keys(schema).forEach((key) => {
                    const now = schema[key];

                    // checking type
                    if (utils.getTypeOf(now.type) === utils.TYPE_STRING) {
                        now.type = [now.type];

                    } else if (utils.getTypeOf(now.type) !== utils.TYPE_ARRAY) {
                        throw new Error(`Invalid param 'type' of key ${key}`);

                    }

                    now.type.forEach((value) => {
                        switch (value) {
                        case utils.TYPE_ARRAY     :
                        case utils.TYPE_BOOLEAN   :
                        case utils.TYPE_JSON      :
                        case utils.TYPE_NULL      :
                        case utils.TYPE_NUMBER    :
                        case utils.TYPE_STRING    :
                        case utils.TYPE_UNDEFINED :
                            break;
                        default :
                            throw new Error(`Invalid type ${value} for param ${key}`);
                        }
                    });

                    // checking required
                    now.required = now.required ? true : false;

                    // checking default
                    now.default = now.default;

                    // setting description
                    now.description = now.description || '';
                });

                schema.validSchema = true;

                return schema;
            };

            scope.check = function check (params, schema) {
                const errors = [];

                // validating params by old form

                if (utils.getTypeOf(params) !== utils.TYPE_JSON) {
                    throw new Error("params isn't a json object");
                }

                if (utils.getTypeOf(schema) !== utils.TYPE_JSON || schema.validSchema !== true) {
                    throw new Error("schema isn't a schema generated using create method");
                }

                // validating params

                Object.keys(schema).forEach((key) => {
                    const
                        p = params[key],
                        s = schema[key];

                    if (p) {
                        if (s.type.indexOf(utils.getTypeOf(p)) === -1) {
                            errors.put(`Invalid type for param ${key}, it's must be ${s.type}`);
                        }
                    } else if (s.required) {
                        errors.put(`Required param ${key} is required, but not found`);
                    } else {
                        params[key] = s.default;
                    }
                });

                return params;
            };

            //
            // SCOPE EXPORT
            //

            return scope;
        });
    });
});


/**
{
  "param": {
       type: 'string' ['string', 'json', 'function', 'number', 'boolean', 'array'], required: true
       required: 'boolean', required: false
       description: 'string', required: false
       default: 'qualquer coisa', required false, default null (se não é requerido, e default não é setado, default é undefined)
  }

}
**/
