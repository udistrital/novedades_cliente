"use strict";

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolAprobacionCtrl
 * @description
 * # SeguimientoycontrolLegalCtrl
 * Controller of the contractualClienteApp
 */
angular
    .module("contractualClienteApp")
    .controller(
        "SeguimientoycontrolAprobacionCtrl",
        function (
            $scope,
            $translate,
            token_service,
            novedadesMidRequest,
            novedadesRequest,
            agoraRequest,
            documentosCrudRequest,
            $mdDialog
        ) {
            this.awesomeThings = ["HTML5 Boilerplate", "AngularJS", "Karma"];
            var self = this;
            self.estado_contrato_obj = {};
            self.estado_resultado_response = true;
            self.contratos = [{}];
            self.vigencias = [];
            self.vigencia_seleccionada = self.vigencias[0];
            self.contrato_obj = {};
            self.estado_resultado_response = false;
            self.estado_contrato_obj.estado = 0;
            self.novedadEnCurso = false;
            self.contratistaBool = false;
            self.usuarioJuridica = false;
            self.rolesUsuario = token_service.getPayload().role;
            self.rolActual = "SUPERVISOR";
            self.createBool = true;
            $scope.status = "";
            self.contrato_id = "";
            self.contrato_vigencia = "";

            $scope.novedadesTabla = [];
            self.estado_resultado_response = true;


            agoraRequest.get("vigencia_contrato", "").then(function (response) {
                $scope.vigencias = response.data;
            });

            // Asignación del rol del usuario
            for (const rol of self.rolesUsuario) {
                if (rol === 'ORDENADOR_DEL_GASTO') {
                    self.rolActual = rol;
                    break;
                }
            }
            if (self.rolActual != 'ORDENADOR_DEL_GASTO') {
                for (const rol of self.rolesUsuario) {
                    if (
                        rol === 'SUPERVISOR' ||
                        // rol === 'ASISTENTE_JURIDICA' ||
                        rol === 'CONTRATISTA'
                    ) {
                        console.log(rol);
                        self.rolActual = rol;
                        break;
                    }
                }
            }

            /**
            * @ngdoc method
            ** @name get_contratos_vigencia
            * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegal
            * @description
            * funcion para obtener la totalidad de los contratos por vigencia seleccionada
            */
            self.buscar_contrato = function () {
                self.novedadEnCurso = false;
                $scope.novedadesTabla = [];
                self.estado_resultado_response = false;
                self.documentoSelect = null;
                if (
                    self.contrato_id == undefined ||
                    self.contrato_vigencia == undefined
                ) {
                    self.estado_resultado_response = false;
                    swal(
                        $translate.instant("Los campos del formulario son obligatorios"),
                        $translate.instant(""),
                        "error"
                    );
                    return;
                }
                agoraRequest
                    .get(
                        "contrato_general/?query=ContratoSuscrito.NumeroContratoSuscrito:" +
                        self.contrato_id +
                        ",VigenciaContrato:" +
                        self.contrato_vigencia
                    )
                    .then(function (agora_response) {
                        console.log(agora_response);
                        if (agora_response.data.length > 0) {
                            self.contrato_obj.numero_contrato = self.contrato_id;
                            self.contrato_obj.id =
                                agora_response.data[0].ContratoSuscrito[0].NumeroContrato.Id;
                            self.contrato_obj.valor = agora_response.data[0].ValorContrato;
                            self.contrato_obj.objeto = agora_response.data[0].ObjetoContrato;
                            self.contrato_obj.fecha_registro =
                                agora_response.data[0].FechaRegistro;
                            self.contrato_obj.ordenador_Id =
                                agora_response.data[0].OrdenadorGasto;
                            self.contrato_obj.vigencia = self.contrato_vigencia;
                            self.contrato_obj.contratista =
                                agora_response.data[0].Contratista;
                            self.contrato_obj.cesion = 0;

                            //Obtiene el estado del contrato.
                            agoraRequest
                                .get(
                                    "contrato_estado?query=NumeroContrato:" +
                                    self.contrato_obj.id +
                                    ",Vigencia:" +
                                    self.contrato_obj.vigencia +
                                    "&sortby=Id&order=desc&limit=1"
                                )
                                .then(function (ce_response) {
                                    self.estado_contrato_obj.estado =
                                        ce_response.data[ce_response.data.length - 1].Estado.Id;
                                    if (self.estado_contrato_obj.estado == 7) {
                                        swal($translate.instant("CONTRATO_CANCELADO"), "", "info");
                                    }
                                    if (
                                        self.estado_contrato_obj.estado == 6 ||
                                        self.estado_contrato_obj.estado == 8
                                    ) {
                                        swal($translate.instant("CONTRATO_FINALIZADO"), "", "info");
                                    }
                                    if (self.estado_contrato_obj.estado == 3) {
                                        swal($translate.instant("CONTRATO_INICIO"), "", "info");
                                    }
                                    if (self.rolActual == "SUPERVISOR") {
                                        if (agora_response.data[0].Supervisor.Documento.toString() == token_service.getPayload().documento) {
                                            self.createBool = false;
                                        } else {
                                            swal({
                                                title: $translate.instant("INFORMACION"),
                                                type: "info",
                                                html: "El contrato # " +
                                                    self.contrato_obj.numero_contrato +
                                                    $translate.instant("ANIO") +
                                                    self.contrato_obj.vigencia +
                                                    " No pertenece a la dependencia del supervisor.",
                                                showCloseButton: false,
                                                showCancelButton: false,
                                                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                                allowOutsideClick: false,
                                            });
                                            self.createBool = true;
                                        }
                                    }


                                    //Obtiene el tipo de contrato y el tipo de la ultima novedad hecha para saber si el contrato fue cedido.
                                })
                                .catch(function (error) {
                                    swal(
                                        $translate.instant("INFORMACION"),
                                        $translate.instant(
                                            "No se pudo obtener datos del estado del contrato o no hay registros asociados en base de datos a este contrato"
                                        ),
                                        "info"
                                    );
                                });
                        } else {
                            self.estado_resultado_response = false;
                            swal(
                                $translate.instant("TITULO_ERROR"),
                                $translate.instant("DESCRIPCION_ERROR_LEGAL"),
                                "error"
                            );
                        }
                    })
                    .catch(function (error) {
                        self.estado_resultado_response = false;
                        swal(
                            $translate.instant("Contrato o fecha invalido"),
                            $translate.instant("DESCRIPCION_ERROR_LEGAL"),
                            "error"
                        );
                    });
            };

            self.crearC

            self.crearSolicitudReinicio = function () {
                self.reinicio_nov = {};
                self.reinicio_nov.contrato = self.contrato_obj.numero_contrato;
                self.reinicio_nov.vigencia = String(self.contrato_obj.vigencia);
                self.reinicio_nov.motivo = self.motivo_suspension;
                self.reinicio_nov.tiponovedad =
                    nc_response.data[0].CodigoAbreviacion;
                self.reinicio_nov.fecharegistro = new Date();
                self.reinicio_nov.fechasolicitud = self.fecha_solicitud;
                self.reinicio_nov.numerosolicitud = self.n_solicitud;
                self.reinicio_nov.numerooficioestadocuentas = 0;
                self.reinicio_nov.valor_desembolsado = 0;
                self.reinicio_nov.saldo_contratista = 0;
                self.reinicio_nov.saldo_universidad = 0;
                self.reinicio_nov.fecha_terminacion_anticipada =
                    "0001-01-01T00:00:00Z";
                self.reinicio_nov.periodosuspension = self.diff_dias;
                self.reinicio_nov.fechasuspension = self.f_suspension;
                self.reinicio_nov.fechafinsuspension = self.f_finsuspension;
                self.reinicio_nov.fechareinicio = self.f_reinicio;
                self.reinicio_nov.fechafinefectiva = self.calcularFechaFin(self.diff_dias);
                self.reinicio_nov.observacion = "";
                self.reinicio_nov.cesionario = parseInt(
                    self.contrato_obj.contratista
                );
                self.reinicio_nov.estado = self.estadoNovedad;
            }

            self.crearSolicitudCesion = function () {
                self.cesion_nov = {};
                self.cesion_nov.aclaracion = "";
                self.cesion_nov.camposaclaracion = null;
                self.cesion_nov.camposmodificacion = null;
                self.cesion_nov.camposmodificados = null;
                self.cesion_nov.cedente = parseInt(
                    response_ced.data[0].Id
                );
                self.cesion_nov.cesionario = parseInt(
                    response_ces.data[0].Id
                );
                self.cesion_nov.contrato =
                    self.contrato_obj.numero_contrato;
                self.cesion_nov.fechaadicion = "0001-01-01T00:00:00Z";
                self.cesion_nov.fechacesion = new Date(self.f_cesion);
                self.cesion_nov.fechafinefectiva = self.calcularFechaFin();
                self.cesion_nov.fechaliquidacion = "0001-01-01T00:00:00Z";
                self.cesion_nov.fechaprorroga = "0001-01-01T00:00:00Z";
                self.cesion_nov.fechareinicio = "0001-01-01T00:00:00Z";
                self.cesion_nov.fechasolicitud = new Date();
                self.cesion_nov.fechasuspension = "0001-01-01T00:00:00Z";
                self.cesion_nov.fechaterminacionanticipada =
                    "0001-01-01T00:00:00Z";
                self.cesion_nov.motivo = "";
                self.cesion_nov.numeroactaentrega = 0;
                self.cesion_nov.numerocdp = "";
                self.cesion_nov.numerooficioestadocuentas =
                    self.num_oficio;
                self.cesion_nov.numerosolicitud = self.n_solicitud;
                self.cesion_nov.observacion = self.observaciones;
                self.cesion_nov.periodosuspension = 0;
                self.cesion_nov.plazoactual = 0;
                self.cesion_nov.poliza = "";
                self.cesion_nov.tiempoprorroga = 0;
                self.cesion_nov.tiponovedad =
                    nc_response.data[0].CodigoAbreviacion;
                self.cesion_nov.valoradicion = 0;
                self.cesion_nov.valorfinalcontrato = 0;
                self.cesion_nov.vigencia = String(
                    self.contrato_obj.vigencia
                );
                self.cesion_nov.vigenciacdp = "";
                self.cesion_nov.fechaoficio = new Date(self.f_oficio);
                self.cesion_nov.fecharegistro = self.replaceAt(
                    self.contrato_obj.fecha_registro,
                    10,
                    "T"
                );
                self.cesion_nov.estado = self.estadoNovedad;
            }


            novedadesRequest
                .get(
                    "novedades_poscontractuales/?query=Estado:4518&limit=0"
                ).then(function (response) {
                    console.log(response);
                    for (var i = 0; i < response.data.length; i++) {

                        console.log(response.data[i]);
                        if (
                            response.data[i].Id !=
                            undefined
                        ) {
                            $scope.novedadesTabla.push({
                                id: response.data[i].Id,
                                tipoNovedad: response.data[i].TipoNovedad,
                                fecha: response.data[i].FechaCreacion,
                                estado: response.data[i].Estado,
                            });
                        }
                    }
                    console.log($scope.novedadesTabla);
                });

            if (self.rolActual == 'CONTRATISTA') {
                agoraRequest.get(
                    "informacion_proveedor?query=NumDocumento:" + token_service.getPayload().documento
                ).then(function (responeIp) {
                    agoraRequest.get(
                        "contrato_general?query=Contratista:" + responeIp.data[0].Id
                    ).then(function (responseCg) {
                        if (responseCg.data !== undefined) {
                            self.contrato_id = responseCg.data[responeIp.data.length - 1].ContratoSuscrito[0].NumeroContratoSuscrito;
                            self.contrato_vigencia = responseCg.data[responeIp.data.length - 1].ContratoSuscrito[0].Vigencia;
                            self.buscar_contrato();
                        } else {
                            swal(
                                $translate.instant("El usuario no tiene un contrato activo!"),
                                $translate.instant(""),
                                "error"
                            );
                            window.location.href = "#/";
                        }
                    });
                });
            }
        });
