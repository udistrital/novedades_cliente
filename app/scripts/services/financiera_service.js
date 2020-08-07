'use strict';

/**
 * @ngdoc service
 * @name financieraService.financieraRequest
 * @description
 * # financieraService
 * Factory in the financieraService
 */
angular.module('financieraService', [])
    .factory('financieraRequest', function($http, token_service, CONF) {
        // Service logic
        // ...
        var path = CONF.GENERAL.FINANCIERA_SERVICE;
        return {
            get: function(tabla, params) {
                return $http.get(path + tabla + "/?" + params, token_service.setting_bearer.headers);
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