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
        var cancelSearch;

        return {
            get: function(tabla, params) {
                cancelSearch = $q.defer();
                return $http.get(path + tabla + "/" + params, {
                    timeout: cancelSearch.promise,
                    headers: token_service.setting_bearer.headers
                });
            },

            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, {
                    headers: token_service.setting_bearer.headers
                });
            },

            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, {
                    headers: token_service.setting_bearer.headers
                });
            },

            patch: function(tabla, id, elemento) {
                return $http({
                    method: 'PATCH',
                    url: path + tabla + "/" + id,
                    data: elemento,
                    headers: token_service.setting_bearer.headers
                });
            },

            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id, {
                    headers: token_service.setting_bearer.headers
                });
            },

            cancel: function() {
                return cancelSearch.resolve('search aborted');
            }
        };
    });

