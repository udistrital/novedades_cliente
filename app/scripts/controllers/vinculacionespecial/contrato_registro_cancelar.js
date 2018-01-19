'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ContratoRegistroCancelarCtrl
 * @description
 * # ContratoRegistroCancelarCtrl
 * Controller of the clienteApp
 */

angular.module('contractualClienteApp')
    .controller('ContratoRegistroCancelarCtrl', function(amazonAdministrativaRequest, administrativaRequest, adminMidRequest, oikosRequest, coreAmazonRequest, financieraRequest, contratacion_request, contratacion_mid_request, sicapitalRequest, idResolucion, $mdDialog, lista, resolucion, $translate) {

        var self = this;
        self.contratoCanceladoBase = {};
        //self.contratoGeneralBase.Contrato = {};
        //self.info_desvincular = false;
        self.idResolucion = idResolucion;
        self.estado = false;
        self.cantidad = 0;


        administrativaRequest.get("resolucion_vinculacion_docente/" + self.idResolucion).then(function(response) {
            self.datosFiltro = response.data;

            oikosRequest.get("dependencia/" + self.datosFiltro.IdFacultad.toString()).then(function(response) {

                //self.contratoGeneralBase.Contrato.SedeSolicitante = response.data.Id.toString();
                self.sede_solicitante_defecto = response.data.Nombre;
            });


            adminMidRequest.get("gestion_desvinculaciones/docentes_cancelados", "id_resolucion=" + self.idResolucion.toString()).then(function(response) {

                self.contratados = response.data;
                var yeison = JSON.parse(JSON.stringify(self.contratados));
                self.cantidad = Object.keys(yeison).length;
                console.log("Yep ",yeison);
                console.log("Nope ",self.cantidad);

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


        self.asignarValoresDefecto = function() {
            self.contratoCanceladoBase.Usuario = "";
            self.contratoCanceladoBase.Estado = true;
        };

        self.cancelar = function() {
            $mdDialog.hide();
        };

        self.cancelarContrato = function() {
            self.asignarValoresDefecto();
            
            swal({
                title: $translate.instant('EXPEDIR'),
                text: $translate.instant('SEGURO_EXPEDIR'),
                html: '<p><b>' + $translate.instant('NUMERO') + ': </b>' + resolucion.Numero.toString() + '</p>' +
                    '<p><b>' + $translate.instant('FACULTAD') + ': </b>' + resolucion.Facultad + '</p>' +
                    '<p><b>' + $translate.instant('NIVEL_ACADEMICO') + ': </b>' + resolucion.NivelAcademico + '</p>' +
                    '<p><b>' + $translate.instant('DEDICACION') + ': </b>' + resolucion.Dedicacion + '</p>' +
                    '<p><b>' + $translate.instant('NUMERO_CANCELACIONES') + ': </b>' + self.cantidad + '</p>',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: $translate.instant('ACEPTAR'),
                cancelButtonText: $translate.instant('CANCELAR'),
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
            }).then(function() {
                self.expedirCancelar();
            }, function(dismiss) {
                if (dismiss === 'cancel') {
                    swal({
                        text: $translate.instant('EXPEDICION_NO_REALIZADA'),
                        type: 'error'
                    });
                }
            });
        };

        self.expedirCancelar = function() {
            self.estado = true;
            var conjuntoContratos = [];
            if (self.contratados) {
                self.contratados.forEach(function(contratado) {
                    var contratoCancelado = JSON.parse(JSON.stringify(self.contratoCanceladoBase));
                    contratoCancelado.NumeroContrato = contratado.NumeroContrato.String;
                    contratoCancelado.Vigencia = contratado.Vigencia.Int64;
                    var CancelacionContrato = {
                        ContratoCancelado: contratoCancelado,
                        VinculacionDocente: { Id: parseInt(contratado.Id) }
                    };
                    conjuntoContratos.push(CancelacionContrato);
                });
                var expedicionResolucion = {
                    Vinculaciones: conjuntoContratos,
                    idResolucion: self.idResolucion
                };
                console.log("contratos a insertar");
                console.log(expedicionResolucion);
                adminMidRequest.post("expedir_resolucion/cancelar", expedicionResolucion).then(function(response) {
                    console.log("Soy el de expedicionResolucion");
                    console.log(expedicionResolucion);
                    console.log("Resolucion expedida, siiiiiiiiiiiiii");
                    console.log(response);
                    self.estado = false;
                    swal({
                        title: $translate.instant('EXPEDIDA'),
                        text: $translate.instant('DATOS_CANCELADOS'),
                        type: 'success',
                        confirmButtonText: $translate.instant('ACEPTAR')
                    }).then(function() {
                        $window.location.reload();
                    });
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

        //HERE

        self.cancelados = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableSorting: true,
            enableFiltering: true,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            columnDefs: [
                { field: 'NombreCompleto', width: '22%', displayName: $translate.instant('NOMBRE') },
                { field: 'IdPersona', width: '13%', displayName: $translate.instant('DOCUMENTO_DOCENTES') },
                { field: 'Categoria', width: '10%', displayName: $translate.instant('CATEGORIA') },
                { field: 'NumeroHorasSemanales', width: '15%', displayName: $translate.instant('HORAS_SEMANALES') },
                { field: 'NumeroSemanas', width: '10%', displayName: $translate.instant('SEMANAS') },
                { field: 'NumeroDisponibilidad', width: '15%', displayName: $translate.instant('NUM_DISPO_DOCENTE') },
                { field: 'ValorContrato', width: '15%', displayName: $translate.instant('VALOR_CONTRATO'), cellClass: "valorEfectivo", cellFilter: "currency" }
            ]
        };

        //Función para visualizar docentes para cancelar su vinculacion resolución
        self.get_docentes_cancelados = function() {
            self.info_desvincular = !self.info_desvincular;
            adminMidRequest.get("gestion_desvinculaciones/docentes_cancelados", "id_resolucion=" + self.idResolucion).then(function(response) {
                //console.log("Admirad!: ",response.data)
                self.cancelados.data = response.data;
            });
        };

        self.get_docentes_cancelados();

    });