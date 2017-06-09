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
  console.log(orden);
  var valor_contrato = contrato.ValorContrato;
  var valor = "";
  self.orden = {};
  var seleccion=0;
  var i = 1;

  self.porcentaje = function(total,actual){
    return parseFloat((actual/total)*100).toFixed(2);
  };

  angular.forEach(self.ordenes_pago, function(op) {
    valor_actual=parseInt(op.valor_orden);
    valor_actual_total=valor_actual_total+valor_actual;
    op.porcentaje = self.porcentaje(valor_contrato,valor_actual);
    op.porcentaje_acumulado = self.porcentaje(valor_contrato,valor_actual_total);
    //esto debe hacerse ya que la fecha queda un dia antes de la que esta definida
    var fechaArreglo = op.fecha_orden.split("-");
    var dia =parseInt(fechaArreglo[2])+1;
    var fecha = fechaArreglo[0]+"-"+fechaArreglo[1]+"-"+dia.toString();

    data.push({
      x: i,
      y:1,
      z: valor_actual,
      label:"Valor Orden Pago "+op.consecutivo_orden+"-"+op.vigencia,
      porcentaje : op.porcentaje,
      fecha: op.fecha_orden,
    });
    data.push({
      x: i,
      y:2,
      z: valor_actual_total,
      label:"Valor Acumulado Ordenes de Pago",
      porcentaje : op.porcentaje_acumulado,
      fecha: op.fecha_orden,
    });
    data.push({
      x: i,
      y:3,
      z: valor_contrato,
      label:"Valor Total Contrato",
      porcentaje : 100,
      fecha: op.fecha_orden,
    });
    i++;
  });

   // specify options
   var options = {
       width:600,
       style: 'bar',
       showGrid: true,
       tooltip:true,
       showLegend:true,
       legendLabel:"Cantidad de dinero",
       yLabel: "",
       zLabel: "",
       xLabel: "",
      zValueLabel:function(z){
          var valor = "$ " + z.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          return valor;
       },
       xValueLabel:function(x){
         x=x-1;
         return self.ordenes_pago[x].consecutivo_orden;
       },
       yValueLabel:function(y){
         if(y===1){
           return "Orden de pago actual";
         }else if(y===2){
           return "Acumulado de ordenes de pago";
         }else if(y===3){
           return "Total Contrato";
         }
          return " ";
       },
       // Option tooltip can be true, false, or a function returning a string with HTML contents
        tooltip: function (point) {
          seleccion = parseInt(point.x)-1;
          // parameter point contains properties x, y, z, and data
          // data is the original object passed to the point constructor
          var valor =point.z.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          return '<b>'+point.data.label+'</b><br>'
          +'Valor: <b> $ ' + valor +'</b><br>'
          +"Porcentaje:<b> % "+point.data.porcentaje+"</b><br>"
          +"Fecha:<b> "+point.data.fecha+"</b><br>";
        },

        // Tooltip default styling can be overridden
        tooltipStyle: {
          content: {
            background    : 'rgba(143, 195, 185, 0.7)',
          },
          line: {
            borderLeft    : '1px dotted rgba(0, 0, 0, 0.5)'
          },
          dot: {
            border        : '5px solid rgba(0, 0, 0, 0.5)'
          }
        },

        keepAspectRatio: true,
        verticalRatio: 0.5
   };

   // Instantiate our graph object.
   var graph3d = new vis.Graph3d(container, data, options);

  self.seleccionar = function(){
    self.orden = self.ordenes_pago[seleccion];
    console.log(self.orden);
  };


});
