'use strict';

/**
 * @ngdoc service
 * @name administrativaService.administrativaRequest
 * @description
 * # administrativaRequest
 * Factory in the administrativaService.
 */
angular.module('administrativaService', [])
    .factory('administrativaRequest', function($http, CONF, token_service) {
        // Service logic
        // ...
        var path = CONF.GENERAL.ADMINISTRATIVA_SERVICE;
        return {
            get: function(tabla, params) {
                if(angular.isUndefined(params)){
                    return $http.get(path + tabla, token_service.setting_bearer.headers);
                }else{
                    return $http.get(path + tabla + "/?" + params, token_service.setting_bearer.headers);
                }
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
