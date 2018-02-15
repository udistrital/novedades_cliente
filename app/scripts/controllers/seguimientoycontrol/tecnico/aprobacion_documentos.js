'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:AprobacionDocumentosCtrl
 * @description
 * # AprobacionDocumentosCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('AprobacionDocumentosCtrl', function (oikosRequest, $http, uiGridConstants, contratoRequest, $translate, administrativaRequest, amazonAdministrativaRequest,nuxeo,coreRequest, $q, $sce, $window, adminMidRequest,$routeParams) {

    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Se utiliza la variable self estandarizada
    var self = this;
    self.contratistas = [];
    self.Documento = $routeParams.docid;

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
          cellTemplate: ' <a type="button" title="Aprobar pago" type="button" class="fa fa-check fa-lg  faa-shake animated-hover" ng-if="!row.entity.validacion" ng-click="grid.appScope.aprobacionDocumentos.verificarDocumentos(row.entity.PagoMensual)">' +
            '</a>&nbsp;' + '<a type="button" title="Rechazar pago" type="button" class="fa fa-close fa-lg  faa-shake animated-hover"' +
            'ng-if="row.entity.validacion" ng-click="grid.appScope.aprobacionDocumentos.invalidarCumplido(row.entity)"></a>' +
            '<a type="button" title="Ver información" type="button" class="fa fa-eye fa-lg  faa-shake animated-hover"' +
            'ng-click="grid.appScope.aprobacionDocumentos.obtener_doc(row.entity.PagoMensual)" data-toggle="modal" data-target="#modal_ver_soportes"></a>' +
            '<a type="button" title="Rechazar" type="button" class="fa fa-close fa-lg  faa-shake animated-hover"' +
            'ng-click="grid.appScope.aprobacionDocumentos.rechazar(row.entity.PagoMensual)"></a>',
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
          contrato: supervisor_contratistas[i].contrato,
          dependencia: supervisor_contratistas[i].supervisor.dependencia,
          cargo_supervision: supervisor_contratistas[i].supervisor.cargo,
          validacion: false
        }
      }
    }

    /*
      Función para consultar los datos del supervisor del contrato y los contratistas asociados a este
    */



    self.obtener_informacion_supervisor = function () {
      //Petición para obtener la información del supervisor del contrato
      self.gridOptions1.data = [];
      self.contratistas = [];
      try {
        contratoRequest.get('supervisor_contratistas', self.Documento).then(function (response) {

          self.respuesta_supervisor_contratistas = response.data;

          console.log(response.status);





          self.supervisor = self.respuesta_supervisor_contratistas.supervisores.supervisor_contratista[0].supervisor;


          //Petición para obtener el Id de la relación de acuerdo a los campos
          adminMidRequest.get('aprobacion_pago/solicitudes_supervisor/'+self.Documento).then(function (response) {
            self.documentos = response.data;
            //self.obtener_informacion_docente();
            self.gridOptions1.data = self.documentos;
          });
          // self.gridOptions1.data = self.contratistas;


        });

      } catch (error) {


      }

    };

    self.obtener_informacion_supervisor ();


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


    self.verInformacionContrato = function (contrato_contratista) {



      contratoRequest.get('informacion_contrato_elaborado_suscrito', contrato_contratista.NumeroContrato + '/' + contrato_contratista.VigenciaContrato).then(function (response) {

        self.respuesta_informacion_contrato = response.data;

        contratoRequest.get('acta_inicio_elaborado', contrato_contratista.NumeroContrato + '/' + contrato_contratista.VigenciaContrato).then(function (response) {


          self.respuesta_acta_inicio = response.data;

          console.log(self.respuesta_acta_inicio);

          amazonAdministrativaRequest.get('contrato_disponibilidad', $.param({
            query: "NumeroContrato:" + contrato_contratista.NumeroContrato + ",Vigencia:" + contrato_contratista.VigenciaContrato,
            limit: 0
          })).then(function (response) {

            self.cdp = response.data[0];

            if (self.respuesta_informacion_contrato.informacion_contratista.contrato !== undefined) {
              self.objeto_modal = {
                numero_contrato: self.respuesta_informacion_contrato.informacion_contratista.contrato.numero,
                vigencia: self.respuesta_informacion_contrato.informacion_contratista.contrato.vigencia,
                cdp: self.cdp.NumeroCdp,
                fecha_cdp: "2017-01-01",
                crp: "123456",
                fecha_crp: "2017-01-01",
                fecha_inicio: self.respuesta_acta_inicio.actaInicio.fechaInicio,
                fecha_fin: self.respuesta_acta_inicio.actaInicio.fechaFin
              }
            }
            else {

              self.objeto_modal = {
                numero_contrato: contrato_contratista.numeroContrato,
                vigencia: contrato_contratista.VigenciaContrato,
                cdp: self.cdp.NumeroCdp,
                fecha_cdp: "2017-01-01",
                crp: "123456",
                fecha_crp: "2017-01-01",
                fecha_inicio: self.respuesta_acta_inicio.actaInicio.fechaInicio,
                fecha_fin: self.respuesta_acta_inicio.actaInicio.fechaFin
              };
            }



          });



        });

      });


    };



    self.verificarDocumentos = function (pago_mensual) {
      self.aprobado = false;
      self.aux_pago_mensual = pago_mensual;
      administrativaRequest.get('soporte_pago_mensual', $.param({
        query: "PagoMensual.NumeroContrato:" + self.aux_pago_mensual.NumeroContrato + ",PagoMensual.VigenciaContrato:" + self.aux_pago_mensual.VigenciaContrato + ",PagoMensual.Mes:" + self.aux_pago_mensual.Mes + ",PagoMensual.Ano:" + self.aux_pago_mensual.Ano,
        limit: 0
      })).then(function (response) {

        var soportes = response.data;

        if (soportes !== null) {
          adminMidRequest.get('aprobacion_pago/informacion_ordenador/'+self.aux_pago_mensual.NumeroContrato+'/'+self.aux_pago_mensual.VigenciaContrato).then(function(response){
           self.ordenador = response.data;

          for (var i = 0; i < soportes.length; i++) {

            if (!soportes[i].Aprobado) {
              self.aprobado = false;
              break;
            } else {
              self.aprobado = true;

              administrativaRequest.get('estado_pago_mensual', $.param({
                limit: 0,
                query: 'CodigoAbreviacion:AD'
              })).then(function (responseCod) {

                var sig_estado = responseCod.data;

                self.aux_pago_mensual.EstadoPagoMensual.Id = sig_estado[0].Id;
                self.aux_pago_mensual.Responsable = self.ordenador.NumeroDocumento.toString();
                self.aux_pago_mensual.CargoResponsable = self.ordenador.Cargo;
                self.aux_pago_mensual.FechaModificacion = new Date();

                administrativaRequest.put('pago_mensual', self.aux_pago_mensual.Id, self.aux_pago_mensual).then(function (response) {

                  if (response.data === "OK") {

                    swal(
                      'Documentos Aprobados',
                      'Se ha registrado la aprobación de los documentos',
                      'success'
                    )
                    self.obtener_informacion_supervisor();
                    self.gridApi.core.refresh();
                  } else {


                    swal(
                      'Error',
                      'No se ha podido registrar la aprobación de los documentos',
                      'error'
                    );
                  }

                });

              });

            }
          }//
          })
        } else {
          swal(
            'Error',
            'No existen soportes aprobados para el cumplido',
            'error'
          );
        }
      })
    }


    self.rechazar = function (pago_mensual) {

      contratoRequest.get('contrato_elaborado', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato).then(function (response) {
        self.aux_pago_mensual = pago_mensual;
        // self.contrato = response.data.contrato;
        //self.aux_pago_mensual.Responsable = self.contrato.supervisor.documento_identificacion;

        administrativaRequest.get('estado_pago_mensual', $.param({
          limit: 0,
          query: 'CodigoAbreviacion:RD'
        })).then(function (responseCod) {

          var sig_estado = responseCod.data;
          self.aux_pago_mensual.EstadoPagoMensual.Id = sig_estado[0].Id;

          administrativaRequest.put('pago_mensual', self.aux_pago_mensual.Id, self.aux_pago_mensual).then(function (response) {

            if (response.data === "OK") {

              swal(
                'Rechazo registrado',
                'Se ha registrado el rechazo de los documentos',
                'success'
              )
              self.obtener_informacion_supervisor();
              self.gridApi.core.refresh();
            } else {


              swal(
                'Error',
                'No se ha podido registrar el rechazo',
                'error'
              );
            }

          });

        })
      });

    };


    /*
      Función para ver documentos de los docentes a cargo
    */
    self.obtener_doc = function (fila){
      self.fila_sol_pago = fila;
      var nombre_docs = self.fila_sol_pago.VigenciaContrato + self.fila_sol_pago.NumeroContrato + self.fila_sol_pago.Persona + self.fila_sol_pago.Mes + self.fila_sol_pago.Ano;
      coreRequest.get('documento', $.param ({
       query: "Nombre:" + nombre_docs + ",Activo:true",
       limit:0
     })).then(function(response){
       self.documentos = response.data;
       console.log(self.documentos);
       angular.forEach(self.documentos, function(value) {
         self.descripcion_doc = value.Descripcion;
         console.log(self.descripcion_doc);
         value.Contenido = JSON.parse(value.Contenido);

         if (value.Contenido.Tipo === "Enlace") {
             value.Contenido.NombreArchivo = value.Contenido.Tipo;
         };
       });
     })
   };

   /*
     Función para visualizar enlace
   */
   self.visualizar_enlace = function (url){
     $window.open(url);
   };

   /*
     Función que permite obtener un documento de nuxeo por el Id
   */
   self.getDocumento = function(docid){
    nuxeo.header('X-NXDocumentProperties', '*');

    self.obtenerDoc = function () {
      var defered = $q.defer();

      nuxeo.request('/id/'+docid)
          .get()
          .then(function(response) {
            self.doc=response;
            var aux=response.get('file:content');
            self.document=response;
            console.log(self.document);
            defered.resolve(response);
          })
          .catch(function(error){
              defered.reject(error)
          });
      return defered.promise;
    };

    self.obtenerFetch = function (doc) {
      var defered = $q.defer();

      doc.fetchBlob()
        .then(function(res) {
          defered.resolve(res.blob());

        })
        .catch(function(error){
              defered.reject(error)
          });
      return defered.promise;
    };

      self.obtenerDoc().then(function(){

         self.obtenerFetch(self.document).then(function(r){
             self.blob=r;
             var fileURL = URL.createObjectURL(self.blob);
             console.log(fileURL);
             self.content = $sce.trustAsResourceUrl(fileURL);
             self.url = fileURL;

             $window.open(fileURL, 'Soporte Cumplido', 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900', true);
          });
      });
    };

    /*
      Función para "borrar" un documento
    */
    self.enviar_comentario = function(documento){
        swal({
          title: '¿Está seguro(a) de enviar la observación?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar'
        }).then(function () {
         documento.Contenido = JSON.stringify(documento.Contenido);
         coreRequest.put('documento', documento.Id, documento).
         then(function(response){
              console.log(documento);
              console.log(response);
              self.obtener_doc(self.fila_sol_pago);
        });

        });


    };

    self.aprobar_documentos = function(id_documento){
      self.id_documento = id_documento;
      administrativaRequest.get('soporte_pago_mensual', $.param({
        query: "Documento:" + self.id_documento,
        limit: 0
      })).then(function(response){
        self.soporte = response.data[0];

        self.soporte.Aprobado=true;


        administrativaRequest.put('soporte_pago_mensual',self.soporte.Id, self.soporte).
        then(function(response){
          if (response.data === 'OK') {

            swal(
              'Documento Aprobado',
              'Se ha aprobado el documento',
              'success'
            )
          } else {
            swal(
              'Error',
              'No se ha podido aprobar el documento',
              'error'
            );  
          }
       });


      });


    }


  });
