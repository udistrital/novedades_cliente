'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadNecesidadExternaCtrl
 * @description
 * # NecesidadNecesidadExternaCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('NecesidadExternaCtrl', function($translate, administrativaRequest, $scope) {
        var ctrl = this;
        $scope.botones = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
            { clase_color: "ver", clase_css: "fa fa-check-square-o fa-lg faa-shake animated-hover", titulo: $translate.instant('BTN.SOLICITAR'), operacion: 'solicitud', estado: true },
        ];
        ctrl.gridOptions = {
            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            columnDefs: [{
                    field: 'TipoNecesidad.Nombre',
                    displayName: $translate.instant('TIPO'),
                    width: '10%',
                },
                {
                    field: 'TipoNecesidad.Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
                    width: '80%',
                },
                {
                    //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
                    name: $translate.instant('OPCIONES'),
                    enableFiltering: false,
                    width: '10%',
                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
                }
            ]
        };
        ctrl.gridOptions.enablePaginationControls = true;
        ctrl.gridOptions.multiSelect = false;
        ctrl.get_all_necesidad_externa = function() {
            administrativaRequest.get("necesidad_proceso_externo", $.param({
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    console.log(response.data);
                    ctrl.gridOptions.data = response.data;
                });
        };
        ctrl.get_all_necesidad_externa();
        $scope.loadrow = function(row, operacion) {
            ctrl.operacion = operacion;
            switch (operacion) {
                case "ver":
                    ctrl.row_entity = row.entity;
                    console.log(ctrl.row_entity);
                    break;
                case "solicitud":
                    ctrl.row_entity = row.entity;
                    switch (ctrl.row_entity.TipoNecesidad.CodigoAbreviacion) {
                        case "N":
                            break;
                    }
                    $('#modalNecesidad').modal('show');
                    break;
                default:
            }
        };
        ctrl.gridOptions.onRegisterApi = function(gridApi) {
            ctrl.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function() {});
        };
    });