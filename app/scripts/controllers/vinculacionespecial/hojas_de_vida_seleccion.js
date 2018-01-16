'use strict';

angular.module('contractualClienteApp')
.controller('HojasDeVidaSeleccionCtrl', function (administrativaRequest,financieraRequest,resolucion,adminMidRequest,oikosRequest,$localStorage,$scope,$mdDialog,$translate,$window) {

  var self = this;
  console.log("fabrica")

  self.resolucion = JSON.parse(localStorage.getItem("resolucion"))
  self.estado = false;
  self.proyectos=[];
  self.vigencia_data = self.resolucion.Vigencia;
  var vinculacionesData=[];

  self.datosDocentesCargaLectiva = {
    paginationPageSizes: [10, 15, 20],
    paginationPageSize: 10,
    enableRowSelection: true,
    enableRowHeaderSelection: true,
    enableFiltering: true,
    enableHorizontalScrollbar: 0,
    enableVerticalScrollbar: true,
    useExternalPagination: false,
    enableSelectAll: false,
    columnDefs : [
      {
        field: 'docente_apellido',
        displayName: $translate.instant('APELLIDO_DOCENTES'),
        width: '15%'
      },
      {
        field: 'docente_nombre',
        displayName: $translate.instant('NOMBRES_DOCENTES'),
        width: '15%'
      },
      {
        field: 'docente_documento',
        displayName: $translate.instant('DOCUMENTO_DOCENTES'),
        width: '10%'
      },
      {
        field: 'horas_lectivas',
        displayName: $translate.instant('HORAS_LECTIVAS'),
        width: '10%'
      },
      {
        field: 'proyecto_nombre',
        displayName: $translate.instant('PROYECTO_CURRICULAR'),
        width: '20%'
      },
      {
        field: 'CategoriaNombre',
        displayName: $translate.instant('CATEGORIA'),
        width: '15%'
      },
      {
        field: 'tipo_vinculacion_nombre',
        displayName: $translate.instant('DEDICACION'),
        width: '13%'
      },
      {
        field: 'id_tipo_vinculacion',
        visible:false
      },
      {
        field: 'id_proyecto',
        visible:false
      }

    ],

    onRegisterApi : function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        self.personasSeleccionadas1=gridApi.selection.getSelectedRows();
        self.persona = true;
      });
    }
  };

  self.precontratados = {
    paginationPageSizes: [10, 15, 20],
    paginationPageSize: 10,
    enableSorting: true,
    enableFiltering : true,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
    columnDefs : [
      {field: 'Id', visible : false},
      {field: 'NombreCompleto', width: '20%', displayName: $translate.instant('NOMBRE')},
      {field: 'IdPersona', width: '10%',displayName: $translate.instant('DOCUMENTO_DOCENTES')},
      {field: 'Categoria', width: '10%',displayName: $translate.instant('CATEGORIA')},
      {field: 'IdDedicacion.NombreDedicacion', width: '10%',displayName: $translate.instant('DEDICACION')},
      {field: 'IdDedicacion.Id',visible:false},
      {field: 'NumeroHorasSemanales', width: '8%',displayName: $translate.instant('HORAS_SEMANALES')},
      {field: 'NumeroSemanas', width: '7%',displayName: $translate.instant('SEMANAS')},
      {field: 'NumeroDisponibilidad', width: '15%',displayName: $translate.instant('NUM_DISPO_DOCENTE') },
      {field: 'ValorContrato', width: '15%',displayName: $translate.instant('VALOR_CONTRATO'), cellClass:"valorEfectivo", cellFilter:"currency"},
      {field: 'IdProyectoCurricular', visible:false,filter: {
        term: self.term
      }},
      {
        field: 'cancelar',
        enableSorting: false,
        enableFiltering: false,
        width: '5%',
        displayName:  $translate.instant('OPCIONES'),
        cellTemplate: '<center>' +
        '<a class="borrar" ng-click="grid.appScope.verCancelarInscripcionDocente(row)">' +
        '<i title="{{\'BORRAR_BTN\' | translate }}" class="fa fa-trash fa-lg  faa-shake animated-hover"></i></a></div>' +
        '</center>'
      }
    ]
  };

  self.Disponibilidades = {
    paginationPageSizes: [10, 15, 20],
    paginationPageSize: 10,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    enableFiltering: true,
    multiSelect: false,
    enableHorizontalScrollbar: 0,
    enableVerticalScrollbar: true,
    useExternalPagination: false,
    enableSelectAll: false,
    columnDefs : [
      {
        field: 'NumeroDisponibilidad',
        displayName: $translate.instant('NUM_DISPO_DOCENTE')
      },
      {
        field: 'Vigencia',
        displayName: $translate.instant('VIGENCIA_DISP')
      },
      {
        field: 'FechaRegistro',
        displayName: $translate.instant('FECHA_DISP'),
        cellTemplate: '<span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"+0900"}}</span>'
      }
    ],

    onRegisterApi : function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        self.disponibilidad_elegida=gridApi.selection.getSelectedRows();
        self.DisponibilidadApropiacion = self.disponibilidad_elegida[0].DisponibilidadApropiacion;
        self.listar_apropiaciones();


      });
    }
  };

  self.Apropiaciones = {
    paginationPageSizes: [10, 15, 20],
    paginationPageSize: 10,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    enableFiltering: true,
    multiSelect: false,
    enableHorizontalScrollbar: 0,
    enableVerticalScrollbar: true,
    useExternalPagination: false,
    enableSelectAll: false,
    columnDefs : [

      {
        field: 'Apropiacion.Valor',
        displayName: $translate.instant('VALOR_APROPIACION')
      },
      {
        field: 'Apropiacion.Saldo',
        displayName: $translate.instant('SALDO_APROPIACION')
      }
    ],

    onRegisterApi : function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        self.apropiacion_elegida=gridApi.selection.getSelectedRows();
        console.log("apropiacion elegida")
        console.log(self.apropiacion_elegida)
        self.verificarDisponibilidad();
      });
    }
  };


  adminMidRequest.get("gestion_previnculacion/Precontratacion/docentes_x_carga_horaria","vigencia="+self.resolucion.Vigencia+"&periodo="+self.resolucion.Periodo+"&tipo_vinculacion="+self.resolucion.Dedicacion+"&facultad="+self.resolucion.IdFacultad).then(function(response){
    self.datosDocentesCargaLectiva.data = response.data

  });



  oikosRequest.get("dependencia/proyectosPorFacultad/"+self.resolucion.IdFacultad+"/"+self.resolucion.NivelAcademico_nombre,"").then(function(response){
    self.proyectos = response.data;
    self.defaultSelectedPrecont = self.proyectos[0].Id;
  });

  //Función para visualizar docentes ya vinculados a resolución
  self.get_docentes_vinculados=function(){
    console.log("selfterm")
    console.log(self.term)
    self.estado = true;
    adminMidRequest.get("gestion_previnculacion/docentes_previnculados", "id_resolucion="+self.resolucion.Id).then(function(response){
      self.precontratados.data=response.data;
      self.estado = false;

    });

    self.precontratados.columnDefs[10].filter.term = self.term;


  }

  //Función para almacenar los datos de las vinculaciones realizadas
  self.agregarPrecontratos = function(){

    if(self.saldo_disponible){
      self.personasSeleccionadas1.forEach(function(personaSeleccionada){
        var vinculacionDocente = {
          IdPersona: personaSeleccionada.docente_documento,
          NumeroHorasSemanales: parseInt(personaSeleccionada.horas_lectivas),
          NumeroSemanas: parseInt(self.resolucion.NumeroSemanas),
          IdResolucion: {Id: parseInt(self.resolucion.Id)},
          IdDedicacion: {Id: parseInt(personaSeleccionada.id_tipo_vinculacion)},
          IdProyectoCurricular: parseInt(personaSeleccionada.id_proyecto),
          Categoria: personaSeleccionada.CategoriaNombre.toUpperCase(),
          Dedicacion: personaSeleccionada.tipo_vinculacion_nombre.toUpperCase(),
          NivelAcademico: self.resolucion.NivelAcademico_nombre,
          Disponibilidad: self.apropiacion_elegida[0].Id
        };

        vinculacionesData.push(vinculacionDocente);

      })

      adminMidRequest.post("gestion_previnculacion/Precontratacion/insertar_previnculaciones",vinculacionesData).then(function(response){

        if(typeof response.data=="number"){
          self.persona=null;
          self.datosDocentesCargaLectiva.data = []
          swal({
            text: $translate.instant('VINCULACION_EXITOSA'),
            type: 'success',
            confirmButtonText: $translate.instant('ACEPTAR')

          })
          self.RecargarDatosPersonas();
          self.RecargarDisponibilidades();
          self.RecargarApropiaciones();
          self.get_docentes_vinculados();
          self.personasSeleccionadas1 = [];
          vinculacionesData = [];
          $('#modal_disponibilidad').modal('hide');
        }else{
          swal({
            title: $translate.instant('ERROR'),
            text: $translate.instant('CONTRATO_NO_ALMACENADO'),
            type: 'info',
            confirmButtonText: $translate.instant('ACEPTAR')
          })
          self.RecargarDatosPersonas();
          self.RecargarDisponibilidades();
          self.RecargarApropiaciones();
          self.get_docentes_vinculados();
          self.personasSeleccionadas1 = [];
          vinculacionesData = [];
          $('#modal_disponibilidad').modal('hide');
        }
      })

    }else{
      swal({
        title: $translate.instant('ERROR'),
        text: $translate.instant('ERROR_DISP'),
        type: 'info',
        confirmButtonText: $translate.instant('ACEPTAR')
      })
    }

  }


  //*-------Funciones para la desvinculación de docentes ------ *//
  $scope.verCancelarInscripcionDocente=function(row){
    swal({
      title: $translate.instant('PREGUNTA_SEGURO'),
      text: $translate.instant('CONFIRMAR_DESVINCULACION'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: $translate.instant('DESVINCULAR_DOCENTE'),
      cancelButtonText: $translate.instant('CANCELAR'),
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then(function () {
      self.desvincularDocente(row);

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(
          $translate.instant('CANCELADO'),
          $translate.instant('DESVINCULACION_CANCELADA'),
          'error'
        )
      }
    })
  }

  self.desvincularDocente = function(row){


    administrativaRequest.delete("vinculacion_docente",row.entity.Id).then(function(response){
      if(response.data=="OK"){
        self.persona=null;
        swal({
          text: $translate.instant('DESVINCULACION_EXITOSA'),
          type: 'success',
          confirmButtonText: $translate.instant('ACEPTAR')

        }).then(function () {
           $window.location.reload();
        })

      }else{
        swal({
          title: $translate.instant('ERROR'),
          text: $translate.instant('DESVINCULACION_NOEXITOSA'),
          type: 'error',
          confirmButtonText: $translate.instant('ACEPTAR')
        })

      }
    })
  }

  //*------ Funciones para manejo y verificación de disponibilidades elegidas ----- *//

  //Función que muestra modal que permite elegir Disponibilidades y sus apropiaciones
  self.mostrar_modal_disponibilidad=function(){
    if(self.personasSeleccionadas1==null){
      swal({
        text: "Seleccione docentes",
        type: 'error',
        confirmButtonText: $translate.instant('ACEPTAR')
      })
    }else{
      financieraRequest.get('disponibilidad', "limit=-1?query=Vigencia:"+self.vigencia_data).then(function(response) {
        self.Disponibilidades.data = response.data;
      });
      $('#modal_disponibilidad').modal('show');
    }
  }

  //Función que lista las apropiaciones  del cdp elegido junto con su saldo y su valor
  self.listar_apropiaciones = function(){

    var disponibilidadAp = self.DisponibilidadApropiacion
    console.log("disponibilidad apropiacion")
    console.log(disponibilidadAp)
    adminMidRequest.post("consultar_disponibilidades/listar_apropiaciones",disponibilidadAp).then(function(response){
      console.log("apropiaciones")
      console.log(response.data)
      self.Apropiaciones.data = response.data
      //self.Apropiaciones.data = response.data;

    })

  }

  //Función que verifica si la apropiación elegida cubre los docentes elegidos
  self.verificarDisponibilidad=function(){

    self.personasSeleccionadas1.forEach(function(personaSeleccionada){
      var vinculacionDocente = {
        IdPersona: personaSeleccionada.docente_documento,
        NumeroHorasSemanales: parseInt(personaSeleccionada.horas_lectivas),
        NumeroSemanas: parseInt(self.resolucion.NumeroSemanas),
        IdResolucion: {Id: parseInt(self.resolucion.Id)},
        IdDedicacion: {Id: parseInt(personaSeleccionada.id_tipo_vinculacion)},
        IdProyectoCurricular: parseInt(personaSeleccionada.id_proyecto),
        Categoria: personaSeleccionada.CategoriaNombre.toUpperCase(),
        Dedicacion: personaSeleccionada.tipo_vinculacion_nombre.toUpperCase(),
        NivelAcademico: self.resolucion.NivelAcademico_nombre,
        Disponibilidad: self.apropiacion_elegida[0].Apropiacion.Id
      };

      vinculacionesData.push(vinculacionDocente);

    })

    adminMidRequest.post("gestion_previnculacion/Precontratacion/calcular_valor_contratos",vinculacionesData).then(function(response){
      console.log("valor de contratos")
      console.log(response.data)
      if(response.data > parseInt(self.apropiacion_elegida[0].Apropiacion.Saldo)){
        self.saldo_disponible = false;
        console.log("no se puede elgir esa apropiacion")
      }else{
        self.saldo_disponible = true;
        console.log("si se puede elegir")
      }
    })
    vinculacionesData = [];
  }

  //*--------------Funciones para recargar grids que han sido seleccionados -------------* //
  self.RecargarDatosPersonas = function(){
    adminMidRequest.get("gestion_previnculacion/Precontratacion/docentes_x_carga_horaria","vigencia="+self.resolucion.Vigencia+"&periodo="+self.resolucion.Periodo+"&tipo_vinculacion="+self.resolucion.Dedicacion+"&facultad="+self.resolucion.IdFacultad).then(function(response){
      self.datosDocentesCargaLectiva.data = response.data

    });
  }

  self.RecargarDisponibilidades = function(){
    financieraRequest.get('disponibilidad', "limit=-1?query=Vigencia:"+self.vigencia_data).then(function(response) {
      self.Disponibilidades.data = response.data;

    });
  }

  self.RecargarApropiaciones = function(){
    self.Apropiaciones.data = [];

  }

});
