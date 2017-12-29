'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.gridOptionsService
 * @description
 * # gridOptionsService
 * Service in the contractualClienteApp.
 */
angular.module('gridOptionsService',[])
  .factory('gridOptionsService', function ($q) {

    return{
      build: function(service,endPoint,params,gridOptionsSource){
        var deferred = $q.defer();
        var gridOptions = {};
        gridOptions = gridOptionsSource;
        gridOptions.columnDefs = gridOptionsSource.columnDefs;
        service.get(endPoint,params).then(function(response) {
          console.log(response.data);
          gridOptions.data = response.data;
          deferred.resolve(gridOptions);

        });

        return deferred.promise;

      }
    };
  });
