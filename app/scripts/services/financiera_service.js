'use strict';

/**
 * @ngdoc service
 * @name financieraService.financieraRequest
 * @description
 * # financieraService
 * Factory in the financieraService
 */
angular.module('financieraService', [])
  .factory('financieraRequest', function($http) {
    // Service logic
    // ...
    var path = "http://10.20.0.254/financiera_api/v1/";
    //var path = "http://127.0.0.1:8080/v1/";
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
