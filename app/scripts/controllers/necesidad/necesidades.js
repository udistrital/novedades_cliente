'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadNecesidadesCtrl
 * @description
 * # NecesidadNecesidadesCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('NecesidadesCtrl', function ($scope, administrativaRequest, $translate, $window, gridApiService, pdfMakerNecesidadesService) {
        var self = this;
        self.offset = 0;
        self.rechazada = false;
        self.editarNecesidad = true; 

        self.gridOptions = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            useExternalPagination: true,
            useExternalFiltering: true,
            enableSelectAll: false,
            multiSelect: false,
            columnDefs: [{
                field: 'NumeroElaboracion',
                displayName: $translate.instant('NUMERO_ELABORACION'),
                type: 'number',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.NumeroElaboracion;
                },
                width: '7%'
            },
            {
                field: 'Vigencia',
                displayName: $translate.instant('VIGENCIA'),
                type: 'number',
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.Vigencia;
                },
                width: '7%'
            },
            {
                field: 'Objeto',
                displayName: $translate.instant('OBJETO_CONTRACTUAL'),
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.Objeto;
                },
                width: '35%'
            },
            {
                field: 'Justificacion',
                displayName: $translate.instant('JUSTIFICACION_CONTRATO'),
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.Justificacion;
                },
                width: '25%'
            },
            {
                field: 'EstadoNecesidad.Nombre',
                displayName: $translate.instant('ESTADO'),
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.EstadoNecesidad.Nombre + ".\n" + row.entity.EstadoNecesidad.Descripcion;
                },
                width: '7%'
            },
            {
                field: 'TipoNecesidad.Nombre',
                displayName: $translate.instant('TIPO_NECESIDAD'),
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.Vigencia;
                },
                width: '13%'
            },
            {
                field: 'ver',
                enableFiltering: false,
                enableSorting: false,
                displayName: $translate.instant('VER'),
                cellTemplate: function () {
                    return '<div style="text-align: center; display: inline-block"><a href="" style="border:0" type="button" ng-click="grid.appScope.direccionar(row.entity)"><span class="fa fa-eye"></span></a></div><div style="text-align: center; display: inline-block"><a href="" style="border:0" type="button" ng-click="grid.appScope.crearPDF(row.entity)"><span class="fa fa-file-pdf-o"></span></a></div>';
                },
                headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
                cellTooltip: function (row) {
                    return row.entity.EstadoNecesidad.Nombre + ".\n" + row.entity.EstadoNecesidad.Descripcion;
                },
                width: '6%'
            }
            ],
            onRegisterApi: function (gridApi) {
                self.gridApi = gridApi;

                self.gridApi = gridApiService.pagination(self.gridApi, self.cargarDatosNecesidades, $scope);
                self.gridApi = gridApiService.filter(self.gridApi, self.cargarDatosNecesidades, $scope);

                self.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    self.necesidad = row.entity;
                });
            }
        };

        //Funcion para cargar los datos de las necesidades creadas y almacenadas dentro del sistema
        self.cargarDatosNecesidades = function (offset, query) {
            if (query == undefined) query = [];
            query = typeof (query) === "string" ? [query] : query;
            query.push("EstadoNecesidad.Nombre__not_in:Borrador");

            var req = administrativaRequest.get('necesidad', $.param({
                limit: self.gridOptions.paginationPageSize,
                offset: offset,
                sortby: "Vigencia,NumeroElaboracion",
                order: "desc",
                query: query.join(",")
            }, true))
            req.then(gridApiService.paginationFunc(self.gridOptions, offset));
            return req;
        };

        self.cargarDatosNecesidades(self.offset, self.query);

        $scope.direccionar = function (necesidad) {
            self.g_necesidad = necesidad;
            self.numero_el = necesidad.NumeroElaboracion;
            self.vigencia = necesidad.Vigencia;
            if (necesidad.EstadoNecesidad.Nombre === 'Solicitada') {
                self.mod_aprobar = true;
                self.mod_cdp = false;
            } else if (necesidad.EstadoNecesidad.Nombre === 'Aprobada') {
                self.mod_aprobar = false;
                self.mod_cdp = true;
            } else {
                self.mod_cdp = false;
                self.mod_aprobar = false;
            }

            //para mostrar informacion de rechazo
            self.rechazada = necesidad.EstadoNecesidad.Nombre === 'Rechazada';

            $("#myModal").modal();

        };

        self.aprobar_necesidad = function () {
            var n = {};
            administrativaRequest.get('necesidad/' + self.g_necesidad.Id
            ).then(function (response) {
                n = response.data == undefined ? {} : response.data;
                return administrativaRequest.get('estado_necesidad', $.param({
                    query: "Nombre:Aprobada"
                }));
            }).then(function (response) {
                n.EstadoNecesidad = response.data[0];
                administrativaRequest.put('necesidad', n.Id, n).then(function (response) {
                    self.alerta = "";
                    for (var i = 1; i < response.data.length; i++) {
                        self.alerta = self.alerta + response.data[i] + "\n";
                    }
                    swal("", self.alerta, response.data[0]);

                    self.cargarDatosNecesidades(self.offset, self.query);
                    $("#myModal").modal("hide");
                    self.g_necesidad = undefined;
                });
            });
        };

        self.rechazar_necesidad = function () {
            var nec_rech = {};
            swal({
                title: 'Indica una justificación por el rechazo',
                input: 'textarea',
                showCancelButton: true,
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value) {
                            resolve();
                        } else {
                            reject('Por favor indica una justificación!');
                        }
                    });
                }
            }).then(function (text) {
                nec_rech = {
                    Justificacion: text,
                    Necesidad: {}
                };
                return administrativaRequest.get('necesidad/' + self.g_necesidad.Id);
            }).then(function (response) {
                nec_rech.Necesidad = response.data;
                return administrativaRequest.get('estado_necesidad', $.param({
                    query: "Nombre:Rechazada"
                }));
            }).then(function (response) {
                nec_rech.Necesidad.EstadoNecesidad = response.data[0];
                return administrativaRequest.put('necesidad', nec_rech.Necesidad.Id, nec_rech.Necesidad);
            }).then(function (response) {
                return administrativaRequest.post('necesidad_rechazada', nec_rech);
            }).then(function (response) {
                if (response.data !== undefined) {
                    swal(
                        $translate.instant("OK"),
                        $translate.instant("NECESIDAD_RECHAZADA"),
                        'success'
                    );
                } else {
                    swal(
                        $translate.instant("ERROR"),
                        $translate.instant("NECESIDAD_NO_RECHAZADA"),
                        'error'
                    );
                }
                self.cargarDatosNecesidades(self.offset, self.query);
                self.g_necesidad = undefined;
                $("#myModal").modal("hide");
            });
        };

        self.solicitar_cdp = function () {
            self.sol_cdp = {};
            self.sol_cdp.Necesidad = self.g_necesidad;
            administrativaRequest.post("solicitud_disponibilidad", self.sol_cdp).then(function (response) {
                self.alerta = "";
                for (var i = 1; i < response.data.length; i++) {
                    self.alerta = self.alerta + response.data[i] + "\n";
                }
                swal("", self.alerta, response.data[0]);
                self.cargarDatosNecesidades(self.offset, self.query);
                self.necesidad = undefined;
                $("#myModal").modal("hide");
            });
        };
        
        self.editar_necesidad = function () {
            var idNecesidad = self.g_necesidad.Id;
            $("#myModal").modal("hide");
            $('#myModal').on('hidden.bs.modal', function (e) {
                $window.location.href = '#/necesidad/solicitud_necesidad/' + idNecesidad;
            })
        };
        $scope.crearPDF = function(row) {
            pdfMake.createPdf(pdfMakerNecesidadesService.docDefinition()).open();
        };

    });
