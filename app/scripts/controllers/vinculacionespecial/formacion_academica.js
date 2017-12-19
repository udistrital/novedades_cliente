'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:FormacionAcademicaCtrl
 * @description
 * # FormacionAcademicaCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('FormacionAcademicaCtrl', function ($scope,$mdDialog,kyronRequest/*,idPersona*/) {
  	
  	var self = this;

    //Los datos de los estudios realizados son leidos a través del servicio Kyron
    kyronRequest.get("formacion_academica").then(function(response){
        self.estudios=response.data;
        self.estudios.forEach(function(estudio){
          //Se cambian los formatos de las fechas
       		estudio.FechaInicio = new Date(estudio.FechaInicio).toLocaleDateString('es');
       		estudio.FechaFinalizacion = new Date(estudio.FechaFinalizacion).toLocaleDateString('es');
          //Se lee la institución donde se efectuo el estudio
          kyronRequest.get("institucion/"+estudio.InstitucionId.Id).then(function(response){
            estudio.institucion=response.data;
          });
          //Se lee el título correspondiente al estudio
          kyronRequest.get("titulo/"+estudio.Titulo.Id).then(function(response){
            estudio.titulo=response.data;
          });
        });
      });

    //Función para manejar dináicamente los registros almacenados en la variable self.estudios, se utiliza en el ng-repeat de la vista formacion_academica.js
     $scope.getNumeros = function(objeto) {
        var numeros=[];
        if(objeto){
          for(var i = 0; i<objeto.length; i++){
            numeros.push(i);
          }
        }
        return numeros;
      };
      
      //Definición de la función para cerrar la ventana una vez se ha realizado el proceso
      $scope.hide = function() {
        $mdDialog.hide();
      };

      //Definición de la función para cerrar la ventana sin realizar procesos
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
  });
