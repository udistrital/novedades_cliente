'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.administrativaMidService
 * @description
 * # administrativaMidService
 * Factory in the financieraClienteApp.
 */
 angular.module('adminMidService',[])
   .factory('adminMidRequest',function ($http,$q, requestRequest) {
     // Service logic
     // ...
    var path = "http://10.20.0.254/administrativa_mid_api/v1/";
    //var path = "http://localhost:8082/v1/";
    //var path = "http://10.20.0.138:8091/v1/";
     // Public API here
     var cancelSearch ; //defer object
     var promise;

     return {
       get: function (tabla,params) {
        cancelSearch = $q.defer(); //create new defer for new request
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
