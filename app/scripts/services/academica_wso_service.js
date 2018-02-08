'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.academicaWsoService
 * @description
 * # academicaWsoService
 * Factory in the contractualClienteApp.
 */
angular.module('contractualClienteApp')
  .factory('academicaWsoService', function ($http, token_service, CONF) {
    // Service logic
    // ...
    var path = CONF.GENERAL.ACADEMICA_WSO_SERVICE;

    // Public API here
    return {
        get: function(tabla, params) {
            var url = path + tabla;
            if (params !== '') {
                url = url + '/' + params;
            }
            return $http.get(url, token_service.setting_bearer.headers);
        },
        getAll: function(tabla) {
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
