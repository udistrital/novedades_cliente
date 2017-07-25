'use strict';

/**
 * @ngdoc service
 * @name clienteApp.hojasDeVidaService
 * @description
 * # hojasDeVidaService
 * Factory in the clienteApp.
 */
angular.module('kyronService',[])
  .factory('kyronRequest', function ($http) {

    // Service logic
    // ...
    var path = "http://localhost:8089/v1/";

    // Public API here
    return {
      get: function(tabla, params) {
        return $http.get(path + tabla + "/?" + params);
      },
      post: function(tabla, elemento) {
        return $http.post(path + tabla, elemento);
      },
      put: function(tabla, id, elemento) {
        return $http.put(path + tabla + "/" + id, elemento);
      },
      delete: function(tabla, id) {
        return $http.delete(path + tabla + "/" + id);
      }
    };
  });
