'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalCtrl
 * @description
 * # SeguimientoycontrolLegalCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('SeguimientoycontrolLegalCtrl', function ($scope, amazonAdministrativaRequest, coreAmazonRequest, $translate, contratoRequest, novedadesMidRequest, novedadesRequest) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var self = this;
        self.estado_contrato_obj = {};
        self.estado_resultado_response = 0;
        self.contratos = [{}];
        self.vigencias = [];
        self.vigencia_seleccionada = self.vigencias[0];
        self.contrato_obj = {};
        self.estado_resultado_response = false;
        amazonAdministrativaRequest.get('vigencia_contrato', '').then(function (response) {
            $scope.vigencias = response.data;
        });

        /**
         * @ngdoc method
         * @name get_contratos_vigencia
         * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegal
         * @description
         * funcion para obtener la totalidad de los contratos por vigencia seleccionada
         */
        self.buscar_contrato = function () {
            contratoRequest.get('contrato', +self.contrato_id + '/' + self.contrato_vigencia).then(function (wso_response) {
                if (wso_response.data.contrato.numero_contrato_suscrito) {
                    self.contrato_obj.id = wso_response.data.contrato.numero_contrato_suscrito;
                    self.contrato_obj.valor = wso_response.data.contrato.valor_contrato;
                    self.contrato_obj.objeto = wso_response.data.contrato.objeto_contrato;
                    self.contrato_obj.fecha_registro = wso_response.data.contrato.fecha_registro;
                    self.contrato_obj.ordenador_gasto_nombre = wso_response.data.contrato.ordenador_gasto.nombre_ordenador;
                    self.contrato_obj.ordenador_gasto_rol = wso_response.data.contrato.ordenador_gasto.rol_ordenador;
                    self.contrato_obj.vigencia = wso_response.data.contrato.vigencia;
                    self.contrato_obj.contratista = wso_response.data.contrato.contratista;
                    self.contrato_obj.cesion = 0;

                    //Obtiene el estado del contrato.
                    contratoRequest.get('contrato_estado', +self.contrato_id + '/' + self.contrato_vigencia).then(function (ce_response) {
                        self.estado_contrato_obj.estado = ce_response.data.contratoEstado.estado.id;
                        console.log(self.estado_contrato_obj.estado)
                        if (self.estado_contrato_obj.estado == 7) {
                            swal(
                                $translate.instant('CONTRATO_CANCELADO'),
                                '',
                                'info'
                            );
                        }
                        if (self.estado_contrato_obj.estado == 6) {
                            swal(
                                $translate.instant('CONTRATO_FINALIZADO'),
                                '',
                                'info'
                            );
                        }
                        if (self.estado_contrato_obj.estado == 8) {
                            swal(
                                $translate.instant('CONTRATO_FINALIZADO'),
                                '',
                                'info'
                            );
                        }
                        //Obtiene el tipo de contrato y el tipo de la ultima novedad hecha para saber si el contrato fue cedido.
                        amazonAdministrativaRequest.get('tipo_contrato?query=Id:' + wso_response.data.contrato.tipo_contrato).then(function (tc_response) {
                            self.contrato_obj.tipo_contrato = tc_response.data[0].TipoContrato;
                            novedadesMidRequest.get('novedad', self.contrato_obj.id + "/" + self.contrato_obj.vigencia).then(function (response_sql) {
                                var elementos_cesion = response_sql.data.Body;
                                if (elementos_cesion.length != '0') {
                                    var last_cesion = elementos_cesion[elementos_cesion.length - 1];
                                    novedadesRequest.get('tipo_novedad', 'query=Id:' + last_cesion.tiponovedad).then(function (nr_response) {
                                        self.contrato_obj.tipo_novedad = nr_response.data[0].CodigoAbreviacion;
                                        if (self.contrato_obj.tipo_novedad == "NP_CES") {
                                            self.contrato_obj.contratista = last_cesion.cesionario;
                                            self.estado_contrato_obj.estado = 1;
                                            swal(
                                                $translate.instant('INFORMACION'),
                                                $translate.instant('DESCRIPCION_ACTA_CESION'),
                                                'info'
                                            );
                                        } else if (self.contrato_obj.tipo_novedad == "NP_SUS" || self.contrato_obj.tipo_novedad == "NP_REI"
                                            || self.contrato_obj.tipo_novedad == "NP_ADI" || self.contrato_obj.tipo_novedad == "NP_PRO"
                                            || self.contrato_obj.tipo_novedad == "NP_ADPRO") {
                                            self.contrato_obj.contratista = last_cesion.cesionario;
                                        }
                                        //Obtiene los datos aosicados al proveedor de un contrato que ha tenido una novedad
                                        amazonAdministrativaRequest.get('informacion_proveedor?query=Id:' + self.contrato_obj.contratista).then(function (ip_response) {
                                            self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                                            self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                                            if (ip_response.data[0].Tipopersona == 'NATURAL') {
                                                amazonAdministrativaRequest.get('informacion_persona_natural?query=Id:' + self.contrato_obj.contratista_documento).then(function (ipn_response) {
                                                    coreAmazonRequest.get('ciudad', 'query=Id:' + ipn_response.data[0].IdCiudadExpedicionDocumento).then(function (c_response) {
                                                        self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                                                        self.estado_resultado_response = true;
                                                    });
                                                });
                                            }
                                            else {
                                                amazonAdministrativaRequest.get('informacion_persona_juridica?query=Id:' + ip_response.data[0].NumDocumento).then(function (ipn_response) {
                                                    amazonAdministrativaRequest.get('informacion_proveedor', 'query=num_documento:' + ip_response.data[0].NumDocumento).then(function (ip_response) {
                                                        coreAmazonRequest.get('ciudad', 'query=Id:' + ip_response.data[0].IdCiudadContacto).then(function (c_response) {
                                                            self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                                                            self.estado_resultado_response = true;
                                                        });
                                                    });
                                                });
                                            }
                                        });

                                    });
                                } else {
                                    //Obtiene los datos aosicados al proveedor de un contrato que no tiene novedades
                                    amazonAdministrativaRequest.get('informacion_proveedor?query=Id:' + self.contrato_obj.contratista).then(function (ip_response) {
                                        self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                                        self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                                        if (ip_response.data[0].Tipopersona == 'NATURAL') {
                                            amazonAdministrativaRequest.get('informacion_persona_natural?query=Id:' + self.contrato_obj.contratista_documento).then(function (ipn_response) {
                                                coreAmazonRequest.get('ciudad', 'query=Id:' + ipn_response.data[0].IdCiudadExpedicionDocumento).then(function (c_response) {
                                                    self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                                                    self.estado_resultado_response = true;
                                                });
                                            });
                                        }
                                        else {
                                            amazonAdministrativaRequest.get('informacion_persona_juridica?query=Id:' + ip_response.data[0].NumDocumento).then(function (ipn_response) {
                                                amazonAdministrativaRequest.get('informacion_proveedor', 'query=num_documento:' + ip_response.data[0].NumDocumento).then(function (ip_response) {
                                                    coreAmazonRequest.get('ciudad', 'query=Id:' + ip_response.data[0].IdCiudadContacto).then(function (c_response) {
                                                        self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                                                        self.estado_resultado_response = true;
                                                    });
                                                });
                                            });
                                        }
                                    });
                                }

                            });
                        });
                    });
                } else {
                    self.estado_resultado_response = false;
                    swal(
                        $translate.instant('TITULO_ERROR'),
                        $translate.instant('DESCRIPCION_ERROR_LEGAL'),
                        'error'
                    );
                }
            });
        }

        /**
         * @ngdoc method
         * @name gridOptions
         * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegal
         * @description
         * Establece los contratos consultados en la tabla del cliente para seleccion
         */
        self.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: false,
            multiSelect: false,
            enableSelectAll: false,
            columnDefs: [
                { field: 'contrato.numero_contrato_suscrito', displayName: $translate.instant('CONTRATO'), width: 150 },
                { field: 'contrato.vigencia', displayName: $translate.instant('VIGENCIA_CONTRATO'), width: 160 },
                { field: 'informacion_proveedor.NumDocumento', displayName: $translate.instant('DOCUMENTO_CONTRATISTA'), width: 200 },
                { field: 'informacion_proveedor.NomProveedor', displayName: $translate.instant('NOMBRE_CONTRATISTA'), width: 390 },
                { field: 'contrato.valor_contrato', displayName: $translate.instant('VALOR'), cellFilter: 'currency', width: 180 }
            ],
            onRegisterApi: function (gridApi) {
                self.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    self.row_c = row.entity;
                    self.estado_resultado_response = 0;
                    contratoRequest.get('contrato_estado', +self.row_c.contrato.numero_contrato_suscrito + '/' + self.row_c.contrato.vigencia).then(function (response) {
                        var estado = response.data.contratoEstado.estado;
                        if (estado.id != 8) {
                            self.estado_contrato_obj.estado = estado.id;
                            self.estado_resultado_response = response.status;
                        } else {
                            self.estado_resultado_response = 0;
                        }
                    });
                });
            }
        };
    });