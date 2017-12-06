'use strict';

angular.module('contractualClienteApp')
  .controller('HojasDeVidaSeleccionCtrl', function (resolucion,amazonAdministrativaRequest,adminMidRequest,oikosAmazonRequest,contratacion_mid_request,$localStorage,$scope,$mdDialog,$routeParams,$translate) {

    var self = this;

    self.resolucion = $localStorage.resolucion
    console.log("resolucion")
    console.log(self.resolucion)
    self.estado = false;
    self.proyectos=[];
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
          displayName: "Apellidos"
        },
        {
          field: 'docente_nombre',
          displayName: "Nombres"
        },
        {
          field: 'docente_documento',
          displayName: "Documento"
        },
        {
          field: 'horas_lectivas',
          displayName: "Horas lectivas"
        },
        {
          field: 'proyecto_nombre',
          displayName: "Proyecto curricular"
        },
        {
          field: 'CategoriaNombre',
          displayName: "Categoria"
        },
        {
          field: 'tipo_vinculacion_nombre',
          displayName: "Dedicación"
        },
        {
          field: 'id_tipo_vinculacion',
          displayName: "id_tipo_vinculacion",
          visible:false
        },
        {
          field: 'id_proyecto',
          displayName: "id_proyecto_curricular",

        },
        {
          field: 'tipo_vinculacion_nombre',
          displayName: "nombre vinculacion",

        }

      ],

      onRegisterApi : function(gridApi){
        self.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          self.personasSeleccionadas1=gridApi.selection.getSelectedRows();

        });
      }
    };


    adminMidRequest.get("informacionDocentes/docentes_x_carga_horaria","vigencia="+self.resolucion.Vigencia.toString()+"&periodo="+self.resolucion.Periodo.toString()+"&tipo_vinculacion="+self.resolucion.Dedicacion+"&facultad="+self.resolucion.IdFacultad.toString()).then(function(response){
        self.datosDocentesCargaLectiva.data = response.data

    });

    self.RecargarDatosPersonas = function(){
      adminMidRequest.get("informacionDocentes/docentes_x_carga_horaria","vigencia="+self.resolucion.Vigencia.toString()+"&periodo="+self.resolucion.Periodo.toString()+"&tipo_vinculacion="+self.resolucion.Dedicacion+"&facultad="+self.resolucion.IdFacultad.toString()).then(function(response){
          self.datosDocentesCargaLectiva.data = response.data

      });
    }


    oikosAmazonRequest.get("dependencia_padre","query=Padre%3A"+self.resolucion.IdFacultad+"&fields=Hija&limit=-1").then(function(response){
      if(response.data==null){
        //En caso de que no existan proyectos curriculares asociados a la facultad, la facultad es asignada como la dependencia donde se asocian los docentes
        oikosAmazonRequest.get("dependencia/"+self.resolucion.IdFacultad).then(function(response){
          self.proyectos=[response.data]
        });
      }
      else{
        var auxProyectos=response.data;
        var auxNum=0;
        auxProyectos.forEach(function(aux){
          oikosAmazonRequest.get("dependencia_tipo_dependencia","query=DependenciaId.Id%3A"+aux.Hija.Id.toString()+"%2CTipoDependenciaId.Id%3A1&limit=-1").then(function(response){
            if(response.data!=null){
              oikosAmazonRequest.get("dependencia_tipo_dependencia","query=DependenciaId.Id%3A"+aux.Hija.Id.toString()+"%2CTipoDependenciaId.Id%3A"+self.resolucion.NivelAcademico.toString()+"&limit=-1").then(function(response){
                auxNum++;
                if(response.data!=null){
                  self.proyectos.push(response.data[0].DependenciaId);
                }
                if(auxNum==auxProyectos.length){
                  if(self.proyectos.length==0){
                    //En caso de que no existan proyectos curriculares asociados a la facultad, la facultad es asignada como la dependencia donde se asocian los docentes
                    oikosAmazonRequest.get("dependencia/"+self.resolucion.IdFacultad).then(function(response){
                      self.proyectos=[response.data]
                    });
                  }
                }
              });
            }else{
              auxNum++;
            }
          });
        });
      }


    });


    //Se cargan los datos de los docentes que han sido asociados previamente a la resolucion
    self.precontratados = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableSorting: true,
      enableFiltering : true,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id', visible : false},
        {field: 'NombreCompleto', width: '25%', displayName: $translate.instant('NOMBRE')},
        {field: 'IdPersona', displayName: $translate.instant('CEDULA')},
        {field: 'Categoria', displayName: $translate.instant('CATEGORIA')},
        {field: 'IdDedicacion.NombreDedicacion', displayName: $translate.instant('DEDICACION')},
        {field: 'IdDedicacion.Id', visible:false,displayName: $translate.instant('DEDICACION')},
        {field: 'NumeroHorasSemanales', displayName: $translate.instant('HORAS_SEMANALES')},
        {field: 'NumeroSemanas', displayName: $translate.instant('SEMANAS')},
        {field: 'ValorContrato', displayName: $translate.instant('VALOR_CONTRATO'), cellClass:"valorEfectivo"},
        {field: 'IdProyectoCurricular', visible:false,filter: {
                        term: self.term
                    }},
        {
          field: 'cancelar',
          enableSorting: false,
          enableFiltering: false,
          width: '5%',
          displayName: '',
          cellTemplate: '<center>' +
            '<a class="borrar" ng-click="grid.appScope.verCancelarInscripcionDocente(row)">' +
            '<i title="{{\'BORRAR_BTN\' | translate }}" class="fa fa-trash fa-lg  faa-shake animated-hover"></i></a></div>' +
            '</center>'
        }
      ]
    };

    /*
    amazonAdministrativaRequest.get("vinculacion_docente", "limit=-1&query=IdResolucion.Id:"+self.resolucion.Id).then(function(response){
      self.precontratados.data=response.data;

    });
    */

    self.get_docentes_vinculados=function(){

      self.estado = true;
      adminMidRequest.get("informacionDocentes/docentes_previnculados", "id_resolucion="+self.resolucion.Id.toString()).then(function(response){
        self.precontratados.data=response.data;
        self.estado = false;

      });

      self.precontratados.columnDefs[9].filter.term = self.term;


    }

      //Función para almacenar los datos de las vinculaciones realizadas
    self.agregarPrecontratos = function(){


      self.personasSeleccionadas1.forEach(function(personaSeleccionada){
        var vinculacionDocente = {
          IdPersona: personaSeleccionada.docente_documento.toString(),
          NumeroHorasSemanales: parseInt(personaSeleccionada.horas_lectivas),
          NumeroSemanas: parseInt(self.resolucion.NumeroSemanas),
          IdResolucion: {Id: parseInt(self.resolucion.Id)},
          IdDedicacion: {Id: parseInt(personaSeleccionada.id_tipo_vinculacion)},
          IdProyectoCurricular: parseInt(personaSeleccionada.id_proyecto),
          Categoria: personaSeleccionada.CategoriaNombre.toString().toUpperCase(),
          Dedicacion: personaSeleccionada.tipo_vinculacion_nombre.toString().toUpperCase(),
          NivelAcademico: self.resolucion.NivelAcademico_nombre.toString()
        };

        vinculacionesData.push(vinculacionDocente);


        })


          adminMidRequest.post("calculo_salario/Contratacion/insertar_previnculaciones",vinculacionesData).then(function(response){

            if(response.data=="OK"){
                self.persona=null;
                self.datosDocentesCargaLectiva.data = []
                swal({
                  text: $translate.instant('VINCULACION_EXITOSA'),
                  type: 'success',
                  confirmButtonText: $translate.instant('ACEPTAR')

                  })
                  self.RecargarDatosPersonas();
                  self.get_docentes_vinculados();
                }else{
                swal({
                  title: $translate.instant('ERROR'),
                  text: $translate.instant('CONTRATO_NO_ALMACENADO'),
                  type: 'info',
                  confirmButtonText: $translate.instant('ACEPTAR')
                })
              }
          })

        //self.RecargarDatosPersonas();


    }



    $scope.verCancelarInscripcionDocente=function(row){
      swal({
        title: $translate.instant('PREGUNTA_SEGURO'),
        text: $translate.instant('CONFIRMAR_DESVINCULACION'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $translate.instant('DEVINCULAR_DOCENTE'),
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


      var vinculacionCancelada = {
        IdPersona: row.entity.IdPersona,
        NumeroHorasSemanales: row.entity.NumeroHorasSemanales,
        NumeroSemanas: row.entity.NumeroSemanas,
        IdResolucion: {Id: parseInt(self.resolucion.Id)},
        IdDedicacion: {Id: parseInt(row.entity.IdDedicacion.Id)},
        IdProyectoCurricular: parseInt(row.entity.IdProyectoCurricular),
        Estado: false

      };

      amazonAdministrativaRequest.put("vinculacion_docente",row.entity.Id,vinculacionCancelada).then(function(response){
        if(response.data=="OK"){
          self.persona=null;
          swal({
            text: $translate.instant('DESVINCULACION_EXITOSA'),
            type: 'success',
            confirmButtonText: $translate.instant('ACEPTAR')

            })
            self.get_docentes_vinculados();
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



    $scope.verInformacionPersonal = function(row){
      $mdDialog.show({
        controller: "InformacionPersonalCtrl",
        controllerAs: 'informacionPersonal',
        templateUrl: 'views/vinculacionespecial/informacion_personal.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    }

    $scope.verHistoriaLaboral = function(row){
      $mdDialog.show({
        controller: "HistoriaLaboralCtrl",
        controllerAs: 'historiaLaboral',
        templateUrl: 'views/vinculacionespecial/experiencia_laboral_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    }

    $scope.verFormacionAcademica = function(row){
      $mdDialog.show({
        controller: "FormacionAcademicaCtrl",
        controllerAs: "formacionAcademica",
        templateUrl: 'views/vinculacionespecial/formacion_academica_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    };

    $scope.verTrabajosInvestigacion = function(row){
       $mdDialog.show({
        controller: "TrabajosInvestigacionCtrl",
        controllerAs: "trabajosInvestigacion",
        templateUrl: 'views/vinculacionespecial/trabajos_investigacion_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    };

    self.Unidades = function(num){
      switch(num)
      {
        case 1: return $translate.instant('UN');
        case 2: return $translate.instant('DOS');
        case 3: return $translate.instant('TRES');
        case 4: return $translate.instant('CUATRO');
        case 5: return $translate.instant('CINCO');
        case 6: return $translate.instant('SEIS');
        case 7: return $translate.instant('SIETE');
        case 8: return $translate.instant('OCHO');
        case 9: return $translate.instant('NUEVE');
      }

      return "";
    }

    self.Decenas = function(num){

      var decena = Math.floor(num/10);
      var unidad = num - (decena * 10);

      switch(decena)
      {
        case 1:
          switch(unidad)
          {
            case 0: return $translate.instant('DIEZ');
            case 1: return $translate.instant('ONCE');
            case 2: return $translate.instant('DOCE');
            case 3: return $translate.instant('TRECE');
            case 4: return $translate.instant('CATORCE');
            case 5: return $translate.instant('QUINCE');
            case 6: return $translate.instant('DIECISEIS');
            case 7: return $translate.instant('DIECISIETE');
            case 8: return $translate.instant('DIECIOCHO');
            case 9: return $translate.instant('DIECINUEVE');
            //default: return "DIECI" + self.Unidades(unidad);
          }
        case 2:
          switch(unidad)
          {
            case 0: return $translate.instant('VEINTE');
            case 1: return $translate.instant('VEINTIUNO');
            case 2: return $translate.instant('VEINTIDOS');
            case 3: return $translate.instant('VEINTITRES');
            case 4: return $translate.instant('VEINTICUATRO');
            case 5: return $translate.instant('VEINTICINCO');
            case 6: return $translate.instant('VEINTISEIS');
            case 7: return $translate.instant('VEINTISIETE');
            case 8: return $translate.instant('VEINTIOCHO');
            case 9: return $translate.instant('VEINTINUEVE');
            //default: return "VEINTI" + self.Unidades(unidad);
          }
        case 3: return self.DecenasY($translate.instant('TREINTA'), unidad);
        case 4: return self.DecenasY($translate.instant('CUARENTA'), unidad);
        case 5: return self.DecenasY($translate.instant('CINCUENTA'), unidad);
        case 6: return self.DecenasY($translate.instant('SESENTA'), unidad);
        case 7: return self.DecenasY($translate.instant('SETENTA'), unidad);
        case 8: return self.DecenasY($translate.instant('OCHENTA'), unidad);
        case 9: return self.DecenasY($translate.instant('NOVENTA'), unidad);
        case 0: return self.Unidades(unidad);
      }
    }

    self.DecenasY = function(strSin, numUnidades){
      if (numUnidades > 0)
        return strSin + $translate.instant('Y') + self.Unidades(numUnidades)

      return strSin;
    }

    self.Centenas = function(num){

      var centenas = Math.floor(num / 100);
      var decenas = num - (centenas * 100);

      switch(centenas)
      {
        case 1:
          if (decenas > 0)
            return $translate.instant('CIENTO')+ self.Decenas(decenas);
          return $translate.instant('CIEN');
        case 2: return $translate.instant('DOSCIENTOS') + self.Decenas(decenas);
        case 3: return $translate.instant('TRESCIENTOS') + self.Decenas(decenas);
        case 4: return $translate.instant('CUATROCIENTOS') + self.Decenas(decenas);
        case 5: return $translate.instant('QUINIENTOS') + self.Decenas(decenas);
        case 6: return $translate.instant('SEISCIENTOS') + self.Decenas(decenas);
        case 7: return $translate.instant('SETECIENTOS') + self.Decenas(decenas);
        case 8: return $translate.instant('OCHOCIENTOS') + self.Decenas(decenas);
        case 9: return $translate.instant('NOVECIENTOS') + self.Decenas(decenas);
      }

      return self.Decenas(decenas);
    }

    self.Seccion = function(num, divisor, strSingular, strPlural){
      var cientos = Math.floor(num / divisor)
      var resto = num - (cientos * divisor)

      var letras = "";

      if (cientos > 0)
        if (cientos > 1)
          letras = self.Centenas(cientos) + " " + strPlural;
        else
          letras = strSingular;

      if (resto > 0)
        letras += "";

      return letras;
    }

    self.Miles = function(num){
      var divisor = 1000;
      var cientos = Math.floor(num / divisor)
      var resto = num - (cientos * divisor)

      var strMiles = self.Seccion(num, divisor, $translate.instant('UN_MIL'), $translate.instant('MIL'));
      var strCentenas = self.Centenas(resto);

      if(strMiles == "")
        return strCentenas;

      return strMiles + " " + strCentenas;

    }

    self.Millones = function(num){
      var divisor = 1000000;
      var cientos = Math.floor(num / divisor)
      var resto = num - (cientos * divisor)

      var strMillones = self.Seccion(num, divisor, $translate.instant('UN_MILLON'), $translate.instant('MILLONES'));
      var strMiles = self.Miles(resto);

      if(strMillones == "")
        return strMiles;

      return strMillones + " " + strMiles;

    }

    self.NumeroALetras = function(num){
      var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
        letrasMonedaPlural: $translate.instant('PESOS'),
        letrasMonedaSingular: $translate.instant('PESO')
      };

      if (data.centavos > 0)
        data.letrasCentavos = $translate.instant('CON')+ data.centavos + "/100";

      if(data.enteros == 0)
        return $translate.instant('CERO') + data.letrasMonedaPlural + " " + data.letrasCentavos;
      if (data.enteros == 1)
        return self.Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
      else
        return self.Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    }

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


});
