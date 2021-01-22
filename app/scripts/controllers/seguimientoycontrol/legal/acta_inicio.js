'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
 * @description
 * # SeguimientoycontrolLegalActaInicioCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('SeguimientoycontrolLegalActaInicioCtrl', function ($log, $scope, $routeParams, $translate, coreAmazonRequest, agoraRequest, novedadesMidRequest, novedadesRequest) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.elementos = [];
        var self = this;
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        var f = new Date();
        var poliza = {};
        self.diff_dias = null;
        self.contrato_id = $routeParams.contrato_id;
        self.contrato_vigencia = $routeParams.contrato_vigencia;
        self.contrato_obj = {};
        $scope.items = []

        // Se obtienen las entidades aseguradoras
        coreAmazonRequest.get('entidad_aseguradora', 'limit=0').then(function (c_response) {
            for (var i = 0; i < c_response.data.length; i++) {
                $scope.items.push(
                    {
                        id: c_response.data[i].Id,
                        label: c_response.data[i].Nombre,
                    }
                );
            }
        });

        agoraRequest.get('contrato_general/?query=ContratoSuscrito.NumeroContratoSuscrito:' + self.contrato_id + ',VigenciaContrato:' + self.contrato_vigencia).then(function (agora_response) {
            if (agora_response.data.length > 0) {
                self.contrato_obj.numero_contrato = self.contrato_id;
                self.contrato_obj.id = agora_response.data[0].ContratoSuscrito[0].NumeroContrato.Id;
                self.contrato_obj.valor = agora_response.data[0].ValorContrato;
                self.contrato_obj.objeto = agora_response.data[0].ObjetoContrato;
                self.contrato_obj.vigencia = self.contrato_vigencia;
                self.contrato_obj.contratista = agora_response.data[0].Contratista;
                self.contrato_obj.cesion = 0;
                self.contrato_obj.plazo = agora_response.data[0].PlazoEjecucion;
                self.contrato_obj.supervisor_cedula = agora_response.data[0].Supervisor.Documento;

                //Teae el nombre del supervisor
                agoraRequest.get('informacion_persona_natural?query=Id:' + self.contrato_obj.supervisor_cedula).then(function (ipns_response) {
                    self.contrato_obj.supervisor_nombre_completo = ipns_response.data[0].PrimerNombre + " " + ipns_response.data[0].SegundoNombre + " " + ipns_response.data[0].PrimerApellido + " " + ipns_response.data[0].SegundoApellido;
                });

                //Verificar si el contrato ha tenido cesion
                novedadesMidRequest.get('novedad', self.contrato_obj.numero_contrato + "/" + self.contrato_obj.vigencia).then(function (response_sql) {
                    var elementos_cesion = response_sql.data.Body;
                    if (elementos_cesion.length != '0') {
                        var last_newness = elementos_cesion[elementos_cesion.length - 1];
                        novedadesRequest.get('tipo_novedad', 'query=Id:' + last_newness.tiponovedad).then(function (nr_response) {
                            self.contrato_obj.tipo_novedad = nr_response.data[0].CodigoAbreviacion;
                            if (self.contrato_obj.tipo_novedad == "NP_CES") {
                                self.contrato_obj.contratista = last_newness.cesionario;
                                //Obtencion de datos del contratista
                                agoraRequest.get('informacion_proveedor?query=Id:' + self.contrato_obj.contratista).then(function (ip_response) {
                                    self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                                    self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                                    agoraRequest.get('informacion_persona_natural?query=Id:' + ip_response.data[0].NumDocumento).then(function (ipn_response) {
                                        coreAmazonRequest.get('ciudad', 'query=Id:' + ipn_response.data[0].IdCiudadExpedicionDocumento).then(function (c_response) {
                                            self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                                            self.contrato_obj.contratista_tipo_documento = ipn_response.data[0].TipoDocumento.ValorParametro;
                                        });
                                    });
                                });
                            }
                            //Trae los datos de la poliza del contrato acutal guardado en el esquema novedades
                            novedadesRequest.get('poliza', 'query=IdNovedadesPoscontractuales:' + last_newness.id).then(function (nrp_response) {
                                poliza = nrp_response.data[0];
                                poliza.FechaCreacion = poliza.FechaCreacion.slice(0, -12);
                                delete poliza.FechaModificacion;
                            });
                        });
                    }
                });
            } else {
                swal(
                    $translate.instant('TITULO_ERROR'),
                    $translate.instant('No se pudo traer los datos asociados al contrato, por favor busque nuevamente el contrato.'),
                    'error'
                );
                window.location.href = "#/seguimientoycontrol/legal";
            }
        });

        /**
         * @ngdoc method
         * @name generarActa
         * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
         * @description
         * funcion que valida la data de la novedad
         */
        self.generarActa = function () {
            if (!$scope.selected) {
                swal(
                    'Oops...',
                    $translate.instant('No se ha selecionado una entidad aseguradora'),
                    'error'
                )
            } else {
                poliza.EntidadAseguradoraId = $scope.selected.id;
                poliza.NumeroPolizaId = self.numero_poliza;
                novedadesRequest.put('poliza', poliza.Id, poliza).then(function (nr_response) {
                    swal({
                        title: $translate.instant('TITULO_BUEN_TRABAJO'),
                        type: 'success',
                        html: 'Se registró exitosamente la poliza del ' + self.contrato_obj.numero_contrato + $translate.instant('ANIO') + self.contrato_obj.vigencia,
                        showCloseButton: false,
                        showCancelButton: false,
                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                        allowOutsideClick: false
                    }).then(function () {
                        window.location.href = "#/seguimientoycontrol/legal";
                    });
                }).catch(function (error) {
                    swal(
                        'Oops...',
                        $translate.instant('No se pudo registrar la poliza'),
                        'error'
                    )
                });
            }
        };

    }).config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return date ? moment(date).format('DD/MM/YYYY') : '';
        };
    });