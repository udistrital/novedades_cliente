'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.contratoService
 * @description
 * # contratoService
 * Factory in the contractualClienteApp.
 */
angular.module('contratoService',[])
  .factory('contratoRequest', function ($http) {
    // Service logic
    // ...
    var path = "http://jbpm.udistritaloas.edu.co:8280/services/contratoSuscritoProxyService/";
    var cabecera={
      headers:{
        'Accept':'application/json'
      }
    };
    // Public API here
    return {
      get: function (tabla,params) {
        return $http.get(path+tabla+'/'+params,cabecera);
      },
      getAll: function (tabla) {
        return $http.get(path+tabla,cabecera);
      },
      post: function (tabla,elemento) {
        return $http.post(path+tabla,elemento);
      },
      put: function (tabla,id,elemento) {
        return $http.put(path+tabla+"/"+id,elemento);
      },
      delete: function (tabla,id) {
        return $http.delete(path+tabla+"/"+id);
      }
    };
  });
