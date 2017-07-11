'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionGeneracionCtrl
 * @description
 * # ResolucionGeneracionCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('ResolucionGeneracionCtrl', function (contratacion_request,$mdDialog,$scope,$routeParams,$window) {

  	var self=this;

  	contratacion_request.getAll("facultad").then(function(response){
  		self.facultades=response.data;
  	});

  	self.resolucion={};

  	$.getJSON("/resolucion.json", function(resolucion) {
        self.resolucion.preambulo=resolucion["preambulo"];
    });

    $.getJSON("/resolucion.json", function(resolucion) {
        self.resolucion.consideracion=resolucion["consideracion"];
    });

    $.getJSON("/resolucion.json", function(resolucion) {
        self.resolucion.articulos=resolucion["articulos"];
    });

    self.getNombreFacultad = function(index){
      var nombreFacultad;
      self.facultades.forEach(function(facultad){
        if(facultad.Id==parseInt(index)){
          nombreFacultad=facultad.Nombre;
        }
      })
      return nombreFacultad;
    }

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
        }, function (dismiss) {
        })
      }
  	}

    self.guardarResolucion = function(){
      var resolucionData={
        NumeroResolucion: self.resolucion.numero.toString(),
        IdDependencia: parseInt(self.resolucion.facultad),
        PreambuloResolucion: self.resolucion.preambulo,
        ConsideracionResolucion: self.resolucion.consideracion
      }
      contratacion_request.post("resolucion",resolucionData).then(function(response){
        var resolucionVinculacionDocenteData={
          Id: response.data.Id,
          IdFacultad: parseInt(self.resolucion.facultad),
          Dedicacion: self.resolucion.dedicacion,
          NivelAcademico: self.resolucion.nivelAcademico
        }
        contratacion_request.post("resolucion_vinculacion_docente",resolucionVinculacionDocenteData).then(function(response){
          var numeroArticulo=1;
          self.resolucion.articulos.forEach(function(articulo){
            var articuloData={
              Numero: numeroArticulo,
              ResolucionId: {Id: response.data.Id},
              Texto: articulo.texto,
              TipoComponente: "Articulo"
            }
            contratacion_request.post("componente_resolucion",articuloData).then(function(response){
              var numeroParagrafo=1;
              if(articulo.paragrafos){
                articulo.paragrafos.forEach(function(paragrafo){
                  var paragrafoData={
                    Numero: numeroParagrafo,
                    ResolucionId: {Id: response.data.ResolucionId.Id},
                    Texto: paragrafo.texto,
                    TipoComponente: "Paragrafo",
                    ComponentePadre: {Id: response.data.Id}
                  }
                  contratacion_request.post("componente_resolucion",paragrafoData).then(function(response){
                  })
                  numeroParagrafo++;
                })
              }
            })
            numeroArticulo++;
          })
          $window.location.href = '#/vinculacionespecial/resolucion_gestion';
        });
});
}

});
