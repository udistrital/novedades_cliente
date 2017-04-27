'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolFinancieroContratoCtrl
 * @description
 * # SeguimientoycontrolFinancieroContratoCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolFinancieroContratoCtrl', function (contrato) {
    var self = this;
    self.contrato=contrato;
    console.log(contrato);
  });
