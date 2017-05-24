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

            //
            // PARAMETERS SCHEMA
            //

            const paramsSchema = schema.create({
                url : {
                    type     : utils.TYPE_STRING,
                    required : true
                }
            });

            return function seaRequest (params) {
                // validating params
                params = schema.check(params, paramsSchema);

                return new Promise(function requestPromise (resolve) {
                    const xhr = new res.window.XMLHttpRequest();

                    xhr.addEventListener('load', (response) => {
                        resolve(response);
                    });

                    xhr.open(params.method, params.url, true);
                    xhr.send();
                });
            }

        });
    });

});
