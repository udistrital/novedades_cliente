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
.controller('RpSolicitudPersonasCtrl', function($window, $scope, contrato,financieraRequest,administrativaRequest, $routeParams, adminMidRequest,$translate,agoraRequest) {
    var self = this;
    var query;
    var seleccion;
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
    $scope.fields = {
      numcontrato: '',
      vigcontrato: '',
      contratistadocumento: '',
      valorcontrato: ''
    };

    self.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableSorting: true,
      enableFiltering: true,
      multiSelect: false,
      columnDefs: [{
          field: 'Id',
          displayName: $translate.instant('CONTRATO'),
          width: "10%",
          cellTemplate: '<div align="center">{{row.entity.Numero_contrato}}</div>'
        },
        {
          field: 'Vigencia_contrato',
          displayName: $translate.instant('VIGENCIA_CONTRATO'),
          visible: false
        },
        {
          field: 'Nombre_completo',
          displayName: $translate.instant('NOMBRE_CONTRATISTA'),
          width: "50%"
        },
        {
          field: 'Id',
          displayName: $translate.instant('DOCUMENTO_CONTRATISTA'),
          cellTemplate: '<div align="center">{{row.entity.Id}}</div>'
        },
        {
          field: 'ContratoGeneral.ValorContrato',
          displayName: $translate.instant('VALOR'),
          cellTemplate: '<div align="right">{{row.entity.Valor_contrato | currency }}</div>'
        },
      ],
      onRegisterApi: function(gridApi) {
        self.gridApi = gridApi;
      }
    };


    //CDP GRID para cargar los CDP hay que meter esto en una funcion
    
    self.gridOptions_cdp = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
 
   columnDefs : [
     {field: 'Id',             visible : false},
     {field: 'Vigencia',   displayName: 'Vigencia'},
     {field: 'NumeroDisponibilidad',   displayName: 'Id'},
     {field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Objeto',   displayName: 'Descripcion'},
     {field: 'Solicitud.DependenciaSolicitante.Nombre',   displayName: 'Ordenador'},
     {field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Id',   displayName: 'Necesidad'},
   ]
 
 };
 financieraRequest.get('disponibilidad','limit=-1&query=Estado.Nombre__not_in:Agotado').then(function(response) {
   self.gridOptions_cdp.data = response.data;
   console.log(self.gridOptions_cdp.data);
   angular.forEach(self.gridOptions_cdp.data, function(data){
     financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Solicitud,'').then(function(response) {
         data.Solicitud = response.data[0];
         });
 
       });
 
 });

    //CDP GRID --
    

    administrativaRequest.get('vigencia_contrato').then(function(response) {
      $scope.vigencias = response.data;

    //selecciona la vigencia actual
    var vigenciaActual=$scope.vigencias[0];

        agoraRequest.directGet('proveedor_contrato_persona',vigenciaActual).then(function(response) {
         self.gridOptions.data = response.data;
          self.longitud_grid = self.gridOptions.data.length;
        });
    });
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
      seleccion = self.gridApi.selection.getSelectedRows();
      if(seleccion[0]===null || seleccion[0]===undefined){
        swal("Alertas", "Debe seleccionar un contratista", "error");
      }else{
        self.contrato.Id = seleccion[0].Numero_contrato;
        self.contrato.Vigencia= seleccion[0].Vigencia_contrato;
        self.contrato.ContratistaId= seleccion[0].Id;
        self.contrato.ValorContrato= seleccion[0].Valor_contrato;
        self.contrato.NombreContratista= seleccion[0].Nombre_completo;
        self.contrato.ObjetoContrato= seleccion[0].Objeto_contrato;
        self.contrato.FechaRegistro= seleccion[0].Fecha_registro;
        self.saving = true;
        self.btnGenerartxt = "Generando...";
      
        self.saving = false;
        self.btnGenerartxt = "Generar";
         $window.location.href = '#/rp/rp_solicitud/';
      }
};
  });


