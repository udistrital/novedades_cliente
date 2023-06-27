"use strict";

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalCtrl
 * @description
 * # SeguimientoycontrolLegalCtrl
 * Controller of the contractualClienteApp
 */
angular
    .module("contractualClienteApp")
    .controller(
        "SeguimientoycontrolLegalCtrl",
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
            self.estado_resultado_response = 0;
            self.contratos = [{}];
            self.vigencias = [];
            self.vigencia_seleccionada = self.vigencias[0];
            self.contrato_obj = {};
            self.estado_resultado_response = false;
            self.estado_contrato_obj.estado = 0;
            self.novedadEnCurso = false;
            self.contratistaBool = false;
            self.usuarioJuridica = false;
            self.rolesUsuario = [];
            self.rolActual = "";
            self.createBool = true;
            $scope.status = "";
            agoraRequest.get("vigencia_contrato", "").then(function (response) {
                $scope.vigencias = response.data;
            });

            self.rolesUsuario = token_service.getPayload().role;
            // Asignación del rol del usuario
            for (var i = 0; i < self.rolesUsuario.length; i++) {
                if (self.rolesUsuario[i] === 'ORDENADOR_DEL_GASTO') {
                    self.rolActual = self.rolesUsuario[i];
                    break;
                }
            }
            if (self.rolActual != 'ORDENADOR_DEL_GASTO') {
                for (var i = 0; i < self.rolesUsuario.length; i++) {
                    if (
                        self.rolesUsuario[i] === 'SUPERVISOR' ||
                        self.rolesUsuario[i] === 'ASISTENTE_JURIDICA' ||
                        self.rolesUsuario[i] === 'CONTRATISTA'
                    ) {
                        console.log(self.rolesUsuario[i])
                        self.rolActual = self.rolesUsuario[i];
                        break;
                    }
                }
            }

            /**
             * @ngdoc method
             * @name get_contratos_vigencia
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
                                            self.createBool = false;
                                        }
                                    }
                                    //obtener los documentos y soportes por contrato
                                    // documentosCrudRequest
                                    //     .get(
                                    //         "documento",
                                    //         "query=Descripcion:" +
                                    //         self.contrato_obj.numero_contrato +
                                    //         "" +
                                    //         parseInt(self.contrato_obj.vigencia) +
                                    //         "&limit=0"
                                    //     )
                                    //     .then(function (doc_response) {
                                    //         if (doc_response.data != null) {
                                    //             for (var i = 0; i < doc_response.data.length; i++) {
                                    //                 if (
                                    //                     doc_response.data[i].Id !=
                                    //                     undefined
                                    //                 ) {
                                    //                     var metadatos = JSON.parse(doc_response.data[i].Metadatos)
                                    //                     $scope.novedadesTabla.push({
                                    //                         idDocumento: doc_response.data[i].Id,
                                    //                         enlace: doc_response.data[i].Enlace,
                                    //                         label: doc_response.data[i].Nombre,
                                    //                         fechaCreacion: doc_response.data[i]
                                    //                             .FechaCreacion,
                                    //                         estado: metadatos.estado,
                                    //                     });
                                    //                 }
                                    //             }
                                    //         }
                                    //     });


                                    //Obtiene el tipo de contrato y el tipo de la ultima novedad hecha para saber si el contrato fue cedido.
                                    novedadesMidRequest
                                        .get(
                                            "novedad",
                                            self.contrato_obj.numero_contrato +
                                            "/" +
                                            self.contrato_obj.vigencia
                                        )
                                        .then(function (response_sql) {
                                            for (var i = 0; i < response_sql.data.Body.length; i++) {
                                                if (
                                                    response_sql.data.Body[i].id !=
                                                    undefined
                                                ) {
                                                    $scope.novedadesTabla.push({
                                                        id: response_sql.data.Body[i].id,
                                                        tipoNovedad: response_sql.data.Body[i].nombreTipoNovedad,
                                                        enlace: response_sql.data.Body[i].enlace,
                                                        fecha: response_sql.data.Body[i].fechasolicitud,
                                                        estado: response_sql.data.Body[i].estado,
                                                    });
                                                }
                                            }
                                            var elementos_cesion = response_sql.data.Body;
                                            if (elementos_cesion != undefined && elementos_cesion.length != "0") {
                                                var last_newness =
                                                    elementos_cesion[elementos_cesion.length - 1];
                                                if (last_newness.estado == "EN_TRAMITE") {
                                                    self.novedadEnCurso = true;
                                                    swal({
                                                        title: $translate.instant("INFORMACION"),
                                                        type: "info",
                                                        html: $translate.instant("TITULO_NOVEDAD_EN_CURSO") +
                                                            self.contrato_obj.numero_contrato +
                                                            $translate.instant("ANIO") +
                                                            self.contrato_obj.vigencia +
                                                            ".",
                                                        showCloseButton: false,
                                                        showCancelButton: false,
                                                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                                        allowOutsideClick: false,
                                                    })
                                                }
                                                novedadesRequest
                                                    .get(
                                                        "tipo_novedad",
                                                        "query=Id:" + last_newness.tiponovedad
                                                    )
                                                    .then(function (nr_response) {
                                                        self.contrato_obj.tipo_novedad =
                                                            nr_response.data[0].CodigoAbreviacion;
                                                        if (self.contrato_obj.tipo_novedad == "NP_CES") {
                                                            self.contrato_obj.contratista =
                                                                last_newness.cesionario;
                                                            if (last_newness.poliza === "") {
                                                                if (self.novedadEnCurso == false) {
                                                                    self.estado_contrato_obj.estado = 10;
                                                                    swal(
                                                                        $translate.instant("INFORMACION"),
                                                                        $translate.instant("DESCRIPCION_ACTA_CESION"),
                                                                        "info"
                                                                    );
                                                                }
                                                            }
                                                        } else if (
                                                            self.contrato_obj.tipo_novedad == "NP_SUS" ||
                                                            self.contrato_obj.tipo_novedad == "NP_REI" ||
                                                            self.contrato_obj.tipo_novedad == "NP_ADI" ||
                                                            self.contrato_obj.tipo_novedad == "NP_PRO" ||
                                                            self.contrato_obj.tipo_novedad == "NP_ADPRO"
                                                        ) {
                                                            self.contrato_obj.contratista =
                                                                last_newness.cesionario;
                                                        }
                                                        //Obtiene los datos aosicados al proveedor de un contrato que ha tenido una novedad
                                                        agoraRequest
                                                            .get(
                                                                "informacion_proveedor?query=Id:" +
                                                                self.contrato_obj.contratista
                                                            )
                                                            .then(function (ip_response) {
                                                                self.contrato_obj.contratista_documento =
                                                                    ip_response.data[0].NumDocumento;
                                                                self.contrato_obj.contratista_nombre =
                                                                    ip_response.data[0].NomProveedor;
                                                                self.estado_resultado_response = true;
                                                            })
                                                            .catch(function (error) {
                                                                $scope.alert = "DESCRIPCION_ERROR_LEGAL_PROV";
                                                                swal({
                                                                    title: $translate.instant("TITULO_ERROR_LEGAL"),
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
                                                            });
                                                    });
                                            } else {
                                                //Obtiene los datos aosicados al proveedor de un Rque no tiene novedades
                                                agoraRequest
                                                    .get(
                                                        "informacion_proveedor?query=Id:" +
                                                        self.contrato_obj.contratista
                                                    )
                                                    .then(function (ip_response) {
                                                        self.contrato_obj.contratista_documento =
                                                            ip_response.data[0].NumDocumento;
                                                        self.contrato_obj.contratista_nombre =
                                                            ip_response.data[0].NomProveedor;
                                                        self.estado_resultado_response = true;
                                                    })
                                                    .catch(function (error) {
                                                        $scope.alert = "DESCRIPCION_ERROR_LEGAL_PROV";
                                                        swal({
                                                            title: $translate.instant("TITULO_ERROR_LEGAL"),
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
                                                    });
                                            }
                                        });
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

            if (self.rolActual == 'CONTRATISTA') {
                agoraRequest.get(
                    "informacion_proveedor?query=NumDocumento:" + token_service.getPayload().documento
                ).then(function (responeIp) {
                    agoraRequest.get(
                        "contrato_general?query=Contratista:" + responeIp.data[0].Id
                    ).then(function (responseCg) {
                        self.contrato_id = responseCg.data[0].ContratoSuscrito[0].NumeroContratoSuscrito;
                        self.contrato_vigencia = responseCg.data[0].ContratoSuscrito[0].Vigencia;
                        self.buscar_contrato();
                    });
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
                columnDefs: [{
                    field: "contrato.numero_contrato_suscrito",
                    displayName: $translate.instant("CONTRATO"),
                    width: 150,
                },
                {
                    field: "contrato.vigencia",
                    displayName: $translate.instant("VIGENCIA_CONTRATO"),
                    width: 160,
                },
                {
                    field: "informacion_proveedor.NumDocumento",
                    displayName: $translate.instant("DOCUMENTO_CONTRATISTA"),
                    width: 200,
                },
                {
                    field: "informacion_proveedor.NomProveedor",
                    displayName: $translate.instant("NOMBRE_CONTRATISTA"),
                    width: 390,
                },
                {
                    field: "contrato.valor_contrato",
                    displayName: $translate.instant("VALOR"),
                    cellFilter: "currency",
                    width: 180,
                },
                ],
            };

            $scope.showTabDialog = function (ev) {
                $mdDialog
                    .show({
                        templateUrl: "views/seguimientoycontrol/novedad-tabla.html",
                        locals: { documentos: $scope.novedadesTabla },
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        restrict: "E",
                        replace: true,
                        controller: DialogController,
                    })
                    .then(
                        function (answer) {
                            $scope.status =
                                'You said the information was "' + answer + '".';
                        },
                        function () {
                            $scope.status = "You cancelled the dialog.";
                        }
                    );
            };

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            $scope.formatDate = function (date) {
                var dateOut = new Date(date);
                return dateOut;
            }

            $scope.currentPage = 1;
            $scope.numLimit = 5;
            $scope.start = 0;

            $scope.verDocumento = function (enlace) {
                novedadesMidRequest
                    .get("gestor_documental", enlace)
                    .then(function (response) {
                        var elementos = response.data.Body;
                        var docB64 = elementos.file.split("'");
                        var file = docB64.length > 1 ? docB64[1] : docB64[0];
                        var pdfWindow = window.open("");
                        pdfWindow.document.write(
                            "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                            file +
                            "'></iframe>"
                        );
                    });
            }

            $scope.editarNovedad = function (idRegNov) {

            }
            $scope.eliminarNovedad = function (idRegNov) {
                if (estado == "EN_TRAMITE") {
                    estructura = {
                        "Id": 9530,
                        "NumeroSolicitud": "7617171",
                        "ContratoId": 3007,
                        "NumeroCdpId": 0,
                        "Motivo": "prueba",
                        "Aclaracion": "",
                        "Observacion": "",
                        "Vigencia": 2023,
                        "VigenciaCdp": 0,
                        "FechaCreacion": "2023-02-20 09:03:11.521786 +0000 +0000",
                        "FechaModificacion": "2023-02-20 09:03:11.521786 +0000 +0000",
                        "Activo": true,
                        "TipoNovedad": 3,
                        "Estado": "TERMINADA"
                    };
                    novedadesMidRequest
                        .put("novedad", idRegNov, estructura)
                        .then(function (response) {
                            console.log("Res: ", response)
                        });
                }

            }

            $scope.$watch("documentos", function (newVal) {
                if (newVal) {
                    $scope.pages = Math.ceil(
                        $scope.novedadesTabla.length / $scope.numLimit
                    );
                }
            });
            $scope.hideNext = function () {
                if (
                    $scope.start + $scope.numLimit <
                    $scope.novedadesTabla.length
                ) {
                    return false;
                } else return true;
            };
            $scope.hidePrev = function () {
                if ($scope.start === 0) {
                    return true;
                } else return false;
            };
            $scope.nextPage = function () {
                $scope.currentPage++;
                $scope.start = $scope.start + $scope.numLimit;
            };
            $scope.PrevPage = function () {
                if ($scope.currentPage > 1) {
                    $scope.currentPage--;
                } $scope.start = $scope.start - $scope.numLimit;
            };

            function DialogController($scope, $mdDialog, documentos) {
                $scope.novedadesTabla = documentos;
                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
                $scope.verDocumento = function (enlace) {
                    novedadesMidRequest
                        .get("gestor_documental", enlace)
                        .then(function (response) {
                            var elementos = response.data.Body;
                            var docB64 = elementos.file.split("'");
                            var file = docB64.length > 1 ? docB64[1] : docB64[0];
                            var pdfWindow = window.open("");
                            pdfWindow.document.write(
                                "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                                file +
                                "'></iframe>"
                            );
                        });
                };
                $scope.formatDate = function (date) {
                    var dateOut = new Date(date);
                    return dateOut;
                };

                $scope.currentPage = 1;
                $scope.numLimit = 5;
                $scope.start = 0;

                $scope.$watch("documentos", function (newVal) {
                    if (newVal) {
                        $scope.pages = Math.ceil(
                            $scope.novedadesTabla.length / $scope.numLimit
                        );
                    }
                });
                $scope.hideNext = function () {
                    if (
                        $scope.start + $scope.numLimit <
                        $scope.novedadesTabla.length
                    ) {
                        return false;
                    } else return true;
                };
                $scope.hidePrev = function () {
                    if ($scope.start === 0) {
                        return true;
                    } else return false;
                };
                $scope.nextPage = function () {
                    $scope.currentPage++;
                    $scope.start = $scope.start + $scope.numLimit;
                };
                $scope.PrevPage = function () {
                    if ($scope.currentPage > 1) {
                        $scope.currentPage--;
                    } $scope.start = $scope.start - $scope.numLimit;
                };
            }
        }
    );
