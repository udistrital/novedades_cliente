'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:ContratoResumenCtrl
 * @description
 * # ContratoResumenCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('ContratoResumenCtrl', function ($scope,contratacion_request,contratacion_mid_request,idResolucion) {
    
  	var self = this;

  	self.idResolucion=idResolucion;

    contratacion_request.getOne("resolucion_vinculacion_docente",self.idResolucion).then(function(response){      
	    self.datosFiltro=response.data;
	    contratacion_request.getOne("contenido_resolucion",self.idResolucion).then(function(response){
	      self.contenidoResolucion=response.data;
	      contratacion_request.getOne("ordenador_gasto",self.datosFiltro.IdFacultad).then(function(response){
	        if(response.data==null){
	          self.contenidoResolucion.ordenadorGasto={Cargo: "Vicerector académico ILUD"}
	        }else{
	          self.contenidoResolucion.ordenadorGasto=response.data;
	        }
	      });
	    });
	    self.datosFiltro.IdFacultad=self.datosFiltro.IdFacultad.toString();
	    contratacion_request.getAll("proyecto_curricular/"+self.datosFiltro.NivelAcademico.toLowerCase()+"/"+self.datosFiltro.IdFacultad).then(function(response){
	      if(response.data==null){
	        contratacion_request.getAll("facultad/"+self.datosFiltro.IdFacultad).then(function(response){
	          self.proyectos=[response.data]
	        });
	      }else{
	        self.proyectos=response.data;
	      }
	    });
	    contratacion_request.getAll("precontratado/"+self.idResolucion.toString()).then(function(response){    
	      self.contratados=response.data;
	      if(self.contratados){
	        self.contratados.forEach(function(row){
	          contratacion_mid_request.post("calculo_salario/"+self.datosFiltro.NivelAcademico+"/"+row.Documento+"/"+row.Semanas+"/"+row.HorasSemanales+"/"+row.Categoria.toLowerCase()+"/"+row.Dedicacion.toLowerCase()).then(function(response){
	            row.ValorContrato=self.FormatoNumero(response.data,0);
	          });
	          row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
	        });
	      }
	    });
	  });

	self.FormatoNumero=function(amount, decimals) {

        amount += ''; 
        amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); 

        decimals = decimals || 0; 

        if (isNaN(amount) || amount === 0) 
            return parseFloat(0).toFixed(decimals);

        amount = '' + amount.toFixed(decimals);

        var amount_parts = amount.split('.'),
            regexp = /(\d+)(\d{3})/;

        while (regexp.test(amount_parts[0]))
            amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

        return amount_parts.join('.');
    }

	$scope.hide = function() {
	   $mdDialog.hide();
	};

	$scope.cancel = function() {
	   $mdDialog.cancel();
	};

  });
