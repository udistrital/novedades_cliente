'use strict';

angular.module('contractualClienteApp')
  .controller('ResolucionGestionCtrl', function (contratacion_request,$scope,$window,$mdDialog,$translate) {
    
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
               '<a class="ver" ng-click="grid.appScope.verVisualizarResolucion(row)">' +
               '<i title="{{\'VER_BTN\' | translate }}" class="fa fa-eye fa-lg  faa-shake animated-hover"></i></a> ' +
               '<a ng-if="!row.entity.FechaExpedicion" class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
               '<i title="{{\'EDITAR_BTN\' | translate }}" class="fa fa-users fa-lg  faa-shake animated-hover"></i></a> ' +
               '<a ng-if="!row.entity.FechaExpedicion" class="configuracion" ng-click="grid.appScope.verEditarResolucion(row)">' +
               '<i title="{{\'CONFIGURAR_BTN\' | translate }}" class="fa fa-cog fa-lg faa-spin animated-hover"></i></a> ' +
               '</center>'
       
            }
      ]
    };

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

    $scope.verEditarResolucion = function(row){
    	$window.location.href = '#/vinculacionespecial/resolucion_detalle/'+row.entity.Id.toString();
    }

    $scope.verEditarDocentes = function(row){
    	$window.location.href = '#/vinculacionespecial/hojas_de_vida_seleccion/'+row.entity.Id.toString();
    }

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

    self.generarNuevaResolucion = function(){
        $window.location.href = '#/vinculacionespecial/resolucion_generacion';
    } 

  });

