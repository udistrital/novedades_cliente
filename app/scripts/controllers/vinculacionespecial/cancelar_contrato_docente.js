'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:CancelarContratoDocenteCtrl
 * @description
 * # CancelarContratoDocenteCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('CancelarContratoDocenteCtrl', function ($translate,amazonAdministrativaRequest,$scope,idResolucion) {

var self = this;
self.ResolucionId =idResolucion;
var docentes=[];
var cancelacion = {};
var FechaRegistro=new Date();
self.datosPersonas={
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
    {
      field: 'Id', 
      displayName: $translate.instant('DOCUMENTO')
    },
    {
      field: 'NombreCompleto', 
      width: '40%', displayName: $translate.instant('NOMBRE')
    },
    {
      field: 'Vinculacion.NumeroContrato', 
      displayName: $translate.instant('CONTRATO')
    },
    {
      field: 'Vinculacion.Vigencia', 
      displayName: $translate.instant('VIGENCIA')
    },
  ],
  onRegisterApi : function(gridApi){
    self.gridApi = gridApi;
    gridApi.selection.on.rowSelectionChanged($scope,function(row){
      self.personasSeleccionadas=gridApi.selection.getSelectedRows();
    });
    amazonAdministrativaRequest.get("vinculacion_docente","limit=-1&query=IdResolucion.Id:"+self.ResolucionId).then(function(response){      
      self.vinculacion=response.data;
      console.log(self.vinculacion);
        if(self.vinculacion[0]!==null){

        self.vinculacion.forEach(function(vinc) {
          amazonAdministrativaRequest.get("informacion_persona_natural/","query=Id:"+vinc.IdPersona).then(function(response){
            if(response.data[0] !== null){
              if(response.data[0].SegundoNombre=""){
                response.data[0].NombreCompleto=response.data[0].PrimerNombre+" "+response.data[0].PrimerApellido+" "+response.data[0].SegundoApellido;
              }else{
                response.data[0].NombreCompleto=response.data[0].PrimerNombre+" "+response.data[0].SegundoNombre+" "+response.data[0].PrimerApellido+" "+response.data[0].SegundoApellido;
              }

              response.data[0].Vinculacion=vinc;
              if(response.data[0].Vinculacion.NumeroContrato !=="" && response.data[0].Vinculacion.Vigencia !==""){

                docentes.push(response.data[0]);
              }
            }     
           });

        });
        console.log(docentes);
        self.datosPersonas.data = docentes;
        
      }else{
        console.log("error");
      }
    });


   }
};
  self.cancelar = function(){
    console.log(self.personasSeleccionadas);
    
    self.personasSeleccionadas.forEach(function(seleccion) {
      cancelacion ={
        NumeroContrato:seleccion.Vinculacion.NumeroContrato,
        Vigencia:seleccion.Vinculacion.Vigencia,
        FechaRegistro:FechaRegistro,
        Estado:{Id: 7},
        Usuario:"",
      }
      amazonAdministrativaRequest.post("contrato_estado",cancelacion).then(function(response){
        console.log(response.data);
        console.log(cancelacion);
      });
    });

  };

  });
