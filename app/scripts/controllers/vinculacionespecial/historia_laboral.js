'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:HistoriaLaboralCtrl
 * @description
 * # HistoriaLaboralCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('HistoriaLaboralCtrl', function ($scope,$mdDialog,kyronRequest,idPersona) {
     
    var self = this;
    
    kyronRequest.getAll("experiencia_docente").then(function(response){
          self.experienciasLaborales=response.data;
          self.experienciasLaborales.forEach(function(experiencia){
          	experiencia.FechaInicio = new Date(experiencia.FechaInicio).toLocaleDateString('es');
          	experiencia.FechaFinalizacion = new Date(experiencia.FechaFinalizacion).toLocaleDateString('es');
            kyronRequest.getOne("institucion",experiencia.InstitucionId.Id).then(function(response){
              experiencia.institucion=response.data;
            });
            kyronRequest.getOne("tipo_dedicacion",experiencia.TipoDedicacionId.Id).then(function(response){
              experiencia.tipoDedicacion=response.data;
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
  });
