'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalActaTerminacionLiquidacionBilateralCtrl
 * @description
 * # SeguimientoycontrolLegalActaTerminacionLiquidacionBilateralCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('SeguimientoycontrolLegalActaTerminacionLiquidacionBilateralCtrl',
        function (
            $location,
            token_service,
            adminMidRequest,
            $scope,
            $routeParams,
            $translate,
            agoraRequest,
            coreAmazonRequest,
            novedadesMidRequest,
            amazonAdministrativaRequest,
            financieraJbpmRequest,
            novedadesRequest,
            cumplidosMidRequest,
            pdfMakerService
        ) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            var self = this;
            self.novedades = [];
            self.estadoNovedad = "";
            self.f_hoy = new Date();
            self.fecha_inicio = "";
            self.motivo = "";
            self.estado_suspendido = "{}";
            self.contrato_id = $routeParams.contrato_id;
            self.contrato_vigencia = $routeParams.contrato_vigencia;
            self.plazoDias = false;
            self.plazoMeses = "";
            self.contrato_obj = {};
            self.contrato_obj_replica = {};
            self.a_favor = {};
            self.numero_solicitud = "";
            self.numero_oficio_supervisor = "";
            self.numero_oficio_ordenador = "";
            self.fecha_oficioO = new Date();
            self.fecha_oficioS = new Date();
            self.valor_desembolsado = '';
            self.saldo_contratista = '';
            self.saldo_universidad = '';
            self.fecha_solicitud = new Date();
            self.fecha_terminacion_anticipada = new Date();
            self.fecha_efectos_legales = new Date();
            self.f_certificacion = new Date();
            self.estados = [];
            self.f_expedicion_acta = new Date();
            self.estadoNovedad = "";
            self.idRegistro = "";
            self.elaboro = '';
            self.elaboro_cedula = token_service.getPayload().documento;
            self.nueva_clausula_text = "";
            self.tamanoFuente = 10;
            self.rp_numero = 0;
            self.cdp_numero = 0;

            // const solic_input = document.getElementById("numero_solicitud");
            // solic_input.addEventListener("input", function () {
            //     if (this.value.length > 7) {
            //         this.value = this.value.slice(0, 7);
            //     }
            // });

            // const oficio_input = document.getElementById("numero_oficio_supervisor");
            // oficio_input.addEventListener("input", function () {
            //     if (this.value.length > 7) {
            //         this.value = this.value.slice(0, 7);
            //     }
            // });

            const desembolsado_input = document.getElementById("valor_desembolsado");
            desembolsado_input.addEventListener("input", function () {
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            });

            const saldocon_input = document.getElementById("saldo_contratista");
            saldocon_input.addEventListener("input", function () {
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            });

            const saldouni_input = document.getElementById("saldo_universidad");
            saldouni_input.addEventListener("input", function () {
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            });

            financieraJbpmRequest
                .get("cdp_vigencia/" + self.contrato_vigencia + "/" + self.contrato_id)
                .then(function (response) {
                    var data = response.data.cdps_vigencia.cdp_vigencia;
                    // console.log(data);
                    if (data != undefined && data[0].id_numero_solicitud != null) {
                        self.numero_solicitud = data[0].id_numero_solicitud;
                    }
                });

            agoraRequest.get('estado_contrato?query=NombreEstado:Suspendido').then(function (ec_response) {
                self.estados[1] = ec_response.data[0];
            });
            agoraRequest.get('informacion_persona_natural?query=Id:' + self.elaboro_cedula).then(function (ipn_response) {
                self.elaboro = ipn_response.data[0].PrimerNombre + ' ' + ipn_response.data[0].SegundoNombre + ' ' + ipn_response.data[0].PrimerApellido + ' ' + ipn_response.data[0].SegundoApellido
            });


            agoraRequest.get('contrato_general/?query=ContratoSuscrito.NumeroContratoSuscrito:' + self.contrato_id + ',VigenciaContrato:' + self.contrato_vigencia).then(function (agora_response) {
                if (agora_response.data.length > 0) {
                    self.contrato_obj.numero_contrato = self.contrato_id;
                    self.contrato_obj.id = agora_response.data[0].ContratoSuscrito[0].NumeroContrato.Id;
                    self.contrato_obj.valor = String(agora_response.data[0].ValorContrato);
                    self.contrato_obj.objeto = agora_response.data[0].ObjetoContrato;
                    self.contrato_obj.fecha_registro = agora_response.data[0].FechaRegistro;
                    self.contrato_obj.ordenadorGasto_id = agora_response.data[0].OrdenadorGasto;
                    self.contrato_obj.plazo = agora_response.data[0].PlazoEjecucion;
                    if (self.contrato_obj.plazo > 12) {
                        self.plazoDias = true;
                    }
                    self.plazoMeses = self.calculoPlazoLetras(self.contrato_obj.plazo);
                    self.contrato_obj.vigencia = self.contrato_vigencia;
                    self.contrato_obj.supervisor_cedula = agora_response.data[0].Supervisor.Documento;
                    self.contrato_obj.supervisor_rol = agora_response.data[0].Supervisor.Cargo;
                    self.contrato_obj.contratista = agora_response.data[0].Contratista;
                    self.contrato_obj.fecha_suscripcion = self.getFechaUTC(agora_response.data[0].ContratoSuscrito[0].FechaSuscripcion);
                    self.contrato_obj.tipo_contrato = agora_response.data[0].TipoContrato.TipoContrato;
                    self.contrato_obj.DependenciaSupervisor = agora_response.data[0].Supervisor.DependenciaSupervisor;
                    self.unidadEjecutora = agora_response.data[0].UnidadEjecutora;
                    //Se obtiene los datos de Acta de Inicio.
                    agoraRequest.get('acta_inicio?query=NumeroContrato:' + self.contrato_obj.id).then(function (acta_response) {
                        self.contrato_obj.FechaInicio = self.getFechaUTC(acta_response.data[0].FechaInicio);
                        self.contrato_obj.FechaFin = self.getFechaUTC(acta_response.data[0].FechaFin);

                        self.fecha_terminacion_anticipada = new Date(self.contrato_obj.FechaFin);
                        self.fecha_lim_inf = new Date(self.contrato_obj.FechaInicio);
                        self.fecha_lim_inf.setDate(self.fecha_lim_inf.getDate() + 1);
                        self.fecha_lim_sup = self.calcularFechaFin();
                    });

                    //Obtención de datos del ordenador del gasto
                    agoraRequest.get('ordenadores?query=IdOrdenador:' + self.contrato_obj.ordenadorGasto_id + '&sortby=FechaFin&order=desc&limit=1').then(function (og_response_id) {
                        const rolOrdenador = og_response_id.data[0].RolOrdenador;
                        agoraRequest.get(
                            "ordenadores?query=RolOrdenador:" + rolOrdenador + "&sortby=FechaInicio&order=desc&limit=1"
                        ).then(function (og_response) {
                            self.contrato_obj.ordenadorGasto_nombre = og_response.data[0].NombreOrdenador;
                            self.contrato_obj.ordenadorGasto_rol = og_response.data[0].RolOrdenador;
                            self.contrato_obj.ordenador_gasto_documento = og_response.data[0].Documento;
                            self.contrato_obj.ordenador_gasto_resolucion = og_response.data[0].InfoResolucion;
                            agoraRequest.get('informacion_persona_natural?query=Id:' + self.contrato_obj.ordenador_gasto_documento).then(function (ipn_response) {
                                self.contrato_obj.ordenador_gasto_tipo_documento = ipn_response.data[0].TipoDocumento.ValorParametro;
                                coreAmazonRequest.get('ciudad', 'query=Id:' + ipn_response.data[0].IdCiudadExpedicionDocumento).then(function (sc_response) {
                                    self.contrato_obj.ordenador_gasto_ciudad_documento = sc_response.data[0].Nombre;
                                });
                            });
                        });
                    }).catch(function (error) {
                        //Servidor no disponible
                        swal({
                            title: $translate.instant('TITULO_ERROR_LEGAL'),
                            type: 'error',
                            html: "Error al consultar datos de ordenadores del contrato " + self.contrato_obj.numero_contrato +
                                $translate.instant('ANIO') + self.contrato_obj.vigencia + '.' + error,
                            showCloseButton: true,
                            showCancelButton: false,
                            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                            allowOutsideClick: false
                        });
                    });

                    financieraJbpmRequest
                        .get(
                              "cdprptercerocontrato/" +
                              self.contrato_vigencia + "/" +
                              self.contrato_id + "/0" + self.unidadEjecutora + "/12"
                            )
                            .then(function (financiera_response) {
                              if (financiera_response.data.cdp_rp_tercero.cdp_rp != undefined) {
                                self.cdprp = financiera_response.data.cdp_rp_tercero.cdp_rp;
                                self.contrato_obj.rp_numero = self.cdprp[self.cdprp.length - 1].rp;
                                self.contrato_obj.cdp_numero = self.cdprp[self.cdprp.length - 1].cdp;
                                self.rp_numero = self.contrato_obj.rp_numero;
                                self.cdp_numero = self.contrato_obj.cdp_numero;
                              }
                            });

                    //Obtención de datos del supervisor.
                    amazonAdministrativaRequest
                        .get(
                            "supervisor_contrato?query=DependenciaSupervisor:" +
                            self.contrato_obj.DependenciaSupervisor + "&sortby=FechaInicio&order=desc&limit=1")
                        .then(function (scd_response) {
                            self.contrato_obj.supervisor_cedula =
                                scd_response.data[0].Documento;
                            amazonAdministrativaRequest
                                .get(
                                    "informacion_persona_natural?query=Id:" +
                                    self.contrato_obj.supervisor_cedula
                                )
                                .then(function (ispn_response) {
                                    coreAmazonRequest
                                        .get(
                                            "ciudad",
                                            "query=Id:" +
                                            ispn_response.data[0].IdCiudadExpedicionDocumento
                                        )
                                        .then(function (sc_response) {
                                            self.contrato_obj.supervisor_ciudad_documento =
                                                sc_response.data[0].Nombre;
                                            self.contrato_obj.supervisor_tipo_documento =
                                                ispn_response.data[0].TipoDocumento.ValorParametro;
                                            self.contrato_obj.supervisor_nombre_completo =
                                                ispn_response.data[0].PrimerNombre +
                                                " " +
                                                ispn_response.data[0].SegundoNombre +
                                                " " +
                                                ispn_response.data[0].PrimerApellido +
                                                " " +
                                                ispn_response.data[0].SegundoApellido;
                                        });
                                });

                        }).catch(function (error) {
                            //Servidor no disponible
                            swal({
                                title: $translate.instant('TITULO_ERROR_LEGAL'),
                                type: 'error',
                                html: "Error al consultar datos del supervisor del contrato " + self.contrato_obj.numero_contrato +
                                    $translate.instant('ANIO') + self.contrato_obj.vigencia + '.' + error,
                                showCloseButton: true,
                                showCancelButton: false,
                                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                allowOutsideClick: false
                            });
                        });;

                    //Obtención de datos del jefe de Oficina de Contratación
                    agoraRequest.get('supervisor_contrato?query=DependenciaSupervisor:DEP636&sortby=FechaFin&order=desc&limit=1').then(function (jj_response) {
                        self.contrato_obj.jefe_juridica_documento = jj_response.data[0].Documento;
                        agoraRequest.get('informacion_persona_natural?query=Id:' + self.contrato_obj.jefe_juridica_documento).then(function (ijpn_response) {
                            coreAmazonRequest.get('ciudad', 'query=Id:' + ijpn_response.data[0].IdCiudadExpedicionDocumento).then(function (scj_response) {
                                self.contrato_obj.jefe_juridica_ciudad_documento = scj_response.data[0].Nombre;
                                self.contrato_obj.jefe_juridica_tipo_documento = ijpn_response.data[0].TipoDocumento.ValorParametro;
                                self.contrato_obj.jefe_juridica_nombre_completo = ijpn_response.data[0].PrimerNombre + " " + ijpn_response.data[0].SegundoNombre + " " + ijpn_response.data[0].PrimerApellido + " " + ijpn_response.data[0].SegundoApellido;
                            });
                        });
                    }).catch(function (error) {
                        //Servidor no disponible
                        swal({
                            title: $translate.instant('TITULO_ERROR_LEGAL'),
                            type: 'error',
                            html: "Error al consultar datos de ordenadores del contrato " + self.contrato_obj.numero_contrato +
                                $translate.instant('ANIO') + self.contrato_obj.vigencia + '.' + error,
                            showCloseButton: true,
                            showCancelButton: false,
                            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                            allowOutsideClick: false
                        });
                    });

                    novedadesMidRequest.get('novedad', self.contrato_obj.numero_contrato + "/" + self.contrato_obj.vigencia).then(function (response_sql) {
                        self.novedades = response_sql.data.Body;
                        self.fecha_lim_sup = self.calcularFechaFin();
                        if (self.novedades.length != '0') {
                            var last_cesion = self.novedades[self.novedades.length - 1];
                            self.contrato_obj.contratista = last_cesion.Cesionario;
                            agoraRequest.get('informacion_proveedor?query=Id:' + self.contrato_obj.contratista).then(function (ip_response) {
                                self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                                self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                                agoraRequest.get('informacion_persona_natural?query=Id:' + self.contrato_obj.contratista_documento).then(function (ipn_response) {
                                    coreAmazonRequest.get('ciudad', 'query=Id:' + ipn_response.data[0].IdCiudadExpedicionDocumento).then(function (c_response) {
                                        self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                                        self.contrato_obj.contratista_tipo_documento = ipn_response.data[0].TipoDocumento.ValorParametro;
                                    });
                                });
                                //consulta el CDP y RP
                                financieraJbpmRequest
                                  .get(
                                      "cdprptercerocontrato/" +
                                      self.contrato_vigencia + "/" +
                                      self.contrato_id
                                  )
                                  .then(function (financiera_response) {
                                      if (financiera_response.data.cdp_rp_tercero.cdp_rp != undefined) {
                                          var cdprp = financiera_response.data.cdp_rp_tercero.cdp_rp;
                                          self.contrato_obj.rp_fecha = cdprp[cdprp.length - 1].vigencia;
                                          self.contrato_obj.rp_numero = cdprp[cdprp.length - 1].rp;
                                          self.contrato_obj.cdp_numero = cdprp[cdprp.length - 1].cdp;
                                          self.rp_numero = self.contrato_obj.rp_numero;
                                          self.cdp_numero = self.contrato_obj.cdp_numero;
                                      }
                                  });
                            });
                            var adiciones = 0;
                            for (var i = 0; i < self.novedades.length; i++) {
                                if (self.novedades[i].TipoNovedad == 6 || self.novedades[i].TipoNovedad == 8) {
                                    adiciones += parseInt(self.novedades[i].ValorAdicion);
                                }
                            }
                            self.contrato_obj.valor = parseInt(self.contrato_obj.valor) + adiciones;
                        } else {
                            //Obtiene los datos aosicados al proveedor de un contrato que no tiene novedades
                            agoraRequest.get('informacion_proveedor?query=Id:' + self.contrato_obj.contratista).then(function (ip_response) {
                                self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                                self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                                //Se obtienen datos relacionados al contrastista.
                                agoraRequest.get('informacion_persona_natural?query=Id:' + self.contrato_obj.contratista_documento).then(function (ipn_response) {
                                    coreAmazonRequest.get('ciudad', 'query=Id:' + ipn_response.data[0].IdCiudadExpedicionDocumento).then(function (c_response) {
                                        self.contrato_obj.contratista_tipo_documento = ipn_response.data[0].TipoDocumento.ValorParametro;
                                        self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                                    });
                                });
                                //consulta el CDP y RP
                                financieraJbpmRequest
                                  .get(
                                      "cdprptercerocontrato/" +
                                      self.contrato_vigencia + "/" +
                                      self.contrato_id
                                  )
                                  .then(function (financiera_response) {
                                      if (financiera_response.data.cdp_rp_tercero.cdp_rp != undefined) {
                                          var cdprp = financiera_response.data.cdp_rp_tercero.cdp_rp;
                                          self.contrato_obj.rp_fecha = cdprp[cdprp.length - 1].vigencia;
                                          self.contrato_obj.rp_numero = cdprp[cdprp.length - 1].rp;
                                          self.contrato_obj.cdp_numero = cdprp[cdprp.length - 1].cdp;
                                          self.rp_numero = self.contrato_obj.rp_numero;
                                          self.cdp_numero = self.contrato_obj.cdp_numero;
                                      }
                                  });
                            });
                        }
                    }).catch(function (error) {
                        //Servidor no disponible
                        swal({
                            title: $translate.instant('TITULO_ERROR_LEGAL'),
                            type: 'error',
                            html: "Error al consultar datos de novedades del contrato " + self.contrato_obj.numero_contrato +
                                $translate.instant('ANIO') + self.contrato_obj.vigencia + '.' + error,
                            showCloseButton: true,
                            showCancelButton: false,
                            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                            allowOutsideClick: false
                        });
                    });

                }
            }).catch(function (error) {
                //Servidor no disponible
                swal({
                    title: $translate.instant('TITULO_ERROR_ACTA'),
                    type: 'error',
                    html: "Error al consultar datos del contrato (contrato_general) # " + self.contrato_obj.numero_contrato +
                        $translate.instant('ANIO') + self.contrato_obj.vigencia + '.' + error,
                    showCloseButton: true,
                    showCancelButton: false,
                    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                    allowOutsideClick: false
                }).then(function () { });
            });

            /**
                 * @ngdoc method
                 * @name calculoTiempo
                 * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaTerminacionLiquidacionBilateralCtrl
                 * @description
                 * Funcion que observa y controla el cambio de fechas
                 * @param {date} Fecha de terminación anticipada
                 */
            // $scope.$watch("sLactaTerminacionAnticipada.fecha_solicitud", function () {
            //     if (self.fecha_solicitud.getDate() == 31) {
            //         swal(
            //             $translate.instant("TITULO_ADVERTENCIA"),
            //             $translate.instant("DESCRIPCION_ERROR_FECHA_31"),
            //             "error"
            //         );
            //         var fecha = new Date(self.fecha_solicitud);
            //         fecha.setDate(self.fecha_solicitud.getDate() + 1);
            //         self.fecha_solicitud = fecha;
            //     }
            // });

            // $scope.$watch("sLactaTerminacionAnticipada.fecha_terminacion_anticipada", function () {
            //     if (self.fecha_terminacion_anticipada.getDate() == 31) {
            //         swal(
            //             $translate.instant("TITULO_ADVERTENCIA"),
            //             $translate.instant("DESCRIPCION_ERROR_FECHA_31"),
            //             "error"
            //         );
            //         var fecha = new Date(self.fecha_terminacion_anticipada);
            //         fecha.setDate(self.fecha_terminacion_anticipada.getDate() + 1);
            //         self.fecha_terminacion_anticipada = fecha;
            //     }
            // });

            /**
             * @ngdoc method
             * @name formato_valores_terminacion
             * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaTerminacionLiquidacionBilateralCtrl
             * @description
             * funcion para modificar el formato de valores para la interfaz
             */
            $scope.formato_valores_terminacion = function (evento, num) {
                var valor = evento.target.value.replace(/[^0-9\.]/g, "");
                var valor_valido = parseInt(self.contrato_obj.valor);
                if (num == 1) {
                    if (valor <= valor_valido) {
                        self.valor_desembolsado = numberFormat(valor);
                    } else {
                        self.valor_desembolsado = undefined;
                        swal(
                            $translate.instant("TITULO_ADVERTENCIA"),
                            "El valor desembolsado no puede ser mayor al valor del contrato",
                            "info"
                        );
                    }
                } else if (num == 2) {
                    if (valor <= valor_valido) {
                        self.saldo_contratista = numberFormat(valor);
                    } else {
                        self.saldo_contratista = undefined;
                        swal(
                            $translate.instant("TITULO_ADVERTENCIA"),
                            "El saldo a favor del contratista no puede ser mayor al valor del contrato",
                            "info"
                        );
                    }
                } else if (num == 3) {
                    if (valor <= valor_valido) {
                        self.saldo_universidad = numberFormat(valor);
                    } else {
                        self.saldo_universidad = undefined;
                        swal(
                            $translate.instant("TITULO_ADVERTENCIA"),
                            "El saldo a favor de la Universidad no puede ser mayor al valor del contrato",
                            "info"
                        );
                    }
                }
            };

            // $scope.check_saldo = function () {
            //     if (self.a_favor_de == "Universidad") {
            //         $(".universidad_check").show("fast");
            //         if ($(".contratista_check").is(":visible")) {
            //             $(".contratista_check").hide("fast");
            //             self.saldo_contratista = 0;
            //         }
            //     } else if (self.a_favor_de = "Contratista") {
            //         $(".contratista_check").show("fast");
            //         if ($(".universidad_check").is(":visible")) {
            //             $(".universidad_check").hide("fast");
            //             self.saldo_universidad = 0;
            //         }
            //     }
            // }

            // seleccionador de beneficiario de saldo
            self.selecionarSaldo = function () {
                if (self.saldo_contratista == 0) {
                    // self.a_favor.entidad = "la Universidad Distrital.";
                    self.a_favor.valor = self.terminacion_nov.saldo_universidad;
                    self.a_favor.existe = "no existe un saldo a favor de este.";
                } else {
                    // self.a_favor.entidad = "el Contratista.";
                    self.a_favor.valor = parseFloat(self.saldo_contratista.replace(/\,/g, "")) + parseFloat(self.saldo_universidad.replace(/\,/g, ""));
                    self.a_favor.existe = ' queda un saldo pendiente a su favor, por la suma de ' +
                        numeroALetras(self.terminacion_nov.saldo_contratista, {
                            plural: $translate.instant("PESOS"),
                            singular: $translate.instant("PESO"),
                            centPlural: $translate.instant("CENTAVOS"),
                            centSingular: $translate.instant("CENTAVO"),
                        }) + " MONEDA CORRIENTE ($" +
                        numberFormat(String(self.terminacion_nov.saldo_contratista) + ' M/Cte.)');
                }
            }

            self.calculoPlazoLetras = function (plazo) {
                if (self.plazoDias) {
                    var plazo_meses = plazo / 30;
                    var res = String(plazo_meses).split(".");
                    var cantidad_meses = res[0];
                    var decimal_cantidad_dias = "0." + res[1];
                    var cantidad_dias = Math.ceil(parseFloat(decimal_cantidad_dias) / 0.03333333333336);
                    var cantidad_meses_letras = numeroALetras(cantidad_meses, {
                        plural: $translate.instant("("),
                        singular: $translate.instant("("),
                    });
                    var cantidad_dias_letras = numeroALetras(cantidad_dias, {
                        plural: $translate.instant("("),
                        singular: $translate.instant("("),
                    });
                    var texto = "";
                    if (cantidad_dias == 0) {
                        texto =
                            cantidad_meses_letras +
                            cantidad_meses +
                            " ) " +
                            $translate.instant("MENSAJE_MESES");
                    } else {
                        texto =
                            cantidad_meses_letras +
                            cantidad_meses +
                            " ) " +
                            $translate.instant("MENSAJE_MESES") +
                            " Y " +
                            cantidad_dias_letras +
                            cantidad_dias +
                            " ) " +
                            $translate.instant("DIAS");
                    }
                    return texto;

                } else {
                    var cantidad_meses_letras = numeroALetras(plazo, {
                        plural: $translate.instant("("),
                        singular: $translate.instant("("),
                    });
                    var texto =
                        cantidad_meses_letras +
                        plazo +
                        " ) " +
                        $translate.instant("MENSAJE_MESES");
                    return texto;
                }
            }

            /**
             * @ngdoc method
             * @name postNovedad
             * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaSuspensionCtrl
             * @description
             * funcion que realiza la inserción de los datos de la novedad
             * enviando la petición POST al MID de Novedades
             */
            self.postNovedad = function (nuevoEstado, output, dateTime, enlaceDoc) {
                self.terminacion_nov.enlace = enlaceDoc;
                novedadesMidRequest.post('validarCambioEstado', self.estados).then(function (vc_response) {
                    if (vc_response.data.Body == "true") {
                        if (self.terminacion_nov.estado == "ENTR") {
                            novedadesMidRequest
                                .post('novedad', self.terminacion_nov)
                                .then(function (response_nosql) {
                                    if (response_nosql.status == 200 || response.statusText == "Ok") {
                                        pdfMake
                                            .createPdf(output)
                                            .download(
                                                "acta_terminacion_anticipada_" +
                                                self.contrato_id +
                                                "_" +
                                                dateTime +
                                                ".pdf"
                                            );
                                        $scope.alert = 'DESCRIPCION_TERMINACION'
                                        swal({
                                            title: $translate.instant('TITULO_BUEN_TRABAJO'),
                                            type: 'success',
                                            html: $translate.instant($scope.alert) + self.contrato_obj.numero_contrato + $translate.instant('ANIO') + self.contrato_obj.vigencia + '.',
                                            showCloseButton: false,
                                            showCancelButton: false,
                                            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                            allowOutsideClick: false
                                        }).then(function () {
                                            window.location.href = "#/seguimientoycontrol/legal";
                                        });
                                    } else {
                                        //respuesta incorrecta, ej: 400/500
                                        $scope.alert = 'DESCRIPCION_ERROR_TERMINACION';
                                        swal({
                                            title: $translate.instant('TITULO_ERROR_ACTA'),
                                            type: 'error',
                                            html: $translate.instant($scope.alert) + self.contrato_obj.numero_contrato +
                                                $translate.instant('ANIO') + self.contrato_obj.vigencia + '.',
                                            showCloseButton: true,
                                            showCancelButton: false,
                                            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                            allowOutsideClick: false
                                        }).then(function () {

                                        });
                                    }
                                });
                        } else {
                            novedadesMidRequest
                                .post('novedad', self.terminacion_nov)
                                .then(function (response_nosql) {
                                    if (response_nosql.status == 200 || response_nosql.statusText == "Ok") {
                                        var idNovedad = response_nosql.data.Body.NovedadPoscontractual.Id;
                                        self.contrato_obj_replica.esFechaActual = true;
                                        novedadesMidRequest
                                            .post("replica", self.contrato_obj_replica)
                                            .then(function (request_novedades) {
                                                if (
                                                    request_novedades.status == 200 ||
                                                    request_novedades.statusText == "OK"
                                                ) {
                                                    agoraRequest.post('contrato_estado', nuevoEstado).then(function (response) {
                                                        if (response.status == 201 || Object.keys(response.data) > 0) {
                                                            pdfMake
                                                                .createPdf(output)
                                                                .download(
                                                                    "acta_terminacion_anticipada_" +
                                                                    self.contrato_id +
                                                                    "_" +
                                                                    dateTime +
                                                                    ".pdf"
                                                                );
                                                            $scope.alert = 'DESCRIPCION_TERMINACION'
                                                            swal({
                                                                title: $translate.instant('TITULO_BUEN_TRABAJO'),
                                                                type: 'success',
                                                                html: $translate.instant($scope.alert) + self.contrato_obj.numero_contrato + $translate.instant('ANIO') + self.contrato_obj.vigencia + '.',
                                                                showCloseButton: false,
                                                                showCancelButton: false,
                                                                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                                                allowOutsideClick: false
                                                            }).then(function () {
                                                                window.location.href = "#/seguimientoycontrol/legal";
                                                            });
                                                        }
                                                    }).catch(function (error) {
                                                        //Servidor no disponible
                                                        $scope.alert = 'DESCRIPCION_ERROR_TERMINACION';
                                                        swal({
                                                            title: $translate.instant('TITULO_ERROR_ACTA'),
                                                            type: 'error',
                                                            html: "Error al cambiar el estado de la novedad del contrato # " + self.contrato_obj.numero_contrato +
                                                                $translate.instant('ANIO') + self.contrato_obj.vigencia + '.' + error,
                                                            showCloseButton: true,
                                                            showCancelButton: false,
                                                            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                                            allowOutsideClick: false
                                                        }).then(function () { });
                                                    });
                                                } else {
                                                    self.desactivarNovedad(idNovedad);
                                                    $scope.alert = "TITULO_ERROR_REPLICA";
                                                    swal({
                                                        title: $translate.instant("TITULO_ERROR_ACTA"),
                                                        type: "error",
                                                        html: $translate.instant($scope.alert) +
                                                            self.contrato_obj.numero_contrato +
                                                            $translate.instant("ANIO") +
                                                            self.contrato_obj.vigencia +
                                                            ".",
                                                        showCloseButton: true,
                                                        showCancelButton: false,
                                                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                                        allowOutsideClick: false,
                                                    }).then(function () { });
                                                }
                                            }).catch(function (error) {
                                                //Error en la replica
                                                self.desactivarNovedad(idNovedad);
                                                const errMsg = error.data.Body[1].err.err;
                                                $scope.alert = "TITULO_ERROR_REPLICA";
                                                swal({
                                                    title: $translate.instant("TITULO_ERROR_ACTA"),
                                                    type: "error",
                                                    html: $translate.instant($scope.alert) +
                                                        self.contrato_obj.numero_contrato +
                                                        $translate.instant("ANIO") +
                                                        self.contrato_obj.vigencia +
                                                        ": '" + errMsg + "'.",
                                                    showCloseButton: true,
                                                    showCancelButton: false,
                                                    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                                    allowOutsideClick: false,
                                                });
                                            });
                                    } else {
                                        //respuesta incorrecta, ej: 400/500
                                        $scope.alert = 'DESCRIPCION_ERROR_TERMINACION';
                                        swal({
                                            title: $translate.instant('TITULO_ERROR_ACTA'),
                                            type: 'error',
                                            html: $translate.instant($scope.alert) + self.contrato_obj.numero_contrato +
                                                $translate.instant('ANIO') + self.contrato_obj.vigencia + '.',
                                            showCloseButton: true,
                                            showCancelButton: false,
                                            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                            allowOutsideClick: false
                                        }).then(function () {

                                        });
                                    }
                                }).catch(function (error) {
                                    //Servidor no disponible
                                    $scope.alert = 'DESCRIPCION_ERROR_TERMINACION';
                                    swal({
                                        title: $translate.instant('TITULO_ERROR_ACTA'),
                                        type: 'error',
                                        html: $translate.instant($scope.alert) + self.contrato_obj.numero_contrato +
                                            $translate.instant('ANIO') + self.contrato_obj.vigencia + '.' + error,
                                        showCloseButton: true,
                                        showCancelButton: false,
                                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                        allowOutsideClick: false
                                    }).then(function () { });
                                });
                        }
                    }
                });
            }

            self.desactivarNovedad = function (idNovedad) {
                novedadesRequest.get('novedades_poscontractuales/' + idNovedad).then(function (res) {
                    var struct = {};
                    if (res.status == 200 || res.statusText == "Ok") {
                        const fechaC = new Date(res.data.FechaCreacion);
                        fechaC.setHours(12, 0, 0, 0, 0);
                        const añoC = fechaC.getFullYear();
                        const mesC = (fechaC.getMonth() + 1).toString().padStart(2, '0');
                        const diaC = fechaC.getDate().toString().padStart(2, '0');

                        const formattedFechaCreacion = añoC + '-' + mesC + '-' + diaC + 'T12:00:00Z';

                        const fechaM = new Date(res.data.FechaModificacion);
                        fechaM.setHours(12, 0, 0, 0, 0);
                        const añoM = fechaM.getFullYear();
                        const mesM = (fechaM.getMonth() + 1).toString().padStart(2, '0');
                        const diaM = fechaM.getDate().toString().padStart(2, '0');

                        const formattedFechaMod = añoM + '-' + mesM + '-' + diaM + 'T12:00:00Z';

                        const motivo = "Error en la réplica";
                        struct = res.data;
                        struct.FechaCreacion = formattedFechaCreacion;
                        struct.FechaModificacion = formattedFechaMod;
                        struct.Motivo = motivo;
                        struct.Activo = false;
                        novedadesRequest.put('novedades_poscontractuales', idNovedad, struct).then(function (resPut) {
                            if (resPut.status != 200) {
                                $scope.alert = "El registro fue realizado de manera incompleta";
                                swal({
                                    title: "Error al desactivar la novedad!",
                                    type: "error",
                                    html: $translate.instant($scope.alert),
                                    showCloseButton: true,
                                    showCancelButton: false,
                                    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                    allowOutsideClick: false,
                                }).then(function () { });
                            }
                        }).catch(function () {
                            $scope.alert = "El registro fue realizado de manera incompleta";
                            swal({
                                title: "Error al desactivar la novedad!",
                                type: "error",
                                html: $translate.instant($scope.alert),
                                showCloseButton: true,
                                showCancelButton: false,
                                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                allowOutsideClick: false,
                            }).then(function () { });
                        });
                    }
                });
            }

            self.verDocumento = function () {
                var docDefinition = self.get_plantilla();
                const pdfDocGenerator = pdfMake.createPdf(docDefinition);
                pdfDocGenerator.open({
                    title: 'PDF creado con PDFMake',
                    width: 600,
                    height: 400,
                    closeBehavior: 'remove',
                });
            }

            /**
             * @ngdoc method
             * @name generarActa
             * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaTerminacionLiquidacionBilateralCtrl
             * @description
             * funcion que valida la data de la novedad
             */
            self.generarActa = function () {
                var nuevoEstado = {
                    "Estado": {
                        "Id": 8
                    },
                    "NumeroContrato": self.contrato_obj.id.toString(),
                    "Usuario": token_service.getPayload().documento_compuesto,
                    "Vigencia": parseInt(self.contrato_vigencia),
                    "FechaRegistro": new Date()
                };
                // var fechaActual = new Date();
                // if (
                //     (fechaActual.getDate() == self.fecha_terminacion_anticipada.getDate()
                //         && fechaActual.getMonth() == self.fecha_terminacion_anticipada.getMonth()
                //         && fechaActual.getFullYear() == self.fecha_terminacion_anticipada.getFullYear())
                //     || fechaActual > self.fecha_terminacion_anticipada
                // ) {
                //     self.estadoNovedad = "TERM";
                // } else {
                //     self.estadoNovedad = "ENTR";
                // }
                self.estadoNovedad = "TERM";

                if ($scope.formTerminacion.$valid) {
                    novedadesRequest.get('tipo_novedad', 'query=Nombre:Terminación Anticipada').then(function (nc_response) {
                        self.fecha_terminacion_anticipada.setHours(12, 0, 0, 0);
                        self.f_expedicion_acta.setHours(12, 0, 0, 0);
                        self.fecha_oficioS.setHours(12, 0, 0, 0);
                        self.fecha_oficioO.setHours(12, 0, 0, 0);
                        self.fecha_solicitud.setHours(12, 0, 0, 0);
                        self.f_hoy.setHours(12, 0, 0, 0);
                        var f_terminacion_post = new Date(self.fecha_terminacion_anticipada);
                        if (f_terminacion_post.getDate() == 31) {
                            f_terminacion_post.setDate(f_terminacion_post.getDate() + 1);
                        }
                        self.terminacion_nov = {};
                        self.terminacion_nov.contrato = self.contrato_obj.numero_contrato;
                        self.terminacion_nov.vigencia = String(self.contrato_obj.vigencia);
                        self.terminacion_nov.cesionario = parseInt(self.contrato_obj.contratista);
                        self.terminacion_nov.motivo = self.motivo;
                        self.terminacion_nov.tiponovedad = nc_response.data[0].CodigoAbreviacion;
                        self.terminacion_nov.fecharegistro = self.f_hoy;
                        self.terminacion_nov.numerosolicitud = self.numero_solicitud;
                        self.terminacion_nov.fechasolicitud = self.fecha_solicitud;
                        self.terminacion_nov.fechaexpedicion = self.f_expedicion_acta;
                        if (self.numero_oficio_supervisor == "") {
                            self.terminacion_nov.numerooficiosupervisor = "n.a.";
                        } else {
                            self.terminacion_nov.numerooficiosupervisor = self.numero_oficio_supervisor;
                        }
                        if (self.numero_oficio_ordenador == "") {
                            self.terminacion_nov.numerooficioordenador = "n.a.";
                        } else {
                            self.terminacion_nov.numerooficioordenador = self.numero_oficio_ordenador;
                        }
                        self.terminacion_nov.fechaoficiosupervisor = self.fecha_oficioS;
                        self.terminacion_nov.fechaoficioordenador = self.fecha_oficioO;
                        self.terminacion_nov.valor_desembolsado = parseFloat(self.valor_desembolsado.replace(/\,/g, ""));
                        self.terminacion_nov.saldo_contratista = parseFloat(self.saldo_contratista.replace(/\,/g, ""));
                        self.terminacion_nov.saldo_universidad = parseFloat(self.saldo_universidad.replace(/\,/g, ""));
                        self.terminacion_nov.fecha_terminacion_anticipada = f_terminacion_post;
                        self.terminacion_nov.fechafinefectiva = f_terminacion_post;
                        self.terminacion_nov.estado = self.estadoNovedad;
                        self.fecha_efectos_legales = new Date(self.fecha_terminacion_anticipada);
                        self.fecha_efectos_legales.setDate(self.fecha_efectos_legales.getDate() + 1);
                        // Recolección datos objeto POST Replica
                        self.contrato_obj_replica.NumeroContrato = self.contrato_obj.numero_contrato;
                        self.contrato_obj_replica.Vigencia = parseInt(self.contrato_obj.vigencia);
                        self.contrato_obj_replica.FechaRegistro = self.f_hoy;
                        self.contrato_obj_replica.FechaInicio = self.contrato_obj.FechaInicio;
                        self.contrato_obj_replica.FechaFin = new Date(self.terminacion_nov.fecha_terminacion_anticipada);
                        self.contrato_obj_replica.Contratista = parseFloat(self.contrato_obj.contratista, 64);
                        self.contrato_obj_replica.PlazoEjecucion = parseInt(self.contrato_obj.plazo);
                        self.contrato_obj_replica.ValorNovedad = parseFloat(self.terminacion_nov.valor_desembolsado);
                        self.contrato_obj_replica.Documento = self.contrato_obj.contratista_documento;
                        self.contrato_obj_replica.NumeroCdp = 0;
                        self.contrato_obj_replica.VigenciaCdp = 0;
                        if (self.terminacion_nov.tiponovedad === "NP_TER") {
                            self.contrato_obj_replica.TipoNovedad = parseFloat(218);
                        };
                        //primero obtenemos el estado actual - en esta caso es 'En ejecucion'
                        //Se guarda en la posicion [0] del arreglo estados el estado actual
                        //Luego se valida si es posible cambiar el estado - en este caso pasar de ejecucion a terminacion anticipada - devuelve si es true o false
                        //si es true guardamos la novedad - y enviamos el cambio de estado del contrato
                        self.selecionarSaldo();
                        agoraRequest.get('contrato_estado?query=NumeroContrato:' + self.contrato_obj.id + ',Vigencia:' + self.contrato_obj.vigencia + '&sortby=Id&order=desc&limit=1').then(function (ce_response) {
                            if (ce_response.data[ce_response.data.length - 1].Estado.NombreEstado == "En ejecucion") {
                                var estado_temp_from = {
                                    "NombreEstado": "ejecucion"
                                }
                                self.estados[0] = estado_temp_from;
                                self.formato_generacion_pdf(nuevoEstado);
                            } else {
                                swal(
                                    $translate.instant('INFORMACION'),
                                    $translate.instant('El contrato no se encuentra en ejecución debido a esto no se puede suspender.'),
                                    'info'
                                ).then(function () {
                                    window.location.href = "#/seguimientoycontrol/legal";
                                });
                            }
                        });
                    });
                } else {
                    swal(
                        $translate.instant('TITULO_ERROR'),
                        $translate.instant('DESCRIPCION_ERROR'),
                        'error'
                    );
                }
            };

            self.calcularFechaFin = function () {

                var fechaFin;
                var fechaFinEfectiva;
                if (self.novedades.length != 0) {
                    fechaFin = self.novedades[self.novedades.length - 1].FechaFinEfectiva;
                    fechaFinEfectiva = new Date(fechaFin);
                } else {
                    fechaFinEfectiva = new Date(self.contrato_obj.FechaFin);
                    if (fechaFinEfectiva.getDate() == 31) {
                        fechaFinEfectiva.setDate(fechaFinEfectiva.getDate() + 1);
                    }
                }
                var nuevaFechaFin = new Date(fechaFinEfectiva);
                return nuevaFechaFin;
            }

            /**
             * @ngdoc method
             * @name formato_generacion_pdf
             * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaCesionCtrl
             * @description
             * funcion para la generacion del PDF del acta correspondiente, basado en json (pdfmake)
             */
            self.formato_generacion_pdf = function (nuevoEstado) {
                var dateTime =
                    new Date().getFullYear() +
                    "" +
                    (new Date().getMonth() + 1) +
                    "" +
                    new Date().getDate() +
                    "" +
                    new Date().getHours() +
                    "" +
                    new Date().getMinutes();

                var output = self.get_plantilla();

                const pdfDocGenerator = pdfMake.createPdf(output);
                // console.log(self.terminacion_nov);
                // console.log(self.contrato_obj_replica);
                // pdfMake
                //     .createPdf(output)
                //     .download(
                //         "acta_terminacion_anticipada_" +
                //         self.contrato_id +
                //         "_" +
                //         dateTime +
                //         ".pdf"
                //     );
                pdfDocGenerator.getBase64(function (data) {
                    pdfMakerService.saveDocGestorDoc(
                        data,
                        "acta_terminacion_anticipada_" +
                        self.contrato_id +
                        "_" +
                        dateTime +
                        ".pdf",
                        self
                    ).then(function (enlace) {
                        self.postNovedad(nuevoEstado, output, dateTime, enlace);
                    });
                });
            }

            /**
             * @ngdoc method
             * @name format_date_letter
             * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
             * @description
             * funcion para el formateo de objetos tipo fecha a formato a letra  nombre dia, año mes y dia
             * @param {date} param
             */
            self.format_date_letter = function (param) {
                var cadena = param.toString().split("-");
                var dd = cadena[2];
                var mm = cadena[1] - 1;
                var yyyy = cadena[0];
                var fecha = new Date(yyyy, mm, dd);
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

                return fecha.toLocaleDateString("es-ES", options);
            };
            /**
             * @ngdoc method
             * @name format_date
             * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaCesionCtrl
             * @description
             * funcion para el formateo de objetos tipo fecha mongo a formato a letra  nombre dia, año mes y dia
             * @param {date} param
             */

            self.format_date_letter_mongo = function (param) {
                var date = new Date(param);
                var dd = date.getDate();
                var mm = date.getMonth();
                var yyyy = date.getFullYear();
                var fecha = new Date(yyyy, mm, dd);
                var options = { year: 'numeric', month: 'long', day: 'numeric' };
                return fecha.toLocaleDateString("es-ES", options);
            };
            /**
             * @ngdoc method
             * @name format_date
             * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaCesionCtrl
             * @description
             * funcion para el formateo de objetos tipo fecha a formato dd/mm/yyyy
             * @param {date} param
             */
            self.format_date = function (param) {
                var date = null;
                var r_date = null;

                date = new Date(param);

                if (date == "Invalid Date") {
                    var temp_arr = param.split("-");
                    temp_arr.pop();
                    today = temp_arr[2] + '/' + temp_arr[1] + '/' + temp_arr[0]
                } else {
                    var dd = date.getDate();
                    var mm = date.getMonth();
                    var yyyy = date.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    r_date = dd + '/' + mm + '/' + yyyy;
                }

                return r_date;
            };

            self.getFechaUTC = function (dateString) {
                var fecha = new Date(dateString);
                var anio = fecha.getUTCFullYear();
                var mes = fecha.getUTCMonth();
                var dia = fecha.getUTCDate();
                var fechaUTC = new Date(anio, mes, dia, 12, 0, 0, 0);
                return fechaUTC;
            }

            /**
             * @ngdoc method
             * @name numberFormat
             * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
             * @description
             * funcion que formatea los valores de la fecha
             */
            function numberFormat(numero) {
                // Variable que contendra el resultado final
                var resultado = "";
                var nuevoNumero = 0;
                // Si el numero empieza por el valor "-" (numero negativo)
                if (numero[0] == "-") {
                    // Cogemos el numero eliminando las posibles comas que tenga, y sin el signo negativo
                    nuevoNumero = numero.replace(/\,/g, '').substring(1);
                } else {
                    // Cogemos el numero eliminando las posibles comas que tenga
                    nuevoNumero = numero.replace(/\,/g, '');
                }
                // Si tiene decimales, se los quitamos al numero
                if (numero.indexOf(".") >= 0)
                    nuevoNumero = nuevoNumero.substring(0, nuevoNumero.indexOf("."));
                // Ponemos un punto cada 3 caracteres
                for (var j = 0, i = nuevoNumero.length - 1; i >= 0; i--, j++)
                    resultado = nuevoNumero.charAt(i) + ((j > 0) && (j % 3 == 0) ? "," : "") + resultado;
                // Si tiene decimales, se lo añadimos al numero una vez forateado con los separadores de miles
                if (numero.indexOf(".") >= 0)
                    resultado += numero.substring(numero.indexOf("."));
                if (numero[0] == "-") {
                    // Devolvemos el valor añadiendo al inicio el signo negativo
                    return "-" + resultado;
                } else {
                    return resultado;
                }
            }

            var numeroALetras = (function () {
                function Unidades(num) {
                    switch (num) {
                        case 1:
                            return $translate.instant("UN");
                        case 2:
                            return $translate.instant("DOS");
                        case 3:
                            return $translate.instant("TRES");
                        case 4:
                            return $translate.instant("CUATRO");
                        case 5:
                            return $translate.instant("CINCO");
                        case 6:
                            return $translate.instant("SEIS");
                        case 7:
                            return $translate.instant("SIETE");
                        case 8:
                            return $translate.instant("OCHO");
                        case 9:
                            return $translate.instant("NUEVE");
                    }
                    return "";
                }

                function Decenas(num) {
                    var decena = Math.floor(num / 10);
                    var unidad = num - decena * 10;
                    switch (decena) {
                        case 1:
                            switch (unidad) {
                                case 0:
                                    return $translate.instant("DIEZ");
                                case 1:
                                    return $translate.instant("ONCE");
                                case 2:
                                    return $translate.instant("DOCE");
                                case 3:
                                    return $translate.instant("TRECE");
                                case 4:
                                    return $translate.instant("CATORCE");
                                case 5:
                                    return $translate.instant("QUINCE");
                                case 6:
                                    return $translate.instant("DIECISEIS");
                                case 7:
                                    return $translate.instant("DIECISIETE");
                                case 8:
                                    return $translate.instant("DIECIOCHO");
                                case 9:
                                    return $translate.instant("DIECINUEVE");
                                default:
                                    return $translate.instant("DIECI") + Unidades(unidad);
                            }
                        case 2:
                            if (unidad == 0) {
                                return $translate.instant("VEINTE");
                            } else {
                                return $translate.instant("VEINTI") + Unidades(unidad);
                            }
                        case 3:
                            return DecenasY($translate.instant("TREINTA"), unidad);
                        case 4:
                            return DecenasY($translate.instant("CUARENTA"), unidad);
                        case 5:
                            return DecenasY($translate.instant("CINCUENTA"), unidad);
                        case 6:
                            return DecenasY($translate.instant("SESENTA"), unidad);
                        case 7:
                            return DecenasY($translate.instant("SETENTA"), unidad);
                        case 8:
                            return DecenasY($translate.instant("OCHENTA"), unidad);
                        case 9:
                            return DecenasY($translate.instant("NOVENTA"), unidad);
                        case 0:
                            return Unidades(unidad);
                    }
                }

                function DecenasY(strSin, numUnidades) {
                    if (numUnidades > 0)
                        return strSin + $translate.instant("Y") + Unidades(numUnidades);
                    return strSin;
                }

                function Centenas(num) {
                    var centenas = Math.floor(num / 100);
                    var decenas = num - centenas * 100;
                    switch (centenas) {
                        case 1:
                            if (decenas > 0)
                                return $translate.instant("CIENTO") + Decenas(decenas);
                            return $translate.instant("CIEN");
                        case 2:
                            return $translate.instant("DOSCIENTOS") + Decenas(decenas);
                        case 3:
                            return $translate.instant("TRESCIENTOS") + Decenas(decenas);
                        case 4:
                            return $translate.instant("CUATROCIENTOS") + Decenas(decenas);
                        case 5:
                            return $translate.instant("QUINIENTOS") + Decenas(decenas);
                        case 6:
                            return $translate.instant("SEISCIENTOS") + Decenas(decenas);
                        case 7:
                            return $translate.instant("SETECIENTOS") + Decenas(decenas);
                        case 8:
                            return $translate.instant("OCHOCIENTOS") + Decenas(decenas);
                        case 9:
                            return $translate.instant("NOVECIENTOS") + Decenas(decenas);
                    }
                    return Decenas(decenas);
                }

                function Seccion(num, divisor, strSingular, strPlural) {
                    var cientos = Math.floor(num / divisor);
                    var resto = num - cientos * divisor;
                    var letras = "";
                    if (cientos > 0)
                        if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
                        else letras = strSingular;
                    if (resto > 0) letras += "";
                    return letras;
                }

                function Miles(num) {
                    var divisor = 1000;
                    var cientos = Math.floor(num / divisor);
                    var resto = num - cientos * divisor;
                    var strMiles = Seccion(
                        num,
                        divisor,
                        $translate.instant("UNMIL"),
                        $translate.instant("MIL")
                    );
                    var strCentenas = Centenas(resto);
                    if (strMiles == "") return strCentenas;
                    return strMiles + " " + strCentenas;
                }

                function Millones(num) {
                    var divisor = 1000000;
                    var cientos = Math.floor(num / divisor);
                    var resto = num - cientos * divisor;
                    var strMillones = Seccion(
                        num,
                        divisor,
                        $translate.instant("UNMILLON"),
                        $translate.instant("MILLONES")
                    );
                    var strMiles = Miles(resto);
                    if (strMillones == "") return strMiles;
                    return strMillones + " " + strMiles;
                }

                return function NumeroALetras(num, currency) {
                    currency = currency || {};
                    var data = {
                        numero: num,
                        enteros: Math.floor(num),
                        centavos: Math.round(num * 100) - Math.floor(num) * 100,
                        letrasCentavos: "",
                        letrasMonedaPlural: currency.plural || $translate.instant("PESOS"),
                        letrasMonedaSingular: currency.singular || $translate.instant("PESO"),
                        letrasMonedaCentavoPlural: currency.centPlural || "CHIQUI PESOS",
                        letrasMonedaCentavoSingular: currency.centSingular || "CHIQUI PESO",
                    };

                    if (data.centavos > 0) {
                        data.letrasCentavos =
                            $translate.instant("CON") +
                            (function () {
                                if (data.centavos == 1)
                                    return (
                                        Millones(data.centavos) +
                                        " " +
                                        data.letrasMonedaCentavoSingular
                                    );
                                else
                                    return (
                                        Millones(data.centavos) +
                                        " " +
                                        data.letrasMonedaCentavoPlural
                                    );
                            })();
                    }

                    if (data.enteros == 0)
                        return (
                            $translate.instant("CERO") +
                            data.letrasMonedaPlural +
                            " " +
                            data.letrasCentavos
                        );
                    if (data.enteros == 1)
                        return (
                            Millones(data.enteros) +
                            " " +
                            data.letrasMonedaSingular +
                            " " +
                            data.letrasCentavos
                        );
                    else
                        return (
                            Millones(data.enteros) +
                            " " +
                            data.letrasMonedaPlural +
                            " " +
                            data.letrasCentavos
                        );
                };
            })();

            self.agregarConsideraciones = function () {
                var consideraciones = [];
                consideraciones.push(
                    'Que entre la Universidad Distrital Francisco José de Caldas y el señor(a) ' +
                    self.contrato_obj.contratista_nombre + ', se suscribió el ' + self.contrato_obj.tipo_contrato +
                    ' No. ' + self.contrato_id + ' de ' + self.contrato_vigencia + ', cuyo objeto es: "' +
                    self.contrato_obj.objeto + '".\n\n'
                );
                consideraciones.push(
                    {
                        text: [
                            { text: 'Que la cláusula 17 - Terminación Del ' + self.contrato_obj.tipo_contrato + ' No. ' + self.contrato_id + ' de ' + self.contrato_vigencia + ', establece que ' },
                            { text: '"Terminación. ', bold: true },
                            { text: 'Serán causales de terminación del contrato el común acuerdo de las partes al respecto, la ocurrencia de cualquier circunstancia de fuerza mayor o caso fortuito que impida la ejecución del contrato, así como el cumplimiento del plazo pactado para su ejecución. Adicionalmente, dará lugar a la terminación anticipada del contrato el incumplimiento de sus obligaciones, por parte de EL CONTRATISTA, debidamente comprobado, que impida continuar con su ejecución”.\n\n', italics: true },
                        ]
                    }
                );
                consideraciones.push(
                    'Que el contrato se perfeccionó y ejecutó mediante Registro Presupuestal No. ' +
                    self.contrato_obj.rp_numero + ' del ' + self.contrato_obj.rp_fecha + '.\n\n'
                );
                consideraciones.push(
                    'Que según lo establecido en el Contrato No. ' + self.contrato_id + ' de ' + self.contrato_vigencia + ', el plazo de duración se pactó en ' +
                    self.plazoMeses + ' contados a partir del perfeccionamiento de la Orden y/o contrato, es decir del ' +
                    self.format_date_letter_mongo(self.contrato_obj.FechaInicio) + '.\n\n'
                );
                consideraciones.push(
                    'Que el valor del ' + self.contrato_obj.tipo_contrato + ' No. ' + self.contrato_id + ' de ' + self.contrato_vigencia +
                    ' se pactó en la suma total de ' +
                    numeroALetras(self.contrato_obj.valor, {
                        plural: $translate.instant("PESOS"),
                        singular: $translate.instant("PESO"),
                        centPlural: $translate.instant("CENTAVOS"),
                        centSingular: $translate.instant("CENTAVO"),
                    }) + "MODENA CORRIENTE ($" + numberFormat(String(self.contrato_obj.valor) + "") + ' M/Cte.).\n\n'
                );
                consideraciones.push(
                    'Que el/la señor(a) ' + self.contrato_obj.contratista_nombre + ', mediante oficio de fecha  ' + self.format_date_letter_mongo(self.fecha_solicitud) + ', le solicita la aceptación de la Terminación Bilateral de ' + self.contrato_obj.tipo_contrato + ' No. ' + self.contrato_id + ' de ' + self.contrato_vigencia +
                    ' al Supervisor del mismo y ejecutará el desarrollo de actividades hasta el ' + self.format_date_letter_mongo(self.fecha_terminacion_anticipada) + '.\n\n'
                );
                consideraciones.push(
                    'Que según certificación de fecha ' + self.format_date_letter_mongo(self.f_certificacion) + ', expedida por el Jefe de la Unidad de Presupuesto, el ' + self.contrato_obj.tipo_contrato + ' No. ' + self.contrato_id + ' de ' + self.contrato_vigencia + ' presenta un saldo a la fecha de ' +
                    numeroALetras(self.a_favor.valor, {
                        plural: $translate.instant("PESOS"),
                        singular: $translate.instant("PESO"),
                        centPlural: $translate.instant("CENTAVOS"),
                        centSingular: $translate.instant("CENTAVO"),
                    }) + 'MONEDA CORRIENTE ($' + numberFormat(String(self.a_favor.valor) + '') + ' M/CTE).\n\n'
                );
                consideraciones.push(
                    'Que mediante oficio ' + self.numero_oficio_supervisor + ' de fecha ' + self.format_date_letter_mongo(self.fecha_oficioS) +
                    ' el Supervisor del CPS No. ' + self.contrato_id + ' de ' + self.contrato_vigencia + ', le comunicó al señor(a) ' +
                    self.contrato_obj.ordenadorGasto_nombre +
                    ' en calidad de Ordenador del Gasto del citado contrato, la autorización para la terminación anticipada del mismo, a partir del ' +
                    self.format_date_letter_mongo(self.fecha_efectos_legales) + '.\n\n'
                );
                consideraciones.push(
                    'Que por medio del oficio ' + self.numero_oficio_ordenador + ' de fecha ' +
                    self.format_date_letter_mongo(self.fecha_oficioO) +
                    ' recibido por la Oficina de Contratación, el señor(a) ' + self.contrato_obj.ordenadorGasto_nombre +
                    ', como Ordenador del Gasto, solicitó de ésta, la elaboración del acta de terminación y liquidación bilateral anticipada del Contrato de Prestación de Servicios No. ' +
                    self.contrato_id + ' de ' + self.contrato_vigencia + ' a partir del ' + self.format_date_letter_mongo(self.fecha_efectos_legales) + '.\n\n'
                );
                if (self.novedades.length > 0) {
                    for (var i = 0; i < self.novedades.length; i++) {
                        if (
                            self.novedades[i].TipoNovedad == 8
                        ) {
                            var texto_otrosi = 'Que el día ' + self.format_date_letter_mongo(self.novedades[i].FechaProrroga) + ', se realizó la modificación en adición y prórroga, al ' +
                                self.contrato_obj.tipo_contrato + ' No. ' + self.contrato_id + ' de ' + self.contrato_vigencia + ', en su orden por la suma de ' +
                                numeroALetras(
                                    self.novedades[i].valoradicion, {
                                    plural: $translate.instant("PESOS"),
                                    singular: $translate.instant("PESO"),
                                    centPlural: $translate.instant("CENTAVOS"),
                                    centSingular: $translate.instant("CENTAVO"),
                                }) + 'MONEDA CORRIENTE ($' + numberFormat(String(self.novedades[i].ValorAdicion)) + " M/CTE)," +
                                ' y prórroga en tiempo por ' + self.calculoPlazoLetras(self.novedades[i].TiempoProrroga) +
                                ' en atención a la solicitud recibida por correo electrónico, de fecha ' + self.format_date_letter_mongo(self.novedades[i].FechaSolicitud) +
                                ', por medio de la cual, el ' + self.contrato_obj.ordenadorGasto_rol +
                                ', solicitó la citada modificación; cuya justificación se encuentra descrita en la solicitud de necesidad No. ' +
                                self.novedades[i].NumeroSolicitud + ' del ' + self.format_date_letter_mongo(self.novedades[i].FechaSolicitud) +
                                ', con respaldo del CDP ' + self.novedades[i].NumeroCdp + ' de ' + self.novedades[i].VigenciaCdp + ".\n\n"
                            consideraciones.splice(
                                5, 0, texto_otrosi
                            );
                        }
                    }
                }
                return consideraciones;
            }

            self.agregarClausulas = function () {
                var estructura = {}
                if ($scope.nueva_clausula) {
                    estructura = {
                        style: ['general_font'],
                        text: [{
                            text: [
                                { text: 'CLAUSULA QUINTA: ', bold: true },
                                {
                                    text: self.nueva_clausula_text + "\n\n"
                                }
                            ],
                        }]
                    }
                }
                return estructura;
            }

            self.agregarFirmas = function () {

                var firmas = [];
                firmas.push([
                    "",
                    { text: "Nombre", bold: true },
                    { text: "Cargo", bold: true },
                    { text: "Firma", bold: true },
                ]);
                if (self.unidadEjecutora == 1) {
                    if (self.elaboro_cedula != self.contrato_obj.jefe_juridica_documento) {
                        firmas.push([
                            { text: "Proyectó", bold: true },
                            self.elaboro,
                            "Abogado Oficina de Contratación",
                            "",
                        ]);
                    }
                    firmas.push([
                        { text: "Aprobó", bold: true },
                        self.contrato_obj.jefe_juridica_nombre_completo,
                        "Jefe Oficina de Contratación",
                        "",
                    ]);
                } else {
                    if (self.elaboro_cedula != self.contrato_obj.jefe_juridica_documento) {
                        firmas.push([
                            { text: "Proyectó", bold: true },
                            self.elaboro,
                            "CPS Coordinadora Legal - Ofex",
                            "",
                        ]);
                    }
                    firmas.push([
                        { text: "Aprobó", bold: true },
                        self.contrato_obj.ordenadorGasto_nombre,
                        "Jefe Oficina de Extensión y Supervisor - Ofex",
                        "",
                    ]);
                }
                return firmas;
            }

            self.get_plantilla = function () {
                return {
                    pageSize: 'LETTER',
                    pageMargins: [50, 110, 50, 45],
                    header: {
                        margin: [40, 30],
                        columns: [{
                            table: {
                                widths: [50, '*', 130, 70],
                                body: [
                                    [
                                        { image: 'logo_ud', fit: [43, 80], rowSpan: 3, alignment: 'center', fontSize: 9 },
                                        { text: 'ACTA DE TERMINACIÓN Y LIQUIDACIÓN BILATERAL', bold: true, alignment: 'center', fontSize: 9 },
                                        { text: 'Código: GJ-PR-002-FR-013', fontSize: 9 },
                                        { image: 'logo_sigud', fit: [65, 120], rowSpan: 3, alignment: 'center', fontSize: 9 }
                                    ],
                                    [' ',
                                        { text: 'Macroproceso: Gestión de Recursos', alignment: 'center', fontSize: 9 },
                                        { text: 'Versión: 02', fontSize: 9, margin: [0, 2] },
                                        ' '
                                    ],
                                    [' ',
                                        { text: 'Proceso: Gestión de Contratación', alignment: 'center', fontSize: 9 },
                                        { text: 'Fecha de Aprobación: 30/07/2019', fontSize: 9 },
                                        ' '
                                    ],
                                ]
                            },
                        }

                        ]
                    },
                    content: [{
                        style: ['table'],
                        table: {
                            widths: [120, '*'],
                            body: [
                                [
                                    { text: 'CONTRATO', bold: true, style: 'topHeader' },
                                    { text: self.contrato_obj.tipo_contrato, style: 'topHeader' }
                                ],
                                [
                                    { text: 'CONTRATO No.', bold: true, style: 'topHeader' },
                                    {
                                        text: [
                                            { text: self.contrato_id, bold: true },
                                            { text: ' suscrito el ' + self.format_date_letter_mongo(self.contrato_obj.fecha_suscripcion) }
                                        ],
                                        style: 'topHeader'
                                    }
                                ],
                                [
                                    { text: 'CONTRATANTE', bold: true, style: 'topHeader' },
                                    { text: 'Universidad Distrital Francísco José de Caldas', style: 'topHeader' }
                                ],
                                [
                                    { text: 'CONTRATISTA', bold: true, style: 'topHeader' },
                                    { text: self.contrato_obj.contratista_nombre + ", mayor de edad, identificado(a) con " + self.contrato_obj.contratista_tipo_documento + " No. " + self.contrato_obj.contratista_documento + " Expedida en " + self.contrato_obj.contratista_ciudad_documento, style: 'topHeader' }
                                ],
                                [
                                    { text: 'VALOR', bold: true, style: 'topHeader' },
                                    {
                                        text: numeroALetras(
                                            self.contrato_obj.valor, {
                                            plural: $translate.instant("PESOS"),
                                            singular: $translate.instant("PESO"),
                                            centPlural: $translate.instant("CENTAVOS"),
                                            centSingular: $translate.instant("CENTAVO"),
                                        }) + 'MONEDA CORRIENTE ($' + numberFormat(String(self.contrato_obj.valor)) + " M/CTE)",
                                        style: 'topHeader'
                                    }
                                ],
                                [
                                    { text: 'FECHA DE INICIO', bold: true, style: 'topHeader' },
                                    { text: self.format_date_letter_mongo(self.contrato_obj.FechaInicio), style: 'topHeader' }
                                ],
                            ],

                        },
                        layout: {
                            fillColor: function (rowIndex, node, columnIndex) {
                                return (rowIndex % 2 === 0) ? null : '#d4d4d4';
                            }
                        }
                    },
                    {
                        style: ['general_font'],
                        text: [{

                            text: [{
                                text: '\n\nEntre los suscritos a saber, ' + self.contrato_obj.ordenadorGasto_nombre + ', mayor de edad, identificado(a) con ' + self.contrato_obj.ordenador_gasto_tipo_documento + ' No. ' +
                                    self.contrato_obj.ordenador_gasto_documento + ' de ' + self.contrato_obj.ordenador_gasto_ciudad_documento + ' quien actúa en calidad de ' + self.contrato_obj.ordenadorGasto_rol + ' según ' + self.contrato_obj.ordenador_gasto_resolucion + ' y ordenador del gasto, y por la otra ' + self.contrato_obj.contratista_nombre + ', mayor de edad, e identificado(a) con ' + self.contrato_obj.contratista_tipo_documento + ' No. ' + self.contrato_obj.contratista_documento + ' de ' + self.contrato_obj.contratista_ciudad_documento + ' quíén actúa en calidad de contratista, hemos convenido en'
                            },
                            { text: ' TERMINAR ANTICIPADAMENTE Y POR MUTUO ACUERDO ', bold: true },
                            { text: ' y en consecuencia, ' },
                            {
                                text: 'LIQUIDAR BILATERALMENTE', bold: true,
                            },
                            {
                                text: ' a partir de la firma de la presente acta, el ' + self.contrato_obj.tipo_contrato + ' No. ' + self.contrato_id + ' suscrito el día ' + self.format_date_letter_mongo(self.contrato_obj.fecha_suscripcion) + ', previas las siguientes '
                            },
                            {
                                text: 'CONSIDERACIONES:\n\n', bold: true,
                            }
                            ]
                        },
                            // {
                            //     text: '\n\nLa presente Terminación y liquidación anticipada por mutuo acuerdo se lleva a cabo en forma que se determina a continuación previa las siguientes consideraciones : \n\n'
                            // }
                        ]
                    },
                    {
                        style: ['general_list'],
                        ol: self.agregarConsideraciones(),
                    },
                    {
                        style: ['general_font'],
                        text: [{
                            text: [
                                { text: 'Por lo anterior las partes acuerdan las siguientes ' },
                                { text: 'CLÁUSULAS:\n\n', bold: true },
                            ]
                        }]

                    },
                    {
                        style: ['general_font'],
                        text: [{
                            text: [
                                { text: ' CLÁUSULA PRIMERA: TERMINAR Y LIQUIDAR DE MANERA ANTICIPADA Y DE MUTUO ACUERDO el contrato No. ' + self.contrato_id + ' de ' + self.contrato_vigencia + ', ', bold: true },
                                { text: 'a partir del ' + self.format_date_letter_mongo(self.fecha_efectos_legales) + ' de la siguiente manera:\n\n' }
                            ]


                        }]
                    },
                    {
                        style: ['table2'],
                        table: {
                            widths: [270, 270],
                            body: [
                                [
                                    { text: 'Valor del contrato', bold: true, style: 'topHeader' },
                                    { text: '$' + numberFormat(String(self.contrato_obj.valor)), style: 'topHeader' }
                                ],
                                [
                                    { text: 'Valor desembolsado', bold: true, style: 'topHeader' },
                                    { text: '$' + numberFormat(String(parseFloat(self.valor_desembolsado.replace(/\,/g, ""))) + ''), style: 'topHeader' }
                                ],
                                [
                                    { text: 'Saldo a favor del contratista', bold: true, style: 'topHeader' },
                                    { text: '$' + numberFormat(String(parseFloat(self.saldo_contratista.replace(/\,/g, ""))) + ''), style: 'topHeader' }
                                ],
                                [
                                    { text: 'Saldo a favor de la Universidad', bold: true, style: 'topHeader' },
                                    { text: '$' + numberFormat(String(parseFloat(self.saldo_universidad.replace(/\,/g, ""))) + '') + '\n\n\n', style: 'topHeader' }
                                ],
                                [
                                    { text: 'CDP N°', bold: true, style: 'topHeader' },
                                    { text: '' + numberFormat(String(parseFloat(self.contrato_obj.cdp_numero)) + '') + '\n\n\n', style: 'topHeader' }
                                ],
                                [
                                    { text: 'CRP N°', bold: true, style: 'topHeader' },
                                    { text: '' + numberFormat(String(parseFloat(self.rp_numero )) + '') + '\n\n\n', style: 'topHeader' }
                                ],
                            ]
                        },
                        layout: 'noBorders',
                    },
                    {
                        style: ['general_font'],
                        text: [{
                            text: [
                                { text: ' CLÁUSULA SEGUNDA : ', bold: true },
                                { text: ' Teniendo en cuenta que el Contratista ' + self.contrato_obj.contratista_nombre + ', ejecutará los servicios hasta el dia ' + self.format_date_letter_mongo(self.fecha_terminacion_anticipada) + ', ' + self.a_favor.existe + '\n\n' }
                            ]
                        }]
                    },
                    {
                        style: ['general_font'],
                        text: [{
                          text: [
                            { text: ' CLÁUSULA TERCERA: ', bold: true },
                            {
                              text: 'ORDENAR liberar el saldo a favor de la UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS por valor de ',
                            },
                            {
                              text: numeroALetras(self.saldo_universidad.replace(/\,/g, ""), {
                                plural: $translate.instant("PESOS"),
                                singular: $translate.instant("PESO"),
                                centPlural: $translate.instant("CENTAVOS"),
                                centSingular: $translate.instant("CENTAVO"),
                              }),
                              bold: true
                            },
                            { text: ' M/CTE ($', bold: true },
                            {
                              text: numberFormat(String(self.saldo_universidad.replace(/\,/g, ""))),
                              bold: true
                            },
                            { text: ' M/CTE), en atención a que es un valor no ejecutado en el contrato.\n\n' }
                          ]
                        }]
                      },
                    {
                        style: ['general_font'],
                        text: [{
                            text: [
                                { text: ' CLÁUSULA CUARTA : ', bold: true },
                                {
                                    text: 'Las partes manifiestan que aceptan la terminación y liquidación del ' + self.contrato_obj.tipo_contrato + ' No. ' + self.contrato_id + ' del día ' +
                                        self.format_date_letter_mongo(self.contrato_obj.fecha_suscripcion) + ' a nombre de ' +
                                        self.contrato_obj.contratista_nombre + ", con efectos legales a partir del " + self.format_date_letter_mongo(self.fecha_efectos_legales) +
                                        ' y se liberan mutuamente de cualquier otra obligación que pueda derivarse del mismo, declarándose a paz y salvo por todo concepto una vez se compruebe el pago de la cláusula segunda de la presente Acta.\n\n'
                                }
                            ],


                        }]
                    },
                    {
                        style: ['general_font'],
                        text: [{
                            text: [
                                { text: 'CLAUSULA QUINTA: PUBLICACIÓN. ', bold: true },
                                {
                                    text: '- En virtud de lo dispuesto en el Estatuto de Contratación – Acuerdo 003 de 2015 y en concordancia con lo establecido en la Resolución de Rectoría No. 008 de 2021 por medio de la cual se reglamenta el uso del SECOP II en la Universidad, se procederá a la publicación del presente documento de terminación y liquidación bilateral en el SECOP II que administra la Agencia Nacional de Contratación Pública – Colombia Compra Eficiente..\n\n'
                                }
                            ],


                        }]
                    },
                    self.agregarClausulas(),
                    {

                        style: ['general_font'],
                        text: [{
                            text: [
                                "En constancia de lo consignado en el presente documento, se firma en Bogotá D.C., el día " + self.format_date_letter_mongo(self.f_expedicion_acta) +
                                "\n",
                            ],
                        }]
                    },
                    {
                        style: ["table2"],
                        table: {
                            widths: [270, 270],
                            body: [
                                [
                                    {
                                        text: "\n\n",
                                        bold: false,
                                        style: "topHeader",
                                    },
                                    {
                                        text: "",
                                        bold: false,
                                        style: "topHeader",
                                    },
                                ],
                                [
                                    {
                                        text: "\n\n",
                                        bold: false,
                                        style: "topHeader",
                                    },
                                    {
                                        text: "",
                                        bold: false,
                                        style: "topHeader",
                                    },
                                ],
                                [{
                                    text: "______________________________________",
                                    bold: false,
                                    style: "topHeader",
                                },
                                {
                                    text: "______________________________________",
                                    bold: false,
                                    style: "topHeader",
                                },
                                ],
                                [{
                                    text: self.contrato_obj.ordenadorGasto_nombre,
                                    bold: false,
                                    style: "topHeader",
                                },
                                {
                                    text: self.contrato_obj.supervisor_nombre_completo,
                                    bold: false,
                                    style: "topHeader",
                                },
                                ],

                                [{
                                    text: "Ordenador de Gasto",
                                    bold: false,
                                    style: "topHeader",
                                },
                                { text: "Supervisor", bold: false, style: "topHeader" },

                                ],




                                [{
                                    text: "\n\n\n______________________________________",
                                    bold: false,
                                    style: "topHeader",
                                },
                                { text: "", bold: false, style: "topHeader" },
                                ],
                                [{
                                    text: self.contrato_obj.contratista_nombre,
                                    bold: false,
                                    style: "topHeader",
                                },
                                { text: "", bold: false, style: "topHeader" },
                                ],
                                [
                                    { text: "Contratista\n\n", bold: false, style: "topHeader" },
                                    { text: "", style: "topHeader" },
                                ],

                            ],
                        },
                        unbreakable: true,
                        layout: "noBorders",
                    },
                    {

                        style: ['general_font'],
                        text: [{
                            text: [
                                { text: '\n\n' }
                            ]
                        }]
                    },
                    {
                        style: 'table3',
                        table: {
                            widths: [65, 130, 130, 150],
                            body: self.agregarFirmas(),
                        }
                    },
                    ],
                    styles: {
                        general_font: {
                            fontSize: self.tamanoFuente,
                            alignment: 'justify',
                            margin: [25, 0, 25, 0]
                        },
                        general_list: {
                            fontSize: 10,
                            alignment: 'justify',
                            margin: [35, 0, 25, 0]
                        },
                        topHeader: {
                            margin: [5, 0, 5, 0],
                            alignment: 'justify',
                            fontSize: 8
                        },
                        table: {
                            margin: [30, 0, 30, 0],
                            border: "0"
                        },
                        table2: {
                            margin: [25, 0, 25, 0],
                            border: "0",
                            fontSize: 10,
                        },
                        table3: {
                            fontSize: 8
                        }
                    },
                    images: {
                        logo_ud: 'data:image/png;base64,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',
                        logo_sigud: 'data:image/jpeg;base64,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'
                    }
                }
            }
        });
