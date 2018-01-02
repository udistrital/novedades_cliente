
'use strict';

/**
 * @ngdoc service
 * @name administrativaService.administrativaRequest
 * @description
 * # administrativaRequest
 * Factory in the administrativaService.
 */
 angular.module('administrativaService',[])
 .factory('administrativaRequest', function ($http) {
    // Service logic
    // ...
    var path = "http://10.20.0.254/administrativa_api/v1/";
<<<<<<< HEAD
    //var path = "http://localhost:8080/v1/";
=======
    //var path = "http://10.20.2.150:8082/v1/";
    //var path = "http://10.20.0.138:8090/v1/";  
>>>>>>> 8ab24e7c71bab2054d08ee75673c0e067695ee0b
    // Public API here
    return {
      get: function (tabla,params) {
        return $http.get(path+tabla+"/?"+params);
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
