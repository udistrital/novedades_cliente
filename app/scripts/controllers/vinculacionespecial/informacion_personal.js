'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:InformacionPersonalCtrl
 * @description
 * # InformacionPersonalCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('InformacionPersonalCtrl', function (amazonamazonAdministrativaRequest,coreRequest,$scope,$mdDialog,idPersona) {
    
    var self = this;
    self.idPersona=idPersona;

    amazonamazonAdministrativaRequest.get("informacion_persona_natural","query=Id%3A"+self.idPersona).then(function(response){
    	self.persona=response.data[0];
    	self.persona.FechaExpedicionDocumento = new Date(self.persona.FechaExpedicionDocumento).toLocaleDateString('es');
    })

  });
