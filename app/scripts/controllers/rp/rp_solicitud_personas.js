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
.controller('RpSolicitudPersonasCtrl', function($timeout,$window,financieraMidRequest, $scope, contrato,financieraRequest,administrativaRequest, $routeParams, adminMidRequest,$translate,agoraRequest) {
    var self = this;
    var query;
    var seleccion;
    var contrato_unidad={};
    var t1;
    var t0;
    var total;
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

    $scope.fields = {
      numcontrato: '',
      vigcontrato: '',
      contratistadocumento: '',
      valorcontrato: ''
    };

    self.gridOptions = {
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
      onRegisterApi: function(gridApip) {
        self.gridAp = gridApip;
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
          cellTemplate:'<button type="button" class="btn btn-info" data-toggle="modal" data-target="#resolucionModal">VER</button>'
        }

      ],
      onRegisterApi: function(gridApi) {
        self.gridApi = gridApi;
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
      console.log($scope.radioB);
      t0 = performance.now();

      //si es filtro por contrato
      if ($scope.radioB === 1){
        self.resolucion_bool=false;
        self.cdp_bool=false;
        self.contrato_bool = true;

        administrativaRequest.get('vigencia_contrato').then(function(response) {
          $scope.vigencias = response.data;
    
        //selecciona la vigencia actual
        var vigenciaActual=$scope.vigencias[0];
    
            agoraRequest.directGet('proveedor_contrato_persona',vigenciaActual).then(function(response) {
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
          console.log(self.gridOptions_cdp.data);
          angular.forEach(self.gridOptions_cdp.data, function(data){
            financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Solicitud,'').then(function(response) {
                data.Solicitud = response.data[0];
                });
              });       
        });

        agoraRequest.get('informacion_proveedor',"limit=-1").then(function(response) {
          self.gridOptionsProveedor.data = response.data;
           self.longitud_grid_proveedor = self.gridOptionsProveedor.data.length;
         });


      }
      //si es filtro por resolucion
      if ($scope.radioB === 3){
        self.resolucion_bool=true;
        self.cdp_bool=false;
        self.contrato_bool = false;

        administrativaRequest.get('resolucion',"limit=-1").then(function(response) {
          self.gridOptionsResolucion.data = response.data;
           self.longitud_grid_resolucion = self.gridOptionsResolucion.data.length;
         });
      }
      t1 = performance.now();
      total = (t1 - t0) +5;
      $timeout(function(){
        $(window).resize();
      },total);
    };

    //se buscan los contratos por la vigencia seleccionada
    self.buscar_contratos_vigencia = function() {
      self.longitud_grid = 0;
      query = "";
      if ($scope.vigenciaModel !== undefined || $scope.vigenciaModel === null) {
       agoraRequest.directGet('proveedor_contrato_persona',$scope.vigenciaModel).then(function(response) {
         self.gridOptions.data = response.data;
          self.longitud_grid = self.gridOptions.data.length;
        });

      }
    };

    self.mostrar_estadisticas = function() {
      self.contrato.splice(0,self.contrato.length);
      seleccion = self.gridAp.selection.getSelectedRows();
      console.log(seleccion);
      if(seleccion[0]===null || seleccion[0]===undefined){
        swal("Alertas", "Debe seleccionar un contratista", "error");
      }else{
        
      for(var i=0;i<seleccion.length;i++){
        contrato_unidad = [];
        contrato_unidad.Id = seleccion[i].Numero_contrato;
        contrato_unidad.Vigencia= seleccion[i].Vigencia_contrato;
        contrato_unidad.ContratistaId= seleccion[i].Id;
        contrato_unidad.ValorContrato= seleccion[i].Valor_contrato;
        contrato_unidad.NombreContratista= seleccion[i].Nombre_completo;
        contrato_unidad.ObjetoContrato= seleccion[i].Objeto_contrato;
        contrato_unidad.FechaRegistro= seleccion[i].Fecha_registro;
        self.contrato.push(contrato_unidad);  
        console.log(contrato_unidad);
      }
        self.saving = true;
        self.btnGenerartxt = "Generando...";
        self.saving = false;
        self.btnGenerartxt = "Generar";
         $window.location.href = '#/rp/rp_solicitud/';
      }
};
  });


