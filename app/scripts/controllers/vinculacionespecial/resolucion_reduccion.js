'use strict';

angular.module('contractualClienteApp')
.controller('ResolucionReduccionCtrl', function (administrativaRequest,financieraRequest,resolucion,adminMidRequest,oikosRequest,$localStorage,$scope,$mdDialog,$translate,$window) {

  var self = this;

  self.resolucion = JSON.parse(localStorage.getItem("resolucion"))
  self.estado = false;
  self.proyectos=[];
  self.vigencia_data = self.resolucion.Vigencia;
  self.fecha = new Date();
  self.saldo_disponible = true;
  var desvinculacionesData=[];

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
  self.get_docentes_vinculados=function(){

    self.estado = true;
    adminMidRequest.get("gestion_previnculacion/docentes_previnculados", "id_resolucion="+self.resolucion.Id).then(function(response){
      self.precontratados.data=response.data;
      self.estado = false;

    });

    self.precontratados.columnDefs[12].filter.term = self.term;


  }

  $scope.mostrar_modal_adicion=function(row){
    self.horas_actuales = row.entity.NumeroHorasSemanales;
    self.disponibilidad_actual = row.entity.NumeroDisponibilidad;
    self.disponibilidad_actual_id = row.entity.Disponibilidad;
    self.disponibilidad_nueva_id = row.entity.Disponibilidad;
    self.persona_a_modificar = row.entity;
      $('#modal_adicion').modal('show');
  }



  self.Calcular_horas_totales = function(){
    self.horas_totales = parseInt(self.horas_actuales) - parseInt(self.horas_a_reducir);

  }

  self.realizar_nueva_vinculacion = function(){


    var vinculacionDocente = {
      Id: self.persona_a_modificar.Id,
      FechaRegistro: self.persona_a_modificar.FechaRegistro,
      IdPersona: self.persona_a_modificar.IdPersona,
      NumeroContrato: null,
      Vigencia:null,
      NumeroHorasSemanales: parseInt(self.horas_actuales),
      NumeroHorasNuevas: parseInt(self.horas_totales),
      NumeroSemanas: parseInt(self.persona_a_modificar.NumeroSemanas),
      IdResolucion: {Id: parseInt(self.resolucion.Id)},
      IdDedicacion: {Id: parseInt(self.persona_a_modificar.IdDedicacion.Id)},
      IdProyectoCurricular: parseInt(self.persona_a_modificar.IdProyectoCurricular),
      Categoria: self.persona_a_modificar.Categoria.toUpperCase(),
      ValorContrato: self.persona_a_modificar.ValorContrato,
      Dedicacion: self.persona_a_modificar.IdDedicacion.NombreDedicacion.toUpperCase(),
      NivelAcademico: self.resolucion.NivelAcademico_nombre,
      Disponibilidad: parseInt(self.disponibilidad_actual_id),
    };

    desvinculacionesData.push(vinculacionDocente);

    var objeto_a_enviar = {
      IdModificacionResolucion : self.id_modificacion_resolucion,
      IdNuevaResolucion:   self.resolucion_id_nueva,
      DisponibilidadNueva: self.disponibilidad_nueva_id,
      DocentesDesvincular : desvinculacionesData
    }

    console.log("objeto a enviar")
    console.log(objeto_a_enviar)

    adminMidRequest.post("gestion_desvinculaciones/adicionar_horas",objeto_a_enviar).then(function(response){

      if(response.data=="OK"){
        swal({
          text: $translate.instant('ALERTA_REDUCCION_EXITOSA'),
          type: 'success',
          confirmButtonText: $translate.instant('ACEPTAR')

        })
        //LIMPIAR GRID
        desvinculacionesData = [];
        $window.location.reload();
      //  $('#modal_adicion').modal('hide');
      }else{
        swal({
          title: $translate.instant('ERROR'),
          text: $translate.instant('ALERTA_ERROR_REDUCCION'),
          type: 'info',
          confirmButtonText: $translate.instant('ACEPTAR')
        })
          //LIMPIAR GRID
        desvinculacionesData = [];
         $window.location.reload();
      //  $('#modal_adicion').modal('hide');
      }
    })

  }

});
