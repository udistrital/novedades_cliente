'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:necesidad/visualizarNecesidad
 * @description
 * # necesidad/visualizarNecesidad
 */
angular.module('contractualClienteApp')
  .directive('visualizarNecesidad', function () {
    return {
      restrict: 'E',
      scope:{
          vigencia:'=',
          numero: '='
      },
      templateUrl: 'views/directives/necesidad/visualizar_necesidad.html',
      controller:function (administrativaRequest,$scope) {
        var self = this;

        $scope.$watch('[vigencia,numero]',function(){
          self.cargar_necesidad();
        });

        self.cargar_necesidad=function(){
          administrativaRequest.get('necesidad',$.param({
            query: "NumeroElaboracion:"+$scope.numero+",Vigencia:"+$scope.vigencia
          })).then(function(response){
            self.v_necesidad=response.data[0];
            administrativaRequest.get('marco_legal_necesidad',$.param({
              query: "Necesidad:"+response.data[0].Id,
              fields: "MarcoLegal"
            })).then(function(response){
              console.log(response);
              self.marco_legal=response.data;
            });
            console.log(self.v_necesidad);
          });
        };

      },
      controllerAs:'d_visualizarNecesidad'
    };
  });
