sea(function aSeaScope (res) {
    'use strict';

    const dependences = [
        'sea.utils',
        'sea.params-schema'
    ];

    res.load(dependences, function ready (require, define) {
        const
            utils  = require('sea.utils'),
            schema = require('sea.params-schema');

        define('sea.request', function defSeaRequest () {
            const scope = {};

            //
            // CONSTANTS

            // http verbs
            utils.setConst(scope, 'DELETE', 'DELETE' );
            utils.setConst(scope, 'GET',    'GET'    );
            utils.setConst(scope, 'POST',   'POST'   );
            utils.setConst(scope, 'PUT',    'PUT'    );

            // responses type
            utils.setConst(scope, 'TYPE_ARRAYBUFFER', 'arraybuffer' );
            utils.setConst(scope, 'TYPE_BLOB',        'blob'        );
            utils.setConst(scope, 'TYPE_DOCUMENT',    'document'    );
            utils.setConst(scope, 'TYPE_JSON',        'json'        );
            utils.setConst(scope, 'TYPE_TEXT',        'text'        );

            // errors type
            utils.setConst(scope, 'ERROR_ABORT',        'abort'        );
            utils.setConst(scope, 'ERROR_INVALID_JSON', 'invalid-json' );
            utils.setConst(scope, 'ERROR_TIMEOUT',      'timeout'      );

            //
            // PARAMETERS SCHEMA

            const doesSchema = schema.create({
                url : {
                    type     : utils.TYPE_STRING,
                    required : true
                },
                method : {
                    type    : utils.TYPE_STRING,
                    options : [scope.DELETE, scope.GET, scope.POST, scope.PUT],
                    default : scope.GET
                },
                data : {
                    type    : [utils.TYPE_STRING, utils.TYPE_JSON],
                    default : {}
                },
                expectedType : {
                    type    : utils.TYPE_STRING,
                    options : [scope.TYPE_ARRAYBUFFER, scope.TYPE_BLOB, scope.TYPE_DOCUMENT, scope.TYPE_JSON, scope.TYPE_TEXT],
                    default : scope.TYPE_TEXT
                }
            });

            //
            // METHODS

            scope.queryString = function queryString (data) {
                if (utils.getTypeOf(data) !== utils.TYPE_JSON ) {
                    throw new Error('[sea.request] Invalid parameter type, expected a JSON');
                }

                return Object.keys(data).map((key) => `${key}=${data[key]}`).join('&');
            };

            scope.does = function does (params) {
                const args = schema.check(params, doesSchema, {preErr: 'sea.request'});

                // validating data
                if (args.method === scope.GET && utils.getTypeOf(args.data) !== utils.TYPE_JSON) {
                    throw new Error('[sea.request] Data must be type JSON for GET methods');
                }

                return new Promise(function requestPromise (resolve, reject) {
                    const xhr = new res.window.XMLHtpRequest();

                    xhr.addEventListener('load', (event) => {
                        const response = {};

                        response.xhr         = event.target;
                        response.status      = event.target.status;
                        response.statusText  = event.target.statusText;
                        response.response    = event.target.response;
                        response.responseURL = event.target.responseURL;

                        if (args.expectedType === scope.TYPE_JSON) {
                            try {
                                response.responseData = JSON.parse(response.response.trim());
                            } catch (e) {
                                reject({reason: scope.ERROR_INVALID_JSON});

                                return;
                            }
                        } else {
                            response.responseData = response.response;
                        }

                        resolve(response);
                    });

                    xhr.addEventListener('timeout', () => {
                        reject({reason: scope.ERROR_TIMEOUT});
                    });

                    xhr.addEventListener('abort', () => {
                        reject({reason: scope.ERROR_ABORT});
                    });

                    args.body = null;
                    if (args.data && utils.getTypeOf(args.data) === utils.TYPE_JSON) {
                        if (args.method === scope.GET) {
                            args.url += (args.url.indexOf('?') === -1 ? '?' : '&');
                            args.url += scope.queryString(args.data);
                        } else {
                            args.body = scope.queryString(args.data);
                        }
                    }

                    xhr.open(args.method, args.url, true);
                    xhr.send(args.body);
                });
            };

            scope.delete = function deleteMethod (params) {
                params.method = scope.DELETE;

                return scope.does(params);
            };

            scope.get = function get (params) {
                params.method = scope.GET;

                return scope.does(params);
            };

            scope.post = function post (params) {
                params.method = scope.POST;

                return scope.does(params);
            };

            scope.put = function put (params) {
                params.method = scope.PUT;

                return scope.does(params);
            };

            //
            // EXPORT SCOPE

            return scope;
        });
    });

});
