'use strict';

/**
 * @ngdoc service
 * @name clienteApp.titanService
 * @description
 * # titanService
 * Factory in the clienteApp.
 */
angular.module('titan_service',[])
  .factory('titan_request', function ($http) {
    // Service logic
    // ...
    var path = "http://10.20.0.254/titan_api_crud/v1/";

    // Public API here
    return {
      getAll: function (table,params) {
        return $http.get(path+table+"/?"+params);
      },
      post: function (table,elemento) {
        return $http.post(path+table,elemento);
      },
      delete: function (table,id) {
        return $http.delete(path+table+"/"+id);
      },
      getOne: function (table,id) {
        return $http.get(path+table+"/"+id);
      },
      put: function (table,id,elemento) {
        return $http.put(path+table+"/"+id,elemento);
      }
    };
  });
