'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:CargaDocumentosContratistaCtrl
 * @description
 * #CargaDocumentosContratistaCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('cargaDocumentosContratistaCtrl', function ($scope, $http, $translate, uiGridConstants, contratoRequest, administrativaRequest, nuxeo, $q, coreRequest, $window,$sce, adminMidRequest,$routeParams, wso2GeneralService) {

    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
  var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';


  $('body').on('hidden.bs.modal', '.modal', function (e) {
    if($('.modal').hasClass('in')) {
    $('body').addClass('modal-open');
    }
});

  //Se utiliza la variable self estandarizada
  var self = this;
  self.mostrar_boton= true;

  self.Documento = '52896764';

  self.anios = [];

  self.meses_aux = [{
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

  /*
    Función que permite realizar una solicitud de pago mensual
  */
  self.solicitar_pago = function(contrato) {
    self.contrato = contrato;
    self.anios = [parseInt(self.contrato.Vigencia), parseInt(self.contrato.Vigencia) -1];
  };

  /*
    Función que visualiza los meses de acuerdo al año seleccionado
  */
  self.getMeses = function (anio){
     var hoy = new Date();
    if (anio < hoy.getFullYear()){
      self.meses = self.meses_aux;
    }else if (anio == hoy.getFullYear())
    {
      self.meses = self.meses_aux.slice(0, hoy.getMonth()+1);
    }
  };
  /*
    Creación tabla que tendrá todos los contratos relacionados al contratista
  */
  self.gridOptions1 = {
    enableSorting: true,
    enableFiltering: true,
    resizable: true,
    columnDefs: [{
        field: 'NumeroContrato',
        cellTemplate: tmpl,
        displayName: $translate.instant('NUMERO_CONTRATO'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "15%"
      },
      {
        field: 'Vigencia',
        cellTemplate: tmpl,
        displayName: $translate.instant('VIGENCIA'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "10%"
      },
      {
        field: 'RP',
        cellTemplate: tmpl,
        displayName: $translate.instant('RP'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "15%"
      },
      {
        field: 'CDP',
        cellTemplate: tmpl,
        displayName: $translate.instant('CDP'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "10%"
      },
      {
        field: 'Dependencia',
        cellTemplate: tmpl,
        displayName: $translate.instant('DEPENDENCIA'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'Acciones',
        displayName: $translate.instant('ACC'),
        cellTemplate: '<a type="button" title="{{\'CARGAR_LISTAS\'| translate }}" type="button" class="fa fa-upload fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosContratista.solicitar_pago(row.entity);grid.appScope.cargaDocumentosContratista.cargar_soportes(row.entity)"  data-toggle="modal" data-target="#modal_carga_listas_docente">',
        width: "10%"
      }
    ]
  };


  self.gridOptions1.onRegisterApi = function(gridApi) {
    self.gridApi = gridApi;
  };

  self.datos = [{
    "NumeroContrato": "14",
    "Vigencia": "2018",
    "RP": "3215",
    "CDP": "154",
    "Dependencia": "OAS"
  }];

  self.gridOptions1.data = self.datos;

  /*
    Función que recibe un objeto que posee un arreglo con información de los contratistas y su supervisor.
    Eśta función extrae el arreglo y los procesa para adicionar un atributo de validación.
  */

  self.procesar_contratos = function (contratos_contratista) {

    for (var i = 0; i < contratos_contratista.length; i++) {
      self.contratistas[i] = {
        vigencia: contratos_contratista[i].contratista.documento,
        nombre: contratos_contratista[i].contratista.nombre,
        contrato: contratos_contratista[i].contrato,
        dependencia: contratos_contratista[i].supervisor.dependencia,
        cargo_supervision: contratos_contratista[i].supervisor.cargo,
        validacion: false
      }
    }
  };

  /*
    Función para consultar los contratos asociados al contratista
  */
  self.obtener_informacion_contratos_contratista = function() {
    //Petición para obtener la información del docente
  //  self.gridOptions1.data = [];
    self.contratos = [];
      //Petición para obtener las vinculaciones del docente
      wso2GeneralService.get('/contratoSuscritoProxyService/contratos_persona', self.Documento)
      .then(function(response) {
        if(self.respuesta_contratista !== null || self.respuesta_contratista !== undefined){
          //Contiene la respuesta de la petición
          self.respuesta_contratista = response.data.contratos_personas;
          //Variable que contiene el nombre del docente
          self.vigencia_contrato = self.respuesta_contratista.contrato_persona[0].vigencia;
          //Variable que contiene el número de contrato
          self.numero_contrato = self.respuesta_contratista.contrato_persona[0].numero_contrato;

          self.obtener_informacion_contratista(self.numero_contrato, self.vigencia_contrato);

          //Carga la información en la tabla
          //self.gridOptions1.data = self.respuesta_contratista;
        }else{
          alert("No se encontraron contratos vigentes asociadas a su número de documento");
        }

      });
    //self.gridApi2.core.refresh();
  };

  self.obtener_informacion_contratos_contratista();

  /*
    Función para consultar los contratos asociados al contratista
  */
  self.obtener_informacion_contratista = function(numero_contrato, vigencia){
    wso2GeneralService.get('/contratoSuscritoProxyService/informacion_contrato_contratista', numero_contrato + '/' + vigencia)
    .then(function(response){
      console.log(response.data);
      //Información contratista
      self.info_contratista = response.data.informacion_contratista;
      console.log(self.info_contratista.nombre_completo);
    })
  };

  /*
    Creación tabla que tendrá las solicitudes de pago de cada contrato
  */
  self.gridOptions2 = {
    enableSorting: true,
    enableFiltering: true,
    resizable: true,
    enableRowSelection: true,
    columnDefs: [{
        field: 'NumeroContrato',
        cellTemplate: tmpl,
        displayName: $translate.instant('NUMERO_CONTRATO'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'VigenciaContrato',
        cellTemplate: tmpl,
        displayName: $translate.instant('VIGENCIA'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'Mes',
        cellTemplate: tmpl,
        displayName: $translate.instant('MES'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'Ano',
        cellTemplate: tmpl,
        displayName: $translate.instant('ANO'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'EstadoPagoMensual.Nombre',
        cellTemplate: tmpl,
        displayName: $translate.instant('EST_SOL'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'Acciones',
        displayName: $translate.instant('ACC'),
        cellTemplate: '<a type="button" title="{{\'VER_SOP\'| translate }}" type="button" class="fa fa-folder-open-o fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosContratista.obtener_doc(row.entity)" data-toggle="modal" data-target="#modal_ver_soportes">' +
          '</a>&nbsp;' + ' <a ng-if="row.entity.EstadoPagoMensual.CodigoAbreviacion === \'CD\' || row.entity.EstadoPagoMensual.CodigoAbreviacion === \'RC\' || row.entity.EstadoPagoMensual.CodigoAbreviacion === \'RD\' || row.entity.EstadoPagoMensual.CodigoAbreviacion === \'RP\'" type="button" title="{{\'ENV_REV\'| translate }}" type="button" class="fa fa-send-o fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosContratista.enviar_revision(row.entity)"  >',
        width: "10%"
      }
    ]
  };


  //No permite poder hacer multiples selecciones en la grilla
  self.gridOptions2.multiSelect = false;
  /*
    Función para obtener la data de la fila seleccionada en la grilla
  */
  self.gridOptions2.onRegisterApi = function(gridApi) {
    self.gridApi2 = gridApi;
    self.seleccionados = self.gridApi2.selection.selectedCount;
    self.gridApi2.selection.on.rowSelectionChanged($scope, function(row) {
      //Contiene la info del elemento seleccionado
      self.seleccionado = row.isSelected;
      //Condiciuonal para capturar la información de la fila seleccionado
      if (self.seleccionado) {
        self.fila_seleccionada = row.entity;
      }
    });
  };

  /*
    Función para generar la solicitud de pago
  */
  self.enviar_solicitud = function() {

    if (self.mes !== undefined && self.anio !== undefined) {
      //Petición para obtener id de estado pago mensual
      administrativaRequest.get("estado_pago_mensual", $.param({
          query: "CodigoAbreviacion:CD",
          limit: 0
        })).then(function (response) {
        //Variable que contiene el Id del estado pago mensual
        var id_estado = response.data[0].Id;
      //Se arma elemento JSON para la solicitud
      var pago_mensual = {
        CargoResponsable: "CONTRATISTA",
        EstadoPagoMensual: { Id: id_estado},
        FechaModificacion: new Date(),
        Mes: self.mes,
        Ano: self.anio,
        NumeroContrato: self.contrato.NumeroContrato,
        Persona: self.Documento,
        Responsable: self.Documento,
        VigenciaContrato: parseInt(self.contrato.Vigencia)
      };


      administrativaRequest.get("pago_mensual", $.param({
        query: "NumeroContrato:" + self.contrato.NumeroContrato +
          ",VigenciaContrato:" + self.contrato.Vigencia +
          ",Mes:" + self.mes +
          ",Ano:" + self.anio,
        limit: 0
      })).then(function(response) {

        if (response.data == null) {

          administrativaRequest.post("pago_mensual", pago_mensual).then(function(response) {
            swal(
              'Solicitud registrada',
              'Por favor cargue los soportes correspondientes',
              'success'
            )

            self.contrato = {};
            self.mes = {};
            self.anio = {};

          });

        } else {

          swal(
            'Error',
            'Ya existe una solicitud de pago para el año y mes dados',
            'error'
          );

        }

      });

    });
  }else {
      swal(
        'Error',
        'Debe seleccionar un mes y un año',
        'error'
      );
    }

  };

  /*
    Función para cargar los soportes
  */
  self.cargar_soportes = function(contrato) {

      self.seleccionado = false;
      self.gridOptions2.data = [];
      self.contrato = contrato;
      //self.obtener_informacion_coordinador(self.contrato.IdDependencia);
      administrativaRequest.get("pago_mensual", $.param({
        query: "NumeroContrato:" + self.contrato.NumeroContrato + ",VigenciaContrato:" + self.contrato.Vigencia,
        limit: 0
      })).then(function(response) {

        contratoRequest.get('contrato', self.contrato.NumeroContrato + '/' + self.contrato.Vigencia).then(function(response_ce) {

          self.tipo_contrato = response_ce.data.contrato.tipo_contrato;

          console.log(self.tipo_contrato);

          administrativaRequest.get("item_informe_tipo_contrato", $.param({
            query: "TipoContrato:" + self.tipo_contrato,
            limit: 0
          })).then(function(response_iitc) {

            self.items = response_iitc.data;

          });

        });

        self.gridOptions2.data = response.data;

      });
    };

    // self.obtener_informacion_coordinador = function(IdDependencia){
    //   adminMidRequest.get('aprobacion_pago/informacion_coordinador/'+ IdDependencia)
    //   .then(function(response){
    //     self.informacion = response.data;
    //     self.informacion_coordinador = self.informacion.carreraSniesCollection.carreraSnies[0];
    //   })
    // };



  // /*
  //   Enviar solicitud de revisión de soportes a Supervisor
  // */
  // self.enviar_revision = function (solicitud) {
  //   swal({
  //     title: '¿Está seguro(a) de enviar a revisar los soportes por el coordinador?',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     cancelButtonText: 'Cancelar',
  //     confirmButtonText: 'Enviar'
  //   }).then(function () {
  //
  //     var nombre_docs = solicitud.VigenciaContrato + solicitud.NumeroContrato + solicitud.Persona + solicitud.Mes + solicitud.Ano;
  //
  //   //  administrativaRequest.get('soporte_pago_mensual', $.param({
  //   //    query: "PagoMensual:" + solicitud.Id,
  //   //    limit: 0
  //   //  })).then(function(responseVal){
  //
  //   self.obtener_doc(solicitud);
  //
  //
  //       if(self.documentos!== null){
  //         solicitud.EstadoPagoMensual = {"Id":1};
  //         solicitud.Responsable = self.informacion_coordinador.numero_documento_coordinador;
  //         solicitud.CargoResponsable = "COORDINADOR " + self.contrato.Dependencia;
  //         solicitud.CargoResponsable = solicitud.CargoResponsable.substring(0,69);
  //         administrativaRequest.put('pago_mensual', solicitud.Id, solicitud).
  //         then(function(response){
  //           swal(
  //             'Solicitud enviada',
  //             'Su solicitud se encuentra a la espera de revisión',
  //             'success'
  //           )
  //         })
  //         self.cargar_soportes(self.contrato);
  //
  //
  //       self.gridApi2.core.refresh();
  //
  //     }else{
  //       swal(
  //         'Error',
  //         'No puede enviar a revisión sin cargar algún documento',
  //         'error'
  //       )
  //     }//else
  //         //    });
  //   });
  //
  //
  //
  // };
  //

//
  /*
    Función para cargar los documentos a la carpeta  destino
  */
  self.cargarDocumento = function(nombre, descripcion, documento, callback) {
    var defered = $q.defer();
    var promise = defered.promise;

    nuxeo.operation('Document.Create')
      .params({
        type: 'File',
        name: nombre,
        properties: 'dc:title=' + nombre + ' \ndc:description=' + descripcion
      })
      .input('/default-domain/workspaces/Titán')
      .execute()
      .then(function(doc) {
        var nuxeoBlob = new Nuxeo.Blob({
          content: documento
        });
        nuxeo.batchUpload()
          .upload(nuxeoBlob)
          .then(function(res) {
            return nuxeo.operation('Blob.AttachOnDocument')
              .param('document', doc.uid)
              .input(res.blob)
              .execute();
          })
          .then(function() {
            return nuxeo.repository().fetch(doc.uid, {
              schemas: ['dublincore', 'file']
            });
          })
          .then(function(doc) {
            var url = doc.uid;
            callback(url);
            defered.resolve(url);
          })
          .catch(function(error) {
            throw error;
            defered.reject(error)
          });
      })
      .catch(function(error) {
        throw error;
        defered.reject(error)
      });

    return promise;
  };


  /*
    Función que permite cargar un documentos
  */
  self.subir_documento = function() {

      var nombre_doc = self.contrato.Vigencia + self.contrato.NumeroContrato + self.Documento + self.fila_seleccionada.Mes + self.fila_seleccionada.Ano;
      //Si seleccionan el check de archivo
      if (self.archivo) {
        //Condicional del item y del file model
        if (self.fileModel!== undefined && self.item!==undefined) {
        self.mostrar_boton= false;
        var descripcion = self.item.ItemInforme.Nombre;
        var aux = self.cargarDocumento(nombre_doc, descripcion, self.fileModel, function(url) {
          //Objeto documento
          var date = new Date();
          date = moment(date).format('DD_MMM_YYYY_HH:mm:ss');
          //var now = date
          self.objeto_documento = {
            "Nombre": nombre_doc,
            "Descripcion": descripcion,
            "TipoDocumento": {
              "Id": 3
            },
            "Contenido": JSON.stringify({
              "NombreArchivo": self.fileModel.name,
              "FechaCreacion": date,
              "Tipo": "Archivo",
              "IdNuxeo": url,
              "Observaciones": self.observaciones
            }),
            "Activo": true
          };

          //Post a la tabla documento del core
          coreRequest.post('documento', self.objeto_documento)
            .then(function(response) {
              self.id_documento = response.data.Id;

              //Objeto soporte_pago_mensual
              self.objeto_soporte = {
                "PagoMensual": {
                  "Id": self.fila_seleccionada.Id
                },
                "Documento": self.id_documento,
                "ItemInformeTipoContrato": {
                  "Id": self.item.Id
                },
                "Aprobado": false
              };

              //Post a la tabla soporte documento
              administrativaRequest.post('soporte_pago_mensual', self.objeto_soporte)
                .then(function(response) {
                  //Bandera de validacion
                  swal(
                    'Documento guardado',
                    'Se ha guardado el documento en el repositorio',
                    'success'
                  );
                  self.item = undefined;
                  self.fileModel = undefined;
                  self.mostrar_boton= true;

                });
            });
        });

      } else {

        swal(
          'Error',
          'Debe subir un archivo y seleccionar un item',
          'error'
        );

        self.mostrar_boton= true;

      }
  //    Si selecciona el link
      } else if (self.link) {
        if (self.enlace!== undefined && self.item!==undefined) {
          self.mostrar_boton= false;

          var descripcion = self.item.ItemInforme.Nombre;
        //Objeto documento
        self.objeto_documento = {
          "Nombre": nombre_doc,
          "Descripcion": descripcion,
          "TipoDocumento": {
            "Id": 3
          },
          "Contenido": JSON.stringify({
            "Tipo": "Enlace",
            "Enlace": self.enlace,
            "Observaciones": self.observaciones
          }),
          "Activo": true
        };
        //Post a la tabla documento del core
        coreRequest.post('documento', self.objeto_documento)
          .then(function(response) {
            self.id_documento = response.data.Id;

            //Objeto soporte_pago_mensual
            self.objeto_soporte = {
              "PagoMensual": {
                "Id": self.fila_seleccionada.Id
              },
              "Documento": self.id_documento,
              "ItemInformeTipoContrato": {
                "Id": self.item.Id
              },
              "Aprobado": false
            };

            //Post a la tabla soporte documento
            administrativaRequest.post('soporte_pago_mensual', self.objeto_soporte)
              .then(function(response) {
                //Bandera de validacion
                swal(
                  'Enlace guardado',
                  'Se ha guardado el enlace',
                  'success'
                );
                self.enlace = undefined;
                self.item = undefined;
                self.mostrar_boton= true;

               });
          });

        }else{

          swal(
            'Error',
            'Debe copiar el enlace y seleccionar un item',
            'error'
          );

          self.mostrar_boton= true;

        }
      }
      self.objeto_documento={};

    };

    self.cambiarCheckArchivo = function() {
      if (self.archivo) {
        self.link = false;
      }
    };

    self.cambiarCheckLink = function() {
      if (self.link) {
        self.archivo = false;
      }
    };
//
//   /*
//     Función que permite obtener un documento de nuxeo por el Id
//   */
//   self.getDocumento = function(docid){
//    nuxeo.header('X-NXDocumentProperties', '*');
//
//    self.obtenerDoc = function () {
//      var defered = $q.defer();
//
//      nuxeo.request('/id/'+docid)
//          .get()
//          .then(function(response) {
//            self.doc=response;
//            var aux=response.get('file:content');
//            self.document=response;
//            defered.resolve(response);
//          })
//          .catch(function(error){
//              defered.reject(error)
//          });
//      return defered.promise;
//    };
//
//    self.obtenerFetch = function (doc) {
//      var defered = $q.defer();
//
//      doc.fetchBlob()
//        .then(function(res) {
//          defered.resolve(res.blob());
//
//        })
//        .catch(function(error){
//              defered.reject(error)
//          });
//      return defered.promise;
//    };
//
//      self.obtenerDoc().then(function(){
//
//         self.obtenerFetch(self.document).then(function(r){
//             self.blob=r;
//             var fileURL = URL.createObjectURL(self.blob);
//             self.content = $sce.trustAsResourceUrl(fileURL);
//             $window.open(fileURL, 'Soporte Cumplido', 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900');
//          });
//      });
//    };
//
//    /*
//     Función que obtiene los documentos relacionados a las solicitudes
//    */
//    self.obtener_doc = function (fila){
//      self.fila_sol_pago = fila;
//      var nombre_docs = self.contrato.Vigencia + self.contrato.NumeroVinculacion + self.Documento + self.fila_sol_pago.Mes + self.fila_sol_pago.Ano;
//      coreRequest.get('documento', $.param ({
//       query: "Nombre:" + nombre_docs + ",Activo:true",
//       limit:0
//     })).then(function(response){
//       self.documentos = response.data;
//       angular.forEach(self.documentos, function(value) {
//         self.descripcion_doc = value.Descripcion;
//         value.Contenido = JSON.parse(value.Contenido);
//
//         if (value.Contenido.Tipo === "Enlace") {
//             value.Contenido.NombreArchivo = value.Contenido.Tipo;
//         };
//       });
//     })
//   };
//
//   /*
//     Función para visualizar enlace
//   */
//   self.visualizar_enlace = function (url){
//     $window.open(url);
//   };
//
//
//   /*
//     Función para "borrar" un documento
//   */
//   self.borrar_doc = function(){
//
//    var documento = self.doc;
//     /*  swal({
//         title: '¿Está seguro(a) de eliminar el soporte?',
//         text: "No podrá revertir esta acción",
//         type: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         cancelButtonText: 'Cancelar',
//         confirmButtonText: 'Aceptar'
//       }).then(function () {*/
//        documento.Contenido = JSON.stringify(documento.Contenido)
//        documento.Activo = false;
//        coreRequest.put('documento', documento.Id, documento).
//        then(function(response){
//             self.obtener_doc(self.fila_sol_pago);
//       });
//
//     //  });
//
//
//   };
//
//   self.set_doc = function (doc){
//
//     self.doc = doc;
//   }
//




  });
