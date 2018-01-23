'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ContratoRegistroCtrl
 * @description
 * # ContratoRegistroCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
    .controller('ContratoRegistroCtrl', function(amazonAdministrativaRequest, administrativaRequest, adminMidRequest, oikosRequest, coreAmazonRequest, financieraRequest,sicapitalRequest, idResolucion, $mdDialog, lista, resolucion, $translate, $window) {

        var self = this;
        self.contratoGeneralBase = {};
        self.contratoGeneralBase.Contrato = {};
        self.acta = {};
        self.estado = false;

        self.idResolucion = idResolucion;

        administrativaRequest.get('resolucion/' +  self.idResolucion).then(function(response) {
            self.resolucionActual = response.data;
            console.log(response.data);
            administrativaRequest.get('tipo_resolucion/' +  self.resolucionActual.IdTipoResolucion.Id).then(function(response) {
                self.resolucionActual.IdTipoResolucion.NombreTipoResolucion = response.data.NombreTipoResolucion;
            });
        });

        oikosRequest.get('dependencia/' + resolucion.Facultad).then(function(response) {
            resolucion.Facultad = response.data.Nombre;
        });


        administrativaRequest.get("resolucion_vinculacion_docente/" + self.idResolucion).then(function(response) {
            self.datosFiltro = response.data;
            oikosRequest.get("dependencia/" + self.datosFiltro.IdFacultad.toString()).then(function(response) {

                self.contratoGeneralBase.Contrato.SedeSolicitante = response.data.Id.toString();
                self.sede_solicitante_defecto = response.data.Nombre;
            });
            /*
            amazonAdministrativaRequest.get("precontratado/"+self.idResolucion.toString()).then(function(response){

              self.contratados=response.data;
              if(self.contratados != null){
                self.contratados.forEach(function(row){
                  console.log("row");
                  console.log(row.Id);
                  adminMidRequest.get("calculo_salario/Contratacion/"+row.Id.toString()).then(function(response){
                    console.log("SCA VOY");
                    console.log(response);
                    row.ValorContrato=response.data;
                  });
                });

              }
            });


            adminMidRequest.post("calculo_salario/Precontratacion/"+self.idResolucion.toString()+"/"+resolucion.NivelAcademico).then(function(response){
              self.contratados=response.data;
              });
              */
            adminMidRequest.get("gestion_previnculacion/docentes_previnculados", "id_resolucion=" + self.idResolucion.toString()).then(function(response) {

                self.contratados = response.data;


            });
            coreAmazonRequest.get("ordenador_gasto", "query=DependenciaId%3A" + self.datosFiltro.IdFacultad.toString()).then(function(response) {
                if (response.data === null) {
                    coreAmazonRequest.get("ordenador_gasto/1").then(function(response) {
                        self.ordenadorGasto = response.data;
                    });
                } else {
                    self.ordenadorGasto = response.data[0];
                }
            });
        });

        coreAmazonRequest.get("punto_salarial", "sortby=Vigencia&order=desc&limit=1").then(function(response) {
            self.punto_salarial = response.data[0];
        });

        coreAmazonRequest.get("salario_minimo", "sortby=Vigencia&order=desc&limit=1").then(function(response) {
            self.salario_minimo = response.data[0];
        });

        amazonAdministrativaRequest.get('vigencia_contrato', $.param({
            limit: -1
        })).then(function(response) {
            self.vigencia_data = response.data;
        });

        self.asignarValoresDefecto = function() {
            self.contratoGeneralBase.Contrato.Vigencia = new Date().getFullYear();
            self.contratoGeneralBase.Contrato.FormaPago = { Id: 240 };
            self.contratoGeneralBase.Contrato.DescripcionFormaPago = "Abono a Cuenta Mensual de acuerdo a puntas y hotras laboradas";
            self.contratoGeneralBase.Contrato.Justificacion = "Docente de Vinculacion Especial";
            self.contratoGeneralBase.Contrato.UnidadEjecucion = { Id: 205 };
            self.contratoGeneralBase.Contrato.LugarEjecucion = { Id: 4 };
            self.contratoGeneralBase.Contrato.Observaciones = "Contrato de Docente Vinculación Especial";
            self.contratoGeneralBase.Contrato.TipoControl = 181;
            self.contratoGeneralBase.Contrato.ClaseContratista = 33;
            self.contratoGeneralBase.Contrato.TipoMoneda = 137;
            self.contratoGeneralBase.Contrato.OrigenRecursos = 149;
            self.contratoGeneralBase.Contrato.OrigenPresupuesto = 156;
            self.contratoGeneralBase.Contrato.TemaGastoInversion = 166;
            self.contratoGeneralBase.Contrato.TipoGasto = 146;
            self.contratoGeneralBase.Contrato.RegimenContratacion = 136;
            self.contratoGeneralBase.Contrato.Procedimiento = 132;
            self.contratoGeneralBase.Contrato.ModalidadSeleccion = 123;
            self.contratoGeneralBase.Contrato.TipoCompromiso = 35;
            self.contratoGeneralBase.Contrato.TipologiaContrato = 46;
            self.contratoGeneralBase.Contrato.FechaRegistro = new Date();
            self.contratoGeneralBase.Contrato.UnidadEjecutora = 1;
            self.contratoGeneralBase.Contrato.Condiciones = "Sin condiciones";
            self.acta.Descripcion = "Acta inicio resolución Docente Vinculación Especial";
        };

        self.asignarValoresDefecto();

        financieraRequest.get("unidad_ejecutora/1").then(function(response) {
            self.unidad_ejecutora_defecto = response.data;
        });
        amazonAdministrativaRequest.get("parametros/240").then(function(response) {
            self.forma_pago_defecto = response.data;
        });
        amazonAdministrativaRequest.get("parametros/136").then(function(response) {
            self.regimen_contratacion_defecto = response.data;
        });


        self.cancelar = function() {
            $mdDialog.hide();
        };

        /*self.calcularSalario = function(){
            adminMidRequest.post("calculo_salario/Precontratacion/"+self.nivelAcademico+"/"+persona.Id+"/"+self.datosValor.NumSemanas+"/"+self.datosValor.NumHorasSemanales+"/asociado/"+self.datosValor.dedicacion).then(function(response){
              if(typeof(response.data)=="number"){
                self.valorContrato=response.data;
                  swal({
                    title: $translate.instant('VALOR_CONTRATO'),
                    text: NumeroALetras(response.data),
                    type: "info",
                    confirmButtonText: $translate.instant('ACEPTAR'),
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                  });
                  self.asignarValoresDefecto();
            }else{
              swal({
                    title: "Peligro",
                    text: $translate.instant('NO_CALCULADO_SALARIO'),
                    type: "danger",
                    confirmButtonText: $translate.instant('ACEPTAR'),
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                  });
            }
            });
        }*/

        self.realizarContrato = function() {
            if (self.datosFiltro.Dedicacion === "HCH") {
                self.contratoGeneralBase.Contrato.TipoContrato = { Id: 3 };
                self.contratoGeneralBase.Contrato.ObjetoContrato = "Docente de Vinculación Especial - Honorarios";
            } else if (self.datosFiltro.Dedicacion === "HCP") {
                self.contratoGeneralBase.Contrato.TipoContrato = { Id: 2 };
                self.contratoGeneralBase.Contrato.ObjetoContrato = "Docente de Vinculación Especial - Salario";
            } else {
                self.contratoGeneralBase.Contrato.TipoContrato = { Id: 18 };
                self.contratoGeneralBase.Contrato.ObjetoContrato = "Docente de Vinculación Especial - Medio Tiempo Ocasional (MTO) - Tiempo Completo Ocasional (TCO)";
            }
            swal({
                title: $translate.instant('EXPEDIR'),
                text: $translate.instant('SEGURO_EXPEDIR'),
                html: '<p><b>' + $translate.instant('NUMERO') + ': </b>' + resolucion.Numero.toString() + '</p>' +
                    '<p><b>' + $translate.instant('FACULTAD') + ': </b>' + resolucion.Facultad + '</p>' +
                    '<p><b>' + $translate.instant('NIVEL_ACADEMICO') + ': </b>' + resolucion.NivelAcademico + '</p>' +
                    '<p><b>' + $translate.instant('DEDICACION') + ': </b>' + resolucion.Dedicacion + '</p>',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: $translate.instant('ACEPTAR'),
                cancelButtonText: $translate.instant('CANCELAR'),
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
            }).then(function() {
                self.guardarContratos();
            }, function(dismiss) {
                if (dismiss === 'cancel') {
                    swal({
                        text: $translate.instant('EXPEDICION_NO_REALIZADA'),
                        type: 'error'
                    });
                }
            });
        };

        self.guardarContratos = function() {
            self.estado = true;
            var conjuntoContratos = [];
            //var errorInsercion = false;
            if (self.contratados) {
                self.contratados.forEach(function(contratado) {
                    var contratoGeneral = JSON.parse(JSON.stringify(self.contratoGeneralBase.Contrato));
                    var actaI = JSON.parse(JSON.stringify(self.acta));
                    contratoGeneral.Contratista = parseInt(contratado.IdPersona);
                    contratoGeneral.DependenciaSolicitante = contratado.IdProyectoCurricular.toString();
                    contratoGeneral.PlazoEjecucion = parseInt(contratado.NumeroHorasSemanales * 7);
                    contratoGeneral.OrdenadorGasto = self.ordenadorGasto.Id;
                    contratoGeneral.ValorContrato = parseInt(contratado.ValorContrato);
                    var contratoVinculacion = {
                        ContratoGeneral: contratoGeneral,
                        ActaInicio: actaI,
                        VinculacionDocente: { Id: parseInt(contratado.Id) }
                    };
                    if (self.datosFiltro.NivelAcademico.toLowerCase() === "pregrado") {
                        contratoVinculacion.VinculacionDocente.IdPuntoSalarial = self.punto_salarial.Id;
                    } else if (self.datosFiltro.NivelAcademico.toLowerCase() === "posgrado") {
                        contratoVinculacion.VinculacionDocente.IdSalarioMinimo = self.salario_minimo.Id;
                    }
                    conjuntoContratos.push(contratoVinculacion);
                });
                var expedicionResolucion = {
                    Vinculaciones: conjuntoContratos,
                    idResolucion: self.idResolucion,
                    FechaExpedicion: self.FechaExpedicion
                };
                adminMidRequest.post("expedir_resolucion/expedir", expedicionResolucion).then(function(response) {
                    self.estado = false;
                    //if(typeof(response.data)=="object"){ //xDD
                    /*
                                  self.alerta = "";
                                  for (var i = 1; i < response.data.length; i++) {
                                    self.alerta = self.alerta + response.data[i] + "\n";
                                  }*/
                    //swal("", self.alerta, response.data[0]);

                    //xD
                    swal({
                        title: $translate.instant('EXPEDIDA'),
                        text: $translate.instant('DATOS_REGISTRADOS'),
                        type: 'success',
                        confirmButtonText: $translate.instant('ACEPTAR')
                    }).then(function() {
                        $window.location.reload();
                    });

                    //  $mdDialog.hide()
                    /*  }else{
                        swal({
                          title: "Alerta",
                          text: $translate.instant('PROBLEMA_EXPEDICION'),
                          type: "warning",
                          confirmButtonText: $translate.instant('ACEPTAR'),
                          showLoaderOnConfirm: true,
                        });
                      }*/
                });
            } else {
                swal({
                    text: $translate.instant('NO_DOCENTES'),
                    title: "Alerta",
                    type: "warning",
                    confirmButtonText: $translate.instant('ACEPTAR'),
                    showLoaderOnConfirm: true,
                });
            }
        };

    });
