'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:plantillas/textoEnriquecido
 * @description
 * # plantillas/textoEnriquecido
 */
angular.module('contractualClienteApp')
  .directive('textoEnriquecido', function () {
    return {
      restrict: 'E',
      /*scope:{
          texto:'='
        },*/
      templateUrl: 'views/directives/plantillas/texto_enriquecido.html',
      controller:function(/*$scope*/){
        var ctrl = this;
        ctrl.opcionesTexto = ['Texto','HTML'];
        ctrl.op = ctrl.opcionesTexto[0];
        ctrl.textoNormal = true;
        // Muestra el textarea o el text-angular del texto del paragrafo de acuerdo al valor de ctrl.op
        ctrl.opcionTexto = function() {
          switch (ctrl.op) {
            case 'Texto':
            ctrl.textoNormal = true;
            ctrl.textoHtml = !ctrl.textoNormal;
            ctrl.textoOriginal = ctrl.textoParagrafo;
            break;
            case 'HTML':
            ctrl.textoHtml = true;
            ctrl.textoNormal = !ctrl.textoHtml;
            break;
            default:
            ctrl.textoNormal = true;
            ctrl.textoHtml = !ctrl.textoNormal;
            break;
          }
        };
      },
      controllerAs:'textoEnriquecido'
    };
  });
