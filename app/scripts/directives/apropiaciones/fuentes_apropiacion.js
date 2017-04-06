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
        fuenteapropiacion: '='
      },
    templateUrl: 'views/directives/apropiaciones/fuentes_apropiacion.html',
    controller:function($scope, uiGridConstants){
      var self = this;

      self.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableFiltering: true,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        useExternalPagination: false,
        enableSelectAll: true,
        columnDefs: [{
            field: 'Fuente.Descripcion',
            displayName: 'Fuente',
            headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
            cellTooltip: function(row, col) {
              return row.entity.Fuente.Descripcion;
            }
          },
          {
              field: 'Valor',
              displayName: 'Valor',
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellFilter: 'currency'
            }
        ]
      };


      self.gridOptions.onRegisterApi = function(gridApi) {
        self.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          $scope.fuenteapropiacion=self.gridApi.selection.getSelectedRows();
        });
      };

      financieraRequest.get('fuente_financiacion_apropiacion',$.param({
        query: "Apropiacion:"+$scope.apropiacion
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });

      $scope.$watch('[d_fuentesApropiacion.gridOptions.paginationPageSize, d_fuentesApropiacion.gridOptions.data]', function(){
        if ((self.gridOptions.data.length<=self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize== null) && self.gridOptions.data.length>0) {
          $scope.gridHeight = self.gridOptions.rowHeight * 2+ (self.gridOptions.data.length * self.gridOptions.rowHeight);
          if (self.gridOptions.data.length<=5) {
            self.gridOptions.enablePaginationControls= false;
          }
        } else {
          $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
          self.gridOptions.enablePaginationControls= true;
        }
      },true);


    },
    controllerAs:'d_fuentesApropiacion'
  };
});
