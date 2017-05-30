'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolFinancieroOrdenesPagoCtrl
 * @description
 * # SeguimientoycontrolFinancieroOrdenesPagoCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolFinancieroOrdenesPagoCtrl', function($http,$scope, registro, disponibilidad,contrato, sicapitalRequest) {
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
    self.banderaOP=false;
    for (var x = 0; x < self.registro.length; x++) {
    url = self.contrato.ContratistaId+"/"+self.registro[x].numero_disponibilidad+"/"+self.registro[x].numero_registro+"/"+self.registro[x].vigencia;
      sicapitalRequest.get('ordenpago/opgsyc', url).then(function(response) {
        if(response.data[0]!= "<"){
          self.ordenes_pago = self.ordenes_pago.concat(response.data);
        }
        if(x === self.registro.length){
          var i = 0;
          angular.forEach(self.ordenes_pago, function(op) {
            self.items.push({
              id: i++,
              content: "OP: "+op.CONSECUTIVO_ORDEN,
              start: op.FECHA_ORDEN
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
