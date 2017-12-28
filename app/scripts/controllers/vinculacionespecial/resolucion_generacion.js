'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ResolucionGeneracionCtrl
 * @description
 * # ResolucionGeneracionCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('ResolucionGeneracionCtrl', function (adminMidRequest,administrativaRequest,oikosRequest,$mdDialog,$scope,$routeParams,$window,$translate) {

  	var self=this;

    self.CurrentDate = new Date();
    self.anioPeriodo = new Date().getFullYear();

    self.resolucionesExpedidasPeriodo = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableSorting: true,
      enableFiltering : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {
          field: 'Id',
          visible : false
        },
        {
          field: 'FechaExpedicion',
          visible : false
        },
        {
          field: 'Estado',
          visible : false
        },
        {
          field: 'Numero',
          width: '10%',
          displayName: $translate.instant('NUMERO')
        },
        {
          field: 'Vigencia',
          width: '10%',
          displayName: $translate.instant('VIGENCIA')
        },
        {
          field: 'Periodo',
          width: '10%',
          displayName: $translate.instant('PERIODO')
        },
        {
          field: 'Facultad',
          width: '20%',
          displayName: $translate.instant('FACULTAD')
        },
        {
          field: 'NivelAcademico',
          width: '15%',
          displayName: $translate.instant('NIVEL')
        },
        {
          field: 'Dedicacion',
          width: '10%',
          displayName: $translate.instant('DEDICACION')
        },
        {
          field: 'NumeroSemanas',
          width: '15%',
          displayName: $translate.instant('SEMANAS')
        },
        {
          field: 'Estado',
          width: '12%',
          displayName: $translate.instant('ESTADO')
        },

      ]
    };

    self.resolucionesExpedidasPeriodo.multiSelect = false;

    self.resolucionesExpedidasPeriodo.onRegisterApi = function(gridApi) {
        self.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            self.resolucion_a_cancelar_seleccionada = row.entity;
        });

    };
    //CALCULAR EN QUÉ PERIODO SE ESTÁ
    administrativaRequest.get("resolucion_vinculacion/expedidas_vigencia_periodo","vigencia="+self.anioPeriodo+"&periodo=3").then(function(response){
      self.resolucionesExpedidasPeriodo.data=response.data;
      if(self.resolucionesExpedidasPeriodo.data!==null){
        self.resolucionesExpedidasPeriodo.data.forEach(function(resolucion){
          if(resolucion.FechaExpedicion!==null){
            //dado que el servicio no está almacenando la Feha de expedición directamente como null, se toma el valor "0001-01-01T00:00:00Z" como tal
            if(resolucion.FechaExpedicion.toString()==="0001-01-01T00:00:00Z"){
              resolucion.FechaExpedicion=null;
              resolucion.EstadoTexto="Creada";
            }else{
              if(resolucion.Estado){
                resolucion.EstadoTexto="Expedida";
              }else{
                resolucion.EstadoTexto="Cancelada";
              }
            }
          }else{
            if(resolucion.Estado){
              resolucion.EstadoTexto="Expedida";
            }else{
              resolucion.EstadoTexto="Cancelada";
            }
          }
        });
      }
    });

  	oikosRequest.get("dependencia_tipo_dependencia","query=TipoDependenciaId.Id%3A2&fields=DependenciaId&limit=-1").then(function(response){
  		self.facultades=response.data;
  	});

  	self.resolucion={};

    administrativaRequest.get("tipo_resolucion","limit=-1").then(function(response){
      self.tipos_resolucion=response.data;
    });


    administrativaRequest.get("contenido_resolucion/ResolucionTemplate").then(function(response){
      self.resolucion.preambulo=response.data.Preambulo;
    });

    administrativaRequest.get("contenido_resolucion/ResolucionTemplate").then(function(response){
      self.resolucion.consideracion=response.data.Consideracion;
    });


    self.crearResolucion = function(){
      self.objeto_facultad = JSON.parse(self.resolucion.facultad)
      if(self.resolucion.numero && self.resolucion.facultad && self.resolucion.nivelAcademico && self.resolucion.dedicacion &&self.resolucion.numeroSemanas){
    		swal({
          title: 'Datos de la resolución',
          html:
            '<p><b>Número: </b>'+self.resolucion.numero.toString()+'</p>'+
            '<p><b>Facultad: </b>'+self.objeto_facultad.Nombre+'</p>'+
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

      var tipoResolucion = {
        Id: parseInt(self.tipo_resolucion_elegida)
      }

      var resolucionData={
        NumeroResolucion: self.resolucion.numero,
        IdDependencia: self.objeto_facultad.Id,
        NumeroSemanas : parseInt(self.resolucion.numeroSemanas),
        Periodo: parseInt(self.resolucion.Periodo),
        IdTipoResolucion: tipoResolucion,
        PreambuloResolucion: self.resolucion.preambulo,
        ConsideracionResolucion: self.resolucion.consideracion,
      };

      var resolucionVinculacionDocenteData={
          IdFacultad: self.objeto_facultad.Id,
          Dedicacion: self.resolucion.dedicacion,
          NivelAcademico: self.resolucion.nivelAcademico
      };

      var objeto_resolucion = {
        Resolucion: resolucionData,
        ResolucionVinculacionDocente: resolucionVinculacionDocenteData
      };

    adminMidRequest.post("gestion_resoluciones/insertar_resolucion_completa",objeto_resolucion).then(function(response){
        if(response.data=="OK"){
          swal({
            text: "Se insertó correctamente la resolución",
            type: 'success',
            confirmButtonText: $translate.instant('ACEPTAR')
          }).then(function() {
                  $window.location.href = '#/vinculacionespecial/resolucion_gestion';
          })
        }else{
          swal({
            title: $translate.instant('ERROR'),
            text: "Error al insertar resolución",
            type: 'error',
            confirmButtonText: $translate.instant('ACEPTAR')
          }).then(function() {
                $window.location.href = '#/vinculacionespecial/resolucion_gestion';
          })
        }

      });

};

self.AsociarResolucionCancelacion = function(){
  console.log("res seleccionada")
  console.log(self.resolucion_a_cancelar_seleccionada)
}

});
