'use strict';

/**
* @ngdoc function
* @name contractualClienteApp.controller:SeguimientoycontrolFinancieroEstadisticasCtrl
* @description
* # SeguimientoycontrolFinancieroEstadisticasCtrl
* Controller of the contractualClienteApp
*/
angular.module('contractualClienteApp')
.controller('SeguimientoycontrolFinancieroEstadisticasCtrl', function (contrato,orden,$scope) {
  var self = this;
  self.ordenes_pago=orden;
  self.contrato=contrato;
  self.items = [];
  self.ordenActual={};
  var container = document.getElementById('estadistica');
  var groups = new vis.DataSet();
  var valor_actual=0;
  var valor_actual_total=0;
  var valor_contrato = contrato.ValorContrato;
  var names = ['Valor orden actual', 'Valor acumulado', 'Valor total contrato'];
  groups.add({id: 0, content: names[0]})
  groups.add({id: 1, content: names[1]})
  groups.add({id: 2, content: names[2]})


  var i = 0;
  console.log(valor_contrato);
  angular.forEach(self.ordenes_pago, function(op) {
    valor_actual=parseInt(op.valor_orden);
    valor_actual_total=valor_actual_total+valor_actual;

    //esto debe hacerse ya que la fecha queda un dia antes de la que esta definida
    var fechaArreglo = op.fecha_orden.split("-");
    var dia =parseInt(fechaArreglo[2])+1;
    var fecha = fechaArreglo[0]+"-"+fechaArreglo[1]+"-"+dia.toString();
    self.items.push({
  //    id: "OP: "+op.consecutivo_orden,
      x: fecha,
      y: valor_actual,
      group: 0,
      label: op
    });
    self.items.push({
    //  id: "OP: "+op.consecutivo_orden,
      x: fecha,
      y: valor_actual_total,
      group: 1,
    });
    self.items.push({
      id: "OP: "+op.consecutivo_orden,
      x: fecha,
      y: valor_contrato-valor_actual-valor_actual_total,
      group: 2,
    });
    i++;
  });

var dataset = new vis.DataSet(self.items);
var options = {
  legend: {right: {position: 'top-left'}},
  showCurrentTime:true,
  style:'bar',
  stack:true,
  barChart: {width:50, align:'center'}, // align: left, center, right
  drawPoints: false,
  dataAxis: {
    icons:true
  },
  height: '300px',
  orientation:'top',
  start: '2016-09-10',
  end: '2017-05-10',
};
var graph2d = new vis.Graph2d(container, self.items, groups, options);

graph2d.on('select', function (properties) {
  var lugar=properties;
  console.log(lugar);
});


        /* Chart options */
        $scope.options = { /* JSON data */ };

        /* Chart data */
        $scope.data = { /* JSON data */ }

});
