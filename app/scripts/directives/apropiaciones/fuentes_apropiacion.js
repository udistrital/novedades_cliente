'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:apropiaciones/fuentesApropiacion
 * @description
 * # apropiaciones/fuentesApropiacion
 */
angular.module('contractualClienteApp')
.directive('fuentesApropiacion', function (financieraRequest) {
  return {
    restrict: 'E',
    scope:{
        apropiacion:'=',
        fuenteapropiacion: '=',
        dependenciasolicitante: '='
      },
    templateUrl: 'views/directives/apropiaciones/fuentes_apropiacion.html',
    controller:function($scope,$translate){
      var self = this;
      $scope.fuente = $translate.instant('FUENTE');

      self.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableRowSelection: true,
        enableFiltering: true,
        enableRowHeaderSelection: false,
        useExternalPagination: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        enableSelectAll: true,
        enablePaginationControls: true,
        columnDefs: [{
            field: 'FuenteFinanciamiento.Nombre',
            displayName: $translate.instant('FUENTE'),
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function(row) {
              return row.entity.FuenteFinanciamiento.Nombre;
            }
          }
        ]
      };


      self.gridOptions.onRegisterApi = function(gridApi) {
        self.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(){
          $scope.fuenteapropiacion=self.gridApi.selection.getSelectedRows();
        });
      };

      financieraRequest.get('fuente_financiamiento_apropiacion',$.param({
        query: "Apropiacion:"+$scope.apropiacion+",Dependencia:"+$scope.dependenciasolicitante
      })).then(function(response) {

        self.gridOptions.data = response.data;
      });
    },
    controllerAs:'d_fuentesApropiacion'
  };
});
