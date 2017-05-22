sea(function aSeaScope (res) {
    'use strict';

    res.load(['sea.utils'], function ready (require, define){
        const utils = require('sea-utils');

        define('sea.params-schema', function seaParamsSchema () {
            //
            // SCOPES
            //

            const PUBLIC  = this,
                  PRIVATE = {};

            //
            // STATICS
            //

            // suppoerted types
            utils.setConst(this, 'TYPE_ARRAY',     'array');
            utils.setConst(this, 'TYPE_BOOLEAN',   'boolean');
            utils.setConst(this, 'TYPE_JSON',      'json');
            utils.setConst(this, 'TYPE_NULL',      'null');
            utils.setConst(this, 'TYPE_NUMBER',    'number');
            utils.setConst(this, 'TYPE_STRING',    'string');
            utils.setConst(this, 'TYPE_UNDEFINED', 'undefined');

            //
            // PRIVATE METHODS
            //

            PRIVATE.typeOf = function typeOf (value) {
                if (value === null) {
                    return this.TYPE_NULL;
                }

                if (typeof(value) === 'string') {
                    return this.TYPE_STRING;
                }

                if (typeof(value) === 'number') {
                    return this.TYPE_NUMBER;
                }

                if (typeof(value) === 'boolean') {
                    return this.TYPE_BOOLEAN;
                }

                if (typeof(value) === 'object') {

                    if (value.constructor == [].constructor) {
                        return this.TYPE_ARRAY;
                    }

                    if (value.constructor == {}.constructor) {
                        return this.TYPE_JSON;
                    }
                }

                return this.TYPE_UNDEFINED;
            };

            console.log('bla bla vli');

            /*
            // // // // // //
            // PUBLIC METHODS

            PUBLIC.create = function create (schema) {
                Object.keys(schema).forEach(function (key) {
                    var now = schema[key];

                    //checking key name
                    if (PRIVATE.typeOf(key) !== STATIC.TYPE_STRING) {
                        throw new Error ("The key " + key + " isn't a string");
                    }

                    //checking type
                    if (PRIVATE.typeOf(now.type) === STATIC.TYPE_STRING) {
                        now.type = [now.type];
                    } else if (PRIVATE.typeOf(now.type) !== STATIC.TYPE_ARRAY) {
                        throw new Error ("Invalid param 'type' of key " + key);
                    }

                    now.type.forEach(function (value) {
                        switch (value){
                        case STATIC.TYPE_ARRAY     :
                        case STATIC.TYPE_BOOLEAN   :
                        case STATIC.TYPE_JSON      :
                        case STATIC.TYPE_NULL      :
                        case STATIC.TYPE_NUMBER    :
                        case STATIC.TYPE_STRING    :
                        case STATIC.TYPE_UNDEFINED :
                            break
                        default :
                            throw new Error ("Invalid type " + value + " for param " + key);
                        }
                    });

                    // checking required
                    now.required = now.required ? true : false;

                    // checking default
                    now.default = now.default;
                });

                schema.validSchema = true;

                return schema;
            };

            PUBLIC.check = function check (params, schema) {

                var errors = [];

                // validating params by old form

                if (PRVATE.typeOf(params) !== STATIC.JSON) {
                    throw new Error ("params isn't a json object");
                }

                if (PRVATE.typeOf(schema) !== STATIC.JSON || schema.validSchema !== true) {
                    throw new Error ("schema isn't a json object");
                }

                // validating params

                Object.keys(schema).forEach(function (key) {
                    var p = params[key],
                        s = schema[key];

                    if (p[key]) {

                    } else {
                        if (s.required) {
                            errors.put('Required param ' + key + ' is required, but not found');
                        } else {
                            params[key] = s.default;
                        }
                    }
                });

            };
            */

            return PUBLIC;
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
