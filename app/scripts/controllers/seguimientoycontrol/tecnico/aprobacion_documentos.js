'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:AprobacionDocumentosCtrl
 * @description
 * # AprobacionDocumentosCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('AprobacionDocumentosCtrl', function(oikosRequest, $http, uiGridConstants, contratoRequest, $translate, administrativaCrudService, administrativaAmazonService) {

    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Se utiliza la variable self estandarizada
    var self = this;
    self.contratistas = [];

    /*
      Creación tabla que tendrá todos los contratistas relacionados al supervisor
    */
    self.gridOptions1 = {
      enableSorting: true,
      enableFiltering: true,
      resizable: true,
      rowHeight: 40,
      columnDefs: [{
          field: 'nombre',
          cellTemplate: tmpl,
          displayName: $translate.instant('NAME_CONTR'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },
        {
          field: 'num_documento',
          cellTemplate: tmpl,
          displayName: $translate.instant('DOCUMENTO'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "15%"
        },
        {
          field: 'dependencia',
          cellTemplate: tmpl,
          displayName: $translate.instant('DEPENDENCIA'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },
        {
          field: 'cargo_supervision',
          cellTemplate: tmpl,
          displayName: $translate.instant('CAR_SUPER'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        }

        ,
        {
          field: 'Acciones',
          displayName: $translate.instant('ACC'),
          cellTemplate: ' <a type="button" title="Aprobar pago" type="button" class="fa fa-check fa-lg  faa-shake animated-hover" ng-if="!row.entity.validacion" ng-click="grid.appScope.aprobacionDocumentos.validarCumplido(row.entity)">' +
            '</a>&nbsp;' + '<a type="button" title="Rechazar pago" type="button" class="fa fa-close fa-lg  faa-shake animated-hover"' +
            'ng-if="row.entity.validacion" ng-click="grid.appScope.aprobacionDocumentos.invalidarCumplido(row.entity)"></a>' +
            '<a type="button" title="Ver información" type="button" class="fa fa-eye fa-lg  faa-shake animated-hover"' +
            'ng-click="grid.appScope.aprobacionDocumentos.verInformacionContrato(row.entity)" data-toggle="modal" data-target="#modal_informacion_contrato"></a>',
          width: "10%"
        }
      ]
    };



    self.gridOptions1.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
    };



    /*
      Función que recibe un objeto que posee un arreglo con información de los contratistas y su supervisor.
      Eśta función extrae el arreglo y los procesa para adicionar un atributo de validación.
    */

    self.procesar_contratistas = function(supervisor_contratistas) {

      for (var i = 0; i < supervisor_contratistas.length; i++) {
        self.contratistas[i] = {
          num_documento: supervisor_contratistas[i].contratista.documento,
          nombre: supervisor_contratistas[i].contratista.nombre,
          contrato: supervisor_contratistas[i].contrato,
          dependencia: supervisor_contratistas[i].supervisor.dependencia,
          cargo_supervision: supervisor_contratistas[i].supervisor.cargo,
          validacion: false
        }
      }
    }

    /*
      Función para consultar los datos del supervisor del contrato y los contratistas asociados a este
    */



    self.obtener_informacion_supervisor = function() {
      //Petición para obtener la información del supervisor del contrato
      self.gridOptions1.data = [];
      self.contratistas = [];
      try {
        contratoRequest.get('supervisor_contratistas', self.Documento).then(function(response) {

          self.respuesta_supervisor_contratistas = response.data;

          console.log(response.status);



          self.procesar_contratistas(self.respuesta_supervisor_contratistas.supervisores.supervisor_contratista);
          console.log(self.contratistas);


          self.supervisor = self.respuesta_supervisor_contratistas.supervisores.supervisor_contratista[0].supervisor;

          self.gridOptions1.data = self.contratistas;


        });

      } catch (error) {


      }

      self.gridApi.core.refresh();
    };


    self.validarCumplido = function(contratista) {
      swal({
        title: '¿Está seguro(a)?',
        text: "Podrá revertir la validación",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Validar'
      }).then(function() {
        contratista.validacion = true;
        self.gridApi.core.refresh();

      });
    };

    self.invalidarCumplido = function(contratista) {
      swal({
        title: '¿Está seguro(a) de invalidar el cumplido?',
        text: "Podrá revertir la invalidación",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Invalidar'
      }).then(function() {
        contratista.validacion = false;
        self.gridApi.core.refresh();

      });
    };


    self.verInformacionContrato = function(contrato_contratista) {



      contratoRequest.get('informacion_contrato_elaborado_suscrito', contrato_contratista.contrato.numero_contrato + '/' + contrato_contratista.contrato.vigencia).then(function(response) {

        self.respuesta_informacion_contrato = response.data;

        contratoRequest.get('acta_inicio_elaborado', contrato_contratista.contrato.numero_contrato + '/' + contrato_contratista.contrato.vigencia).then(function(response) {


          self.respuesta_acta_inicio = response.data;

          console.log(self.respuesta_acta_inicio);

          administrativaAmazonService.get('contrato_disponibilidad', $.param({
            query: "NumeroContrato:" + contrato_contratista.contrato.numero_contrato + ",Vigencia:" + contrato_contratista.contrato.vigencia,
            limit: 0
          })).then(function(response) {

            self.cdp = response.data[0];

            if (self.respuesta_informacion_contrato.informacion_contratista.contrato !== undefined) {
              self.objeto_modal = {
                numero_contrato: self.respuesta_informacion_contrato.informacion_contratista.contrato.numero,
                vigencia: self.respuesta_informacion_contrato.informacion_contratista.contrato.vigencia,
                cdp: self.cdp.NumeroCdp,
                fecha_cdp: "2017-01-01",
                crp: "123456",
                fecha_crp: "2017-01-01",
                fecha_inicio: self.respuesta_acta_inicio.actaInicio.fechaInicio,
                fecha_fin: self.respuesta_acta_inicio.actaInicio.fechaFin
              }
            } else {

              self.objeto_modal = {
                numero_contrato: contrato_contratista.contrato.numero_contrato,
                vigencia: contrato_contratista.contrato.vigencia,
                cdp: self.cdp.NumeroCdp,
                fecha_cdp: "2017-01-01",
                crp: "123456",
                fecha_crp: "2017-01-01",
                fecha_inicio: self.respuesta_acta_inicio.actaInicio.fechaInicio,
                fecha_fin: self.respuesta_acta_inicio.actaInicio.fechaFin
              };
            }



          });



        });

      });


    };

    self.verificarDocumentos = function(contrato) {

      administrativaCrudService.get('soporte_pago_mensual', $.param({
        query: "PagoMensual.Persona:" + true,
        limit: 0
      }))

    }


  });
