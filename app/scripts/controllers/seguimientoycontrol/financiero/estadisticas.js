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
  var data = [];
  self.ordenActual={};
  var container = document.getElementById('estadistica');
  var groups = new vis.DataSet();
  var valor_actual=0;
  var valor_actual_total=0;
  self.seleccion = false;
  var valor_contrato = contrato.ValorContrato;
  var valor = "";
  self.orden = {};
  var seleccion=0;
  var i = 1;

  $scope.options = {
    chart: {
      type: 'multiBarChart',
      height: 450,
      margin : {
        top: 20,
        right: 5,
        bottom: 65,
        left: 100,
      },
      x: function(d){return d.x;},
      y: function(d){return d.valor},
      yDomain: [0,valor_contrato],
      showValues: true,
      duration: 100,
      xAxis: {
        axisLabel: 'Ordenes pago',
        showMaxMin: false,
        ticks:5,
      },
      yAxis: {
        axisLabel: 'Monto',
        axisLabelDistance: 35,
        tickFormat:function(d){return '$' + d3.format(',f')(d) },
      },
      multibar:{
        dispatch: {
          elementClick: function(e) {
            var lugar = parseInt(e.data.x)
            self.orden = self.ordenes_pago[lugar-1];
            self.seleccion = true;
            angular.element('#grafico').triggerHandler('click');
            //refresh();
          },
        },
      },
      tooltip: {
        keyFormatter: function(d) {
          return d;
        }
      },
      zoom: {
        enabled: true,
        scale : 1,
        useNiceScale: false,
        horizontalOff: false,
        verticalOff: true,
        unzoomEventType: 'dblclick.zoom',
      },
    },
  };

  self.porcentaje = function(total,actual){
    return parseFloat((actual/total)*100).toFixed(2);
  };

  angular.forEach(self.ordenes_pago, function(op) {
    valor_actual=parseInt(op.valor_orden);
    valor_actual_total=valor_actual_total+valor_actual;
    op.porcentaje = self.porcentaje(valor_contrato,valor_actual);
    op.porcentaje_acumulado = self.porcentaje(valor_contrato,valor_actual_total);
    op.valor_acumulado = valor_actual_total;
    op.valor_restante = valor_contrato - valor_actual_total;
    op.porcentaje_restante = 100 - op.porcentaje_acumulado;
    //esto debe hacerse ya que la fecha queda un dia antes de la que esta definida
    var fechaArreglo = op.fecha_orden.split("-");
    var dia =parseInt(fechaArreglo[2])+1;
    var fecha = fechaArreglo[0]+"-"+fechaArreglo[1]+"-"+dia.toString();

    data.push({
      x: i,
      valor: valor_actual,
      label:"Valor Orden Pago "+op.consecutivo_orden+"-"+op.vigencia,
      porcentaje : op.porcentaje,
      fecha: op.fecha_orden,
    });
    data.push({
      x: i,
      valor: valor_actual_total,
      label:"Valor Acumulado Ordenes de Pago",
      porcentaje : op.porcentaje_acumulado,
      fecha: op.fecha_orden,
    });
    data.push({
      x: i,
      valor: valor_contrato,
      label:"Valor Total Contrato",
      porcentaje : 100,
      fecha: op.fecha_orden,
    });
    i++;
  });

console.log(data);
  $scope.data = [
      {
          "bar": true,
          "values" : data,
      }];

  self.seleccionar = function(){
    return self.orden;
  };


});
