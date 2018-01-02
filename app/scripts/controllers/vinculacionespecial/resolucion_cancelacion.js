'use strict';

angular.module('contractualClienteApp')
.controller('ResolucionCancelacionCtrl', function (administrativaRequest,financieraRequest,resolucion,adminMidRequest,oikosRequest,$localStorage,$scope,$mdDialog,$translate,$window) {

  var self = this;

  self.resolucion = JSON.parse(localStorage.getItem("resolucion"))
  self.estado = false;
  self.proyectos=[];
  self.fecha = new Date();

  self.precontratados = {
    paginationPageSizes: [10, 15, 20],
    paginationPageSize: 10,
    enableSorting: true,
    enableFiltering : true,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
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
      {
        field: 'cancelar',
        enableSorting: false,
        enableFiltering: false,
        width: '15%',
        displayName:  $translate.instant('OPCIONES'),
        cellTemplate: '<center>' +
        '<a class="borrar" ng-click="grid.appScope.verCancelarInscripcionDocente(row)">' +
        '<i title="{{\'BORRAR_BTN\' | translate }}" class="fa fa-trash fa-lg  faa-shake animated-hover"></i></a></div>' +
        '</center>'
      }
    ]
  };

  oikosRequest.get("dependencia/proyectosPorFacultad/"+self.resolucion.IdFacultad+"/"+self.resolucion.NivelAcademico_nombre,"").then(function(response){
    self.proyectos = response.data;
    self.defaultSelectedPrecont = self.proyectos[0].Id;
  });

  administrativaRequest.get("modificacion_resolucion","limit=-1&query=ResolucionNueva:"+self.resolucion.Id).then(function(response){
      self.resolucion.Id = response.data[0].ResolucionAnterior

  });
  //Función para visualizar docentes ya vinculados a resolución
  self.get_docentes_vinculados=function(){

    self.estado = true;
    adminMidRequest.get("informacionDocentes/docentes_previnculados", "id_resolucion="+self.resolucion.Id).then(function(response){
      self.precontratados.data=response.data;
      self.estado = false;

    });

    self.precontratados.columnDefs[11].filter.term = self.term;


  }



  $scope.verCancelarInscripcionDocente=function(row){
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
        )
      }
    })
  }


  self.desvincularDocente = function(row){

    var docente_a_desvincular = {
    Id :              row.entity.Id,
    IdPersona :            row.entity.IdPersona,
    NumeroHorasSemanales : row.entity.NumeroHorasSemanales,
    NumeroSemanas  :     row.entity.NumeroSemanas,
    IdResolucion     : {Id: self.resolucion.Id},
    IdDedicacion     :   {Id:row.entity.IdDedicacion.Id},
    IdProyectoCurricular : row.entity.IdProyectoCurricular,
    Estado              : Boolean(false),
    FechaRegistro: self.fecha,
    ValorContrato        : row.entity.ValorContrato,
    Categoria: row.entity.Categoria,
    Disponibilidad: row.entity.Disponibilidad
    };

    console.log("doc")
    console.log(docente_a_desvincular)
    administrativaRequest.put("vinculacion_docente",row.entity.Id,docente_a_desvincular).then(function(response){
      console.log("respuesta")
      console.log(response.data)
      if(response.data=="OK"){
        self.persona=null;
        swal({
          text: $translate.instant('DESVINCULACION_EXITOSA'),
          type: 'success',
          confirmButtonText: $translate.instant('ACEPTAR')

        })
         $window.location.reload();
      }else{
        swal({
          title: $translate.instant('ERROR'),
          text: $translate.instant('DESVINCULACION_NOEXITOSA'),
          type: 'error',
          confirmButtonText: $translate.instant('ACEPTAR')
        })

      }
    })
  }



});
