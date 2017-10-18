'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:CancelarContratoDocenteCtrl
 * @description
 * # CancelarContratoDocenteCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('CancelarContratoDocenteCtrl', function ($translate,agoraRequest,$scope,kyronRequest,idResolucion,administrativaRequest) {

    var self = this;
    self.idResolucion = idResolucion;
    self.valor = idResolucion;

    //Se leen los datos básicos de la resolucion de vinculación especial
    administrativaRequest.get("resolucion_vinculacion_docente/"+self.idResolucion).then(function(response){      
      self.datosFiltro=response.data;
      if(self.datosFiltro.NivelAcademico.toLowerCase()=="pregrado"){
        var auxNivelAcademico=14;
      }else if(self.datosFiltro.NivelAcademico.toLowerCase()=="posgrado"){
        var auxNivelAcademico=15;
      }
      
      //Se llaman las funciones para cargar datos de las dos tablas de la vista
      kyronRequest.get("persona_escalafon/"+self.datosFiltro.NivelAcademico.toLowerCase()).then(function(response){
        $scope.datosPersonas.data=response.data;
        $scope.datosPersonas.data.forEach(function(row){
          //El nombre completo se guarda en una sola variable
          row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
        });
      });
    });

    //Estructura ui-grid de la tabla de docentes inscritos
    $scope.datosPersonas = {
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
          width: '40%', displayName: 
          $translate.instant('NOMBRE')
        },
        {
          field: 'Escalafon', 
          displayName: $translate.instant('CATEGORIA')
        }
      ],
      onRegisterApi : function(gridApi){
        self.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          self.personasSeleccionadas=gridApi.selection.getSelectedRows();
          if(self.personasSeleccionadas.length==0){
            console.log("SELECCIOOOOON");
            self.persona=null;
          }else{
            agoraRequest.get("informacion_persona_natural/"+row.entity.Id).then(function(response){
              console.log("ACA SI HAGO ALGO");
              if(typeof(response.data)=="object"){
                self.persona=row.entity;
                self.persona.FechaExpedicionDocumento = new Date(self.persona.FechaExpedicionDocumento).toLocaleDateString('es');
              }else{
                swal({
                  title: $translate.instant('PROBLEMA'),
                  text: $translate.instant('MENSAJE_ERROR'),
                  type: "danger",
                  confirmButtonText: $translate.instant('ACEPTAR'),
                  closeOnConfirm: false,
                  showLoaderOnConfirm: true,
                }); 
              }
            });
          }
        });
      }
  };

  self.cancelar = function(){
    console.log(self.personasSeleccionadas);
  };
  
  /*
                      administrativaRequest.put("resolucion/CancelarResolucion", nuevaResolucion.Id, nuevaResolucion).then(function(response){
                        if(response.data=="OK"){
                            self.cargarDatosResolucion();
                        }
                    })
  
  self.cargarDatosPersonas = function(){
    kyronRequest.get("persona_escalafon/"+self.datosFiltro.NivelAcademico.toLowerCase()).then(function(response){
      self.datosPersonas.data=response.data;
      self.datosPersonas.data.forEach(function(row){
        //El nombre completo se guarda en una sola variable
        row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
      });
    });
  }*/
 

  });
