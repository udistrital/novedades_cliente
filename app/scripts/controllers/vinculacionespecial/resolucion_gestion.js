'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionGestionCtrl
 * @description
 * # ResolucionGestionCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .factory("resolucion",function(){
     return {};
  })
  .controller('ResolucionGestionCtrl', function (resolucion,amazonAdministrativaRequest,$scope,$window,$mdDialog,$translate) {

  	var self = this;
    self.datos_docentes;
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
        	field: 'Numero',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (row.entity.Estado=="Cancelada") {
                    return 'resolucionCancelada';
                }else if(row.entity.Estado=="Expedida"){
                    return 'resolucionExpedida';
                }
            },
        	width: '10%',
        	displayName: $translate.instant('NUMERO')
        },
        {
        	field: 'Vigencia',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (row.entity.Estado=="Cancelada") {
                    return 'resolucionCancelada';
                }else if(row.entity.Estado=="Expedida"){
                    return 'resolucionExpedida';
                }
            },
        	width: '15%',
        	displayName: $translate.instant('VIGENCIA')
        },
        {
        	field: 'Facultad',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (row.entity.Estado=="Cancelada") {
                    return 'resolucionCancelada';
                }else if(row.entity.Estado=="Expedida"){
                    return 'resolucionExpedida';
                }
            },
        	width: '20%',
        	displayName: $translate.instant('FACULTAD')
        },
        {
        	field: 'NivelAcademico',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (row.entity.Estado=="Cancelada") {
                    return 'resolucionCancelada';
                }else if(row.entity.Estado=="Expedida"){
                    return 'resolucionExpedida';
                }
            },
        	width: '15%',
        	displayName: $translate.instant('NIVEL')
        },
        {
        	field: 'Dedicacion',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (row.entity.Estado=="Cancelada") {
                    return 'resolucionCancelada';
                }else if(row.entity.Estado=="Expedida"){
                    return 'resolucionExpedida';
                }
            },
        	width: '15%',
        	displayName: $translate.instant('DEDICACION')
        },
        {
            field: 'Estado',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (row.entity.Estado=="Cancelada") {
                    return 'resolucionCancelada';
                }else if(row.entity.Estado=="Expedida"){
                    return 'resolucionExpedida';
                }
            },
            width: '15%',
            displayName: $translate.instant('ESTADO')
        },
        {
            name: $translate.instant('OPCIONES'),
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (row.entity.Estado=="Cancelada") {
                    return 'resolucionCancelada';
                }else if(row.entity.Estado=="Expedida"){
                    return 'resolucionExpedida';
                }
            },
            enableFiltering: false,
            width: '10%',
            //Los botones son mostrados de acuerdo alestado de las resoluciones (ver,editar,configurar)
            cellTemplate: '<center>' +
               '<a class="ver" ng-click="grid.appScope.verVisualizarResolucion(row)">' +
               '<i title="{{\'VER_BTN\' | translate }}" class="fa fa-eye fa-lg  faa-shake animated-hover"></i></a> ' +
               '<a ng-if="row.entity.Estado==\'Expedible\'" class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
               '<i title="{{\'EDITAR_BTN\' | translate }}" class="fa fa-users fa-lg  faa-shake animated-hover"></i></a> ' +
               '<a ng-if="row.entity.Estado==\'Expedible\'" class="configuracion" ng-click="grid.appScope.verEditarResolucion(row)">' +
               '<i title="{{\'CONFIGURAR_BTN\' | translate }}" class="fa fa-cog fa-lg faa-spin animated-hover"></i></a> ' +
               '</center>'

            }
      ]
    };

    //Se cargan los datos de las resoluciones de vinculación especial almacenadas
    amazonAdministrativaRequest.get("resolucion_vinculacion").then(function(response){

        self.resolucionesInscritas.data=response.data;
        console.log(self.resolucionesInscritas.data)
        if(self.resolucionesInscritas.data!=null){
            self.resolucionesInscritas.data.forEach(function(resolucion){
                if(resolucion.FechaExpedicion!=null){
                    //dado que el servicio no está almacenando la Feha de expedición directamente como null, se toma el valor "0001-01-01T00:00:00Z" como tal
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
                }else{
                    if(resolucion.Estado){
                        resolucion.EstadoTexto="Expedida";
                    }else{
                        resolucion.EstadoTexto="Cancelada";
                    }
                }
            })
        }
    });

    //Función para redireccionar la página web a la vista de edición del contenido de la resolución, donde se pasa por parámetro el id de la resolucion seleccionada
    $scope.verEditarResolucion = function(row){
    	$window.location.href = '#/vinculacionespecial/resolucion_detalle/'+row.entity.Id.toString();
    }

    //Función para redireccionar la página web a la vista de adición y eliminación de docentes en la resolucion, donde se pasa por parámetro el id de la resolucion seleccionada
    $scope.verEditarDocentes = function(row){

      amazonAdministrativaRequest.get("resolucion_vinculacion_docente/"+row.entity.Id.toString()).then(function(response){
          self.datos_docentes = response.data

      });

      var auxNivelAcademico;

      if(row.entity.NivelAcademico.toLowerCase()=="pregrado"){
        auxNivelAcademico=14;
      }else if(row.entity.NivelAcademico.toLowerCase()=="posgrado"){
        auxNivelAcademico=15;
      }

        self.resolucion = resolucion;
        self.resolucion.Id = row.entity.Id;
        self.resolucion.Numero = row.entity.Numero;
        self.resolucion.NivelAcademico_nombre = row.entity.NivelAcademico;
        self.resolucion.NivelAcademico = auxNivelAcademico
        self.resolucion.IdFacultad = self.datos_docentes.IdFacultad
        self.resolucion.NumeroSemanas = 18; 
        if(self.datos_docentes.Dedicacion == "TCO-MTO"){
            self.resolucion.Dedicacion = "TCO|MTO"
        }else{
          self.resolucion.Dedicacion = self.datos_docentes.Dedicacion;
        }


      $window.location.href = '#/vinculacionespecial/hojas_de_vida_seleccion/'+row.entity.Id.toString();

    }

    //Función para asignar controlador de la vista resolucion_vista.html, donde se pasa por parámetro el id de la resolucion seleccionada con ayuda de $mdDialog
	$scope.verVisualizarResolucion = function(row){
    	$mdDialog.show({
            controller: "ResolucionVistaCtrl",
            controllerAs: 'resolucionVista',
            templateUrl: 'views/vinculacionespecial/resolucion_vista.html',
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            fullscreen: true,
            locals: {idResolucion: row.entity.Id}
        })
    }

    //Función para redireccionar la página web a la vista de creación de una nueva resolución
    self.generarNuevaResolucion = function(){
        $window.location.href = '#/vinculacionespecial/resolucion_generacion';
    }

  });
