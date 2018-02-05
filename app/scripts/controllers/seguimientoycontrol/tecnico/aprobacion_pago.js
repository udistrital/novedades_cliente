'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:AprobacionPagoCtrl
 * @description
 * # AprobacionPagoCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('AprobacionPagoCtrl', function (oikosRequest, $http, uiGridConstants, contratoRequest, $translate) {

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
          rowHeight:40,
          columnDefs: [
            {
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
            }
            ,
            {
              field: 'dependencia',
              cellTemplate: tmpl,
              displayName: $translate.instant('DEPENDENCIA'),
              sort: {
                direction: uiGridConstants.ASC,
                priority: 1
              },
            }
            ,
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
              cellTemplate: ' <button title="Aprobar pago" type="button" class="btn btn-success btn-circle" ng-if="!row.entity.validacion" ng-click="grid.appScope.aprobacionPago.validarCumplido(row.entity)" data-toggle="modal" data-target="#editarDependencia">' +
              '<i class="glyphicon glyphicon-ok"></i></button>&nbsp;' + '<button title="Rechazar pago" type="button" class="btn btn-danger btn-circle"' +
              'ng-if="row.entity.validacion" ng-click="grid.appScope.aprobacionPago.invalidarCumplido(row.entity)" data-toggle="modal" data-target="#vincularEspacios"><i class="glyphicon glyphicon-remove"></i></button>',
              width: "10%"
            }
          ]
        };



        self.gridOptions1.onRegisterApi = function (gridApi) {
          self.gridApi = gridApi;
      };



        /*
          Función que recibe un objeto que posee un arreglo con información de los contratistas y su supervisor.
          Eśta función extrae el arreglo y los procesa para adicionar un atributo de validación.
        */

        self.procesar_contratistas = function(supervisor_contratistas){

                for(var i = 0; i<supervisor_contratistas.length;i++){
                 self.contratistas[i] = {
                 num_documento:  supervisor_contratistas[i].contratista.documento,
                 nombre : supervisor_contratistas[i].contratista.nombre,
                 dependencia :  supervisor_contratistas[i].supervisor.dependencia,
                 cargo_supervision : supervisor_contratistas[i].supervisor.cargo,
                 validacion : false
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
          contratoRequest.get('supervisor_contratistas',self.Documento).then(function(response) {

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


        self.validarCumplido = function (contratista) {
          swal({
            title: '¿Está seguro(a)?',
            text: "Podrá revertir la validación",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Validar'
          }).then(function () {
            contratista.validacion = true;
            self.gridApi.core.refresh();

          });
    };

    self.invalidarCumplido = function (contratista) {
      swal({
        title: '¿Está seguro(a) de invalidar el cumplido?',
        text: "Podrá revertir la invalidación",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Invalidar'
      }).then(function () {
        contratista.validacion = false;
        self.gridApi.core.refresh();

      });
    };

  });
