'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionGeneracionCtrl
 * @description
 * # ResolucionGeneracionCtrl
 * Controller of the clienteApp
 */
 angular.module('contractualClienteApp')
 .controller('ResolucionDetalleCtrl', function (administrativaRequest,oikosRequest,coreRequest,adminMidRequest,$mdDialog,$scope,$translate,$window,$localStorage,$http) {

   var self=this;
   self.resolucion = JSON.parse(localStorage.getItem("resolucion"));

   self.proyectos=[];

    oikosRequest.get("dependencia","query=Id:"+self.resolucion.IdFacultad+"&limit=-1").then(function(response){
      self.facultad=response.data[0].Nombre;
    });

    oikosRequest.get("dependencia/proyectosPorFacultad/"+self.resolucion.IdFacultad+"/"+self.resolucion.NivelAcademico_nombre,"").then(function(response){
        self.proyectos = response.data;
      });


      adminMidRequest.get("gestion_documento_resolucion/get_contenido_resolucion", "id_resolucion="+self.resolucion.Id+"&id_facultad="+self.resolucion.IdFacultad).then(function(response){
          self.contenidoResolucion=response.data;
          adminMidRequest.get("gestion_previnculacion/docentes_previnculados_all", "id_resolucion="+self.resolucion.Id).then(function(response){
            self.contratados=response.data;

          });
      });



    $http.get("scripts/models/imagen_ud.json")
        .then(function(response) {
            self.imagen = response.data;

    });

//*------------Funciones para editar la resolución -----------------*//
self.agregarArticulo = function() {
  swal({
    title: $translate.instant('ESCRIBA_TEXTO'),
    input: 'textarea',
    showCancelButton: true,
    confirmButtonText: $translate.instant('ACEPTAR'),
    cancelButtonText: $translate.instant('CANCELAR'),
    howLoaderOnConfirm: true,
    preConfirm: function (texto) {
      return new Promise(function (resolve, reject) {
        setTimeout(function() {
          if (texto) {
            resolve();
          }else{
            reject($translate.instant('DEBE_INSERTAR'));
          }
        }, 1000);
      });
    },
    allowOutsideClick: false
  }).then(function (texto) {
    self.adicionarArticulo(texto);
  });
};

self.adicionarArticulo = function(texto){
  administrativaRequest.get("resolucion/"+self.idResolucion).then(function(/*response*/){
    if(self.contenidoResolucion.Articulos){
      self.contenidoResolucion.Articulos.push({Texto: texto,
        Paragrafos: null});
    }else{
      self.contenidoResolucion.Articulos=[{Texto: texto,
        Paragrafos: null}];
      }
    });
};

self.eliminarArticulo = function(num) {
  if(self.contenidoResolucion.Articulos.length>1){
    self.contenidoResolucion.Articulos.splice(num,1);
  }else{
    swal({
      text: $translate.instant('ALMENOS_UNO'),
      type: "warning"
    });
  }
};

self.eliminarParagrafo = function(num1, num2) {
  self.contenidoResolucion.Articulos[num1].Paragrafos.splice(num2,1);
};

self.agregarParagrafo = function(num){
  swal({
    title: $translate.instant('ESCRIBA_PARAGRAFO'),
    input: 'textarea',
    showCancelButton: true,
    confirmButtonText: $translate.instant('ACEPTAR'),
    cancelButtonText: $translate.instant('CANCELAR'),
    howLoaderOnConfirm: true,
    preConfirm: function (texto) {
      return new Promise(function (resolve, reject) {
        setTimeout(function() {
          if (texto) {
            resolve();
          }else{
            reject($translate.instant('DEBE_INSERTAR'));
          }
        }, 1000);
      });
    },
    allowOutsideClick: false
  }).then(function (texto) {
    self.adicionarParagrafo(num,texto);
  });
};

self.adicionarParagrafo = function(num,texto){
  administrativaRequest.get("resolucion/"+self.idResolucion).then(function(/*response*/){
    if(self.contenidoResolucion.Articulos[num].Paragrafos){
      self.contenidoResolucion.Articulos[num].Paragrafos.push({Texto: texto});
    }else{
      self.contenidoResolucion.Articulos[num].Paragrafos=[{Texto: texto}];
    }
  });
};

self.guardarCambios = function(){
  if(self.resolucionValida()){

    var ResolucionVinculacionDocente = {
      Id: self.resolucion.Id,
      IdFacultad : self.resolucion.IdFacultad,
      Dedicacion: self.resolucion.Dedicacion,
      NivelAcademico: self.resolucion.NivelAcademico_nombre
    };
    self.contenidoResolucion.Vinculacion = ResolucionVinculacionDocente;
    administrativaRequest.put("contenido_resolucion",self.idResolucion,self.contenidoResolucion).then(function(response){
      if(response.data==="OK"){
        swal({
          title: $translate.instant('GUARDADO'),
          text: $translate.instant('GUARDADO_EXITO'),
          type: "success",
          confirmButtonText: $translate.instant('ACEPTAR'),
          showLoaderOnConfirm: true
        }).then(function() {
             $window.location.reload();
        });
      }else{
        swal({
          title: $translate.instant('ALERTA'),
          text: $translate.instant('PROBLEMA_ALMACENAMIENTO'),
          type: "warning",
          confirmButtonText: $translate.instant('ACEPTAR'),
          showLoaderOnConfirm: true
        });
      }
    });
  }else{
    swal({
      text: $translate.instant('REVISE_DATOS_RESOLUCION'),
      type: "error"
    });
  }
};



self.resolucionValida = function(){
  var resolucionValida=true;
  if(!self.contenidoResolucion.Numero){
    resolucionValida=false;
  }
  if(!self.contenidoResolucion.Titulo){
    resolucionValida=false;
  }
  if(!self.contenidoResolucion.Preambulo){
    resolucionValida=false;
  }
  if(!self.contenidoResolucion.Consideracion){
    resolucionValida=false;
  }
  if(self.contenidoResolucion.Articulos){
    self.contenidoResolucion.Articulos.forEach(function(articulo){
      if(!articulo.Texto){
        resolucionValida=false;
      }
      if(articulo.Paragrafos){
        articulo.Paragrafos.forEach(function(paragrafo){
          if(!paragrafo.Texto){
            resolucionValida=false;
          }
        });
      }
    });
  }
  return resolucionValida;
};

self.generarResolucion = function(){
  if(self.resolucionValida()){
    //self.contenidoResolucion;
    var documento=self.getDocumento(self.contenidoResolucion,self.contratados,self.proyectos);
    pdfMake.createPdf(documento).getDataUrl(function(outDoc){
      document.getElementById('vistaPDF').src = outDoc;
    });
    $("#resolucion").show();
  }else{
    swal({
      text: $translate.instant('REVISE_DATOS_RESOLUCION'),
      type: "error"
    });
  }
};

self.getNumeros = function(objeto) {
 var numeros=[];
 if(objeto){
   for(var i = 0; i<objeto.length; i++){
    numeros.push(i);
  }
}
return numeros;
};

self.getCuerpoTabla=function(idProyecto, datos, columnas) {
  var cuerpo=[];
  var encabezado=[{ text: $translate.instant('NOMBRE'), style: 'encabezado' }, { text: $translate.instant('CEDULA'), style: 'encabezado'},  { text:  $translate.instant('EXPEDICION'), style: 'encabezado'},{ text:  $translate.instant('CATEGORIA'), style: 'encabezado'},{ text:  $translate.instant('DEDICACION'), style: 'encabezado'},{ text:  $translate.instant('HORAS_SEMANALES'), style: 'encabezado'},{ text:  $translate.instant('VALOR_CONTRATO'), style: 'encabezado'},{ text:  $translate.instant('DISPONIBILIDAD'), style: 'encabezado'}
];
  cuerpo.push(encabezado);
  if(datos){
    datos.forEach(function(fila) {
      if(fila.IdProyectoCurricular===idProyecto){

        var datoFila = [];
        columnas.forEach(function(columna) {
          datoFila.push(fila[columna].toString());
        });
        cuerpo.push(datoFila);
      }
    });
  }
  return cuerpo;
};

self.getTabla=function(idProyecto, datos, columnas) {
  return {
    style: 'tabla',
    table: {
      headerRows: 1,
      body: self.getCuerpoTabla(idProyecto, datos, columnas)
    }
  };
};

self.getPreambuloTexto=function(preambulo){
  return {
    text: preambulo,
    style: 'texto'
  };
};

self.getConsideracionTexto=function(consideracion){
  return {
    text: consideracion,
    style: 'texto'
  };
};

self.getArticuloTexto=function(articulo, numero){
  var aux=[{text: $translate.instant('ARTICULO')+" "+self.numeroALetras(numero+1)+' - ', bold: true}, articulo.Texto];
  if(articulo.Paragrafos!==null){
    var numeroParagrafo=1;
    articulo.Paragrafos.forEach(function(paragrafo){
      aux.push({text: " "+$translate.instant('PARAGRAFO')+" "+self.numeroALetras(numeroParagrafo)+' - ', bold: true});
      aux.push(paragrafo.Texto);
      numeroParagrafo++;
    });
  }

  return {
    text: aux,
    style: 'texto'
  };
};

self.getContenido=function(contenidoResolucion, contratados, proyectos){
  var contenido = [];
  contenido.push({ text: "UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS",
  style: 'titulo'});
  contenido.push({ text: self.resolucion.FacultadNombre,
  style: 'titulo'});
 contenido.push({ text: $translate.instant('RESOLUCION')+" "+'No '+contenidoResolucion.Numero,
    style: 'titulo'});
    contenido.push({ text: "("+self.resolucion.FechaExpedicion+")",
    style: 'titulo'});
    contenido.push({ text: " ",
    style: 'titulo'});
    contenido.push({ text: contenidoResolucion.Titulo,
    style: 'titulo_res'});
  contenido.push(self.getPreambuloTexto(contenidoResolucion.Preambulo));
  contenido.push({ text: $translate.instant('CONSIDERANDO'),
    style: 'titulo'});
  contenido.push(self.getConsideracionTexto(contenidoResolucion.Consideracion));
  contenido.push({ text: $translate.instant('RESUELVE'),
    style: 'titulo'});
  var numero=0;
  if(contenidoResolucion.Articulos){
    var index=1;
    contenidoResolucion.Articulos.forEach(function(articulo){
      contenido.push(self.getArticuloTexto(articulo, numero));
      if(index===1){
        proyectos.forEach(function(proyecto){
          var proyectoVisible=false;
          if(contratados){
            contratados.forEach(function(fila) {
              if(fila.IdProyectoCurricular===proyecto.Id){
                proyectoVisible=true;
              }
            });
          }
          if(proyectoVisible){
            contenido.push({ text: proyecto.Nombre,
              style: 'proyecto'});
              contenido.push(self.getTabla(proyecto.Id, contratados, ['NombreCompleto', 'IdPersona', 'LugarExpedicionCedula','Categoria','Dedicacion','NumeroHorasSemanales','ValorContrato','NumeroDisponibilidad']));
          }
        });
      }
      index++;
      numero++;
    });
  }
  contenido.push({ text: $translate.instant('COMUNIQUESE_Y_CUM'),
  style: 'finalizacion'});
  contenido.push({ text: contenidoResolucion.OrdenadorGasto.NombreOrdenador,
  style: 'nombre_ordenador'});
  contenido.push({ text: '--'+contenidoResolucion.OrdenadorGasto.Cargo+' --',
  style: 'nombre_cargo'});
  return contenido;
};

self.getDocumento=function(contenidoResolucion, contratados, proyectos){
  var documento={
    info: {
      title: 'Resolución'
    },
    pageMargins: [40, 140, 40, 40],
    header: {
      height: 120,
      width: 120,
      image: self.imagen.imagen,
      margin: [100, 15,5,5],
      alignment: 'center'
    },
    content: self.getContenido(contenidoResolucion, contratados, proyectos),

    styles: {
      //Encabezados de las tablas
      encabezado: {
        fontSize: 9,
        alignment: 'center'
      },
      //Contenido de las tablas
      tabla: {
        fontSize: 8,
        margin: [30, 5, 30,0]
      },
      //Texto normal
      texto: {
        fontSize: 10,
        margin: [30, 5],
        alignment: 'justify',
      },
      //Títulos (Preámbulo, onsideración, ...)
      titulo: {
        bold: true,
        fontSize: 12,
        alignment: 'center'
      },
      titulo_res: {
        bold: true,
        fontSize: 9,
        alignment: 'center'
      },      //Proyectos curriculares
      proyecto: {
        fontSize: 11,
        margin: [30, 5]
      },
      //Nombre del ordenador del gasto
      nombre_cargo: {
        bold: true,
        fontSize: 10,
        margin: [30, 0, 30,0],
        alignment: 'center'
      },
      //Parte final de la resolución y complementos
      finalizacion: {
        bold: true,
        fontSize: 12,
        alignment: 'center'
      },
      pie_pagina: {
        fontSize: 8,
        alignment: 'center'
      },
      nombre_ordenador: {
        bold: true,
        fontSize: 10,
        margin: [30, 50, 30,0],
        alignment: 'center'
      }
    },
    footer: function(page, pages) {
      return {
        columns: [
           $translate.instant('RESOLUCION')+" "+'No '+contenidoResolucion.Numero+" "+self.resolucion.NivelAcademico_nombre+" "+self.resolucion.Dedicacion+" "+"2018-I"+"\n"+self.resolucion.FacultadNombre,
          {
            alignment: 'right',
            text: [
              { text: page.toString(), italics: true },
              ' de ',
              { text: pages.toString(), italics: true }
            ]
          }
        ],
        margin: [10, 0],
        style: "pie_pagina"
      };
    },
  };
  return documento;
};

self.getUnidades = function(num){
  switch(num)
  {
    case 1: return 'PRIMERO';
    case 2: return 'SEGUNDO';
    case 3: return 'TERCERO';
    case 4: return 'CUARTO';
    case 5: return 'QUINTO';
    case 6: return 'SEXTO';
    case 7: return 'SEPTIMO';
    case 8: return 'OCTAVO';
    case 9: return 'NOVENO';
  }
  return '';
};

self.getDecenas = function(numero){
  var decena = Math.floor(numero/10);
  var unidad = numero-(decena*10);
  switch(decena)
  {
    case 0: return self.getUnidades(unidad);
    case 1: return 'DECIMO'+self.getUnidades(unidad);
    case 2: return 'VIGÉSIMO '+self.getUnidades(unidad);
    case 3: return 'TRIGÉSIMO '+self.getUnidades(unidad);
    case 4: return 'CUADRAGÉSIMO '+self.getUnidades(unidad);
    case 5: return 'QUINCUAGÉSIMO '+self.getUnidades(unidad);
    case 6: return 'SEXAGÉSIMO '+self.getUnidades(unidad);
    case 7: return 'SEPTUAGÉSIMO '+self.getUnidades(unidad);
    case 8: return 'OCTAGÉSIMO '+self.getUnidades(unidad);
    case 9: return 'NONAGÉSIMO '+self.getUnidades(unidad);
  }
  return '';
};

self.numeroALetras = function(numero) {
  if(numero === 0){
    return 'CERO ';
  }else{
    return self.getDecenas(numero);
  }
};

self.FormatoNumero=function(amount, decimals) {

        amount += '';
        amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));

        decimals = decimals || 0;

        if (isNaN(amount) || amount === 0)
            {
              return parseFloat(0).toFixed(decimals);
            }

        amount = '' + amount.toFixed(decimals);

        var amount_parts = amount.split('.'),
            regexp = /(\d+)(\d{3})/;

        while (regexp.test(amount_parts[0]))
            {
              amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
            }

        return amount_parts.join('.');
    };


});
