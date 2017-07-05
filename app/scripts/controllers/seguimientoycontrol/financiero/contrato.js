'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolFinancieroContratoCtrl
 * @description
 * # SeguimientoycontrolFinancieroContratoCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolFinancieroContratoCtrl', function ($timeout,$window,contrato,registro,disponibilidad,agoraRequest,orden,sicapitalRequest,administrativaRequest,$scope,$rootScope,$translate) {
    var self = this;
    self.cambio = false;
    self.contrato=contrato;
    self.registro_presupuestal = [];
    var url;
    self.registro = registro;
    self.ordenes_pago = [];
    self.orden=[];
    self.orden_pago = orden;
    var temp = [];
    self.disponibilidad = disponibilidad;
    self.cdp=null;
    self.cargando_datos = true;
    $scope.banderaRP = true;
    var query = "query=NumeroContrato:"+self.contrato.Id;
    self.registro_presupuestal=[];
    var t1;
    var t0;
    var total;

    if(self.contrato.Id === undefined){
      swal("Alerta", $translate.instant('NO_HAY_DATOS_REDIRIGIR'), "error").then(function() {
        //si da click en ir a contratistas
        $window.location.href = '#/seguimientoycontrol/financiero';
      });
    }

    t0 = performance.now();
    //CDP asociado a un contrato
    if(disponibilidad.length===0){
    administrativaRequest.get('contrato_disponibilidad',query).then(function(response) {
      self.cdps=response.data;
      if(self.cdps !== null){
      //petición para traer los rp por cdp de sicapital vigencia/cdp/cedula
      for (var i = 0; i < self.cdps.length; i++) {
        self.cdp=self.cdps[i];
        //caso real

        sicapitalRequest.get('registro/rpxcdp', self.cdp.Vigencia+"/"+self.cdp.NumeroCdp+"/"+contrato.ContratistaId).then(function(response) {
        //caso prueba
        //sicapitalRequest.get('registro/rpxcdp', self.cdp.Vigencia+"/"+self.cdp.NumeroCdp).then(function(response) {
        if(response.data[0]!== "<"){
          self.registro_presupuestal=self.registro_presupuestal.concat(response.data);
          self.cargando_datos = false;
        }else{
          $scope.banderaRP = false;
        }
        if(i === self.cdps.length){
          //recorre los rps y busca las ordenes de pago de este
          for (var x = 0; x < self.registro_presupuestal.length; x++) {
          url = self.contrato.ContratistaId+"/"+self.registro_presupuestal[x].NUMERO_DISPONIBILIDAD+"/"+self.registro_presupuestal[x].NUMERO_REGISTRO+"/"+self.registro_presupuestal[x].VIGENCIA;
            sicapitalRequest.get('ordenpago/opgsyc', url).then(function(response) {
              if(response.data[0]!== "<"){
                self.ordenes_pago = self.ordenes_pago.concat(response.data);
              }
              if(x===self.registro_presupuestal.length){

                for (var i = 0; i < self.ordenes_pago.length; i++) {
                  temp.numero_disponibilidad = self.ordenes_pago[i].NUMERO_DISPONIBILIDAD;
                  temp.numero_registro = self.ordenes_pago[i].NUMERO_REGISTRO;
                  temp.unidad_ejecutora = self.ordenes_pago[i].UNIDAD_EJECUTORA;
                  temp.beneficiario = self.ordenes_pago[i].BENEFICIARIO;
                  temp.cod_rubro = self.ordenes_pago[i].COD_RUBRO;
                  temp.consecutivo_orden = self.ordenes_pago[i].CONSECUTIVO_ORDEN;
                  temp.descripcion_rubro = self.ordenes_pago[i].DESCRIPCION_RUBRO;
                  temp.estado = self.ordenes_pago[i].ESTADO;
                  temp.fecha_orden = self.ordenes_pago[i].FECHA_ORDEN;
                  temp.valor_bruto = self.ordenes_pago[i].VALOR_BRUTO;
                  temp.valor_neto = self.ordenes_pago[i].VALOR_NETO;
                  temp.valor_orden = self.ordenes_pago[i].VALOR_ORDEN;
                  temp.vigencia_presupuesto = self.ordenes_pago[i].VIGENCIA_PRESUPUESTO;
                  temp.vigencia = self.ordenes_pago[i].VIGENCIA;
                  self.orden.push(temp);
                  temp=[];
                }
              }

            });
          }
        }
        });
      }
    }else{
      //comentariar la siguiente linea para ver el reloj
     $scope.banderaRP = false;
    }
    });
  }else{
    self.cargando_datos = false;
    self.cambio = true;
    $scope.banderaRP=true;
    self.registro_presupuestal.splice(0,self.registro_presupuestal.length);
    for (var i = 0; i < self.registro.length; i++) {
      temp.NUMERO_REGISTRO = self.registro[i].numero_registro;
      temp.NUMERO_DISPONIBILIDAD = self.registro[i].numero_disponibilidad;
      temp.VIGENCIA = self.registro[i].vigencia;
      temp.FECHA_REGISTRO = self.registro[i].fecha_registro;
      temp.FECHA_INICIAL = self.registro[i].fecha_inicio;
      temp.FECHA_FINAL = self.registro[i].fecha_fin;
      temp.NUMERO_COMPROMISO = self.registro[i].numero_compromiso;
      self.registro_presupuestal.push(temp);
    }
    temp=[];

  }
    t1 = performance.now();
    total = (t1 - t0) +500;

    self.reloj = function(){
      if($scope.banderaRP === true && self.cargando_datos === true){
        return true;
      }else{
        return false;
      }
    };

    agoraRequest.get('informacion_persona_natural', 'query=Id:'+contrato.ContratistaId).then(function(response) {
      self.persona=response.data[0];
    agoraRequest.get('parametro_estandar', 'query=Id:'+self.persona.TipoDocumento.Id).then(function(response) {
          self.persona.TipoDocumento.ValorParametro=response.data[0].ValorParametro;
        });
    });

    self.seleccionarValores = function(){
      if(disponibilidad.length===0){
        $timeout(function(){
        temp =[];
        //se recorre el arreglo de rps que se obtienen de la consulta y se guardan en la fabrica para usarlos en otra vista
        for (var i = 0; i < self.registro_presupuestal.length; i++) {
          temp.numero_disponibilidad= self.registro_presupuestal[i].NUMERO_DISPONIBILIDAD;
          temp.numero_registro = self.registro_presupuestal[i].NUMERO_REGISTRO;
          temp.vigencia = self.registro_presupuestal[i].VIGENCIA;
          temp.fecha_registro = self.registro_presupuestal[i].FECHA_REGISTRO;
          temp.fecha_inicio = self.registro_presupuestal[i].FECHA_INICIAL;
          temp.fecha_fin = self.registro_presupuestal[i].FECHA_FINAL;
          temp.numero_compromiso = self.registro_presupuestal[i].NUMERO_COMPROMISO;
          self.registro.push(temp);
          temp = [];
        }

       //se recorre el arreglo de cdps que se obtienen de la consulta y se guardan en la fabrica para usarlos en otra vista
        for (i = 0; i < self.cdps.length; i++) {
          temp.numero_cdp = self.cdps[i].NumeroCdp;
          temp.vigencia = self.cdps[i].Vigencia;
          temp.vigencia_cdp = self.cdps[i].VigenciaCdp;
          temp.fecha_registro = self.cdps[i].FechaRegistro;
          temp.estado = self.cdps[i].Estado;
          self.disponibilidad.push(temp);
          temp = [];
        }
        //se recorre el arreglo de ordenes que se obtienen de la consulta y se guardan en la fabrica para usarlos en otra vista
        for (i = 0; i < self.orden.length; i++) {
          temp.numero_disponibilidad = self.orden[i].numero_disponibilidad;
          temp.numero_registro = self.orden[i].numero_registro;
          temp.unidad_ejecutora = self.orden[i].unidad_ejecutora;
          temp.beneficiario = self.orden[i].beneficiario;
          temp.cod_rubro = self.orden[i].cod_rubro;
          temp.consecutivo_orden = self.orden[i].consecutivo_orden;
          temp.descripcion_rubro = self.orden[i].descripcion_rubro;
          temp.estado = self.orden[i].estado;
          temp.fecha_orden = self.orden[i].fecha_orden;
          temp.valor_bruto = self.orden[i].valor_bruto;
          temp.valor_neto = self.orden[i].valor_neto;
          temp.valor_orden = self.orden[i].valor_orden;
          temp.vigencia_presupuesto = self.orden[i].vigencia_presupuesto;
          temp.vigencia = self.orden[i].vigencia;
          self.orden_pago.push(temp);
          temp = [];
        }
        self.cambio = true;
      }, total);
      }

    };

  });
