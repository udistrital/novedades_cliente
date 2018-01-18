'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.requestRequest
 * @description
 * # requestService
 * Service in the financieraClienteApp.
 */
angular.module('requestService', [])
    .factory('requestRequest', function($q) {
        // Service logic
        // ...
        //var canceller = $q.defer();
        var promises = [];
        // Public API here
        return {
            get: function() {
                return promises;
            },
            add: function(promise) {
                var defered = $q.defer();
                defered.resolve(promise);
                promises.push(defered);
                return defered.promise;
            },
            cancel_all: function() {
                angular.forEach(promises, function(p) {
                    
                    if (!angular.isUndefined(p)) {
                        console.log("cancel");
                        return p.reject('CANCELED');
                        /*if (p.promise.$$state.status) {
                            console.log(p.promise);
                           // console.log("URL: " + p.promise.$$state.value.config.url + ", STATUS: " + p.promise.$$state.value.xhrStatus);
                        } else {
                            console.log("cancel");
                            p.resolve();
                        }*/
                    }
                });
                return null;
            }
        };

    });