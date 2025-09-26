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
      self.novedades = [];
      self.novedadEnCurso = false;
      self.contratistaBool = false;
      self.usuarioJuridica = false;
      self.rolesUsuario = [];
      self.rolActual = "";
      self.createBool = false;
      $scope.status = "";

      function fmtFechaCorta(val) {
        try {
          if (!val) return "";
          var d = new Date(val);
          if (isNaN(d.getTime())) return "";
          return d.toISOString().slice(0, 10);
        } catch (e) { return ""; }
      }

      $scope.getNovedadKey = function (n) {
        return n && (n.id || n.Id || n.IdNovedad || n.novedadId);
      };

      $scope.idBotonHabilitado = null;
      $scope.anulandoId = null;

      $scope.formatDate = function (date) { return new Date(date); };

      $scope.anularFila = function (novedad) {
        if ($scope.novedadesTabla && $scope.novedadesTabla.length > 1) {
          swal(
            "Operación no permitida",
            "No se pueden anular novedades cuando existen múltiples registros. " +
            "Por favor comuníquese con soporte para gestionar este caso.",
            "warning"
          );
          return;
        }
        if ($scope.getNovedadKey(novedad) !== $scope.idBotonHabilitado) {
          swal('Operación no permitida', 'Solo se puede anular la última novedad registrada.', 'warning');
          return;
        }

        var id = novedad.id || novedad.Id || novedad.IdNovedad || novedad.novedadId;
        if (!id) {
          swal($translate.instant("ERROR"), $translate.instant("No se encontró el Id de la novedad"), "error");
          return;
        }

        var htmlDetalle =
          "<b>Contrato:</b> " + (self.contrato_obj.numero_contrato || "") + " &nbsp; " +
          "<b>Vigencia:</b> " + (self.contrato_obj.vigencia || "") + "<br>" +
          "<b>Tipo:</b> " + (novedad.tipoNovedad || "") + "<br>" +
          "<b>Fecha:</b> " + fmtFechaCorta(novedad.fecha) + "<br>" +
          "<b>Estado actual:</b> " + (novedad.estado || "") + "<br><br>" +
          "Se registrarán los estados <b>Novedad anulada</b> y luego <b>En ejecución</b> en el contrato.";

        swal({
          title: "¿Anular la novedad del contrato?",
          type: "warning",
          html: htmlDetalle,
          showCancelButton: true,
          confirmButtonText: '<i class="fa fa-check"></i> Sí, anular',
          cancelButtonText: '<i class="fa fa-times"></i> Cancelar',
          allowOutsideClick: false
        }).then(function (ok) {
          if (!ok) return;

          swal({
            title: "Cargando...",
            html: '' +
              '<p>Por favor espera mientras se procesa la anulación.<br>El proceso puede tardar varios minutos.</p>' +
              '<div style="margin-top:15px; width:100%; background:#f4f4f4; border-radius:10px; overflow:hidden;">' +
              '<div id="progress-bar"></div>' +
              '</div>' +
              '<style>' +
              '@keyframes progress-indeterminate {' +
              '0%   {margin-left: -100%; width: 100%;}' +
              '50%  {margin-left: 0%; width: 100%;}' +
              '100% {margin-left: 100%; width: 100%;}' +
              '}' +

              '@keyframes gradient-shift {' +
              '0%   { background-position: 0% 50%; }' +
              '50%  { background-position: 100% 50%; }' +
              '100% { background-position: 0% 50%; }' +
              '}' +

              '#progress-bar {' +
              'width: 100% !important;' +
              'height: 14px !important;' +
              'border-radius: 10px;' +
              'background: linear-gradient(90deg, #2980b9, #6dd5fa, #ffffff);' +
              'background-size: 200% 200%;' +
              'animation: progress-indeterminate 2.5s infinite linear, ' +
              'gradient-shift 5s infinite ease-in-out;' +
              'box-shadow: 0 2px 8px rgba(0,0,0,0.15), ' +
              'inset 0 1px 2px rgba(255,255,255,0.6);' +
              '}' +
              '</style>',
            allowOutsideClick: false,
            showConfirmButton: false
          });


          $scope.anulandoId = id;

          novedadesMidRequest.patch("novedad", id, {})
            .then(function (resp) {
              var r = resp && resp.data ? resp.data : {};
              swal.close();

              if (r.Success) {
                swal({
                  title: "Novedad anulada",
                  type: "success",
                  html:
                    "Se registraron los cambios de estado y se anuló la novedad del contrato " +
                    (self.contrato_obj.numero_contrato || "") +
                    " (Vigencia " + (self.contrato_obj.vigencia || "") + ").",
                  confirmButtonText: "OK",
                  allowOutsideClick: false
                }).then(function () {
                  if (typeof self.buscar_contrato === "function") {
                    self.buscar_contrato();
                  } else {
                    novedad.estado = "ANULADA";
                  }
                });
              } else {
                swal({
                  title: "Error",
                  type: "error",
                  html:
                    "No fue posible anular la novedad del contrato " +
                    (self.contrato_obj.numero_contrato || "") + ".",
                  confirmButtonText: "OK",
                  allowOutsideClick: false
                });
              }
            })
            .catch(function (err) {
              console.error("Error PATCH /v1/novedad/" + id, err);
              swal.close();
              swal({
                title: "Error",
                type: "error",
                html:
                  "No fue posible anular la novedad del contrato " +
                  (self.contrato_obj.numero_contrato || "") + ".",
                confirmButtonText: "OK",
                allowOutsideClick: false
              });
            })
            .finally(function () {
              $scope.anulandoId = null;
            });
        });
      };
      // ====== /AJUSTE ======

      agoraRequest.get("vigencia_contrato", "").then(function (response) {
        $scope.vigencias = response.data;
      });

      self.rolesUsuario = token_service.getPayload().role;
      for (var i = 0; i < self.rolesUsuario.length; i++) {
        if (self.rolesUsuario[i] === 'ASISTENTE_JURIDICA') {
          self.rolActual = self.rolesUsuario[i];
          break;
        }
      }
      if (self.rolActual != 'ASISTENTE_JURIDICA') {
        for (var j = 0; j < self.rolesUsuario.length; j++) {
          if (
            self.rolesUsuario[j] === 'SUPERVISOR' ||
            self.rolesUsuario[j] === 'ORDENADOR_DEL_GASTO' ||
            self.rolesUsuario[j] === 'CONTRATISTA'
          ) {
            self.rolActual = self.rolesUsuario[j];
            break;
          }
        }
      }

      self.buscar_contrato = function () {
        self.novedadEnCurso = false;
        $scope.novedadesTabla = [];
        $scope.novedadesProceso = [];
        self.estado_resultado_response = false;
        self.documentoSelect = null;
        if (self.contrato_id == undefined || self.contrato_vigencia == undefined) {
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
              self.contrato_obj.id = agora_response.data[0].ContratoSuscrito[0].NumeroContrato.Id;
              self.contrato_obj.valor = agora_response.data[0].ValorContrato;
              self.contrato_obj.objeto = agora_response.data[0].ObjetoContrato;
              self.contrato_obj.fecha_registro = agora_response.data[0].FechaRegistro;
              self.contrato_obj.ordenador_Id = agora_response.data[0].OrdenadorGasto;
              self.contrato_obj.vigencia = self.contrato_vigencia;
              self.contrato_obj.contratista = agora_response.data[0].Contratista;
              self.contrato_obj.cesion = 0;

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
                  self.estado_contrato_obj.idRegistro =
                    ce_response.data[ce_response.data.length - 1].Id;
                  if (self.estado_contrato_obj.estado == 7) {
                    swal($translate.instant("CONTRATO_CANCELADO"), "", "info");
                  }
                  if (self.estado_contrato_obj.estado == 6) {
                    swal($translate.instant("CONTRATO_FINALIZADO"), "", "info");
                  }
                  if (self.estado_contrato_obj.estado == 8) {
                    swal($translate.instant("CONTRATO_FIN_ANTICIPADO"), "", "info");
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

                  novedadesMidRequest
                    .get(
                      "novedad",
                      self.contrato_obj.numero_contrato + "/" + self.contrato_obj.vigencia
                    )
                    .then(function (response_sql) {
                      self.novedades = response_sql.data.Body;
                      var adiciones = 0;
                      for (var i = 0; i < self.novedades.length; i++) {
                        if (self.novedades[i].TipoNovedad == 6 || self.novedades[i].TipoNovedad == 8) {
                          adiciones += parseFloat(self.novedades[i].ValorAdicion);
                        }
                      }
                      self.contrato_obj.valor = parseFloat(self.contrato_obj.valor) + adiciones;

                      for (var k = 0; k < self.novedades.length; k++) {
                        if (self.novedades[k].Id != undefined) {
                          $scope.novedadesTabla.push({
                            id: self.novedades[k].Id,
                            tipoNovedad: self.novedades[k].NombreTipoNovedad,
                            enlace: self.novedades[k].Enlace,
                            fecha: self.novedades[k].FechaExpedicion,
                            estado: self.novedades[k].NombreEstado
                          });
                        }
                      }

                      if ($scope.novedadesTabla.length > 0) {
                        var ultima = $scope.novedadesTabla[$scope.novedadesTabla.length - 1];
                        $scope.idBotonHabilitado = $scope.getNovedadKey(ultima);
                      }

                      if (self.novedades != undefined && self.novedades.length != "0") {
                        var last_newness = self.novedades[self.novedades.length - 1];
                        if (last_newness.Estado == "ENTR") {
                          self.novedadEnCurso = true;
                          swal({
                            title: $translate.instant("INFORMACION"),
                            type: "info",
                            html: $translate.instant("TITULO_NOVEDAD_EN_CURSO") +
                              self.contrato_obj.numero_contrato +
                              $translate.instant("ANIO") +
                              self.contrato_obj.vigencia + ".",
                            showCloseButton: false,
                            showCancelButton: false,
                            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                            allowOutsideClick: false,
                          });
                        }
                        novedadesRequest
                          .get("tipo_novedad", "query=Id:" + last_newness.TipoNovedad)
                          .then(function (nr_response) {
                            self.contrato_obj.tipo_novedad = nr_response.data[0].CodigoAbreviacion;
                            if (self.contrato_obj.tipo_novedad == "NP_CES") {
                              self.contrato_obj.contratista = last_newness.Cesionario;
                              if (last_newness.Poliza === "") {
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
                              self.contrato_obj.contratista = last_newness.Cesionario;
                            }
                            agoraRequest
                              .get("informacion_proveedor?query=Id:" + self.contrato_obj.contratista)
                              .then(function (ip_response) {
                                self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                                self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                                self.estado_resultado_response = true;
                              })
                              .catch(function () {
                                $scope.alert = "DESCRIPCION_ERROR_LEGAL_PROV";
                                swal({
                                  title: $translate.instant("TITULO_ERROR_LEGAL"),
                                  type: "error",
                                  html: $translate.instant($scope.alert) +
                                    self.contrato_obj.numero_contrato +
                                    $translate.instant("ANIO") +
                                    self.contrato_obj.vigencia + ".",
                                  showCloseButton: true,
                                  showCancelButton: false,
                                  confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                                  allowOutsideClick: false,
                                });
                              });
                          });
                      } else {
                        agoraRequest
                          .get("informacion_proveedor?query=Id:" + self.contrato_obj.contratista)
                          .then(function (ip_response) {
                            self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                            self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                            self.estado_resultado_response = true;
                          })
                          .catch(function () {
                            $scope.alert = "DESCRIPCION_ERROR_LEGAL_PROV";
                            swal({
                              title: $translate.instant("TITULO_ERROR_LEGAL"),
                              type: "error",
                              html: $translate.instant($scope.alert) +
                                self.contrato_obj.numero_contrato +
                                $translate.instant("ANIO") +
                                self.contrato_obj.vigencia + ".",
                              showCloseButton: true,
                              showCancelButton: false,
                              confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                              allowOutsideClick: false,
                            });
                          });
                      }
                    });
                })
                .catch(function () {
                  swal(
                    $translate.instant("INFORMACION"),
                    $translate.instant("No se pudo obtener datos del estado del contrato o no hay registros asociados en base de datos a este contrato"),
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
          .catch(function () {
            self.estado_resultado_response = false;
            swal(
              $translate.instant("Contrato o fecha invalido"),
              $translate.instant("DESCRIPCION_ERROR_LEGAL"),
              "error"
            );
          });
      };

      $scope.activarContrato = function () {
        swal({
          title: "¿Está seguro de que desea cambiar el estado del contrato?",
          type: "question",
          html: "Contrato: " + self.contrato_obj.numero_contrato + $translate.instant("ANIO") + self.contrato_obj.vigencia + ".",
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
          cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancelar',
          allowOutsideClick: false,
        }).then(function (result) {
          if (result) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const formattedDate = year + '-' + month + '-' + day + 'T00:00:00.000Z';
            var estadoContrato = 0;
            agoraRequest.get("estado_contrato?query=NombreEstado:En ejecucion")
              .then(function (ec_response) {
                estadoContrato = ec_response.data[0].Id;
                var cambioEstado = {
                  Estado: { Id: estadoContrato },
                  FechaRegistro: formattedDate,
                  NumeroContrato: self.contrato_obj.id,
                  Usuario: "CC" + token_service.getPayload().documento,
                  Vigencia: parseInt(self.contrato_obj.vigencia)
                };
                novedadesMidRequest.post("validarCambioEstado", cambioEstado)
                  .then(function (response) {
                    if (response.data.Type == "OK") {
                      var estadoRes = response.data.Body[1];
                      swal({
                        title: "Cambio de estado exitoso",
                        type: "success",
                        html: "Se hizo el registro de estado de contrato (Argo)<br><br>" +
                          "Usuario: " + estadoRes.Usuario + "<br>" +
                          "Fecha: " + estadoRes.FechaRegistro,
                        showCloseButton: false,
                        showCancelButton: false,
                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                        allowOutsideClick: false,
                      }).then(function () {
                        self.buscar_contrato();
                      });
                    } else {
                      swal({
                        title: $translate.instant("ERROR"),
                        type: "error",
                        html: "No se pudo cambiar el estado del contrato",
                        showCloseButton: false,
                        showCancelButton: false,
                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                        allowOutsideClick: false,
                      });
                    }
                  }).catch(function () {
                    swal({
                      title: $translate.instant("ERROR"),
                      type: "error",
                      html: "No se pudo cambiar el estado del contrato",
                      showCloseButton: false,
                      showCancelButton: false,
                      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                      allowOutsideClick: false,
                    });
                  });
              });
          }
        }).catch(function () { });
      };

      if (self.rolActual == 'CONTRATISTA') {
        agoraRequest.get("informacion_proveedor?query=NumDocumento:" + token_service.getPayload().documento)
          .then(function (responeIp) {
            agoraRequest.get("contrato_general?query=Contratista:" + responeIp.data[0].Id)
              .then(function (responseCg) {
                if (responseCg.data !== undefined) {
                  self.contrato_id = responseCg.data[responeIp.data.length - 1].ContratoSuscrito[0].NumeroContratoSuscrito;
                  self.contrato_vigencia = responseCg.data[responeIp.data.length - 1].ContratoSuscrito[0].Vigencia;
                  self.buscar_contrato();
                } else {
                  swal($translate.instant("El usuario no tiene un contrato activo!"), $translate.instant(""), "error");
                  window.location.href = "#/";
                }
              });
          });
      }

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
        }],
      };

      $scope.hide = function () { $mdDialog.hide(); };
      $scope.cancel = function () { $mdDialog.cancel(); };
      $scope.answer = function (answer) { $mdDialog.hide(answer); };

      // paginación
      $scope.currentPage = 1;
      $scope.numLimit = 5;
      $scope.start = 0;

      $scope.$watch("documentos", function (newVal) {
        if (newVal) {
          $scope.pages = Math.ceil($scope.novedadesTabla.length / $scope.numLimit);
        }
      });
      $scope.hideNext = function () {
        return !($scope.start + $scope.numLimit < $scope.novedadesTabla.length);
      };
      $scope.hidePrev = function () {
        return $scope.start === 0;
      };
      $scope.nextPage = function () {
        $scope.currentPage++;
        $scope.start = $scope.start + $scope.numLimit;
      };
      $scope.PrevPage = function () {
        if ($scope.currentPage > 1) {
          $scope.currentPage--;
        }
        $scope.start = $scope.start - $scope.numLimit;
      };
    }
  );
