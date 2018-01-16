'use strict';

/**
* @ngdoc function
* @name clienteApp.controller:ResolucionAdministracionCtrl
* @description
* # ResolucionAdministracionCtrl
* Controller of the clienteApp
*/
angular.module('contractualClienteApp')
.controller('ResolucionAdministracionCtrl', function (administrativaRequest,adminMidRequest,titan_request,$scope,$window,$mdDialog,$translate) {

  var self = this;

  //Tabla para mostrar los datos básicos de las resoluciones almacenadas dentro del sistema
  self.resolucionesInscritas = {
    paginationPageSizes: [10, 15, 20],
    paginationPageSize: 10,
    enableSorting: true,
    enableFiltering : true,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
    columnDefs : [
      {
        field: 'Id',
        visible : false
      },
      {
        field: 'FechaExpedicion',
        visible : false
      },
      {
        field: 'Estado',
        visible : false
      },
      {
          field: 'Facultad',
          visible : false
      },
      {
        field: 'Numero',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '10%',
        displayName: $translate.instant('NUMERO')
      },
      {
        field: 'Vigencia',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '15%',
        displayName: $translate.instant('VIGENCIA')
      },
      {
        field: 'FacultadNombre',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '20%',
        displayName: $translate.instant('FACULTAD')
      },
      {
        field: 'NivelAcademico',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '15%',
        displayName: $translate.instant('NIVEL')
      },
      {
        field: 'Dedicacion',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '15%',
        displayName: $translate.instant('DEDICACION')
      },
      {
        field: 'Estado',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '15%',
        displayName: $translate.instant('ESTADO')
      },
      {
        name: $translate.instant('OPCIONES'),
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        enableFiltering: false,
        width: '10%',
        //Los botones son mostrados de acuerdo alestado de las resoluciones (ver,expedir,cancelar,restaurar)
        cellTemplate: '<center>' +
        '<a class="ver" ng-click="grid.appScope.verVisualizarResolucion(row)">' +
        '<i title="{{\'VER_BTN\' | translate }}" class="fa fa-eye fa-lg  faa-shake animated-hover"></i></a> ' +
        '<a ng-if="row.entity.Estado==\'Aprobada\'" class="ver" ng-click="grid.appScope.verRealizarExpedicion(row)">' +
        '<i title="{{\'EXPEDIR_BTN\' | translate }}" class="fa fa-file-text fa-lg  faa-shake animated-hover"></i></a> ' +
        '<a ng-if="row.entity.Estado==\'Expedida\'" class="editar" ng-click="grid.appScope.verCancelarResolucion(row)">' +
        '<i title="{{\'CANCELAR_BTN\' | translate }}" class="fa fa-remove fa-lg  faa-shake animated-hover"></i></a> ' +
        '<a ng-if="row.entity.Estado==\'Cancelada\'" class="configuracion" ng-click="grid.appScope.verRestaurarResolucion(row)">' +
        '<i title="{{\'RESTAURAR_BTN\' | translate }}" class="fa fa-refresh fa-lg faa-spin animated-hover"></i></a> ' +
        '</center>'
      }
    ]
  };

  //Funcion para cargar los datos de las resoluciones creadas y almacenadas dentro del sistema
  self.cargarDatosResolucion=function(){
      adminMidRequest.get("gestion_resoluciones/get_resoluciones_inscritas").then(function(response){
          self.resolucionesInscritas.data=response.data;
      });
  };

  //Función para asignar controlador de la vista contrato_registro.html (expedición de la resolución), donde se pasa por parámetro el id de la resolucion seleccionada, la lista de resoluciones paraque sea recargada y los datos completos de la resolución con ayuda de $mdDialog
  $scope.verRealizarExpedicion = function(row){
    $mdDialog.show({
      controller: "ContratoRegistroCtrl",
      controllerAs: 'contratoRegistro',
      templateUrl: 'views/vinculacionespecial/contrato_registro.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      fullscreen: true,
      locals: {idResolucion: row.entity.Id, lista: self, resolucion: row.entity}
    });
  };

  //Función donde se despliega un mensaje de alerta previo a la cancelación de la resolución
  $scope.verCancelarResolucion = function(row){
    $mdDialog.show({
      controller: "CancelarContratoDocenteCtrl",
      controllerAs: "cancelarContratoDocente",
      templateUrl: 'views/vinculacionespecial/cancelar_contrato_docente.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      fullscreen: true,
      locals: {idResolucion: row.entity.Id}
    });
    /*
    swal({
    title: $translate.instant('CANCELAR_RESOLUCION'),
    html:
    '<p><b>Número: </b>'+row.entity.Numero.toString()+'</p>'+
    '<p><b>Facultad: </b>'+row.entity.Facultad+'</p>'+
    '<p><b>Nivel académico: </b>'+row.entity.NivelAcademico+'</p>'+
    '<p><b>Dedicación: </b>'+row.entity.Dedicacion+'</p>',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: $translate.instant('ACEPTAR'),
    cancelButtonText: $translate.instant('CANCELAR'),
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger',
    buttonsStyling: false
  }).then(function () {
  self.cancelarResolucion(row);
}, function (dismiss) {
if (dismiss === 'cancel') {
swal({
text: $translate.instant('NO_CANCELACION_RESOLUCION'),
type: 'error'
})
}
})*/
};

//Función para realizar la cancelación y verificación de la resolución
self.cancelarResolucion = function(row){
  //var cancelacionPosible = true;
  //Se verifica que no existan liquidaciones asoociadas a los contratos pertenecientes a la resolucion
  adminMidRequest.post("cancelacion_valida/"+row.entity.Id).then(function(response){
    if(response.data==="OK"){
      administrativaRequest.get("resolucion/"+ row.entity.Id).then(function(response){
        var nuevaResolucion=response.data;
        //Cambio de estado
        nuevaResolucion.Estado=false;
        //Se actualiza el estado de la resolución
        administrativaRequest.put("resolucion/CancelarResolucion", nuevaResolucion.Id, nuevaResolucion).then(function(response){
          if(response.data==="OK"){
            self.cargarDatosResolucion();
          }
        });
      });
    }else{
      swal({
        text: $translate.instant('NO_CANCELADA_PAGOS'),
        type: 'warning'
      });
    }
  });
};

//Función donde se despliega un mensaje de alerta previo a la restauración de la resolución
$scope.verRestaurarResolucion = function(row){
  swal({
    title: $translate.instant('PREGUNTA_RESTAURAR'),
    html:
    '<p><b>Número: </b>'+row.entity.Numero.toString()+'</p>'+
    '<p><b>Facultad: </b>'+row.entity.FacultadNombre+'</p>'+
    '<p><b>Nivel académico: </b>'+row.entity.NivelAcademico+'</p>'+
    '<p><b>Dedicación: </b>'+row.entity.Dedicacion+'</p>',
    type: 'success',
    showCancelButton: true,
    confirmButtonText: $translate.instant('ACEPTAR'),
    cancelButtonText: $translate.instant('CANCELAR'),
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger',
    buttonsStyling: false
  }).then(function () {
    self.restaurarResolucion(row);
  }, function (dismiss) {
    if (dismiss === 'cancel') {
      swal({
        text: $translate.instant('NO_RESTAURACION_RESOLUCION'),
        type: 'error'
      });
    }
  });
};

//Función para asignar controlador de la vista resolucion_vista.html, donde se pasa por parámetro el id de la resolucion seleccionada con ayuda de $mdDialog
$scope.verVisualizarResolucion = function(row){

  if(row.entity.Dedicacion === "TCO-MTO"){
    self.Dedicacion = "TCO|MTO";
  }else{
    self.Dedicacion = row.entity.Dedicacion;
  }

  var resolucion = {
    Id: row.entity.Id,
    Numero: row.entity.Numero,
    NivelAcademico_nombre : row.entity.NivelAcademico,
    IdFacultad : row.entity.Facultad,
    Vigencia : row.entity.Vigencia,
    Periodo : row.entity.Periodo,                       //--- se deja quemado, debe incluirse ne tabla resolucion
    NumeroSemanas : row.entity.NumeroSemanas,
    Dedicacion : self.Dedicacion
  }

  var local = JSON.stringify(resolucion)
  localStorage.setItem('resolucion', local);
  $mdDialog.show({
    controller: "ResolucionVistaCtrl",
    controllerAs: 'resolucionVista',
    templateUrl: 'views/vinculacionespecial/resolucion_vista.html',
    parent: angular.element(document.body),
    clickOutsideToClose:true,
    fullscreen: true
  });
};

//Función para realizar la restauración y verificación de la resolución
self.restaurarResolucion = function(row){
  administrativaRequest.get("resolucion/"+ row.entity.Id).then(function(response){
    var nuevaResolucion=response.data;
    //Cambio de estado y fecha de expedicion de la resolucion en caso de que ya hubiese sido expedida.
    nuevaResolucion.Estado=true;
    nuevaResolucion.FechaExpedicion=null;
    //Se actualizan los datos de la resolución
    administrativaRequest.put("resolucion/RestaurarResolucion", nuevaResolucion.Id, nuevaResolucion).then(function(response){
      if(response.data==="OK"){
        self.cargarDatosResolucion();
      }
    });
  });
};

//Se hace el llamado de la función para cargar datos de resoluciones
self.cargarDatosResolucion();

});
