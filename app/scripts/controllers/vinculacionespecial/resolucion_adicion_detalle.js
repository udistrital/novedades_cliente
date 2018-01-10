'use strict';

angular.module('contractualClienteApp')
.controller('ResolucionAdicionDetalleCtrl', function (administrativaRequest,financieraRequest,resolucion,adminMidRequest,oikosRequest,$localStorage,$scope,$mdDialog,$translate,$window) {

  var self = this;

  self.resolucion = JSON.parse(localStorage.getItem("resolucion"))
  self.estado = false;
  self.proyectos=[];
  self.vigencia_data = self.resolucion.Vigencia;
  self.fecha = new Date();
  self.saldo_disponible = true;
  var desvinculacionesData=[];

  self.precontratados_adicion = {
    paginationPageSizes: [10, 15, 20],
    paginationPageSize: 10,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
    enableFiltering: true,
    enableHorizontalScrollbar: 0,
    enableVerticalScrollbar: true,
    useExternalPagination: false,
    enableSelectAll: false,
    columnDefs : [
      {field: 'Id', visible : false},
      {field: 'FechaRegistr', visible : false},
      {field: 'NombreCompleto', width: '15%', displayName: $translate.instant('NOMBRE')},
      {field: 'IdPersona', width: '10%',displayName: $translate.instant('DOCUMENTO_DOCENTES')},
      {field: 'Categoria', width: '10%',displayName: $translate.instant('CATEGORIA')},
      {field: 'IdDedicacion.NombreDedicacion', width: '10%',displayName: $translate.instant('DEDICACION')},
      {field: 'IdDedicacion.Id',visible:false},
      {field: 'Disponibilidad', visible : false},
      {field: 'NumeroHorasSemanales', width: '8%',displayName: $translate.instant('HORAS_SEMANALES')},
      {field: 'NumeroSemanas', width: '7%',displayName: $translate.instant('SEMANAS')},
      {field: 'NumeroDisponibilidad', width: '15%',displayName: $translate.instant('NUM_DISPO_DOCENTE') },
      {field: 'ValorContrato', width: '15%',displayName: $translate.instant('VALOR_CONTRATO'), cellClass:"valorEfectivo", cellFilter:"currency"},
      {field: 'IdProyectoCurricular', visible:false,filter: {
        term: self.term
      }},
      {
        field: 'cancelar',
        enableSorting: false,
        enableFiltering: false,
        width: '15%',
        displayName:  $translate.instant('OPCIONES'),
        cellTemplate: '<center>' +
        '<a class="borrar" ng-click="grid.appScope.mostrar_modal_adicion(row)">' +
        '<i title="{{\'BORRAR_BTN\' | translate }}" class="fa fa-trash fa-lg  faa-shake animated-hover"></i></a></div>' +
        '</center>'
      }
    ],

    onRegisterApi : function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        self.personasSeleccionadas=gridApi.selection.getSelectedRows();

      });
    }
  };



  oikosRequest.get("dependencia/proyectosPorFacultad/"+self.resolucion.IdFacultad+"/"+self.resolucion.NivelAcademico_nombre,"").then(function(response){
    self.proyectos = response.data;
    self.defaultSelectedPrecont = self.proyectos[0].Id;
  });

  administrativaRequest.get("modificacion_resolucion","limit=-1&query=ResolucionNueva:"+self.resolucion.Id).then(function(response){
      self.resolucion.Id = response.data[0].ResolucionAnterior;
      self.resolucion_id_nueva = response.data[0].ResolucionNueva;
      self.id_modificacion_resolucion = response.data[0].Id

  });
  //Función para visualizar docentes ya vinculados a resolución
  self.get_docentes_vinculados_adicion=function(){

    self.estado = true;
    adminMidRequest.get("gestion_previnculacion/docentes_previnculados", "id_resolucion="+self.resolucion_id_nueva).then(function(response){
      self.precontratados_adicion.data=response.data;
      self.estado = false;

    });

    self.precontratados_adicion_data.columnDefs[12].filter.term = self.term;


  }

});
