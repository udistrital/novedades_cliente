'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.administrativaMidService
 * @description
 * # administrativaMidService
 * Factory in the financieraClienteApp.
 */
angular.module('adminMidService', [])
    .factory('adminMidRequest', function ($http, $q, requestRequest, token_service, CONF) {
        // Service logic
        // ...
        var path = CONF.GENERAL.ADMINISTRATIVA_MID_SERVICE;
        //var path = "http://localhost:8082/v1/";
        //var path = "http://10.20.0.138:8091/v1/";
        // Public API here
        var cancelSearch; //defer object

        return {
            get: function (tabla, params) {
                cancelSearch = $q.defer(); //create new defer for new request
                if (angular.isUndefined(params)) {
                    return $http.get(path + tabla, { timeout: cancelSearch.promise });
                } else {
                    return $http.get(path + tabla + "?" + params, { timeout: cancelSearch.promise });
                }
            },
            post: function (tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.setting_bearer.headers);
            },
            put: function (tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, token_service.setting_bearer.headers);
            },
            delete: function (tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.setting_bearer.headers);
            },
            cancel: function () {
                return cancelSearch.resolve('search aborted');
            }
        };
    });
