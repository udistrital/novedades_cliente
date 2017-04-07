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
            console.log(self.v_necesidad);
          });
        };   

      },
      controllerAs:'d_visualizarNecesidad'
    };
  });
