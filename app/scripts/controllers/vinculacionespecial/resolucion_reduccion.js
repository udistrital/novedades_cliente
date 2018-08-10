'use strict';

angular.module('contractualClienteApp')
    .controller('ResolucionReduccionCtrl', function (amazonAdministrativaRequest, administrativaRequest, financieraRequest, resolucion, adminMidRequest, oikosRequest, colombiaHolidaysService, $localStorage, $scope, $mdDialog, $translate, $window) {

        var self = this;

        self.resolucion = JSON.parse(localStorage.getItem("resolucion"));
        self.estado = false;
        self.proyectos = [];
        self.vigencia_data = self.resolucion.Vigencia;
        self.fecha = new Date();
        self.saldo_disponible = true;
        self.semanasTranscurridas = 0;
        var desvinculacionesData = [];

        self.precontratados = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: true,
            useExternalPagination: false,
            enableSelectAll: false,
            columnDefs: [
                { field: 'Id', visible: false },
                { field: 'FechaRegistro', visible: false },
                { field: 'NombreCompleto', width: '15%', displayName: $translate.instant('NOMBRE') },
                { field: 'IdPersona', width: '10%', displayName: $translate.instant('DOCUMENTO_DOCENTES') },
                { field: 'Categoria', width: '10%', displayName: $translate.instant('CATEGORIA') },
                { field: 'IdDedicacion.NombreDedicacion', width: '10%', displayName: $translate.instant('DEDICACION') },
                { field: 'IdDedicacion.Id', visible: false },
                { field: 'Disponibilidad', visible: false },
                { field: 'DependenciaAcademica', visible: false },
                { field: 'NumeroHorasSemanales', width: '8%', displayName: $translate.instant('HORAS_SEMANALES') },
                { field: 'NumeroSemanas', width: '7%', displayName: $translate.instant('SEMANAS') },
                { field: 'NumeroDisponibilidad', width: '15%', displayName: $translate.instant('NUM_DISPO_DOCENTE') },
                { field: 'ValorContrato', width: '15%', displayName: $translate.instant('VALOR_CONTRATO'), cellClass: "valorEfectivo", cellFilter: "currency" },
                {
                    field: 'IdProyectoCurricular',
                    visible: false,
                    filter: {
                        term: self.term
                    }
                },
                { field: 'Vigencia', visible: false },
                { field: 'NumeroContrato', visible: false },
                {
                    field: 'cancelar',
                    enableSorting: false,
                    enableFiltering: false,
                    width: '15%',
                    displayName: $translate.instant('OPCIONES'),
                    cellTemplate: '<center>' +
                        '<a class="borrar" ng-click="grid.appScope.mostrar_modal_adicion(row)">' +
                        '<i title="{{\'REDUCIR_BTN\' | translate }}" class="fa fa-minus-circle  faa-shake animated-hover"></i></a></div>' +
                        '</center>'
                }
            ],

            onRegisterApi: function (gridApi) {
                self.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function () {
                    self.personasSeleccionadas = gridApi.selection.getSelectedRows();

                });
            }
        };

        self.Disponibilidades = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            multiSelect: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: true,
            useExternalPagination: false,
            enableSelectAll: false,
            columnDefs: [{
                field: 'NumeroDisponibilidad',
                displayName: $translate.instant('NUM_DISPO_DOCENTE')
            },
            {
                field: 'Vigencia',
                displayName: $translate.instant('VIGENCIA_DISP')
            },
            {
                field: 'FechaRegistro',
                displayName: $translate.instant('FECHA_DISP'),
                cellTemplate: '<span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"+0900"}}</span>'
            }
            ],

            onRegisterApi: function (gridApi) {
                self.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function () {
                    self.disponibilidad_elegida = gridApi.selection.getSelectedRows();
                    self.DisponibilidadApropiacion = self.disponibilidad_elegida[0].DisponibilidadApropiacion;
                    self.listar_apropiaciones();


                });
            }
        };

        self.Apropiaciones = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            multiSelect: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: true,
            useExternalPagination: false,
            enableSelectAll: false,
            columnDefs: [

                {
                    field: 'Apropiacion.Valor',
                    displayName: $translate.instant('VALOR_APROPIACION')
                },
                {
                    field: 'Apropiacion.Saldo',
                    displayName: $translate.instant('SALDO_APROPIACION')
                }
            ],

            onRegisterApi: function (gridApi) {
                self.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function () {
                    self.apropiacion_elegida = gridApi.selection.getSelectedRows();
                    self.verificarDisponibilidad();
                });
            }
        };

        oikosRequest.get("dependencia/proyectosPorFacultad/" + self.resolucion.IdFacultad + "/" + self.resolucion.NivelAcademico_nombre, "").then(function (response) {
            self.proyectos = response.data;
            self.defaultSelectedPrecont = self.proyectos[0].Id;
        });

        administrativaRequest.get("modificacion_resolucion", "limit=-1&query=ResolucionNueva:" + self.resolucion.Id).then(function (response) {
            self.resolucion.Id = response.data[0].ResolucionAnterior;
            self.resolucion_id_nueva = response.data[0].ResolucionNueva;
            self.id_modificacion_resolucion = response.data[0].Id;
            self.get_docentes_vinculados();
        });
        //Función para visualizar docentes ya vinculados a resolución
        self.get_docentes_vinculados = function () {

            self.estado = true;
            adminMidRequest.get("gestion_previnculacion/docentes_previnculados", "id_resolucion=" + self.resolucion.Id).then(function (response) {
                self.precontratados.data = response.data;
                self.estado = false;
            });

            self.precontratados.columnDefs[12].filter.term = self.term;


        };


        $scope.mostrar_modal_adicion = function (row) {
            self.horas_actuales = row.entity.NumeroHorasSemanales;
            self.semanas_actuales = row.entity.NumeroSemanas;
            self.disponibilidad_actual = row.entity.NumeroDisponibilidad;
            self.persona_a_modificar = row.entity;
            self.disponibilidad_actual_id = row.entity.Disponibilidad;
            self.disponibilidad_nueva_id = row.entity.Disponibilidad;
            self.getRPs(self.persona_a_modificar.NumeroContrato.String, self.persona_a_modificar.Vigencia.Int64, self.persona_a_modificar.IdPersona);
            amazonAdministrativaRequest.get("acta_inicio", $.param({
                query: 'NumeroContrato:' + self.persona_a_modificar.NumeroContrato.String + ',Vigencia:' + self.persona_a_modificar.Vigencia.Int64
            })).then(function (response) {
                self.acta = response.data[0];
                self.fechaIni = new Date(self.acta.FechaInicio);
                self.fechaActa = self.fechaUtc(self.fechaIni);
                if (self.FechaInicio == undefined) {
                    self.calculoSemanasTranscurridas(self.fecha);
                    self.maximoSemanasReducir = self.semanas_actuales - self.semanasTranscurridas;
                }
                $('#modal_adicion').modal('show');
            }); 

        };

        self.listar_apropiaciones = function () {

            var disponibilidadAp = self.DisponibilidadApropiacion;
            adminMidRequest.post("consultar_disponibilidades/listar_apropiaciones", disponibilidadAp).then(function (response) {
                self.Apropiaciones.data = response.data;
            });

        };

        self.verificarDisponibilidad = function () {

            var vinculacionDocente = {

                IdPersona: self.persona_a_modificar.IdPersona,
                NumeroHorasSemanales: parseInt(self.horas_actuales),
                NumeroHorasNuevas: parseInt(self.horas_totales),
                NumeroHSemanas: parseInt(self.semanas_actuales),
                NumeroSemanasNuevas: parseInt(self.semanas_totales),
                NumeroSemanas: parseInt(self.persona_a_modificar.NumeroSemanas),
                IdResolucion: { Id: parseInt(self.resolucion.Id) },
                IdDedicacion: { Id: parseInt(self.persona_a_modificar.IdDedicacion.Id) },
                IdProyectoCurricular: parseInt(self.persona_a_modificar.IdProyectoCurricular),
                Categoria: self.persona_a_modificar.Categoria.toUpperCase(),
                Dedicacion: self.persona_a_modificar.IdDedicacion.NombreDedicacion.toUpperCase(),
                NivelAcademico: self.resolucion.NivelAcademico_nombre,
                Disponibilidad: self.apropiacion_elegida[0].Id,
                NumeroContrato: self.persona_a_modificar.NumeroContrato,
                Vigencia: { Int64: parseInt(self.resolucion.Vigencia), valid: true }
            };

            desvinculacionesData.push(vinculacionDocente);

            adminMidRequest.post("gestion_previnculacion/Precontratacion/calcular_valor_contratos", desvinculacionesData).then(function (response) {

                if (response.data > parseInt(self.apropiacion_elegida[0].Apropiacion.Saldo)) {
                    self.saldo_disponible = false;

                } else {
                    self.saldo_disponible = true;
                    self.disponibilidad_nueva_id = self.apropiacion_elegida[0].Id;

                }
            });

            desvinculacionesData = [];
        };

        self.RecargarDatosPersonas = function () {
            adminMidRequest.get("gestion_previnculacion/Precontratacion/docentes_x_carga_horaria", "vigencia=" + self.resolucion.Vigencia + "&periodo=" + self.resolucion.Periodo + "&tipo_vinculacion=" + self.resolucion.Dedicacion + "&facultad=" + self.resolucion.IdFacultad).then(function (response) {
                self.datosDocentesCargaLectiva.data = response.data;

            });
        };

        self.RecargarDisponibilidades = function () {
            financieraRequest.get('disponibilidad', "limit=-1?query=Vigencia:" + self.vigencia_data).then(function (response) {
                self.Disponibilidades.data = response.data;

            });
        };

        self.RecargarApropiaciones = function () {
            self.Apropiaciones.data = [];

        };

        self.Calcular_horas_totales = function () {
            self.horas_totales = parseInt(self.horas_actuales) - parseInt(self.horas_a_adicionar);

        };

        self.Calcular_semanas_totales = function () {
            self.semanas_totales = parseInt(self.semanas_actuales) - parseInt(self.semanas_a_adicionar);

        };

        self.cambiar_disponibilidad = function () {
            self.cambio_disp = true;
        };

        self.realizar_nueva_vinculacion = function () {
            if (self.semanas_a_adicionar != undefined && self.horas_a_adicionar != undefined && self.FechaInicio != undefined && self.persona_a_modificar.InformacionRp != undefined) {
                if (self.saldo_disponible) {
                    self.calculoSemanasTranscurridas(self.FechaInicio);
                    self.semanasRestantes = self.semanas_totales - self.semanasTranscurridas;
                    self.persona_a_modificar.InformacionRp = JSON.parse( self.persona_a_modificar.InformacionRp);
                    self.persona_a_modificar.InformacionRp.rp = parseInt(self.persona_a_modificar.InformacionRp.rp,10);
                    self.persona_a_modificar.InformacionRp.vigencia = parseInt(self.persona_a_modificar.InformacionRp.vigencia,10);
                    var vinculacionDocente = {
                        Id: self.persona_a_modificar.Id,
                        FechaRegistro: self.persona_a_modificar.FechaRegistro,
                        IdPersona: self.persona_a_modificar.IdPersona,
                        NumeroHorasSemanales: parseInt(self.horas_actuales),
                        NumeroHorasNuevas: parseInt(self.horas_a_adicionar),
                        NumeroSemanas: parseInt(self.semanas_actuales),
                        NumeroSemanasNuevas: parseInt(self.semanas_a_adicionar),
                        NumeroSemanasRestantes: parseInt(self.semanasRestantes),
                        IdResolucion: { Id: parseInt(self.persona_a_modificar.IdResolucion.Id) },
                        IdDedicacion: { Id: parseInt(self.persona_a_modificar.IdDedicacion.Id) },
                        IdProyectoCurricular: parseInt(self.persona_a_modificar.IdProyectoCurricular),
                        Categoria: self.persona_a_modificar.Categoria.toUpperCase(),
                        ValorContrato: self.persona_a_modificar.ValorContrato,
                        Dedicacion: self.persona_a_modificar.IdDedicacion.NombreDedicacion.toUpperCase(),
                        NivelAcademico: self.resolucion.NivelAcademico_nombre,
                        Disponibilidad: parseInt(self.disponibilidad_actual_id),
                        Vigencia: { Int64: parseInt(self.resolucion.Vigencia), valid: true },
                        NumeroContrato: self.persona_a_modificar.NumeroContrato,
                        FechaInicio: self.FechaInicio,
                        NumeroRp:self.persona_a_modificar.InformacionRp.rp,
                        VigenciaRp:self.persona_a_modificar.InformacionRp.vigencia,
                        DependenciaAcademica: self.persona_a_modificar.DependenciaAcademica,
                    };

                    desvinculacionesData.push(vinculacionDocente);

                    var objeto_a_enviar = {
                        IdModificacionResolucion: self.id_modificacion_resolucion,
                        IdNuevaResolucion: self.resolucion_id_nueva,
                        DisponibilidadNueva: self.disponibilidad_nueva_id,
                        TipoDesvinculacion: "Reducción",
                        DocentesDesvincular: desvinculacionesData
                    };
                    
                    adminMidRequest.post("gestion_desvinculaciones/adicionar_horas", objeto_a_enviar).then(function (response) {

                        if (response.data === "OK") {
                            swal({
                                text: $translate.instant('ALERTA_REDUCCION_EXITOSA'),
                                type: 'success',
                                confirmButtonText: $translate.instant('ACEPTAR')

                            });
                            //LIMPIAR GRID
                            desvinculacionesData = [];
                            $window.location.reload();
                        } else {
                            swal({
                                title: $translate.instant('ERROR'),
                                text: $translate.instant('ALERTA_ERROR_REDUCCION'),
                                type: 'info',
                                confirmButtonText: $translate.instant('ACEPTAR')
                            });
                            //LIMPIAR GRID
                            desvinculacionesData = [];
                            $window.location.reload();
                        }
                    });
                } else {
                    swal({
                        title: $translate.instant('ERROR'),
                        text: $translate.instant('ERROR_DISP'),
                        type: 'info',
                        confirmButtonText: $translate.instant('ACEPTAR')
                    });
                }

            } 
        };

        //Función para hacer el cálculo de semanas en dos casos:
        //(1) Entre la fecha de inicio original y la fecha actual para determinar el máximo de semanas a reversar
        //(2) Entre la fecha de inicio original y la fecha de inicio escogida en la reducción para el cálculo de horas a reversar
        self.calculoSemanasTranscurridas = function (fechaCalculo) {
            var dias = (fechaCalculo - self.fechaActa) / 1000 / 60 / 60 / 24;
            if (dias > 0) {
                var semanasDecimal = dias / 30 * 4; // cálculo con base en mes de 30 días y 4 semanas
                var decimal = semanasDecimal % 1;
                self.semanasTranscurridas = semanasDecimal - decimal;
                if (decimal > 0) {
                    self.semanasTranscurridas = self.semanasTranscurridas + 1;
                }
            }
        };

        self.CalculoSemanasRestantes = function () {
            self.calculoSemanasTranscurridas(self.FechaInicio);
            self.semanasRestantes = self.semanas_actuales - self.semanasTranscurridas;
            self.maximoSemanasReducir = self.semanasRestantes;
        }
        
        //Función para convertir las fechas a UTC declaradas desde el cliente (Las que vengan por gets corregirlas desde los apis)
        self.fechaUtc = function (fecha) {
            var _fechaConUtc = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate(), fecha.getUTCHours(), fecha.getUTCMinutes(), fecha.getUTCSeconds());
            return _fechaConUtc;
        };

        self.getRPs = function(vinculacion,vigencia,identificacion){
            adminMidRequest.get("gestion_previnculacion/rp_docente/"+vinculacion+"/"+vigencia+"/"+identificacion, "").then(function (response) {
            self.rps = response.data.cdp_rp_docente.cdp_rp;
            });
        }
        $scope.validarFecha = colombiaHolidaysService.validateDate;
    });
