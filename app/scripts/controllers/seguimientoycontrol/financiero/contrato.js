'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolFinancieroContratoCtrl
 * @description
 * # SeguimientoycontrolFinancieroContratoCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolFinancieroContratoCtrl', function (contrato,registro,disponibilidad,agoraRequest,orden,sicapitalRequest,administrativaRequest,$scope,$rootScope) {
    var self = this;
    self.contrato=contrato;
    self.registro_presupuestal = [];
    self.registro = registro;
    self.ordenes_pago = [];
    self.orden = orden;
    var temp = [];
    self.disponibilidad = disponibilidad;
    self.cdp=null;
    $scope.banderaRP = false;
    query = "query=NumeroContrato:"+self.contrato.Id;
    self.registro_presupuestal=[];
    //CDP asociado a un contrato
    administrativaRequest.get('contrato_disponibilidad',query).then(function(response) {
      self.cdps=response.data;
      if(self.cdps != null){
        $scope.banderaRP = true;
      //petición para traer los rp por cdp de sicapital vigencia/cdp/cedula
      for (var i = 0; i < self.cdps.length; i++) {
        self.cdp=self.cdps[i];
        //caso real
        sicapitalRequest.get('registro/rpxcdp', self.cdp.Vigencia+"/"+self.cdp.NumeroCdp+"/"+contrato.ContratistaId).then(function(response) {
        //caso prueba
        //sicapitalRequest.get('registro/rpxcdp', self.cdp.Vigencia+"/"+self.cdp.NumeroCdp).then(function(response) {
        if(response.data[0]!= "<"){
          self.registro_presupuestal=self.registro_presupuestal.concat(response.data);
          }
        });
      }
    }
    });

    agoraRequest.get('informacion_persona_natural', 'query=Id:'+contrato.ContratistaId).then(function(response) {
      self.persona=response.data[0];
    agoraRequest.get('parametro_estandar', 'query=Id:'+self.persona.TipoDocumento.Id).then(function(response) {
          self.persona.TipoDocumento.ValorParametro=response.data[0].ValorParametro;
        });
    });

    self.seleccionarValores = function(){

      //se recorre el arreglo de rps que se obtienen de la consulta y se guardan en la fabrica para usarlos en otra vista
      for (var i = 0; i < self.registro_presupuestal.length; i++) {
        temp.numero_disponibilidad= self.registro_presupuestal[i].NUMERO_DISPONIBILIDAD;
        temp.numero_registro = self.registro_presupuestal[i].NUMERO_REGISTRO;
        temp.vigencia = self.registro_presupuestal[i].VIGENCIA;
        self.registro.push(temp);
        temp = [];
      }

     //se recorre el arreglo de cdps que se obtienen de la consulta y se guardan en la fabrica para usarlos en otra vista
      for (var i = 0; i < self.cdps.length; i++) {
        temp.numero_cdp = self.cdps[i].NumeroCdp;
        temp.vigencia = self.cdps[i].Vigencia;
        temp.vigencia_cdp = self.cdps[i].VigenciaCdp;
        temp.fecha_registro = self.cdps[i].FechaRegistro;
        temp.estado = self.cdps[i].Estado;
        self.disponibilidad.push(temp);
        temp = [];
      }
      for (var i = 0; i < self.ordenes_pago.length; i++) {
        temp.fecha_orden = self.ordenes_pago[x].beneficiario;
        self.orden.push(temp);
        temp = [];
      }
    };

  });
