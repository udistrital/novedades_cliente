'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.financieraMidService
 * @description
 * # financieraMidService
 * Service in the financieraClienteApp.
 */
angular.module('financieraMidService',[])
  .factory('financieraMidRequest', function ($http,$q) {
    // Service logic
    // ...
    //var path = "http://127.0.0.1:8086/v1/";
    var path = "http://10.20.0.254/financiera_mid_api/v1/";
    // Public API here
    var cancelSearch ; //defer object
    var promise;
    return {
      get: function (tabla,params) {
        cancelSearch = $q.defer(); 
        return $http.get(path+tabla+"/?"+params,{timeout:cancelSearch.promise});
      },
      post: function (tabla,elemento) {
        return $http.post(path+tabla,elemento);
      },
      put: function (tabla,id,elemento) {
        return $http.put(path+tabla+"/"+id,elemento);
      },
      delete: function (tabla,id) {
        return $http.delete(path+tabla+"/"+id);
      },
      cancel: function(){
        return cancelSearch.resolve('search aborted');
       }
    };
  });
