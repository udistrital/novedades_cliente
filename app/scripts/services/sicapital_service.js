'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.agoraService
 * @description
 * # agoraService
 * Factory in the contractualClienteApp.
 */
angular.module('sicapitalService',[])
.factory('sicapitalRequest', function ($http) {
  // Service logic
  // ...
  var path = "http://10.20.2.15/sicws/ws/sicapitalAPI.php/?/";
  // Public API here
  return {
    get: function (tabla,params) {
      return $http.get(path+tabla+"/"+params);
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
