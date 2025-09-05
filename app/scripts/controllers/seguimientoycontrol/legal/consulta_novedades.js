'use strict';

angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolLegalConsultaNovedadesCtrl', function ($scope, novedadesMidRequest, $log) {
    var self = this;

    self.anularFila = function (entity) {
      var id = entity.Id || entity.id || entity.IdNovedad || entity.novedadId;
      if (!id) {
        $log.error('No se encontró Id en la fila:', entity);
        if (window.swal) swal('Error', 'No se encontró el Id de la novedad en la fila', 'error');
        return;
      }
      var payload = { Activo: false };

      $log.info('PATCH /v1/novedad/' + id, payload);
      novedadesMidRequest.patch('novedad', id, payload)
        .then(function () {
          if (window.swal) swal('Éxito', 'Novedad ' + id + ' anulada', 'success');
          if (Object.prototype.hasOwnProperty.call(entity, 'Activo')) entity.Activo = false;
          if (Object.prototype.hasOwnProperty.call(entity, 'estado')) entity.estado = 'ANULADA';
        })
        .catch(function (err) {
          $log.error('Error PATCH /v1/novedad/' + id, err);
          if (window.swal) swal('Error', 'No fue posible anular la novedad ' + id, 'error');
        });
    };

    $scope.anularFila = self.anularFila;

    self.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: false,
      multiSelect: false,
      enableSelectAll: false,
      columnDefs: [
        { field: 'row', displayName: 'No', width: 50,
          cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' },
        { field: 'fecharegistro', displayName: 'Fecha de Registro', width: 150 },
        { field: 'tipo', displayName: 'Tipo de Novedad', width: 160 },
        { field: 'numerosolicitud', displayName: 'Número Solicitud', width: 150 },
        { field: 'fechasolicitud', displayName: 'Fecha de Solicitud', width: 150 },
        { field: 'observacion', displayName: 'Observación', width: 300 },
        { field: 'motivo', displayName: 'Motivo', width: 250 },
        {
          field: 'accion', displayName: 'Acción', width: 100,
          cellTemplate:
            '<center>' +
              '<a class="ver" ng-click="grid.appScope.TiposAvance && grid.appScope.TiposAvance.load_row ? grid.appScope.TiposAvance.load_row(row,\'ver\') : angular.noop()" data-toggle="modal" data-target="#modalVer">' +
                '<i class="fa fa-eye fa-lg faa-shake animated-hover" aria-hidden="true" title="{{\'BTN.VER\' | translate}}"></i>' +
              '</a> ' +
              '<a class="borrar" ng-click="grid.appScope.TiposAvance && grid.appScope.TiposAvance.load_row ? grid.appScope.TiposAvance.load_row(row,\'delete\') : angular.noop()">' +
                '<i title="{{\'BTN.BORRAR\' | translate}}" class="fa fa-trash fa-lg faa-shake animated-hover" aria-hidden="true"></i>' +
              '</a>' +
            '</center>'
        },
        {
          field: 'anular', displayName: 'Anular', width: 110, enableFiltering: false, enableSorting: false,
          cellTemplate:
            '<div class="ui-grid-cell-contents text-center">' +
              '<button type="button" class="btn btn-xs btn-danger" ' +
                      'ng-click="grid.appScope.anularFila(row.entity)" ' +
                      'ng-disabled="row.entity.Activo === false || row.entity.estado === \'ANULADA\'">' +
                'Anular' +
              '</button>' +
            '</div>'
        }
      ],
      onRegisterApi: function (gridApi) { self.gridApi = gridApi; }
    };

    self.gridOptions.data = [
      { id: 10077, fecharegistro: '20-06-2017', tipo: 'cesión', numerosolicitud: '123', fechasolicitud:'07-06-2017', observacion:'PRUEBA', motivo:'PRUEBA', estado:'CREADA', Activo:true },
      { id: 10088, fecharegistro: '20-06-2017', tipo: 'suspensión', numerosolicitud: '124', fechasolicitud:'07-06-2017', observacion:'PRUEBA', motivo:'PRUEBA', estado:'CREADA', Activo:true }
    ];
  });
