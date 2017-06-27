'use strict';

/**
* @ngdoc function
* @name contractualClienteApp.controller:SeguimientoycontrolFinancieroOrdenesPagoCtrl
* @description
* # SeguimientoycontrolFinancieroOrdenesPagoCtrl
* Controller of the contractualClienteApp
*/
angular.module('contractualClienteApp')
.controller('SeguimientoycontrolFinancieroOrdenesPagoCtrl', function($http,$window, $scope,$translate,registro,orden, disponibilidad,contrato, sicapitalRequest) {
  var self = this;
  self.contrato = contrato;
  self.items = [];
  self.registro = registro;
  self.disponibilidad = disponibilidad;
  self.ordenes_pago =orden;
  var retorno = null;
  var container = document.getElementById('linea');
  var url;
  self.consulta_finalizada=false;
  self.banderaOP=false;
  var i = 0;
  self.ordenActual={};
  var inicio;
  var fin;
  var tempfecha;
  var mesinicio;
  var mesfin;

  if(self.contrato.Id === undefined){
    swal("Alerta", $translate.instant('NO_HAY_DATOS_REDIRIGIR'), "error").then(function() {
      //si da click en ir a contratistas
      $window.location.href = '#/seguimientoycontrol/financiero';
    });
  };
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
      cellTemplate: '<div align="center">{{row.entity.consecutivo_orden}}</div>'
    },
    {
      field: 'VIGENCIA',
      width: "10%",
      displayName: $translate.instant('VIGENCIA'),
      cellTemplate: '<div align="center">{{row.entity.vigencia}}</div>'
    },
    {
      field: 'VIGENCIA_PRESUPUESTO',
      width: "13%",
      displayName: $translate.instant('PRESUPUESTO'),
      cellTemplate: '<div align="center">{{row.entity.vigencia_presupuesto}}</div>'
    },
    {
      field: 'FECHA_ORDEN',
      width: "13%",
      displayName: $translate.instant('FECHA_ORDEN'),
      cellTemplate: '<div align="center">{{row.entity.fecha_orden}}</div>'
    },
    {
      field: 'NUMERO_REGISTRO',
      width: "8%",
      displayName: $translate.instant('NUMERO_REGISTRO_PRESUPUESTAL'),
      cellTemplate: '<div align="center">{{row.entity.numero_registro}}</div>'
    },
    {
      field: 'NUMERO_DISPONIBILIDAD',
      width: "8%",
      displayName: $translate.instant('NUMERO_DISPONIBILIDAD'),
      cellTemplate: '<div align="center">{{row.entity.numero_disponibilidad}}</div>'
    },
    {
      field: 'ESTADO',
      width: "9%",
      displayName: $translate.instant('ESTADO'),
      cellTemplate: '<div align="center">{{row.entity.estado}}</div>'
    },
    {
      field: 'VALOR_ORDEN',
      width: "13%",
      displayName: $translate.instant('VALOR_ORDEN'),
      cellTemplate: '<div align="right">{{row.entity.valor_orden | currency}}</div>'
    },
    {
      field: 'VALOR_NETO',
      width: "13%",
      displayName: $translate.instant('VALOR_NETO'),
      cellTemplate: '<div align="right">{{row.entity.valor_neto | currency}}</div>'
    },
  ],
  onRegisterApi: function(gridApi) {
    self.gridApi = gridApi;
  }
};
self.gridOptions.data = self.ordenes_pago;

$scope.getTableStyle= function() {
  var rowHeight=30;
  var headerHeight=45;
  return {
    height: (self.gridOptions.data.length * rowHeight + headerHeight) + "px"
  };
};

angular.forEach(self.ordenes_pago, function(op) {
  //esto debe hacerse ya que la fecha queda un dia antes de la que esta definida
  var fechaArreglo = op.fecha_orden.split("-");
  var dia =parseInt(fechaArreglo[2])+1;
  var fecha = fechaArreglo[0]+"-"+fechaArreglo[1]+"-"+dia.toString();

  self.items.push({
    id: i++,
    content: "OP: "+op.consecutivo_orden+"-"+op.vigencia,
    start: fecha
  });
});

//para que se puedan visualizar todas las ordenes de pago se disminuye un mes en la primera op y se aumenta un mes en la ultima op
tempfecha = self.ordenes_pago[0].fecha_orden.split("-");
mesinicio = parseInt(tempfecha[1])-1;
inicio = tempfecha[0]+"-"+mesinicio.toString()+"-"+tempfecha[1];
tempfecha=[];
tempfecha = self.ordenes_pago[self.ordenes_pago.length-1].fecha_orden.split("-");
mesfin = parseInt(tempfecha[1])+1;
fin = tempfecha[0]+"-"+mesfin.toString()+"-"+tempfecha[1];

var options = {
  showCurrentTime: true,
  start: inicio,
  end: fin,
  height: '200px',
};
var items = new vis.DataSet(self.items);
container = new vis.Timeline(container, items, options);

container.on('select', function (properties) {
  var lugar=properties.items[0];
  if(lugar !== undefined){
    self.ordenActual.numero_disponibilidad = self.ordenes_pago[parseInt(lugar)].numero_disponibilidad;
    self.ordenActual.numero_registro = self.ordenes_pago[parseInt(lugar)].numero_registro;
    self.ordenActual.unidad_ejecutora = self.ordenes_pago[parseInt(lugar)].unidad_ejecutora;
    self.ordenActual.beneficiario = self.ordenes_pago[parseInt(lugar)].beneficiario;
    self.ordenActual.cod_rubro = self.ordenes_pago[parseInt(lugar)].cod_rubro;
    self.ordenActual.consecutivo_orden = self.ordenes_pago[parseInt(lugar)].consecutivo_orden;
    self.ordenActual.descripcion_rubro = self.ordenes_pago[parseInt(lugar)].descripcion_rubro;
    self.ordenActual.estado = self.ordenes_pago[parseInt(lugar)].estado;
    self.ordenActual.fecha_orden = self.ordenes_pago[parseInt(lugar)].fecha_orden;
    self.ordenActual.valor_bruto = self.ordenes_pago[parseInt(lugar)].valor_bruto;
    self.ordenActual.valor_neto = self.ordenes_pago[parseInt(lugar)].valor_neto;
    self.ordenActual.valor_orden = self.ordenes_pago[parseInt(lugar)].valor_orden;
    self.ordenActual.vigencia_presupuesto = self.ordenes_pago[parseInt(lugar)].vigencia_presupuesto;
    self.ordenActual.vigencia = self.ordenes_pago[parseInt(lugar)].vigencia;
  }
});

self.accion = function(){
  return self.ordenActual;
};

});
