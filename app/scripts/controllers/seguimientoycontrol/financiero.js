'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolFinancieroCtrl
 * @description
 * # SeguimientoycontrolFinancieroCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolFinancieroCtrl', function ($window, $scope, contrato,financieraRequest,administrativaRequest, $routeParams, adminMidRequest,$translate,orden,disponibilidad,registro,agoraRequest,amazonAdministrativaRequest) {
    var self = this;
     var query;
     self.dato = [1];
     self.contrato = contrato;
     self.orden = orden;
     self.disponibilidad=disponibilidad;
     self.registro=registro;
     //esto es para resetear los valores de disponibilidad, orden y registro
     self.orden.splice(0,orden.length);
     self.disponibilidad.splice(0,disponibilidad.length);
     self.registro.splice(0,registro.length);
     var seleccion;
     $scope.vigenciaModel = null;
     $scope.vigencias=null;
     $scope.busquedaSinResultados = false;
     $scope.banderaValores = true;
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
           cellTemplate: '<div align="center">{{row.entity.Numero_suscrito}}</div>'
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
         self.gridApi.core.handleWindowResize();
         self.gridApi.core.refresh();
       }
     };

     amazonAdministrativaRequest.get('vigencia_contrato').then(function(response) {
       $scope.vigencias = response.data;

     //selecciona la vigencia actual
     var vigenciaActual=$scope.vigencias[0];

     amazonAdministrativaRequest.get('proveedor_contrato_persona/'+vigenciaActual,'').then(function(response) {
          self.gridOptions.data = response.data;
         });
     });
     //se buscan los contratos por la vigencia seleccionada
     self.buscar_contratos_vigencia = function() {
       query = "";
       if ($scope.vigenciaModel !== undefined || $scope.vigenciaModel === null) {
        amazonAdministrativaRequest.get('proveedor_contrato_persona',$scope.vigenciaModel).then(function(response) {
          self.gridOptions.data = response.data;
         });
       }
     };

     self.mostrar_estadisticas = function() {
       seleccion = self.gridApi.selection.getSelectedRows();
       if(seleccion[0]===null || seleccion[0]===undefined){
         swal("Alertas", "Debe seleccionar un contratista", "error");
       }else{
         self.contrato.Id = seleccion[0].Numero_contrato;
         self.contrato.Vigencia = seleccion[0].Vigencia_contrato;
         self.contrato.ContratistaId = seleccion[0].Id;
         self.contrato.ValorContrato = seleccion[0].Valor_contrato;
         self.contrato.NombreContratista = seleccion[0].Nombre_completo;
         self.contrato.ObjetoContrato = seleccion[0].Objeto_contrato;
         self.contrato.FechaRegistro  = seleccion[0].Fecha_registro;
         self.contrato.NumeroSuscrito = seleccion[0].Numero_suscrito;
         self.saving = true;
         self.btnGenerartxt = "Generando...";
         self.saving = false;
         self.btnGenerartxt = "Generar";
         $window.location.href = '#/seguimientoycontrol/financiero/contrato';
       }

 };
  });
