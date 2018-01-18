'use strict';

angular.module('contractualClienteApp')
.controller('ResolucionCancelacionCtrl', function (administrativaRequest,financieraRequest,resolucion,adminMidRequest,oikosRequest,$localStorage,$scope,$mdDialog,$translate,$window) {

  var self = this;

  self.resolucion = JSON.parse(localStorage.getItem("resolucion"));
  self.estado = false;
  self.proyectos=[];
  self.fecha = new Date();
  var desvinculacionesData=[];

  self.precontratados = {
    paginationPageSizes: [10, 15, 20],
    paginationPageSize: 10,
    enableRowSelection: true,
    enableRowHeaderSelection: true,
    enableFiltering: true,
    enableHorizontalScrollbar: 0,
    enableVerticalScrollbar: true,
    useExternalPagination: false,
    enableSelectAll: false,
    columnDefs : [
      {field: 'Id', visible : false},
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
      {field: 'Vigencia',visible:false},
      {field: 'NumeroContrato',visible:false},
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
      self.id_modificacion_resolucion = response.data[0].Id;

  });
  //Función para visualizar docentes ya vinculados a resolución
  self.get_docentes_vinculados=function(){

    self.estado = true;
    adminMidRequest.get("gestion_previnculacion/docentes_previnculados", "id_resolucion="+self.resolucion.Id).then(function(response){
      self.precontratados.data=response.data;
      self.estado = false;

    });

    self.precontratados.columnDefs[11].filter.term = self.term;


  };



  self.verCancelarInscripcionDocente=function(row){
    swal({
      title: $translate.instant('PREGUNTA_SEGURO'),
      text: $translate.instant('CONFIRMAR_DESVINCULACION'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: $translate.instant('DESVINCULAR_DOCENTE'),
      cancelButtonText: $translate.instant('CANCELAR'),
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then(function () {
      self.desvincularDocente(row);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(
          $translate.instant('CANCELADO'),
          $translate.instant('DESVINCULACION_CANCELADA'),
          'error'
        );
      }
    });
  };


  self.desvincularDocente = function(row){

    console.log("id de modificacion res");
    console.log(self.id_modificacion_resolucion);
    self.personasSeleccionadas.forEach(function(personaSeleccionada){
      var docente_a_desvincular = {
      Id :              personaSeleccionada.Id,
      IdPersona :           personaSeleccionada.IdPersona,
      NumeroHorasSemanales : personaSeleccionada.NumeroHorasSemanales,
      NumeroSemanas  :     personaSeleccionada.NumeroSemanas,
      IdResolucion     : {Id: self.resolucion.Id},
      IdDedicacion     :   {Id: personaSeleccionada.IdDedicacion.Id},
      IdProyectoCurricular : personaSeleccionada.IdProyectoCurricular,
      Estado              : Boolean(false),
      FechaRegistro: self.fecha,
      ValorContrato        : personaSeleccionada.ValorContrato,
      Categoria: personaSeleccionada.Categoria,
      Disponibilidad: personaSeleccionada.Disponibilidad,
      Vigencia: personaSeleccionada.Vigencia,
      NumeroContrato: personaSeleccionada.NumeroContrato 
      };

      desvinculacionesData.push(docente_a_desvincular);

    });

    var objeto_a_enviar = {
      IdModificacionResolucion : self.id_modificacion_resolucion,
      DocentesDesvincular : desvinculacionesData
    };


    adminMidRequest.post("gestion_desvinculaciones/actualizar_vinculaciones",objeto_a_enviar).then(function(response){
      if(response.data==="OK"){
        self.persona=null;
        swal({
          text: $translate.instant('ALERTA_DESVIN_EXITOSA'),
          type: 'success',
          confirmButtonText: $translate.instant('ACEPTAR')

        });
         $window.location.reload();
      }else{
        swal({
          title: $translate.instant('ERROR'),
          text: $translate.instant('ALERTA_ERROR_DESVIN'),
          type: 'error',
          confirmButtonText: $translate.instant('ACEPTAR')
        });

      }
    });


  };



});
