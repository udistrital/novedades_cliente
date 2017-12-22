'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionVistaCtrl
 * @description
 * # ResolucionVistaCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('ResolucionVistaCtrl', function (administrativaRequest,oikosRequest,coreRequest,adminMidRequest,$mdDialog,$scope,idResolucion,$http) {

    var self=this;

    self.idResolucion=idResolucion;
    //self.imagen;
    self.proyectos=[];

    $http.get("scripts/models/imagen_ud.json")
        .then(function(response) {
            self.imagen = response.data;

    });

    //Se cargan los datos almacenados en la tabla resolucion
    administrativaRequest.get("resolucion/"+self.idResolucion).then(function(response){
      self.resolucion=response.data;
      self.numero=self.resolucion.NumeroResolucion;
      //Se cargan los datos almacenados en la tabla resolucion_vinculacion_docente donde se encuentran los elementos filtro para obtener los docentes asociados a la resolución
      administrativaRequest.get("resolucion_vinculacion_docente/"+self.idResolucion).then(function(response){
        self.datosFiltro=response.data;
        var auxNivelAcademico;
        if(self.datosFiltro.NivelAcademico.toLowerCase()==="pregrado"){
          auxNivelAcademico=14;
        }else if(self.datosFiltro.NivelAcademico.toLowerCase()==="posgrado"){
          auxNivelAcademico=15;
        }
        self.datosFiltro.IdFacultad=self.datosFiltro.IdFacultad.toString();

       oikosRequest.get("dependencia/proyectosPorFacultad/"+self.datosFiltro.IdFacultad+"/"+self.datosFiltro.NivelAcademico,"").then(function(response){
            self.proyectos = response.data;
            self.getContenidoDocumento();
        });
      });
    });

    self.getContenidoDocumento = function(){
                    administrativaRequest.get("contenido_resolucion/"+self.idResolucion).then(function(response){
                      self.contenidoResolucion=response.data;
                      //Se carga el ordenador del gasto asocciado a la dependencia solicitante de los docentes de vinculación especial
                      coreRequest.get("ordenador_gasto","query=DependenciaId%3A"+self.datosFiltro.IdFacultad.toString()).then(function(response){

                        if(response.data===null){
                          coreRequest.get("ordenador_gasto/1").then(function(response){
                            self.contenidoResolucion.ordenadorGasto=response.data;
                          });
                        }else{
                          self.contenidoResolucion.ordenadorGasto=response.data[0];
                        }
                        //Se verifica si la resolución ha sido expedida o no
                        if(self.resolucion.FechaExpedicion === null){
                            //Se cargan los docentes previamente vinculados con la resolución
                            adminMidRequest.get("informacionDocentes/docentes_previnculados", "id_resolucion="+self.idResolucion.toString()).then(function(response){
                            self.contratados=response.data;
                            self.generarResolucion();

                          });
                        }else{
                                                  //Se cargan los docentes contratdos si la resolucion ya fue expedida
                          adminMidRequest.get("informacionDocentes/docentes_previnculados", "id_resolucion="+self.idResolucion.toString()).then(function(response){
                            self.contratados=response.data;
                            if(self.contratados){
                              console.log("contratados")
                              console.log(self.contratados)
                              self.generarResolucion();
                            }else{
                              //Se llama la función para generar el pdf con la resoleución
                              self.generarResolucion();
                            }
                          });
                        }
                      });
                    });
    };

    //Función para generar el pdf de la resolución con la información almacenada en la base de datos
  	self.generarResolucion = function() {
	    var documento=self.getDocumento(self.contenidoResolucion,self.contratados,self.proyectos);
	    //Se hace uso de la libreria pdfMake para generar el documento y se asigna a la etiqueta con el id vistaPDF
      pdfMake.createPdf(documento).getDataUrl(function(outDoc){
	      document.getElementById('vistaPDF').src = outDoc;
	    });
	 };

