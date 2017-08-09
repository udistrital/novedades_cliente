'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:MinutasListaPlantillasCtrl
 * @description
 * # MinutasListaPlantillasCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('ListaPlantillasCtrl', function () {
    var self = this;

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
      {field: 'FechaActivacion', headerCellTemplate: '<div align="center"> {{ \'FECHA_ACTIVACION\' | translate }} </div>',
          cellTemplate: '<div align="right">{{row.entity.FechaActivacion}}</div>'},
      {field: 'FechaInactivacion', headerCellTemplate: '<div align="center"> {{ \'FECHA_INACTIVACION\' | translate }} </div>',
        cellTemplate: '<div align="right">{{row.entity.FechaInactivacion}}</div>'},
      {field: 'Gestion', headerCellTemplate: '<div align="center"> {{ \'GESTION_PLANTILLA\' | translate }} </div>',
        cellTemplate: '<center><button class="btn btn-default editar"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'+
        '<button class="btn btn-default borrar"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>'+
        '<button class="btn btn-default"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></center>'}
    ];

    self.gridOptions.data = plantillas;

    self.opcionesFiltro = ["Activo", "Inactivo"];

    self.cambiarFiltro = function() {
      self.gridOptions.data = [];
      if (self.opcionFiltro === "Activo") {
        for (var i = 0; i < plantillas.length; i++) {
          if(plantillas[i].Activo) {
            self.gridOptions.data.push(plantillas[i]);
          }
        }
      } else {
        for (var i = 0; i < plantillas.length; i++) {
          if(!plantillas[i].Activo) {
            self.gridOptions.data.push(plantillas[i]);
          }
        }
      }
    }
  });
