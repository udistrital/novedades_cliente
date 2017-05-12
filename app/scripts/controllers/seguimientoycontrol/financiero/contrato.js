'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolFinancieroContratoCtrl
 * @description
 * # SeguimientoycontrolFinancieroContratoCtrl
 * Controller of the contractualClienteApp
 */

angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolFinancieroContratoCtrl', function (contrato,agoraRequest,sicapitalRequest,administrativaRequest) {
    var self = this;
    self.contrato=contrato;
    console.log(contrato);

    /*administrativaRequest.get('contrato_general','query=Id:DVE470,VigenciaContrato:2017').then(function(response) {
      self.registro_presupuestal=response.data[0].RegistroPresupuestal;
    });*/

    //petición para traer los rp por cdp de sicapital vigencia/cdp/cedula
    sicapitalRequest.get('registro/rpxcdp', '2016/3472/1031138556').then(function(response) {
      self.registro_presupuestal=response.data[0];
      console.log(self.registro_presupuestal);
    });

    agoraRequest.get('informacion_persona_natural', 'query=Id:'+contrato.ContratistaId).then(function(response) {
      self.persona=response.data[0];
    agoraRequest.get('parametro_estandar', 'query=Id:'+self.persona.TipoDocumento.Id).then(function(response) {
          self.persona.TipoDocumento.ValorParametro=response.data[0].ValorParametro;
        });
    });
  });
