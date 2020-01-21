'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalCtrl
 * @description
 * # SeguimientoycontrolLegalCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('SeguimientoycontrolLegalCtrl', function ($scope, $translate, novedadesMidRequest, novedadesRequest, agoraRequest) {
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
        self.estado_contrato_obj.estado=0;
        agoraRequest.get('vigencia_contrato', '').then(function (response) {
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
            agoraRequest.get('contrato_general/?query=ContratoSuscrito.NumeroContratoSuscrito:' + self.contrato_id + ',VigenciaContrato:' + self.contrato_vigencia).then(function (agora_response) {
                if (agora_response.data.length > 0) {
                    self.contrato_obj.numero_contrato = self.contrato_id;
                    self.contrato_obj.id = agora_response.data[0].ContratoSuscrito[0].Id;
                    self.contrato_obj.valor = agora_response.data[0].ValorContrato;
                    self.contrato_obj.objeto = agora_response.data[0].ObjetoContrato;
                    self.contrato_obj.fecha_registro = agora_response.data[0].FechaRegistro;
                    self.contrato_obj.ordenador_Id = agora_response.data[0].OrdenadorGasto;
                    self.contrato_obj.vigencia = self.contrato_vigencia;
                    self.contrato_obj.contratista = agora_response.data[0].Contratista;
                    self.contrato_obj.cesion = 0;

                    //Obtiene el estado del contrato.
                    agoraRequest.get('contrato_estado?query=NumeroContrato:' + self.contrato_obj.id + ',Vigencia:' + self.contrato_obj.vigencia).then(function (ce_response) {
                        self.estado_contrato_obj.estado = ce_response.data[ce_response.data.length - 1].Estado.Id;
                        if (self.estado_contrato_obj.estado == 7) {
                            swal(
                                $translate.instant('CONTRATO_CANCELADO'),
                                '',
                                'info'
                            );
                        }
                        if (self.estado_contrato_obj.estado == 6 || self.estado_contrato_obj.estado == 8) {
                            swal(
                                $translate.instant('CONTRATO_FINALIZADO'),
                                '',
                                'info'
                            );
                        } if (self.estado_contrato_obj.estado == 3) {
                            swal(
                                $translate.instant('CONTRATO_INICIO'),
                                '',
                                'info'
                            );
                        }

                        //Obtiene el tipo de contrato y el tipo de la ultima novedad hecha para saber si el contrato fue cedido.
                        novedadesMidRequest.get('novedad', self.contrato_obj.numero_contrato + "/" + self.contrato_obj.vigencia).then(function (response_sql) {
                            var elementos_cesion = response_sql.data.Body;
                            if (elementos_cesion.length != '0') {
                                var last_newness = elementos_cesion[elementos_cesion.length - 1];
                                novedadesRequest.get('tipo_novedad', 'query=Id:' + last_newness.tiponovedad).then(function (nr_response) {
                                    self.contrato_obj.tipo_novedad = nr_response.data[0].CodigoAbreviacion;
                                    if (self.contrato_obj.tipo_novedad == "NP_CES") {
                                        self.contrato_obj.contratista = last_newness.cesionario;
                                        if (last_newness.poliza === "") {
                                            self.estado_contrato_obj.estado = 10
                                            swal(
                                                $translate.instant('INFORMACION'),
                                                $translate.instant('DESCRIPCION_ACTA_CESION'),
                                                'info'
                                            );
                                        }
                                    } else if (self.contrato_obj.tipo_novedad == "NP_SUS" || self.contrato_obj.tipo_novedad == "NP_REI"
                                        || self.contrato_obj.tipo_novedad == "NP_ADI" || self.contrato_obj.tipo_novedad == "NP_PRO"
                                        || self.contrato_obj.tipo_novedad == "NP_ADPRO") {
                                        self.contrato_obj.contratista = last_newness.cesionario;
                                    }
                                    //Obtiene los datos aosicados al proveedor de un contrato que ha tenido una novedad
                                    agoraRequest.get('informacion_proveedor?query=Id:' + self.contrato_obj.contratista).then(function (ip_response) {
                                        self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                                        self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                                        self.estado_resultado_response = true;
                                    });

                                });
                            } else {
                                //Obtiene los datos aosicados al proveedor de un contrato que no tiene novedades
                                agoraRequest.get('informacion_proveedor?query=Id:' + self.contrato_obj.contratista).then(function (ip_response) {
                                    self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                                    self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                                    self.estado_resultado_response = true;
                                });
                            }
                        });

                    }).catch(function (error) {
                        swal(
                            $translate.instant('INFORMACION'),
                            $translate.instant('No se pudo obtener datos del estado del contrato o no hay registros asociados en base de datos a este contrato'),
                            'info'
                        )
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
        };
    });