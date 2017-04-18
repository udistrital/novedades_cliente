'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:catalogosElementos/listaSubgruposCatalogos
 * @description
 * # catalogosElementos/listaSubgruposCatalogos
 */
angular.module('contractualClienteApp')
  .directive('listaSubgruposCatalogos', function (administrativaRequest) {
    return {
      restrict: 'E',
      scope:{
          productos:'=?'
        },
      templateUrl: 'views/directives/catalogos_elementos/lista_subgrupos_catalogos.html',
      controller:function($scope, uiGridConstants){
        var self = this;

        self.gridOptions = {
          paginationPageSizes: [5, 10, 15],
          paginationPageSize: 5,
          enableRowSelection: true,
          enableRowHeaderSelection: true,
          enableFiltering: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          useExternalPagination: false,
          enableSelectAll: true,
          columnDefs: [{
              field: 'ElementoNombre',
              displayName: 'Productos',
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              cellTooltip: function(row, col) {
                return row.entity.Nombre;
              }
            }
          ]
        };


        self.gridOptions.onRegisterApi = function(gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope,function(row){
            $scope.productos=self.gridApi.selection.getSelectedRows();
          });
        };

        //administrativaRequest.get('catalogo_elemento',$.param({
        administrativaRequest.get('catalogo_elemento_grupo',$.param({
          fields: 'Id,Nombre'
        })).then(function(response) {
          self.gridOptions.data = response.data;
        });

        $scope.$watch('[d_listaSubgruposCatalogos.gridOptions.paginationPageSize,d_listaSubgruposCatalogos.gridOptions.data]', function(){
          if ((self.gridOptions.data.length<=self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize== null) && self.gridOptions.data.length>0) {
            $scope.gridHeight = self.gridOptions.rowHeight * 2+ (self.gridOptions.data.length * self.gridOptions.rowHeight);
            if (self.gridOptions.data.length<=5) {
              self.gridOptions.enablePaginationControls= false;
            }
          } else {
            $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
            self.gridOptions.enablePaginationControls= true;
          }
        },true)


      },
      controllerAs:'d_listaSubgruposCatalogos'
    };
  });
