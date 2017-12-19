'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionGeneracionCtrl
 * @description
 * # ResolucionGeneracionCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('ResolucionGeneracionCtrl', function (administrativaRequest,oikosRequest,$mdDialog,$scope,$routeParams,$window) {

  	var self=this;



  	oikosRequest.get("dependencia_tipo_dependencia","query=TipoDependenciaId.Id%3A2&fields=DependenciaId&limit=-1").then(function(response){
  		self.facultades=response.data;
  	});

  	self.resolucion={};

    administrativaRequest.get("contenido_resolucion/ResolucionTemplate").then(function(response){
      self.resolucion.preambulo=response.data.Preambulo;
    });

    administrativaRequest.get("contenido_resolucion/ResolucionTemplate").then(function(response){
      self.resolucion.consideracion=response.data.Consideracion;
    });

    administrativaRequest.get("contenido_resolucion/ResolucionTemplate").then(function(response){
      self.resolucion.articulos=response.data.Articulos;
    });

    self.getNombreFacultad = function(index){
      var nombreFacultad;
      self.facultades.forEach(function(facultad){
        if(facultad.DependenciaId.Id===parseInt(index)){
          nombreFacultad=facultad.DependenciaId.Nombre;
        }
      });
      return nombreFacultad;
    };

  	self.crearResolucion = function(){
      if(self.resolucion.numero && self.resolucion.facultad && self.resolucion.nivelAcademico && self.resolucion.dedicacion && self.resolucion.preambulo && self.resolucion.consideracion){
    		swal({
          title: 'Datos de la resolución',
          html:
            '<p><b>Número: </b>'+self.resolucion.numero.toString()+'</p>'+
            '<p><b>Facultad: </b>'+self.getNombreFacultad(self.resolucion.facultad)+'</p>'+
            '<p><b>Nivel académico: </b>'+self.resolucion.nivelAcademico+'</p>'+
            '<p><b>Dedicación: </b>'+self.resolucion.dedicacion+'</p>'+
            '<p><b>Los artículos son creados por defecto y pueden ser editados</b></p>',
          type: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Guardar resolución',
          cancelButtonText: 'Cancelar',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false
        }).then(function () {
          self.guardarResolucion();
        }, function (/*dismiss*/) {
        });
      }
  	};

    self.guardarResolucion = function(){
      var resolucionData={
        NumeroResolucion: self.resolucion.numero,
        IdDependencia: parseInt(self.resolucion.facultad),
        PreambuloResolucion: self.resolucion.preambulo,
        ConsideracionResolucion: self.resolucion.consideracion,
        NumeroSemanas : parseInt(self.resolucion.numeroSemanas),
        Periodo: parseInt(self.resolucion.Periodo)

      };
      administrativaRequest.post("resolucion/GenerarResolucion",resolucionData).then(function(response){
        var resolucionVinculacionDocenteData={
          Id: response.data.Id,
          IdFacultad: parseInt(self.resolucion.facultad),
          Dedicacion: self.resolucion.dedicacion,
          NivelAcademico: self.resolucion.nivelAcademico
        };
        administrativaRequest.post("resolucion_vinculacion_docente",resolucionVinculacionDocenteData).then(function(response){
          var numeroArticulo=1;
          self.resolucion.articulos.forEach(function(articulo){
            var articuloData={
              Numero: numeroArticulo,
              ResolucionId: {Id: response.data.Id},
              Texto: articulo.Texto,
              TipoComponente: "Articulo"
            };
           administrativaRequest.post("componente_resolucion",articuloData).then(function(response){
              var numeroParagrafo=1;
              if(articulo.Paragrafos){
                articulo.Paragrafos.forEach(function(paragrafo){
                  var paragrafoData={
                    Numero: numeroParagrafo,
                    ResolucionId: {Id: response.data.ResolucionId.Id},
                    Texto: paragrafo.Texto,
                    TipoComponente: "Paragrafo",
                    ComponentePadre: {Id: response.data.Id}
                  };
                  administrativaRequest.post("componente_resolucion",paragrafoData).then(function(/*response*/){
                  });
                  numeroParagrafo++;
                });
              }
            });
            numeroArticulo++;
          });
          $window.location.href = '#/vinculacionespecial/resolucion_gestion';
        });
});
};

});
