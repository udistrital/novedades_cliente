'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:RpSolicitudPersonasCtrl
 * @description
 * # RpSolicitudPersonasCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
.factory("contrato",function(){
      return {};
})
.controller('RpSolicitudPersonasCtrl', function($timeout,$window,financieraMidRequest, $scope, contrato,financieraRequest,amazonAdministrativaRequest, $routeParams, adminMidRequest,$translate) {
    var self = this;
    var query;
    var seleccion;
    var contrato_unidad={};
    self.contrato = contrato;
    $scope.vigenciaModel = null;
    self.longitud_grid = 0;
    $scope.busquedaSinResultados = false;
    $scope.banderaValores = true;
    $scope.contrato_int = $translate.instant('CONTRATO');
    $scope.vigencia_contrato = $translate.instant('VIGENCIA_CONTRATO');
    $scope.contratista_nombre = $translate.instant('NOMBRE_CONTRATISTA');
    $scope.contratista_documento = $translate.instant('DOCUMENTO_CONTRATISTA');
    $scope.valor_contrato = $translate.instant('VALOR');
    self.resolucion_bool=false;
    self.cdp_bool=false;
    self.contrato_bool = false;
    self.texto_busqueda = "";
    self.persona_sel = "";
    $scope.radioB=0;
    self.gridAp = null;
    self.gridApiCDP = null;
    self.gridApip = null;
    self.gridApiResolucion = null;
    self.resolucionNumero = "";
    self.resolucionVigencia = "";
    self.resolucionId = "";
    self.tipoResolucion = "";

    $scope.fields = {
      numcontrato: '',
      vigcontrato: '',
      contratistadocumento: '',
      valorcontrato: ''
    };

    //grid modal
    self.gridOptionsResolucionPersonas ={
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableSorting: true,
      enableFiltering: true,
      multiSelect: false,
      columnDefs: [
        {
          field: 'Id',
          displayName: $translate.instant('CONTRATO'),
          width: "15%",
          cellTemplate: '<div align="center">{{row.entity.Numero_contrato}}</div>'
        },
        {
          field: 'Vigencia_contrato',
          displayName: $translate.instant('VIGENCIA_CONTRATO'),
          visible: true,
          width: "15%",
        },
        {
          field: 'Nombre_completo',
          displayName: $translate.instant('NOMBRE_CONTRATISTA'),
          width: "50%"
        },
        {
          field: 'Id',
          displayName: $translate.instant('DOCUMENTO_CONTRATISTA'),
          cellTemplate: '<div align="center">{{row.entity.Id}}</div>',
          width: "20%",
        }
      ],
      onRegisterApi: function(gridApi) {
        self.gridApip = gridApi;
      }
    };

    //GRID CONTRATISTAS
    self.gridOptions = {
      enableSelectAll: true,
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableSorting: true,
      enableFiltering: true,
      multiSelect: true,
      columnDefs: [{
          field: 'Id',
          displayName: $translate.instant('CONTRATO'),
          width: "15%",
          cellTemplate: '<div align="center">{{row.entity.Numero_contrato}}</div>'
        },
        {
          field: 'Vigencia_contrato',
          displayName: $translate.instant('VIGENCIA_CONTRATO'),
          visible: true,
          width: "15%",
        },
        {
          field: 'Nombre_completo',
          displayName: $translate.instant('NOMBRE_CONTRATISTA'),
          width: "30%"
        },
        {
          field: 'Id',
          displayName: $translate.instant('DOCUMENTO_CONTRATISTA'),
          cellTemplate: '<div align="center">{{row.entity.Id}}</div>',
          width: "20%",
        },
        {
          field: 'ContratoGeneral.ValorContrato',
          displayName: $translate.instant('VALOR'),
          cellTemplate: '<div align="right">{{row.entity.Valor_contrato | currency }}</div>'
        },
      ],
      onRegisterApi: function(gridApi) {
        self.gridAp = gridApi;
      }
    };

    //<RESOLUCION GRID
    self.gridOptionsResolucion = {
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableSorting: true,
      enableFiltering: true,
      multiSelect: true,
      rowHeight: 40,
      columnDefs: [
        {
          field: 'Id',
          displayName: $translate.instant('ID'),
        },
        {
          field: 'NumeroResolucion',
          displayName: $translate.instant('NUMERO_RESOLUCION'),
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
        },
        {
          field: 'IdTipoResolucion.NombreTipoResolucion',
          displayName: $translate.instant('TIPO_RESOLUCION'),
        },
        {
          field: 'FechaRegistro',
          displayName: $translate.instant('FECHA'),
          cellTemplate: '<div align="center">{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900" }}</div>'
        },
        {
          field:'Boton',
          displayName:$translate.instant('VER'),
          cellTemplate:'<button type="button" class="btn btn-info" data-toggle="modal" data-target="#resolucionModal" ng-click="grid.appScope.rpSolicitudPersonas.setResolucion(row.entity)"">{{"VER" | translate}}</button>'
        }

      ],
      onRegisterApi: function(gridApi) {
        self.gridApiResolucion = gridApi;
      }
    };
    //RESOLUCION GRID>

    //<PROVEEDOR GRID
    self.gridOptionsProveedor = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableSorting: true,
      enableFiltering: true,
      multiSelect: false,
      columnDefs: [
        {
          field: 'Id',
          displayName: $translate.instant('ID'),
        },
        {
          field: 'NumDocumento',
          displayName: $translate.instant('NUMERO_DOCUMENTO'),
        },
        {
          field: 'Tipopersona',
          displayName: $translate.instant('TIPO_PERSONA'),
        },
        {
          field: 'NomProveedor',
          displayName: $translate.instant('NOMBRE_PROVEEDOR'),
          width: "50%",
        },
      ],
      onRegisterApi: function(gridApi) {
        self.gridApi = gridApi;
      }
    };

    //PROVEEDOR GRID>

    //CDP GRID para cargar los CDP hay que meter esto en una funcion
    
    self.gridOptions_cdp = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      rowHeight: 30,
      headerHeight: 30,
   columnDefs : [
     {
       field: 'Id',             
       visible : false,     
      },
     {
       field: 'Vigencia',   
       displayName: 'Vigencia',
       width: '13%',
      },
     {
       field: 'NumeroDisponibilidad',   
       displayName: 'Id',
       width: '12%',
      },
     {
       field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Objeto',   
       displayName: 'Descripcion',
       width: '21%',
      },
     {
       field: 'Solicitud.DependenciaSolicitante.Nombre',   
       displayName: 'Ordenador',
       width: '21%',
      },
     {
       field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Id',   
       displayName: 'Necesidad',
       width: '15%',
      },
      {
        field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Valor',   
        displayName: 'Valor necesidad',
        width: '18%',
        cellTemplate: '<div align="right">{{row.entity.Solicitud.SolicitudDisponibilidad.Necesidad.Valor | currency }}</div>'
       },
   ]
 };

    //CDP GRID --

    //se busca de acuerdo al filtro seleccionado en la interfaz cdp,resolucion o contratos

    self.cargar_filtro = function(){

      //si es filtro por contrato
      if ($scope.radioB === 1){
        self.resolucion_bool=false;
        self.cdp_bool=false;
        self.contrato_bool = true;

        amazonAdministrativaRequest.get('vigencia_contrato').then(function(response) {
          $scope.vigencias = response.data;
    
        //selecciona la vigencia actual
        var vigenciaActual=$scope.vigencias[0];
    
        amazonAdministrativaRequest.get('proveedor_contrato_persona/'+vigenciaActual).then(function(response) {
             self.gridOptions.data = response.data;
              self.longitud_grid = self.gridOptions.data.length;
            });
        });
      }
      
      //si es filtro por cdp
      if ($scope.radioB === 2){
        self.resolucion_bool=false;
        self.cdp_bool=true;
        self.contrato_bool = false;

        financieraRequest.get('disponibilidad','limit=-1&query=Estado.Nombre__not_in:Agotado').then(function(response) {
          self.gridOptions_cdp.data = response.data;
          angular.forEach(self.gridOptions_cdp.data, function(data){
            financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Solicitud,'').then(function(response) {
                data.Solicitud = response.data[0];
                });
              });       
        });

        amazonAdministrativaRequest.get('informacion_proveedor',"limit=-1").then(function(response) {
          self.gridOptionsProveedor.data = response.data;
           self.longitud_grid_proveedor = self.gridOptionsProveedor.data.length;
         });


      }
      //si es filtro por resolucion
      if ($scope.radioB === 3){
        self.resolucion_bool=true;
        self.cdp_bool=false;
        self.contrato_bool = false;

        amazonAdministrativaRequest.get('resolucion',"limit=-1").then(function(response) {
          self.gridOptionsResolucion.data = response.data;
           self.longitud_grid_resolucion = self.gridOptionsResolucion.data.length;
         });
      }

    };

    //se buscan los contratos por la vigencia seleccionada
    self.buscar_contratos_vigencia = function() {
      self.longitud_grid = 0;
      query = "";
      if ($scope.vigenciaModel !== undefined || $scope.vigenciaModel === null) {
        amazonAdministrativaRequest.get('proveedor_contrato_persona/'+$scope.vigenciaModel).then(function(response) {
         self.gridOptions.data = response.data;
          self.longitud_grid = self.gridOptions.data.length;
        });

      }
    };

    self.setResolucion= function(resolucion){
      var vinculacion_docente = [];
      var contratistas = [];
      var cedula = "";
      var numContrato = "";
      var vigenciaContrato;
      self.resolucionId = resolucion.Id;
      self.resolucionNumero = resolucion.NumeroResolucion;
      self.resolucionVigencia = resolucion.Vigencia;
      self.tipoResolucion = resolucion.IdTipoResolucion.NombreTipoResolucion;
      //peticion para traer los docentes asociados a una resolucion
      amazonAdministrativaRequest.get('vinculacion_docente',"limit=-1&query=IdResolucion.Id:"+self.resolucionId).then(function(response) {
        if(response.data!=null){
        vinculacion_docente = response.data;
        
        //consulta para traer la informacion de las personas de los docentes asociados a una resolucion
        for(var x = 0;x<vinculacion_docente.length;x++){
          cedula = vinculacion_docente[x].IdPersona.toString();
          numContrato = vinculacion_docente[x].NumeroContrato;
          vigenciaContrato = vinculacion_docente[x].Vigencia;
          amazonAdministrativaRequest.get('proveedor_contrato_persona/'+numContrato+"/"+vigenciaContrato).then(function(response) {
            response.data[0].Contrato = numContrato;
            contratistas.push(response.data[0]); 
           });
         };
        }
         
       });
           self.gridOptionsResolucionPersonas.data = contratistas; 
           self.gridOptionsResolucionPersonas.longitud_grid=self.gridOptionsResolucionPersonas.length;
    };

    self.mostrar_estadisticas = function() {
      var cedula;
      var numContrato;
      var vigenciaContrato;
      var contratistas = [];
      var vinculacion_docente = [];
      self.contrato.splice(0,self.contrato.length);
      var total;
      var total2;
      var t1;
      var t0;
      var t00;
      var t2;
      // si es solicitud por contrato
      if($scope.radioB ===1){
        seleccion = self.gridAp.selection.getSelectedRows();
        if(seleccion[0]===null || seleccion[0]===undefined){
          swal("Alertas", "Debe seleccionar un contratista", "error");
        }else{
          
        for(var i=0;i<seleccion.length;i++){
          contrato_unidad = [];
          contrato_unidad.Numero_contrato = seleccion[i].Numero_contrato;
          contrato_unidad.Vigencia= seleccion[i].Vigencia_contrato;
          contrato_unidad.ContratistaId= seleccion[i].Id;
          contrato_unidad.ValorContrato= seleccion[i].Valor_contrato;
          contrato_unidad.NombreContratista= seleccion[i].Nombre_completo;
          contrato_unidad.ObjetoContrato= seleccion[i].Objeto_contrato;
          contrato_unidad.FechaRegistro= seleccion[i].Fecha_registro;
          self.contrato.push(contrato_unidad);  
        }
          self.saving = true;
          self.btnGenerartxt = "Generando...";
          self.saving = false;
          self.btnGenerartxt = "Generar";
           $window.location.href = '#/rp/rp_solicitud/';
        }
      // si es solicitud por cdp
      }else if($scope.radioB ===2){

      // si es solicitud por resolucion
      }else if($scope.radioB===3){
        seleccion = self.gridApiResolucion.selection.getSelectedRows();
        t0= performance.now();
        for(var x=0;x<seleccion.length;x++){
          amazonAdministrativaRequest.get('vinculacion_docente',"limit=-1&query=IdResolucion.Id:"+seleccion[x].Id).then(function(response) {
            if(response.data!=null){
            vinculacion_docente = response.data;
            
            //consulta para traer la informacion de las personas de los docentes asociados a una resolucion
            for(var x = 0;x<vinculacion_docente.length;x++){
              cedula = vinculacion_docente[x].IdPersona.toString();
              numContrato = vinculacion_docente[x].NumeroContrato;
              vigenciaContrato = vinculacion_docente[x].Vigencia;
              amazonAdministrativaRequest.get('proveedor_contrato_persona/'+numContrato+"/"+vigenciaContrato).then(function(response) {
                response.data[0].Contrato = numContrato;
                contratistas.push(response.data[0]); 
               });
             };
            }
             
           });
        }
        t1 = performance.now();
        total = (t1 - t0) +1000;
        
        $timeout(function(){
          
          for(var i=0;i<contratistas.length;i++){
            contrato_unidad = []; 
            contrato_unidad.Numero_contrato = contratistas[i].Numero_contrato;
            contrato_unidad.Vigencia= contratistas[i].Vigencia_contrato;
            contrato_unidad.ContratistaId= contratistas[i].Id;
            contrato_unidad.ValorContrato= contratistas[i].Valor_contrato;
            contrato_unidad.NombreContratista= contratistas[i].Nombre_completo;
            contrato_unidad.ObjetoContrato= contratistas[i].Objeto_contrato;
            contrato_unidad.FechaRegistro= contratistas[i].Fecha_registro;
            self.contrato.push(contrato_unidad);  
          }
              self.saving = true;
              self.btnGenerartxt = "Generando...";
              self.saving = false;
              self.btnGenerartxt = "Generar";
              $window.location.href = '#/rp/rp_solicitud/';
        },total);
      }

};
});