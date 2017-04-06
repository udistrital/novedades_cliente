'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadAprobarNecesidadCtrl
 * @description
 * # NecesidadAprobarNecesidadCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('AprobarNecesidadCtrl', function($routeParams, administrativaRequest, $scope) {
    var self = this;
    if ($routeParams.Id != undefined && $routeParams.Vigencia != undefined) {
      $scope.data = [];
      $scope.data[0] = $routeParams.Vigencia;
      $scope.data[1] = $routeParams.Id;
    }
    console.log("NumeroElaboracion:" + $scope.data[0] + ",Vigencia:" + $scope.data[1]);
    administrativaRequest.get('necesidad', $.param({
      query: "NumeroElaboracion:" + $scope.data[0] + ",Vigencia:" + $scope.data[1]
    })).then(function(response) {
      self.ap_necesidad = response.data[0];
      console.log(self.ap_necesidad);
    });

    self.aprobar_necesidad = function() {
      administrativaRequest.get('estado_necesidad', $.param({
        query: "Nombre:Aprobada"
      })).then(function(response) {
        self.ap_necesidad.Estado = response.data[0];
        administrativaRequest.put('necesidad', self.ap_necesidad.Id, self.ap_necesidad).then(function(response) {
          if (response.data == "OK") {
            swal(
              'Bien!',
              'La necesidad ha sido Aprobada!',
              'success'
            )
          } else {
            swal(
              'error!',
              'La necesidad no pudo ser aprobada!',
              'error'
            )
          }
          console.log(response.data);
        });
      });
    };

    self.rechazar_necesidad = function() {
      administrativaRequest.get('estado_necesidad', $.param({
        query: "Nombre: Rechazada"
      })).then(function(response) {
        self.ap_necesidad.Estado = response.data[0];
        administrativaRequest.put('necesidad', self.ap_necesidad.Id, self.ap_necesidad).then(function(response) {
          console.log(response.data);
        });
      });
    };

    /*  self.aprobar_necesidad=function(){
        var aprobada:{

        }
        administrativaRequest.post('estado_necesidad_necesidad')
      };*/



  });
