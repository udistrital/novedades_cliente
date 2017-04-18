'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:RpSolicitudPersonasCtrl
 * @description
 * # RpSolicitudPersonasCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('RpSolicitudPersonasCtrl', function($window, $scope, financieraRequest, $routeParams, adminMidRequest) {
    var self = this;
    var query;
    $scope.vigencias = [2017, 2016];
    $scope.vigenciaModel = null;
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
          displayName: 'Contrato',
          width: "10%",
          cellTemplate: '<div align="center">{{row.entity.Id}}</div>'
        },
        {
          field: 'VigenciaContrato',
          displayName: 'Vigencia de Contrato',
          visible: false
        },
        {
          field: 'Contratista.NomProveedor',
          displayName: 'Contratista nombre',
          width: "50%"
        },
        {
          field: 'Contratista.NumDocumento',
          displayName: 'Contratista documento',
          cellTemplate: '<div align="center">{{row.entity.Contratista.NumDocumento}}</div>'
        },
        {
          field: 'ValorContrato',
          displayName: 'Valor del contrato',
          cellTemplate: '<div align="right">{{row.entity.ValorContrato | currency }}</div>'
        },
      ],
      onRegisterApi: function(gridApi) {
        self.gridApi = gridApi;
      }
    };


    //1 carga los contratos con vigencia 2017 al cargar el controllador
    var datos = JSON.stringify("VigenciaContrato:2017");
    adminMidRequest.post('informacion_proveedor/contratoPersona', datos).then(function(response) {
      self.gridOptions.data = response.data;
      if (response.data === null) {
        $scope.busquedaSinResultados = true;
      }
    });

    //se buscan los contratos por la vigencia seleccionada
    self.buscarContratosVigencia = function() {
      query = "";
      if ($scope.vigenciaModel !== undefined || $scope.vigenciaModel === null) {
        query = query + "VigenciaContrato:" + $scope.vigenciaModel;
        var datos = JSON.stringify(query);
        adminMidRequest.post('informacion_proveedor/contratoPersona', datos).then(function(response) {
          self.gridOptions.data = response.data;
          if (response.data === null) {
            $scope.busquedaSinResultados = true;
          }
        });
      }
    };

    self.mostrar_estadisticas = function() {
      var seleccion = self.gridApi.selection.getSelectedRows();
      var contrato = {
        Id: seleccion[0].Id,
        Vigencia: seleccion[0].VigenciaContrato,
        ContratistaId: seleccion[0].Contratista.NumDocumento,
        ValorContrato: seleccion[0].ValorContrato,
        NombreContratista: seleccion[0].Contratista.NomProveedor,
      };

      self.saving = true;
      self.btnGenerartxt = "Generando...";

      self.saving = false;
      self.btnGenerartxt = "Generar";
      $window.location.href = '#/rp/rp_solicitud/' + contrato.Id + "/" + contrato.Vigencia + "/" + contrato.ValorContrato + "/" + contrato.ContratistaId + "/" + contrato.NombreContratista;
    };
  });
