'use strict';

/**
 * @ngdoc service
 * @name financieraService.financieraJbpmRequest
 * @description
 * # financieraService
 * Factory in the financieraService
 */
angular.module('financieraJbpmService', [])
    .factory('financieraJbpmRequest', function($http, token_service, CONF) {
        // Service logic
        // ...
        var path = CONF.GENERAL.FINANCIERA_JBPM_SERVICE;
        return {
            get: function(tabla) {
                return $http.get(path + tabla, token_service.setting_bearer.headers);
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