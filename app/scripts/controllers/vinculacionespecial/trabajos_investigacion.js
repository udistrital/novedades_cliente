'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:TrabajosInvestigacionCtrl
 * @description
 * # TrabajosInvestigacionCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('TrabajosInvestigacionCtrl', function ($scope,$mdDialog,kyronRequest,idPersona) {
  	
  	var self = this;

    kyronRequest.getAll("investigacion").then(function(response){
        self.investigaciones=response.data;
        self.investigaciones.forEach(function(investigacion){
        	investigacion.FechaInicio = new Date(investigacion.FechaInicio).toLocaleDateString('es');
          	investigacion.FechaFinalizacion = new Date(investigacion.FechaFinalizacion).toLocaleDateString('es');
          kyronRequest.getOne("institucion",investigacion.InstitucionId.Id).then(function(response){
            investigacion.institucion=response.data;
          });
          kyronRequest.getOne("tipo_investigacion",investigacion.TipoInvestigacionId.Id).then(function(response){
            investigacion.tipoInvestigacion=response.data;
          });
        });
      });

     $scope.getNumeros = function(objeto) {
        var numeros=[];
        if(objeto){
          for(var i = 0; i<objeto.length; i++){
            numeros.push(i);
          }
        }
        return numeros;
      }
      
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
  });
