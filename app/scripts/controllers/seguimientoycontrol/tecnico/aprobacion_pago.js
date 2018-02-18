'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:AprobacionPagoCtrl
 * @description
 * # AprobacionPagoCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('AprobacionPagoCtrl', function (oikosRequest, $http, uiGridConstants, contratoRequest, $translate, administrativaRequest,$routeParams,adminMidRequest) {


      //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
      var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

      //Se utiliza la variable self estandarizada
      var self = this;
      self.Documento = $routeParams.docid;

      self.contratistas = [];

      self.mes = '';

      self.meses = [{
          Id: 1,
          Nombre: $translate.instant('ENERO')
        },
        {
          Id: 2,
          Nombre: $translate.instant('FEBRERO')
        },
        {
          Id: 3,
          Nombre: $translate.instant('MARZO')
        },
        {
          Id: 4,
          Nombre: $translate.instant('ABRIL')
        },
        {
          Id: 5,
          Nombre: $translate.instant('MAYO')
        },
        {
          Id: 6,
          Nombre: $translate.instant('JUNIO')
        },
        {
          Id: 7,
          Nombre: $translate.instant('JULIO')
        },
        {
          Id: 8,
          Nombre: $translate.instant('AGOSTO')
        },
        {
          Id: 9,
          Nombre: $translate.instant('SEPT')
        },
        {
          Id: 10,
          Nombre: $translate.instant('OCTU')
        },
        {
          Id: 11,
          Nombre: $translate.instant('NOV')
        },
        {
          Id: 12,
          Nombre: $translate.instant('DIC')
        }
      ];

      self.d = new Date();
      self.anios = [(self.d.getFullYear()), (self.d.getFullYear() + 1)];

      /*
        Función para obtener la imagen del escudo de la universidad
      */
      $http.get("scripts/models/imagen_ud.json")
       .then(function(response) {
         self.imagen = response.data;
      });

      /*
        Creación tabla que tendrá todos los contratistas relacionados al supervisor
      */
      self.gridOptions1 = {
        enableSorting: true,
        enableFiltering: true,
        resizable: true,
        rowHeight: 40,
        columnDefs: [
          {
            field: 'Dependencia.Nombre',
            cellTemplate: tmpl,
            displayName: $translate.instant('PRO_CURR'),
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            },
            width: "15%"
          },
          {
            field: 'PagoMensual.Persona',
            cellTemplate: tmpl,
            displayName: $translate.instant('DOCUMENTO'),
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            },
            width: "15%"
          },
          {
            field: 'NombrePersona',
            cellTemplate: tmpl,
            displayName: $translate.instant('NAME_TEACHER'),
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            },
          },

          {
            field: 'PagoMensual.NumeroContrato',
            cellTemplate: tmpl,
            displayName: $translate.instant('NUM_VIN'),
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            },
          },
          {
            field: 'PagoMensual.Mes',
            cellTemplate: tmpl,
            displayName: $translate.instant('MES_SOLICITUD'),
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            },
          },
          {
            field: 'PagoMensual.Ano',
            cellTemplate: tmpl,
            displayName: $translate.instant('ANO_SOLICITUD'),
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1
            },
          }
          ,
          {
            field: 'Acciones',
            displayName: $translate.instant('ACC'),
            cellTemplate:  ' <a type="button" title="Aprobar pago" type="button" class="fa fa-check fa-lg  faa-shake animated-hover"  ng-click="grid.appScope.aprobacionPago.aprobarPago(row.entity.PagoMensual)">'+
            '<a type="button" title="Rechazar" type="button" class="fa fa-close fa-lg  faa-shake animated-hover"' +
            'ng-click="grid.appScope.aprobacionPago.rechazarPago(row.entity.PagoMensual)"></a>',
            width: "10%"
          }
        ]
      };



      self.gridOptions1.onRegisterApi = function (gridApi) {
        self.gridApi = gridApi;
      };



      /*
        Función que recibe un objeto que posee un arreglo con información de los contratistas y su supervisor.
        Eśta función extrae el arreglo y los procesa para adicionar un atributo de validación.
      */

      self.procesar_contratistas = function (supervisor_contratistas) {

        for (var i = 0; i < supervisor_contratistas.length; i++) {
          self.contratistas[i] = {
            num_documento: supervisor_contratistas[i].contratista.documento,
            nombre: supervisor_contratistas[i].contratista.nombre,
            dependencia: supervisor_contratistas[i].supervisor.dependencia,
            cargo_supervision: supervisor_contratistas[i].supervisor.cargo,
            validacion: false
          }
        }
      }

      /*
        Función para consultar los datos del supervisor del contrato y los contratistas asociados a este
      */



      self.obtener_informacion_ordenador = function () {
        //Petición para obtener la información del supervisor del contrato
        self.gridOptions1.data = [];
        self.contratistas = [];

        contratoRequest.get('ordenador', self.Documento).then(function (response) {

          self.ordenador = response.data.ordenador;

          //Petición para obtener el Id de la relación de acuerdo a los campos
          adminMidRequest.get('aprobacion_pago/solicitudes_ordenador/'+self.Documento).then(function (response) {
            self.documentos = response.data;
            //self.obtener_informacion_docente();
            self.gridOptions1.data = self.documentos;
          });


        });
      };

      self.obtener_informacion_ordenador();

      self.validarCumplido = function (contratista) {
        swal({
          title: '¿Está seguro(a)?',
          text: "Podrá revertir la validación",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Validar'
        }).then(function () {
          contratista.validacion = true;
          self.gridApi.core.refresh();

        });
      };

      self.invalidarCumplido = function (contratista) {
        swal({
          title: '¿Está seguro(a) de invalidar el cumplido?',
          text: "Podrá revertir la invalidación",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Invalidar'
        }).then(function () {
          contratista.validacion = false;
          self.gridApi.core.refresh();

        });
      };

      self.aprobarPago = function (pago_mensual) {

        contratoRequest.get('contrato_elaborado', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato).then(function (response) {
          self.aux_pago_mensual = pago_mensual;


          administrativaRequest.get('estado_pago_mensual', $.param({
            limit: 0,
            query: 'CodigoAbreviacion:AP'
          })).then(function (responseCod) {

            var sig_estado = responseCod.data;
            self.aux_pago_mensual.EstadoPagoMensual.Id = sig_estado[0].Id;
            self.aux_pago_mensual.FechaModificacion = new Date();

            administrativaRequest.put('pago_mensual', self.aux_pago_mensual.Id, self.aux_pago_mensual).then(function (response) {

              if(response.data==="OK"){

                swal(
                  'Pago aprobado',
                  'Se ha registrado la aprobación del pago',
                  'success'
                )
                self.obtener_informacion_ordenador();
                self.gridApi.core.refresh();
               }else{


                swal(
                  'Error',
                  'No se ha podido registrar la aprobación del pago',
                  'error'
                );
               }

            });

          })
        });

      };

      self.rechazarPago = function (pago_mensual) {

        contratoRequest.get('contrato_elaborado', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato).then(function (response) {
          self.aux_pago_mensual = pago_mensual;


          administrativaRequest.get('estado_pago_mensual', $.param({
            limit: 0,
            query: 'CodigoAbreviacion:RP'
          })).then(function (responseCod) {

            var sig_estado = responseCod.data;
            self.aux_pago_mensual.EstadoPagoMensual.Id = sig_estado[0].Id;
            self.aux_pago_mensual.FechaModificacion = new Date();


            administrativaRequest.put('pago_mensual', self.aux_pago_mensual.Id, self.aux_pago_mensual).then(function (response) {

              if(response.data==="OK"){

                swal(
                  'Pago rechazado',
                  'Se ha registrado el rechazo del pago',
                  'success'
                )
                self.obtener_informacion_ordenador();
                self.gridApi.core.refresh();
               }else{


                swal(
                  'Error',
                  'No se ha podido registrar el rechazo del pago',
                  'error'
                );
               }

            });

          })
        });

      };

      /*
        Función que genera el documento de quienes no cumplieron con sus obligaciones
      */
      self.getContenido = function(){
        var contenido = [];
        contenido.push( {text:'EL SUSCRITO DECANO DE LA FACULTAD DE INGENIERÍA DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
        contenido.push({text:'CERTIFICA QUE: ', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
        contenido.push({text:'De acuerdo con la información suministrada por los proyectos curriculares de pregrado de la facultad de Ingeniería, los profesores de Vinculación Especial contratados para el período académico 2018-I, cumplieron a cabalidad con las funciones docentes en el mes de febrero del presente año. (De acuerdo a calendario académico).', style:'general_font'}, '\n\n')
        if(self.docentes_pago_rechazado){
          contenido.push({text:'A excepción de las siguientes novedades: ', style:'general_font'}, '\n')
          angular.forEach(self.docentes_pago_rechazado, function(value) {
           contenido.push({text: value.Nombre + ', ' + value.NumDocumento, style:'general_font'});
         });
        }
        contenido.push('\n',{text:'La presente certificación se expide con destino a la División de Recursos Humanos a los catorce días del mes de febrero de 2018.',  style:'general_font'}, '\n\n\n\n\n\n');
        contenido.push({text:'' + self.ordenador.nombre, style:'bottom_space'});
        contenido.push({text:'' + self.ordenador.cargo, style:'bottom_space'});
        return contenido
      }

      /*
        Función que genera el documento de quienes no cumplieron con sus obligaciones
      */
      self.generarPDF = function (){
        //adminMidRequest.get('aprobacion_pago/certificacion_visto_bueno/*/**/*').
        adminMidRequest.get('aprobacion_pago/certificacion_documentos_aprobados/14/2/2018').
          then(function(response){
            self.docentes_pago_rechazado = response.data;

            //Generación documento
            var docDefinition = {
              pageMargins: [30, 140, 40, 40],
              header: {
               height: 120,
               width: 120,
               image: self.imagen.imagen,
               margin: [100, 15,5,5],
               alignment: 'center'
             },
             content: self.getContenido(),
             styles: {
               top_space: {
                 fontSize: 11,
                 marginTop: 30
               },
               bottom_space: {
                 fontSize: 12,
                 bold: true,
                 alignment:'center'
                 //marginBottom: 30
               },
               general_font:{
                 fontSize: 11,
                 alignment: 'justify'
               }
             }
            }
            //Variable para obtener la fecha y hora que se genera el dcoumento
            var date = new Date();
            date = moment(date).format('DD_MMM_YYYY_HH_mm_ss');

            //Sirve para descargar el documento y setearle el nombre
            pdfMake.createPdf(docDefinition).download('Certificación cumplido para pago ' + date + '.pdf');
           });
      };

  });
