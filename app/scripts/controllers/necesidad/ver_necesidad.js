'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadVerNecesidadCtrl
 * @description
 * # NecesidadVerNecesidadCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('VerNecesidadCtrl', function ($routeParams,administrativaRequest,$scope) {
    var self = this;
    if ($routeParams.Id!=undefined && $routeParams.Vigencia!=undefined) {
      $scope.data=[];
      $scope.data[0]=$routeParams.Vigencia;
      $scope.data[1]=$routeParams.Id;
    }
    console.log("NumeroElaboracion:"+$scope.data[0]+",Vigencia:"+$scope.data[1]);
    administrativaRequest.get('necesidad',$.param({
      query: "NumeroElaboracion:"+$scope.data[0]+",Vigencia:"+$scope.data[1]
    })).then(function(response){
      self.v_necesidad=response.data[0];
      console.log(self.v_necesidad);
    });
  });
