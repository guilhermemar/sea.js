/* globals window */
(function seajs (scope) {
    'use strict';

    const modules = {},
        resources = {};

    resources.window   = window;
    resources.console  = window.console;
    resources.document = window.document;

    resources.require = function require (module) {
        if (modules[module]) {
            return modules[module].scope;
        }

        throw new Error(`Module ${module} not found`);
    };

    resources.define = function define (manifest, scope) {
        if (typeof (manifest) === 'string') {
            manifest = {name: manifest};

        } else if (!manifest.name) {
            throw new Error('Undefined new module name');
        }

        if (modules[manifest.name]) {
            throw new Error('Module name already defined');
        }

        manifest.scope = scope(resources);
        modules[manifest.name]  = manifest;
    };

    resources.load = function load (dependences) {
        if (dependences instanceof Array) {
            return Promise.resolve(resources.require, resources.define);
        }

        const notFound = [];

        let i;

        for (i = 0; i < dependences.length; ++i) {
            if (!modules[dependences[i]]) {
                notFound.push(dependences[i]);
            }
        }

        if (notFound.length > 0) {
            return Promise.reject('The dependences not found ' + notFound.toString());
        }

        Promise.resolve(resources.require, resources.define);
    };

    scope.sea = function sea (callback) {
        if (typeof(callback) === 'function' ) {
            callback(resources);
        }

        return resources;
    };

})(this);
