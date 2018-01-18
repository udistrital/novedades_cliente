'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.academicaService
 * @description
 * # academicaService
 * 
 * Service module of the application.
 */
angular.module('academicaService', [])
    /**
     * @ngdoc service
     * @name academicaService.service:academicaRequest
     * @requires $http
     * @param {injector} $http componente http de angular
     * @description
     * # academicaService
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de financiera sobre los metodos GET, POST, PUT y DELETE
     */
    .factory('academicaRequest', function($http, token_service, CONF) {
        var path = CONF.GENERAL.ACADEMICA_SERVICE;
        // Public API here
        return {
            /**
             * @ngdoc function
             * @name academicaService.service:academicaRequest#get
             * @methodOf academicaService.service:academicaRequest
             * @param {string} params parametros para filtrar la busqueda
             * @return {array|object} objeto u objetos del get
             * @description Metodo GET del servicio
             */
            get: function(params) {
                return $http.get(path + "&" + params, token_service.setting_bearer.headers);
            },

            /**
             * @ngdoc function
             * @name academicaService.service:academicaRequest#post
             * @param {object} elemento objeto a ser creado por el API
             * @methodOf academicaService.service:academicaRequest
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo POST del servicio
             */
            post: function(elemento) {
                return $http.post(path, elemento, token_service.setting_bearer.headers);
            }
        };
    });