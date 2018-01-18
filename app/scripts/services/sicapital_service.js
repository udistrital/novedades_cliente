'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.agoraService
 * @description
 * # agoraService
 * Factory in the contractualClienteApp.
 */
angular.module('sicapitalService', [])
    .factory('sicapitalRequest', function($http, token_service, CONF) {
        // Service logic
        // ...
        var path = CONF.GENERAL.SICAPITAL_SERVICE;
        //var path = "http://10.20.2.15/sicws/ws/sicapitalAPI.php/?/";
        // Public API here
        return {
            get: function(tabla, params) {
                return $http.get(path + tabla + "/" + params, token_service.setting_bearer.headers);
            },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.setting_bearer.headers);
            },
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, token_service.setting_bearer.headers);
            },
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.setting_bearer.headers);
            }
        };
    });