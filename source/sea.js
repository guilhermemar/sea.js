/* globals window */
/**
 * The seajs definition
 *
 * @param  {object}    scope Scope to be added seajs
 * @return {undefined}
 */
(function seajs (scope) {

    /**
     * resource properties config
     *
     * @typedef  {Object}   Resources
     * @property {Object}   window      - alias for browser window
     * @property {Object}   console     - alias for browser console
     * @property {Object}   document    - alias for browser document
     * @property {function} define      - define a new module
     * @property {function} require     - require a module
     * @property {function} requireSync - request synchronously a module
     * @property {function} load        - wait load a list of modulet to execute a callback
     */

    /**
     * A callback that contains a param with resources
     *
     * @callback cbWithResource
     * @param {Resources}
     */

    'use strict';

    /**
     * store all defined modules
     *
     * @type {Object}
     */
    const modules = {};

    /**
     * list of 'requires' waiting a module
     *
     * @type {Object}
     */
    const waiting = {};

    /**
     * scope for resources
     *
     * @type {Resources}
     */
    const resources = {};

    /**
     * window alias
     */
    resources.window = window;

    /**
     * console alias
     */
    resources.console = window.console;

    /**
     * document alias
     */
    resources.document = window.document;

    /**
     * Define e new module
     * @param  {string|Object}  manifest      - module name, or module manifest
     * @param  {String}         manifest.name - the module name
     * @param  {cbWithResource} scope         - function to be executed to get a module scope
     * @return {undefined}
     */
    resources.define = function define (manifest, scope) {

        if (typeof (manifest) === 'string') {
            manifest = {name: manifest};

        } else if (typeof manifest.name !== 'string') {
            throw new Error('Undefined new module name');

        }

        if (modules[manifest.name]) {
            throw new Error('Module name already defined');
        }

        manifest.scope = scope(resources);
        modules[manifest.name] = manifest;

        if (waiting[manifest.name]) {
            waiting[manifest.name].forEach( (item) => {
                item(manifest.scope);
            });

            delete waiting[manifest.name];
        }
    };

    /**
     * Require a module
     *
     * @param  {string}         module  - Module name
     * @return {Promise<mixed>}         - A promise that contains the module content
     */
    resources.require = function require (module) {
        return new Promise((resolve) => {
            if (modules[module]) {
                resolve(modules[module].scope);
            } else {
                if (!waiting[module]) {
                    waiting[module] = [];
                }

                waiting[module].push(resolve);
            }
        });
    };

    /**
     * Require synchronously a module
     *
     * @param  {string} module - Module name
     * @return {mixed}         - The module content
     * @throws {Error}         - Will throw a error if the requested module not found
     */
    resources.requireSync = function requireSync (module) {
        if (modules[module]) {
            return modules[module].scope;
        }

        throw new Error(`Module ${module} not found`);
    };

    /**
     * Wait load a list of dependences to execute a callback
     *
     * @param  {string[]}  [dependences] - Array with the requested modules names
     * @return {Promise}                 - A Promise that will be resolved when all dependencies will defined
     */
    resources.load = function load (dependences) {
        return new Promise((resolve) => {
            if (!(dependences instanceof Array)) {
                resolve();
            }

            const notFound = [];

            for (let i = 0; i < dependences.length; ++i) {
                if (typeof modules[dependences[i]] === 'undefined') {
                    notFound.push(resources.require(dependences[i]));
                }
            }

            Promise.all(notFound).then(() => {
                resolve();
            });
        });
    };

    /**
     * Main seajs function
     *
     * @param  {cbWithResource} callback - A callback to be executed inside seajs scope
     * @return {Resource}                - The seajs resource
     */
    scope.sea = function sea (callback) {
        if (typeof callback === 'function' ) {
            callback(resources);
        }

        return resources;
    };

})(this);
