'use strict';

/**
 * @ngdoc service
 * @name administrativaService.amazonAdministrativa
 * @description
 * # administrativaRequest
 * Factory in the administrativaService.
 */
angular.module('amazonAdministrativaService', [])
    .factory('amazonAdministrativaRequest', function ($http, token_service, CONF) {
        var path = CONF.GENERAL.ADMINISTRATIVA_PRUEBAS_SERVICE;
        //var path = "http://localhost:8084/v1/";
        // Public API here
        return {
            get: function (tabla, params) {
                //return $http.get(path + tabla + "/?" + params, token_service.setting_bearer.headers);
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
