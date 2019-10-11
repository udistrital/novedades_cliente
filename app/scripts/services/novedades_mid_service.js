'use strict';

/**
 * @ngdoc service
 * @name novedadesMidService.novedadesMidRequest
 * @description
 * # novedadesMidRequest
 * Service in the novedadesMidService.
 */
angular.module('novedadesMidService', [])
    .factory('novedadesMidRequest', function($http, $q, token_service, CONF) {
        var path = CONF.GENERAL.NOVEDADES_MID_SERVICE;
        // Public API here
        var cancelSearch; //defer object
        return {
            get: function(tabla, params) {
                cancelSearch = $q.defer();
                return $http.get(path + tabla + "/?" + params, [{ timeout: cancelSearch.promise }, token_service.setting_bearer.headers]);
            },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.setting_bearer.headers);
            },
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, token_service.setting_bearer.headers);
            },
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.setting_bearer.headers);
            },
            cancel: function() {
                return cancelSearch.resolve('search aborted');
            }
        };
    });