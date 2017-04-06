'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadNecesidadesCtrl
 * @description
 * # NecesidadNecesidadesCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('NecesidadesCtrl', function($scope, administrativaRequest) {
    var self = this;



    self.gridOptions = {
      paginationPageSizes: [10, 15,20],
      paginationPageSize: 10,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'NumeroElaboracion',
          displayName: 'Número',
          type: 'number',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row, col) {
            return row.entity.NumeroElaboracion;
          },
          width: '7%'
        },
        {
          field: 'Vigencia',
          displayName: 'Vigencia',
          type: 'number',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row, col) {
            return row.entity.Vigencia;
          },
          width: '7%'
        },
        {
          field: 'Objeto',
          displayName: 'Objeto',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row, col) {
            return row.entity.Objeto;
          },
          width: '35%'
        },
        {
          field: 'Justificacion',
          displayName: 'Justificación',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row, col) {
            return row.entity.Justificacion;
          },
          width: '25%'
        },
        {
          field: 'Estado.Nombre',
          displayName: 'Estado',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row, col) {
            return row.entity.Estado.Nombre + ".\n" + row.entity.Estado.Descripcion;
          },
          width: '20%'
        },
        {
          field: 'ver',
          displayName: 'ver',
          cellTemplate: function() {
            return '<center><a href="" style="border:0" type="button" ng-click="grid.appScope.direccionar(row.entity)" data-toggle="modal" data-target="#myModal"><span class="fa fa-eye"></span></a></center>';
          },
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTooltip: function(row, col) {
            return row.entity.Estado.Nombre + ".\n" + row.entity.Estado.Descripcion;
          },
          width: '6%'
        }

      ]
    };
    self.gridOptions.multiSelect = false;

    $scope.direccionar = function(necesidad) {
      console.log("ent");
      console.log(necesidad);
      self.dat=[necesidad.NumeroElaboracion,necesidad.Vigencia];
      self.parametros=[];
      self.parametros.push(self.dat);
      console.log(self.parametros);
      if (necesidad.Estado.Nombre == 'Solicitada') {
        self.templateUrl="views/necesidad/aprobar_necesidad.html";
        self.mod_ver=false;
        self.mod_aprobar=true;
      } else {
        self.templateUrl="views/necesidad/ver_necesidad.html";
        self.mod_ver=true;
        self.mod_aprobar=false;
      }
    };

    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      self.gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        //console.log(row.entity);
        self.necesidad = row.entity;
        //console.log(row);
      });
    };

    administrativaRequest.get('necesidad', $.param({
      limit: 0
    })).then(function(response) {
      self.gridOptions.data = response.data;
    });

    $scope.$watch('[necesidades.gridOptions.paginationPageSize, necesidades.gridOptions.data]', function() {
      if ((self.gridOptions.data.length <= self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize == null) && self.gridOptions.data.length > 0) {
        $scope.gridHeight = self.gridOptions.rowHeight * 2 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
        if (self.gridOptions.data.length<=10) {
          self.gridOptions.enablePaginationControls= false;
        }
      } else {
        $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
        self.gridOptions.enablePaginationControls = true;
      }
    });

  });
