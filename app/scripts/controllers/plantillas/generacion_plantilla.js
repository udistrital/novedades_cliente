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

  self.opcionesTexto = ['Texto','HTML'];
  self.textoNormal = true;
  // Json de prueba para los datos del formulario
  self.contenidoMinuta = {
    Titulo: 'Minuta de prueba',
    IdDependencia: {
      Id: 1,
      Nombre: 'OAS'
    },
    IdUnidadEjecutora: {
      Id: 1,
      Nombre: 'Recursos Físicos'
    },
    TipoContrato: 0,
    Introduccion: 'Entre los suscritos, de una parte, CARLOS JAVIER MOSQUERA SUAREZ, mayor de edad, vecino de esta ciudad, identificado con cédula de ciudadanía No.19.353.736 expedida en Bogotá, D.C., quien actúa en calidad de Rector (E), de conformidad con la Resolución 001 del 29 de enero de 2015 y posesionado mediante Acta del 02 de febrero de 2015, debidamente autorizado para contratar, según Acuerdo No. 003 de 2015 (Estatuto de Contratación de la Universidad Distrital Francisco José de Caldas) y Resoluciones rectorales 262 de 2015, 443 de 2015 y 003 de 2016, quien en lo sucesivo se denominará LA UNIVERSIDAD, con NIT 899999230-7, ente universitario autónomo de conformidad con la Ley 30 de 1992, y, de otra',
    Consideracion: 'Que LA UNIVERSIDAD elaboró los respectivos estudios y documentos previos, en los términos del artículo noveno de la Resolución de Rectoría No. 262 de 2015, en los cuales se determinó, entre otras cosas, la necesidad anterior, que conlleva a contratar un perfil (profesional, técnico o asistencial), que no existe en la planta de personal de la entidad, según certificación expedida por la División de Recursos Humanos, III. Que la modalidad de selección de contratación directa procede para la celebración de contratos prestación de servicios profesionales y de apoyo a la gestión. IV. Que el Proceso de Contratación se encuentra incluido en el Plan Anual de Adquisiciones.',
    Clausulas: []
  };

  // Agregar clausula
  self.agregarClausula = function() {
    if (typeof self.tituloClausula != 'undefined' && typeof self.textoClausula != 'undefined') {
      if (self.tituloClausula != '' && self.textoClausula != '') {
        self.contenidoMinuta.Clausulas.push({Titulo: self.tituloClausula, Texto: self.textoClausula, Paragrafos: []});
        $('#modal_add_clausula').modal('hide');
        self.limpiarModal();
      }
    }
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
    if(typeof self.textoParagrafo != 'undefined') {
      if(self.textoParagrafo != '') {
        self.contenidoMinuta.Clausulas[self.idClausula].Paragrafos.push({Texto: self.textoParagrafo});
        $('#modal_add_paragrafo').modal('hide');
        self.limpiarModal();
      }
    }
  };

  // Muestra el textarea o el text-angular del texto del paragrafo de acuerdo al valor de self.op
  self.opcionTexto = function() {
    switch (self.op) {
      case 'Texto':
      self.textoNormal = true;
      self.textoHtml = !self.textoNormal;
      self.textoOriginal = self.textoParagrafo;
      break;
      case 'HTML':
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
    self.singleTipoContrato = self.tipoContrato[self.contenidoMinuta.TipoContrato];
  });


  // Información para la modal de plantillas
  var plantillas = [
    {
      Nombre: 'Plantilla 1',
      Dependencia: 'Dependencia 1',
      UnidadEjecutora: 'Unidad Ejecutora 1',
      TipoContrato: {Id: 2, TipoContrato: 'HC-SALARIOS'},
      FechaActivacion: '08-08-2017',
      FechaInactivacion: '',
      Activo: true,
      Clausulas: [
        {Titulo: 'Clausula 1 de Plantilla 1', Texto: 'Texto Clausula 1 Plantilla 1',
        Paragrafos: [
          {Texto: 'Texto de Paragrafo 1 de Clausula 1'},
          {Texto: 'Texto de Paragrafo 2 de Clausula 1'},
          {Texto: 'Texto de Paragrafo 3 de Clausula 1'},
        ]},
        {Titulo: 'Clasula 2 de Plantilla 1', Texto: 'Texto de Clasula 2 Plantilla 1',
        Paragragos: [
          {Texto: 'Texto de Paragrafo 1 de Clasula 2'},
          {Texto: 'Texto de Paragrafo 2 de Clasula 2'}
        ]},
        {Titulo: 'Clasula 3 de Plantilla 1', Texto: 'Texto de Clasula 3 Plantilla 1',
        Paragrafos: []}
      ]
    },
    {
      Nombre: 'Plantilla 2',
      Dependencia: 'Dependencia 2',
      UnidadEjecutora: 'Unidad Ejecutora 2',
      TipoContrato: {Id: 3, TipoContrato: 'CPS'},
      FechaActivacion: '08-08-2027',
      FechaInactivacion: '',
      Activo: true,
      Clasulas: []
    },
    {
      Nombre: 'Plantilla 3',
      Dependencia: 'Dependencia 3',
      UnidadEjecutora: 'Unidad Ejecutora 3',
      TipoContrato: {Id: 1, TipoContrato: 'CPS'},
      FechaActivacion: '01-01-2016',
      FechaInactivacion: '31-12-2017',
      Activo: false,
      Clausulas: [
        {Titulo: 'Clasula 1 de Plantilla 3', Texto: 'Texto de Clausula 1 de Plantilla 3',
        Paragrafos: []},
        {Titulo: 'Clausula 2 de Plantilla 3', Texto: 'Texto de Clausula 2 de Plantilla 3',
        Paragrafos: [
          {Texto: 'Texto 1 de Paragrafo de Clasula 2'},
          {Texto: 'Texto 2 de Paragrafo de Clasula 2'},
          {Texto: 'Texto 3 de Paragrafo de Clasula 2'}
        ]}
      ]
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
    {field: 'TipoContrato.TipoContrato', headerCellTemplate: '<div align="center"> {{ \'TIPO_CONTRATO\' | translate }} </div>'},
    {field: 'Gestion', headerCellTemplate: '<div align="center"> {{ \'GESTION_PLANTILLA\' | translate }} </div>',
    cellTemplate: '<button class="btn btn-default borrar" ng-click="grid.appScope.generacionPlantilla.seleccionarPlantilla(row.entity)" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>'}
  ];

  self.llenarUiGrid = function() {
    self.gridOptions.data = [];
    for (var i = 0; i < plantillas.length; i++) {
      if (plantillas[i].Activo) {
        self.gridOptions.data.push(plantillas[i]);
      }
    }
  };

  // Recibe la plantilla seleccionada y establece la información al formulario
  self.seleccionarPlantilla = function(plantilla) {
    $('#modal_plantilla_existente').modal('hide');
    self.singleTipoContrato = self.tipoContrato[plantilla.TipoContrato.Id];
    self.contenidoMinuta = {
      Titulo: plantilla.Nombre,
      IdDependencia: {
        Id: 1,
        Nombre: plantilla.Dependencia
      },
      IdUnidadEjecutora: {
        Id: 1,
        Nombre: plantilla.UnidadEjecutora
      },
      TipoContrato: self.singleTipoContrato,
      Clausulas: plantilla.Clausulas
    };
    console.log(plantilla.TipoContrato.Id);
  }

  self.guardarCambios = function() {
    console.log(self.contenidoMinuta);
  }

  // pdfMake
  self.crearPdf = function(op) {

    var docDefinition = setInfoPlantilla();
    switch (op) {
      case 1:
      // open the PDF in a new window
      pdfMake.createPdf(docDefinition).open();
      break;
      case 2:
      // print the PDF
      pdfMake.createPdf(docDefinition).print();
      break;
      case 3:
      // download the PDF
      pdfMake.createPdf(docDefinition).download('optionalName.pdf');
      break;
      default:
      console.log('Opción no implementada');
      break;
    }
  }

  function setInfoPlantilla() {
    var pieDePagina = 'Oficina Asesora Jurídica – http://www.udistrital.edu.co   -   juridica@udistrital.edu.co \n Cra. 7 No. 40B-53, Piso 9º, Tel.: (57) 3239300  Ext. 1911 - 1912'
    var contenido = {
      pageSize: 'A4',

      header: { text: self.contenidoMinuta.Titulo.toUpperCase(), style: 'titulo'},

      footer: { text: pieDePagina, style: 'pie' },

      content:
      [
        { text: self.contenidoMinuta.Introduccion+' '+self.contenidoMinuta.Consideracion, style: 'contenido' }
      ],

      styles: {
        titulo: {
          fontSize: 11,
          bold: true,
          width: '50%',
          alignment: 'center'
        },
        subtitulo: {
          fontSize: 10,
          bold: true
        },
        pie: {
          fontSize: 9,
          alignment: 'center'
        },
        contenido: {
          fontSize: 10,
        }
      }
    };
    var numClausulas = self.contenidoMinuta.Clausulas.length;
    if (numClausulas) {
      for (var i = 0; i < numClausulas; i++) {
        var clausulaTitulo = { text: 'Clausula ' + (i+1) + ' ' +self.contenidoMinuta.Clausulas[i].Titulo, style: 'subtitulo' };
        var clausulaTexto =  { text: self.contenidoMinuta.Clausulas[i].Texto, style: 'contenido' };
        contenido.content.push(clausulaTitulo, clausulaTexto);
      }
    }

    for (var i = 0; i < contenido.content.length; i++) {
      contenido.content[i].text = contenido.content[i].text.trim()
    }
    return contenido;
  }

});
