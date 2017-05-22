//STATUS develpment
sea().define('marjs.request', function coreRequest (res) {
    'use strict';

    return function request (params) {
        return new Promise(function requestPromise (resolve) {
            const xhr = new res.window.XMLHttpRequest();

            xhr.addEventListener('load', function xhrLoad (response) {
                resolve(response);
            });

            xhr.open(params.method, params.url, true);
            xhr.send();
        });
    };
});
