'use strict';

/**
* @ngdoc function
* @name contractualClienteApp.controller:SeguimientoycontrolFinancieroEstadisticasCtrl
* @description
* # SeguimientoycontrolFinancieroEstadisticasCtrl
* Controller of the contractualClienteApp
*/
angular.module('contractualClienteApp')
.controller('SeguimientoycontrolFinancieroEstadisticasCtrl', function (contrato,$window,orden,$scope,$translate) {
  var self = this;
  self.ordenes_pago=orden;
  self.contrato=contrato;
  var data1 = [];
  var data2 = [];
  var data3 = [];
  self.ordenActual={};
  var valor_actual=0;
  var valor_actual_total=0;
  self.seleccion = false;
  var valor_contrato = contrato.ValorContrato;
  self.orden = {};
  var i = 1;

  if(self.contrato.Id === undefined){
    swal("Alerta", $translate.instant('NO_HAY_DATOS_REDIRIGIR'), "error").then(function() {
      //si da click en ir a contratistas
      $window.location.href = '#/seguimientoycontrol/financiero';
    });
  }

  $scope.options = {
    chart: {
      type: 'multiBarChart',
      height: 450,
      margin : {
        top: 40,
        right: 5,
        bottom: 65,
        left: 100,
      },
      stacked: true,
      x: function(d){return d.op;},
      y: function(d){return d.valor;},
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
            var lugar = parseInt(e.data.x);
            self.orden = self.ordenes_pago[lugar-1];
            self.seleccion = true;
            angular.element('#grafico').triggerHandler('click');
            //refresh();
          },
        },
      },
      tooltip: {
        contentGenerator: function(d){
          var valor = d.data.valor;
          valor = '$'+valor.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          return "<h5><b>"+d.data.op+"</b></h5><h5><b>"+$translate.instant('VALOR')+
          ": </b></h5>"+valor+"</br><h5><b>"+$translate.instant('FECHA')+": </h5></b>"
          +d.data.fecha+"</br><h5><b>"+$translate.instant('PORCENTAJE')+": </b></h5>"+d.data.porcentaje+"%"
          +"</br><h5><b>"+$translate.instant('TIPO')+": </b></h5>"+d.data.tipo;
        },
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

    data1.push({
      x: i,
      op:op.consecutivo_orden+"-"+op.vigencia,
      valor: valor_actual,
      tipo: $translate.instant('UNITARIO'),
      porcentaje : op.porcentaje,
      fecha: fecha,
      yAxis:0,
    });
    data2.push({
      x: i,
      op:op.consecutivo_orden+"-"+op.vigencia,
      valor: valor_actual_total,
      tipo: $translate.instant('ACUMULADO'),
      porcentaje : op.porcentaje_acumulado,
      fecha: fecha,
      series:2,
      yAxis:1,
    });
    data3.push({
      x: i,
      op:op.consecutivo_orden+"-"+op.vigencia,
      valor: valor_contrato,
      tipo: $translate.instant('TOTAL'),
      porcentaje : 100,
      fecha: fecha,
      yAxis:3,
    });
    i++;
  });
//se agrega un arreglo para cada stack de la grafica
  self.generateData =function(){
    return [{
  key: $translate.instant('UNITARIO'),
  color: '#22313F',
  values: data1,
  },
  {
    key: $translate.instant('ACUMULADO'),
    color: '#6BB9F0',
    values: data2,
  },
  {
    key: $translate.instant('TOTAL'),
    color: '#1E8BC3',
    values: data3,
  }
];
  };

  $scope.data = self.generateData();

  self.seleccionar = function(){
    return self.orden;
  };


});
