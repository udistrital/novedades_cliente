'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionGeneracionCtrl
 * @description
 * # ResolucionGeneracionCtrl
 * Controller of the clienteApp
 */
 angular.module('contractualClienteApp')
 .controller('ResolucionDetalleCtrl', function (administrativaRequest,oikosRequest,coreRequest,adminMidRequest,$mdDialog,$scope,$routeParams,$translate,$window,$localStorage,$http) {

   var self=this;

   self.resolucion = $localStorage.resolucion;
   self.Numero = self.resolucion.Numero;
   self.Nivel_Academico = self.resolucion.NivelAcademico_nombre;
   self.Dedicacion = self.resolucion.Dedicacion;
   self.proyectos=[];

    oikosRequest.get("dependencia","query=Id:"+self.resolucion.IdFacultad+"&limit=-1").then(function(response){
      self.facultad=response.data[0].Nombre;
    });

    oikosRequest.get("dependencia/proyectosPorFacultad/"+self.resolucion.IdFacultad+"/"+self.resolucion.NivelAcademico_nombre,"").then(function(response){
        self.proyectos = response.data;
      });


  administrativaRequest.get("contenido_resolucion/"+self.resolucion.Id).then(function(response){
      self.contenidoResolucion=response.data;
      coreRequest.get("ordenador_gasto","query=DependenciaId%3A"+self.resolucion.IdFacultad).then(function(response){
        if(response.data===null){
          coreRequest.get("ordenador_gasto/1").then(function(response){
            self.contenidoResolucion.ordenadorGasto=response.data;
          });
        }else{
          self.contenidoResolucion.ordenadorGasto=response.data[0];
        }
      });
    });

    adminMidRequest.get("informacionDocentes/docentes_previnculados", "id_resolucion="+self.resolucion.Id).then(function(response){
      self.contratados=response.data;

    });

    $http.get("scripts/models/imagen_ud.json")
        .then(function(response) {
            self.imagen = response.data;

    });

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
    }
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
  var encabezado=[{ text: 'Nombre', style: 'encabezado' }, { text: 'Cédula', style: 'encabezado'},  { text: 'Lugar de expedición', style: 'encabezado'},{ text: 'Categoría', style: 'encabezado'},{ text: 'Dedicación', style: 'encabezado'},{ text: 'Valor contrato ', style: 'encabezado'}];
  cuerpo.push(encabezado);
  if(datos){
    datos.forEach(function(fila) {
      if(fila.IdProyectoCurricular===idProyecto){
        console.log("entré")
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
  var aux=[{text: 'ARTÍCULO '+self.numeroALetras(numero+1)+' - ', bold: true}, articulo.Texto];
  if(articulo.Paragrafos!==null){
    var numeroParagrafo=1;
    articulo.Paragrafos.forEach(function(paragrafo){
      aux.push({text: ' PARAGRAFO '+self.numeroALetras(numeroParagrafo)+' - ', bold: true});
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
  contenido.push({ text: 'RESOLUCIÓN No '+contenidoResolucion.Numero,
    style: 'titulo'});
  contenido.push(self.getPreambuloTexto(contenidoResolucion.Preambulo));
  contenido.push({ text: 'CONSIDERANDO',
    style: 'titulo'});
  contenido.push(self.getConsideracionTexto(contenidoResolucion.Consideracion));
  contenido.push({ text: 'RESUELVE',
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
              contenido.push(self.getTabla(proyecto.Id, contratados, ['NombreCompleto', 'IdPersona', 'LugarExpedicionCedula','Categoria','Dedicacion','ValorContrato']));
          }
        });
      }
      index++;
      numero++;
    });
  }
  contenido.push({ text: 'COMUNIQUESE Y CUMPLASE',
    style: 'finalizacion'});
  contenido.push({ text: '--'+contenidoResolucion.ordenadorGasto.Cargo+' --',
    style: 'nombre'});
    //contenido.push({ text: 'DECANO',
    //style: 'finalizacion'});
return contenido;
};

self.getDocumento=function(contenidoResolucion, contratados, proyectos){
  var documento={
    info: {
      title: 'Resolución'
    },
    pageMargins: [40, 120, 40, 40],
    header: {
      height: 120,
      width: 120,
      image: self.imagen.imagen,
      alignment: 'center'
    },
    content: self.getContenido(contenidoResolucion, contratados, proyectos),
    styles: {
      encabezado: {
        fontSize: 9,
        alignment: 'center'
      },
      tabla: {
        fontSize: 8,
        margin: [30, 5, 30,0]
      },
      texto: {
        fontSize: 10,
        margin: [30, 5]
      },
      titulo: {
        bold: true,
        fontSize: 12,
        alignment: 'center'
      },
      proyecto: {
        fontSize: 11,
        margin: [30, 5]
      },
      nombre: {
        bold: true,
        fontSize: 10,
        margin: [30, 50, 30,0],
        alignment: 'center'
      },
      finalizacion: {
        bold: true,
        fontSize: 12,
        alignment: 'center'
      }
    },
    footer: function(currentPage, pageCount) {return {text: currentPage.toString()+' de '+pageCount, alignment: 'right', margin: [70, 5]};},
    defaultStyle: {
      alignment: 'justify'
    }
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
