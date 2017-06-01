'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolFinancieroOrdenesPagoCtrl
 * @description
 * # SeguimientoycontrolFinancieroOrdenesPagoCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolFinancieroOrdenesPagoCtrl', function($http, $scope,$translate,registro, disponibilidad,contrato, sicapitalRequest) {
    var self = this;
    self.contrato = contrato;
    self.items = [];
    self.registro = registro;
    self.disponibilidad = disponibilidad;
    self.ordenes_pago =[];
    var retorno = null;
    var container = document.getElementById('linea');
    self.ordenActual = {};
    var url;
    self.consulta_finalizada=false;
    self.banderaOP=false;

    self.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableSorting: true,
      enableFiltering: true,
      multiSelect: false,
      columnDefs: [{
          field: 'CONSECUTIVO',
          displayName: $translate.instant('CONSECUTIVO'),
          width: "12%",
          rowHeight: 30,
          cellTemplate: '<div align="center">{{row.entity.CONSECUTIVO_ORDEN}}</div>'
        },
        {
          field: 'VIGENCIA',
          width: "10%",
          displayName: $translate.instant('VIGENCIA'),
          cellTemplate: '<div align="center">{{row.entity.VIGENCIA}}</div>'
        },
        {
          field: 'VIGENCIA_PRESUPUESTO',
          width: "13%",
          displayName: $translate.instant('PRESUPUESTO'),
          cellTemplate: '<div align="center">{{row.entity.VIGENCIA_PRESUPUESTO}}</div>'
        },
        {
          field: 'FECHA_ORDEN',
          width: "13%",
          displayName: $translate.instant('FECHA_ORDEN'),
          cellTemplate: '<div align="center">{{row.entity.FECHA_ORDEN}}</div>'
        },
        {
        field: 'NUMERO_REGISTRO',
        width: "8%",
        displayName: $translate.instant('NUMERO_REGISTRO_PRESUPUESTAL'),
        cellTemplate: '<div align="center">{{row.entity.NUMERO_REGISTRO}}</div>'
      },
      {
        field: 'NUMERO_DISPONIBILIDAD',
        width: "8%",
        displayName: $translate.instant('NUMERO_DISPONIBILIDAD'),
        cellTemplate: '<div align="center">{{row.entity.NUMERO_DISPONIBILIDAD}}</div>'
      },
      {
        field: 'ESTADO',
        width: "9%",
        displayName: $translate.instant('ESTADO'),
        cellTemplate: '<div align="center">{{row.entity.ESTADO}}</div>'
      },
      {
        field: 'VALOR_ORDEN',
        width: "13%",
        displayName: $translate.instant('VALOR_ORDEN'),
        cellTemplate: '<div align="right">{{row.entity.VALOR_ORDEN | currency}}</div>'
      },
      {
        field: 'VALOR_NETO',
        width: "13%",
        displayName: $translate.instant('VALOR_NETO'),
        cellTemplate: '<div align="right">{{row.entity.VALOR_NETO | currency}}</div>'
      },
      ],
      onRegisterApi: function(gridApi) {
        self.gridApi = gridApi;
      }
    };
    $scope.getTableStyle= function() {
      var rowHeight=30;
      var headerHeight=45;
      return {
      height: (self.gridOptions.data.length * rowHeight + headerHeight) + "px"
      };
    };

    for (var x = 0; x < self.registro.length; x++) {
    url = self.contrato.ContratistaId+"/"+self.registro[x].numero_disponibilidad+"/"+self.registro[x].numero_registro+"/"+self.registro[x].vigencia;
      sicapitalRequest.get('ordenpago/opgsyc', url).then(function(response) {
        if(response.data[0]!= "<"){
          self.ordenes_pago = self.ordenes_pago.concat(response.data);

        }
        if(x === self.registro.length){
           self.gridOptions.data = response.data;
           console.log(response.data);
           self.consulta_finalizada=true;
          var i = 0;
          angular.forEach(self.ordenes_pago, function(op) {
            //esto debe hacerse ya que la fecha queda un dia antes de la que esta definida
            var fechaArreglo = op.FECHA_ORDEN.split("-");
            var dia =parseInt(fechaArreglo[2])+1;
            var fecha = fechaArreglo[0]+"-"+fechaArreglo[1]+"-"+dia.toString();

            self.items.push({
              id: i++,
              content: "OP: "+op.CONSECUTIVO_ORDEN,
              start: fecha
            });
          });
          var options = {
            showCurrentTime: true,
            start: self.items[0].FECHA_ORDEN,
            end: self.items[self.items.length-1].FECHA_ORDEN,
            height: '200px',

          };
          var items = new vis.DataSet(self.items);
          container = new vis.Timeline(container, items, options);

          container.on('select', function (properties) {
            var lugar=properties.items[0];
            if(lugar !== undefined){
              var a = self.ordenes_pago[parseInt(lugar)];
              self.ordenActual= a;
            }
        });
        }

    });
    }


  self.accion = function(){
    return self.ordenActual;
  };

  });
