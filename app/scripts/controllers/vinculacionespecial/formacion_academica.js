'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:FormacionAcademicaCtrl
 * @description
 * # FormacionAcademicaCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('FormacionAcademicaCtrl', function ($scope,$mdDialog,kyronRequest,idPersona) {
  	
  	var self = this;

    kyronRequest.getAll("formacion_academica").then(function(response){
        self.estudios=response.data;
        self.estudios.forEach(function(estudio){
       		estudio.FechaInicio = new Date(estudio.FechaInicio).toLocaleDateString('es');
       		estudio.FechaFinalizacion = new Date(estudio.FechaFinalizacion).toLocaleDateString('es');
          kyronRequest.getOne("institucion",estudio.InstitucionId.Id).then(function(response){
            estudio.institucion=response.data;
          });
          kyronRequest.getOne("titulo",estudio.Titulo.Id).then(function(response){
            estudio.titulo=response.data;
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
