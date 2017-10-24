'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verSolicitud
 * @description
 * # verSolicitud
 */
angular.module('contractualClienteApp')
    .directive('verSolicitud', function() {
        return {
            restrict: 'E',
            scope: {
                sol: '=?',
                tipos: '=?'
            },
            templateUrl: 'views/directives/avances/ver_solicitud.html',

            controller: function($scope) {
                var ctrl = this;

                $scope.$watch('sol', function() {
                    ctrl.solicitud = $scope.sol;
                    ctrl.tipo_avance = $scope.tipos;
                });
            },
            controllerAs: 'd_verSolicitud'
        };
    });