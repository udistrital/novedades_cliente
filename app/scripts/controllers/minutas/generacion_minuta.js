'use strict';

/**
* @ngdoc function
* @name contractualClienteApp.controller:MinutaGeneracionMinutaCtrl
* @description
* # MinutaGeneracionMinutaCtrl
* Controller of the contractualClienteApp
*/
angular.module('contractualClienteApp')
.controller('MinutaGeneracionMinutaCtrl', function ($translate, $timeout) {
  var self = this;

  // Json de prueba para los datos del formulario
  self.contenidoMinuta = {
    Titulo: "Minuta de prueba",
    IdDependencia: {
      Id: 1,
      Nombre: "OAS"
    },
    IdUnidadEjecutora: {
      Id: 1,
      Nombre: "Recursos Físicos"
    },
    IdTipoContrato: {
      Id: 1,
      Nombre: "CPS"
    },
    Clausulas: []
  };

  // Adiciona clausulas
  self.agregarClausula = function() {
    $("#modal_add_clausula").modal('hide');
    self.contenidoMinuta.Clausulas.push({Texto: self.clausula, Paragrafos: null});
    self.clausula='';
  }

  self.reload = function() {
    console.log("reload");
  }

  // Adiciona paragrafo
  self.adicionarParagrafo = function(num,texto){
    if(self.contenidoMinuta.Clausulas[num].Paragrafos){
      self.contenidoMinuta.Clausulas[num].Paragrafos.push({Texto: texto})
    }else{
      self.contenidoMinuta.Clausulas[num].Paragrafos=[{Texto: texto}]
    }
    /*contratacion_request.getOne("resolucion",self.idResolucion).then(function(response){
  });*/
}

// Con el tamaño de objeto devuelve un arreglo de números menor a mayor
self.getCantidad = function(objeto) {
  var numeros = [];
  if (objeto) {
    for (var i = 0; i < objeto.length; i++) {
      numeros.push(i);
    }
  }
  return numeros
}

});
