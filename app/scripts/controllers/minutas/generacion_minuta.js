'use strict';

/**
* @ngdoc function
* @name contractualClienteApp.controller:MinutaGeneracionMinutaCtrl
* @description
* # MinutaGeneracionMinutaCtrl
* Controller of the contractualClienteApp
*/
angular.module('contractualClienteApp')
.controller('MinutaGeneracionMinutaCtrl', function ($translate, $timeout, $scope) {
  var self = this;

  self.opcionesTexto = ["Texto","HTML"];
  self.textoNormal = true;
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

  // Muestra el textarea o el text-angular de acuerdo al valor de self.op
  self.opcionTexto = function() {
    switch (self.op) {
      case "Texto":
        self.textoNormal = true;
        self.textoHtml = !self.textoNormal;
        self.textoOriginal = self.textoParagrafo;
      break;
      case "HTML":
        self.textoHtml = true;
        self.textoNormal = !self.textoHtml;
      break;
      default:
        self.textoNormal = true;
        self.textoHtml = !self.textoNormal;
      break;
    }
  }

  // Adiciona clausulas
  self.agregarClausula = function() {
    $("#modal_add_clausula").modal('hide');
    self.contenidoMinuta.Clausulas.push({Titulo: self.tituloClausula, Texto: self.textoClausula, Paragrafos: []});
    self.clausula='';
  }

  // Cambia los campos de las ventanas modales vacios
  self.limpiarModal = function() {
    self.textoClausula = '';
    self.tituloClausula = '';
  }


  // Adiciona paragrafo
  self.adicionarParagrafo = function(){
    $('#modal_add_paragrafo').modal('hide');
    self.contenidoMinuta.Clausulas[self.idClausula].Paragrafos.push({Texto: self.textoParagrafo});
    console.log(self.contenidoMinuta);
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
