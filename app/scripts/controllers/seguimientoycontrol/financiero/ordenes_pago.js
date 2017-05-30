'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolFinancieroOrdenesPagoCtrl
 * @description
 * # SeguimientoycontrolFinancieroOrdenesPagoCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolFinancieroOrdenesPagoCtrl', function($http,$scope, contrato, orden,sicapitalRequest,registro,disponibilidad) {
    var self = this;
    self.contrato = contrato;
    self.items = [];
    self.registro = registro;
    self.disponibilidad = disponibilidad;
    var registros = [];
    self.ordenes_pago =orden;
    var retorno = null;
    var container = document.getElementById('linea');
    self.ordenActual = {};
    self.banderaOP=false;
    var temp=[];

    for (var x = 0; x < self.registro.length; x++) {
      sicapitalRequest.get('ordenpago/opgsyc', "1071167689/4624/9768/2016").then(function(response) {
        if(response.data[0]!= "<"){
          temp.fecha_orden = self.ordenes_pago[i].FECHA_ORDEN;
          self.orden.push(temp);
          temp = [];
        }
      });
    }

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
        console.log(self.ordenActual);
    });

  self.inici
  self.accion = function(){
    return self.ordenActual;
  };

  });
