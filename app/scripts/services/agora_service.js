'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.agoraService
 * @description
 * # agoraService
 * Factory in the contractualClienteApp.
 */
angular.module('agoraService', [])
    .factory('agoraRequest', function ($http, CONF, token_service) {
        var path = CONF.GENERAL.ADMINISTRATIVA_PRUEBAS_SERVICE;
        // Public API here
        return {
            get: function (tabla) {
                return $http.get(path + tabla, token_service.setting_bearer.headers);
            },
            post: function (tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.setting_bearer.headers);
            },
            put: function (tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, token_service.setting_bearer.headers);
            },
            delete: function (tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.setting_bearer.headers);
            }
        };
    });