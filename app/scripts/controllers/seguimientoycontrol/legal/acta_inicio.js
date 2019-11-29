'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
 * @description
 * # SeguimientoycontrolLegalActaInicioCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('SeguimientoycontrolLegalActaInicioCtrl', function ($log, $scope, $routeParams, $translate, argoNosqlRequest, contratoRequest, coreAmazonRequest, amazonAdministrativaRequest, adminMidRequest, novedadesMidRequest, novedadesRequest) {
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

        contratoRequest.get('contrato', self.contrato_id + '/' + self.contrato_vigencia).then(function (wso_response) {
            self.contrato_obj.id = wso_response.data.contrato.numero_contrato_suscrito;
            self.contrato_obj.objeto = wso_response.data.contrato.objeto_contrato;
            self.contrato_obj.valor = wso_response.data.contrato.valor_contrato;
            self.contrato_obj.plazo = wso_response.data.contrato.plazo_ejecucion;
            self.contrato_obj.supervisor = wso_response.data.contrato.supervisor.nombre;
            self.contrato_obj.supervisor_cedula = wso_response.data.contrato.supervisor.documento_identificacion;
            self.contrato_obj.supervisor_cargo = wso_response.data.contrato.supervisor.cargo;
            self.contrato_obj.VigenciaContrato = wso_response.data.contrato.vigencia;
            self.contrato_obj.FechaRegistro = wso_response.data.contrato.FechaRegistro;
            self.contrato_obj.contratista = String(wso_response.data.contrato.contratista);
            self.contrato_obj.FechaSuscripcion = String(wso_response.data.contrato.fecha_suscripcion);
            self.contrato_obj.UnidadEjecucion = String(wso_response.data.contrato.unidad_ejecucion);


            //Obtencion de datos del Supervisor
            amazonAdministrativaRequest.get('informacion_persona_natural?query=Id:' + self.contrato_obj.supervisor_cedula).then(function (ipns_response) {
                self.contrato_obj.supervisor_nombre_completo = ipns_response.data[0].PrimerNombre + " " + ipns_response.data[0].SegundoNombre + " " + ipns_response.data[0].PrimerApellido + " " + ipns_response.data[0].SegundoApellido;
            });

            //Verificar si el contrato ha tenido cesion
            novedadesMidRequest.get('novedad', self.contrato_obj.id + "/" + self.contrato_obj.VigenciaContrato).then(function (response_sql) {
                var elementos_cesion = response_sql.data.Body;
                if (elementos_cesion.length != '0') {
                    var last_newness = elementos_cesion[elementos_cesion.length - 1];
                    novedadesRequest.get('tipo_novedad', 'query=Id:' + last_newness.tiponovedad).then(function (nr_response) {
                        self.contrato_obj.tipo_novedad = nr_response.data[0].CodigoAbreviacion;
                        if (self.contrato_obj.tipo_novedad == "NP_CES") {
                            self.contrato_obj.contratista = last_newness.cesionario;
                        }
                        //Trae los datos de la poliza del contrato acutal guardado en el esquema novedades
                        novedadesRequest.get('poliza', 'query=IdNovedadesPoscontractuales:' + last_newness.id).then(function (nrp_response) {
                            poliza = nrp_response.data[0]
                            poliza.FechaCreacion = poliza.FechaCreacion.slice(0, -12);
                            delete poliza.FechaModificacion
                            //poliza.FechaModificacion = poliza.FechaModificacion.slice(0, -12)
                        });

                        //Obtencion de datos del contratista
                        amazonAdministrativaRequest.get('informacion_proveedor?query=Id:' + self.contrato_obj.contratista).then(function (ip_response) {
                            self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                            self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                            amazonAdministrativaRequest.get('informacion_persona_natural?query=Id:' + ip_response.data[0].NumDocumento).then(function (ipn_response) {
                                coreAmazonRequest.get('ciudad', 'query=Id:' + ipn_response.data[0].IdCiudadExpedicionDocumento).then(function (c_response) {
                                    self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                                    self.contrato_obj.contratista_tipo_documento = ipn_response.data[0].TipoDocumento.ValorParametro;
                                });
                            });
                        });
                    });
                }
            });
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
                poliza.EntidadAseguradoraId = $scope.selected.id
                poliza.NumeroPolizaId = self.numero_poliza
                novedadesRequest.put('poliza', poliza.Id, poliza).then(function (nr_response) {
                    swal({
                        title: $translate.instant('TITULO_BUEN_TRABAJO'),
                        type: 'success',
                        html: 'Se registró exitosamente la poliza del ' + self.contrato_obj.id + $translate.instant('ANIO') + self.contrato_obj.VigenciaContrato,
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