//Función para obtener el contenido de las tablas por proyecto currícular de los docentes asociados a la resolución
self.getCuerpoTabla=function(idProyecto, datos, columnas) {
  var cuerpo=[];
  var encabezado=[{ text: 'Nombre', style: 'encabezado' }, { text: 'Cédula', style: 'encabezado'},  { text: 'Lugar de expedición', style: 'encabezado'},{ text: 'Categoría', style: 'encabezado'},{ text: 'Dedicación', style: 'encabezado'},{ text: 'Valor contrato ', style: 'encabezado'}
];
  cuerpo.push(encabezado);
  if(datos){
    datos.forEach(function(fila) {
      //Se veriica que el docente este asociado al proyecto curricular actual
      if(fila.IdProyectoCurricular===idProyecto){
        var datoFila = [];
        columnas.forEach(function(columna) {
          //Cada dato es almacenado como un String dentro de la matriz de la tabla
          datoFila.push(fila[columna].toString());
        });
        //La fila es agregada a la tablacon los datos correspondientes
        cuerpo.push(datoFila);
      }
    });
  }
  return cuerpo;
};

//Función para obtener la estructura de la tabla de contratados
self.getTabla=function(idProyecto, datos, columnas) {
  return {
    style: 'tabla',
    table: {
      headerRows: 1,
      body: self.getCuerpoTabla(idProyecto, datos, columnas)
    }
  };
};

//Función para obtener el texto del preámbulo dentro de una estructura
self.getPreambuloTexto=function(preambulo){
  return {
    text: preambulo,
    style: 'texto'
  };
};

//Función para obtener el texto de la consideración dentro de una estructura
self.getConsideracionTexto=function(consideracion){
  return {
    text: consideracion,
    style: 'texto'
  };
};

//Funcion para obtener el texto de los artiulos consu paragrafos dentro de una estructura
self.getArticuloTexto=function(articulo, numero){
  var aux=[{text: 'ARTÍCULO '+self.numeroALetras(numero+1)+' - ', bold: true}, articulo.Texto];
  if(articulo.Paragrafos!==null){
    var numeroParagrafo=1;
    //Cada paragrafo se inserta dentro del texto del articulo
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

//Función que devuelve en contenido de la resolución en un arreglo de estructuras
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
  //Se agregan artículos al documento
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
            //Definicion de los encabezados en base a las claves almacenadas dentro de la estructura de los datos
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
return contenido;
};

//Devuelve el contenido del documento en una estrutura formato "JSON"
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
    //Definición de los estilosutilizados dentro del documento
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
        margin: [30, 5]
      },
      //Títulos (Preámbulo, onsideración, ...)
      titulo: {
        bold: true,
        fontSize: 12,
        alignment: 'center'
      },
      //Proyectos curriculares
      proyecto: {
        fontSize: 11,
        margin: [30, 5]
      },
      //Nombre del ordenador del gasto
      nombre: {
        bold: true,
        fontSize: 10,
        margin: [30, 50, 30,0],
        alignment: 'center'
      },
      //Parte final de la resolución y complementos
      finalizacion: {
        bold: true,
        fontSize: 12,
        alignment: 'center'
      }
    },
    //Pie de página de la resolución
    footer: function(currentPage, pageCount) {return {text: currentPage.toString()+' de '+pageCount, alignment: 'right', margin: [70, 5]};},
    defaultStyle: {
      alignment: 'justify'
    }
  };
  return documento;
};

/*
*Funciones para convertir numero a texto, utilizado para paragrafos y artículos
*/

//Función que retorna las unidades del número en texto
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

//Función que retorna las decenas del número en texto
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

//Función que retorna los números de entrada en texto formato orden
self.numeroALetras = function(numero) {
  if(numero === 0){
    return 'CERO ';
  }else{
    return self.getDecenas(numero);
  }
};

//Función que retorna un número en formato monetario "99.999.999"
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
