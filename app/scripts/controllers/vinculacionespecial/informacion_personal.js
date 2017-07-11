'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:InformacionPersonalCtrl
 * @description
 * # InformacionPersonalCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('InformacionPersonalCtrl', function (agoraRequest,coreRequest,$scope,$mdDialog,idPersona) {
    
    var self = this;
    self.idPersona=idPersona;

    agoraRequest.get("informacion_persona_natural","query=Id%3A"+self.idPersona).then(function(response){
    	self.persona=response.data[0];
    	self.persona.FechaExpedicionDocumento = new Date(self.persona.FechaExpedicionDocumento).toLocaleDateString('es');
    	coreRequest.get("pais","query=Id%3A"+self.persona.IdPaisNacimiento).then(function(response){
	    	self.persona.Pais=response.data[0].NombrePais;
	    })
    })

  });
