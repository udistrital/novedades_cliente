'use strict';

/**
* @ngdoc function
* @name contractualClienteApp.controller:MinutaGeneracionMinutaCtrl
* @description
* # MinutaGeneracionMinutaCtrl
* Controller of the contractualClienteApp
*/
angular.module('contractualClienteApp')
.controller('GeneracionPlantillaCtrl', function ($translate, $timeout, $scope, administrativaRequest) {
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
    TipoContrato: "0",
    Clausulas: []
  };

  // Agregar clausula
  self.agregarClausula = function() {
    $("#modal_add_clausula").modal('hide');
    self.contenidoMinuta.Clausulas.push({Titulo: self.tituloClausula, Texto: self.textoClausula, Paragrafos: []});
    self.limpiarModal();
  };

  // Eliminar clausula
  self.eliminarClausula = function(idClausula) {
    // Elimina un objeto del arreglo Clausulas con la funcion splice, siendo idClausula la posicion del objeto y 1 la cantidad de objetos a eliminar
    self.contenidoMinuta.Clausulas.splice(idClausula, 1);
  };

  // Cambia los campos de las ventanas modales a vacios
  self.limpiarModal = function() {
    self.tituloClausula = '';
    self.textoClausula = '';
    self.textoParagrafo = '';
  };


  // Adiciona paragrafo
  self.adicionarParagrafo = function(){
    $('#modal_add_paragrafo').modal('hide');
    self.contenidoMinuta.Clausulas[self.idClausula].Paragrafos.push({Texto: self.textoParagrafo});
    self.limpiarModal();
  };

  // Muestra el textarea o el text-angular del texto del paragrafo de acuerdo al valor de self.op
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
  };

  // Elimina un paragrafo
  self.eliminarParagrafo = function(idClausula, idParagrafo) {
    // Elimina el elemento con la funcion splice, siendo idParagrafo la posicion y 1 la cantidad de elementos a eliminar
    self.contenidoMinuta.Clausulas[idClausula].Paragrafos.splice(idParagrafo, 1);
  };

  // Con el tamaño de objeto devuelve un arreglo de números menor a mayor
  self.getCantidad = function(objeto) {
    var numeros = [];
    if (objeto) {
      for (var i = 0; i < objeto.length; i++) {
        numeros.push(i);
      }
    }
    return numeros
  };

  administrativaRequest.get('tipo_contrato','query=Estado:true').then(function(response) {
    self.tipoContrato = response.data;
  });


  // Información para la modal de plantillas
  var plantillas = [
    {
      Nombre: "Plantilla 1",
      Dependencia: "Dependencia 1",
      UnidadEjecutora: "Unidad Ejecutora 1",
      TipoContrato: "CPS",
      FechaActivacion: "08-08-2017",
      FechaInactivacion: "",
      Activo: true
    },
    {
      Nombre: "Plantilla 2",
      Dependencia: "Dependencia 2",
      UnidadEjecutora: "Unidad Ejecutora 2",
      TipoContrato: "CPS Virtual",
      FechaActivacion: "08-08-2027",
      FechaInactivacion: "",
      Activo: true
    },
    {
      Nombre: "Plantilla 3",
      Dependencia: "Dependencia 3",
      UnidadEjecutora: "Unidad Ejecutora 3",
      TipoContrato: "fsdfsdfasdf",
      FechaActivacion: "01-01-2016",
      FechaInactivacion: "31-12-2017",
      Activo: false
    }
  ];

  self.gridOptions = {
    enableFiltering : false,
    enableSorting : true,
    treeRowHeaderAlwaysVisible : false,
    showTreeExpandNoChildren : false,
  };

  self.gridOptions.columnDefs = [
    {field: 'Nombre', headerCellTemplate: '<div align="center"> {{ \'NOMBRE\' | translate }} </div>'},
    {field: 'Dependencia',  headerCellTemplate: '<div align="center"> {{ \'DEPENDENCIA\' | translate }} </div>'},
    {field: 'UnidadEjecutora', headerCellTemplate: '<div align="center"> {{ \'UNIDAD_EJECUTORA\' | translate }} </div>'},
    {field: 'TipoContrato', headerCellTemplate: '<div align="center"> {{ \'TIPO_CONTRATO\' | translate }} </div>'},
    {field: 'Gestion', headerCellTemplate: '<div align="center"> {{ \'GESTION_PLANTILLA\' | translate }} </div>',
      cellTemplate: '<button class="btn btn-default borrar" ng-click="grid.appScope.generacionPlantilla.cerrarModal()" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>'}
  ];

  self.llenarUiGrid = function() {
    for (var i = 0; i < plantillas.length; i++) {
      if (plantillas[i].Activo) {
        self.gridOptions.data.push(plantillas[i]);
      }
    }
  };

  self.cerrarModal = function() {
    $('#modal_plantilla_existente').modal('hide');
  }
});
