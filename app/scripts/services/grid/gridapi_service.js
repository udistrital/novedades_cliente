'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.grid/gridapiService
 * @description
 * # grid/gridapiService
 * Service in the financieraClienteApp.
 */
angular.module('gridApiService', [])
    /**
         * @ngdoc service
         * @name gridApiService.service:gridApiService
         * @description
         * # gridApiService
         * Fabrica sobre la cual se consumen los servicios para paginado externo en uigrid
         */
    .factory('gridApiService', function () {
        //var path = CONF.GENERAL.ACADEMICA_SERVICE;
        // Public API here
        return {
            /**
             * @ngdoc function
             * @name gridApiService.service:gridApiService#pagination
             * @methodOf gridApiService.service:gridApiService
             * @param {object} gridApi gridApi de uigrid para poner paginado externo
             * @return {object} gridApi con paginacion externa
             * @description Metodo gridApi del servicio
             */
            pagination: function (gridApi, consulFunc, $scope) {
                var self = this;
                var filter = function (grid) {
                    var query = [];
                    angular.forEach(grid.columns, function (value, key) {
                        if (value.filters[0].term) {
                            var formtstr = value.colDef.name.replace('[0]', '');
                            //console.log("change ", value.filters[0].term);
                            query.push(formtstr + '__icontains:' + value.filters[0].term);

                        };
                    });
                    return query;
                };
                gridApi.core.on.filterChanged($scope, function () {
                    consulFunc($scope.offset, filter(this.grid));
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    $scope.offset = (newPage - 1) * pageSize;
                    consulFunc($scope.offset, filter(this.grid));
                });
                return gridApi;
            },
            paginationFunc: function (table, offset) {
                return function (response) {
                    if (response.data === null) {
                        table.data = [];
                    } else {
                        table.data = response.data;
                        if (response.data.length === table.paginationPageSize) {
                            table.totalItems = offset + table.paginationPageSize + 5;
                        }
                    }
                };
            }
        };
    });