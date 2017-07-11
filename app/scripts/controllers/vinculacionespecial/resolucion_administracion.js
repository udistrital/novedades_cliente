'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionAdministracionCtrl
 * @description
 * # ResolucionAdministracionCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('ResolucionAdministracionCtrl', function (contratacion_request,titan_request,$scope,$window,$mdDialog,$translate) {

    var self = this;

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
            field: 'Numero',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
            width: '10%', 
            displayName: $translate.instant('NUMERO')
        },
        {
            field: 'Vigencia', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
            width: '15%', 
            displayName: $translate.instant('VIGENCIA')
        },
        {
            field: 'Facultad', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
            width: '20%', 
            displayName: $translate.instant('FACULTAD')
        },
        {
            field: 'NivelAcademico', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
            width: '15%', 
            displayName: $translate.instant('NIVEL')
        },
        {
            field: 'Dedicacion', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
            width: '15%', 
            displayName: $translate.instant('DEDICACION')
        },
        {
            field: 'EstadoTexto', 
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
            width: '15%', 
            displayName: $translate.instant('ESTADO')
        },
        {
            name: $translate.instant('OPCIONES'),
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (row.entity.FechaExpedicion) {
                if(row.entity.Estado==false){
                    return 'resolucionCancelada';
                }else{
                    return 'resolucionExpedida';
                }
              }
            },
            enableFiltering: false,
            width: '10%',  
            cellTemplate: '<center>' +
               '<a ng-if="!row.entity.FechaExpedicion" class="ver" ng-click="grid.appScope.verRealizarExpedicion(row)">' +
               '<i title="{{\'EXPEDIR_BTN\' | translate }}" class="fa fa-file-text fa-lg  faa-shake animated-hover"></i></a> ' +
               '<a ng-if="row.entity.FechaExpedicion && row.entity.Estado==true" class="editar" ng-click="grid.appScope.verCancelarResolucion(row)">' +
               '<i title="{{\'CANCELAR_BTN\' | translate }}" class="fa fa-remove fa-lg  faa-shake animated-hover"></i></a> ' +
               '<a ng-if="row.entity.FechaExpedicion || row.entity.Estado==false" class="configuracion" ng-click="grid.appScope.verRestaurarResolucion(row)">' +
               '<i title="{{\'RESTAURAR_BTN\' | translate }}" class="fa fa-refresh fa-lg faa-spin animated-hover"></i></a> ' +
               '</center>'
        }
      ]
    };

    self.cargarDatosResolucion=function(){
        contratacion_request.getAll("resolucion_vinculacion").then(function(response){
            self.resolucionesInscritas.data=response.data;
            self.resolucionesInscritas.data.forEach(function(resolucion){
                if(resolucion.FechaExpedicion.toString()=="0001-01-01T00:00:00Z"){
                    resolucion.FechaExpedicion=null;
                    resolucion.EstadoTexto="Creada";
                }else{                
                    if(resolucion.Estado){
                        resolucion.EstadoTexto="Expedida";
                    }else{
                        resolucion.EstadoTexto="Cancelada";
                    }
                }
            })
        });
    }

    $scope.verRealizarExpedicion = function(row){
        $mdDialog.show({
            controller: "ContratoRegistroCtrl",
            controllerAs: 'contratoRegistro',
            templateUrl: 'views/vinculacionespecial/contrato_registro.html',
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            fullscreen: true,
            locals: {idResolucion: row.entity.Id, lista: self, resolucion: row.entity}
        })
    }  

	$scope.verCancelarResolucion = function(row){
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
        })
    }

    self.cancelarResolucion = function(row){
        var cancelacionPosible = true;
        contratacion_request.getAll("vinculacion_docente/","query=IdResolucion.Id%3A"+row.entity.Id.toString()).then(function(response){
            var aux = response.data[response.data.length-1]
            response.data.forEach(function(vinculacion){
                titan_request.getAll("detalle_liquidacion","query=NumeroContrato.Id%3A"+vinculacion.NumeroContrato).then(function(response){
                    
                    if(response.data){
                        cancelacionPosible = false;
                    }
                    if (aux==vinculacion && cancelacionPosible){
                        contratacion_request.getOne("resolucion", row.entity.Id).then(function(response){
                            var nuevaResolucion=response.data;
                            nuevaResolucion.Estado=false;
                            contratacion_request.put("resolucion/CancelarResolucion", nuevaResolucion.Id, nuevaResolucion).then(function(response){
                                alert(JSON.stringify(response.data))
                                self.cargarDatosResolucion();
                            })
                        })
                    }else if(aux==vinculacion && !cancelacionPosible){
                        swal({
                            text: $translate.instant('NO_CANCELADA_PAGOS'),
                            type: 'warning'
                          })
                    }
                });
            })
        });
    }

    $scope.verRestaurarResolucion = function(row){
        swal({
          title: $translate.instant('PREGUNTA_RESTAURAR'),
          html:
            '<p><b>Número: </b>'+row.entity.Numero.toString()+'</p>'+
            '<p><b>Facultad: </b>'+row.entity.Facultad+'</p>'+
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
                })
            }
        })
    }

    self.restaurarResolucion = function(row){
        contratacion_request.getOne("resolucion", row.entity.Id).then(function(response){
            var nuevaResolucion=response.data;
            nuevaResolucion.Estado=true;
            nuevaResolucion.FechaExpedicion=null;
            contratacion_request.put("resolucion", nuevaResolucion.Id, nuevaResolucion).then(function(response){
                self.cargarDatosResolucion();
            })
        })
    }

    self.cargarDatosResolucion();

  });
