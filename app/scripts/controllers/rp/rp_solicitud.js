'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:RpSolicitudCtrl
 * @description
 * # RpSolicitudCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('RpSolicitudCtrl', function(coreRequest,resolucion,$window,contrato,disponibilidad,administrativaRequest,amazonAdministrativaRequest,$scope,financieraRequest,$translate) {
    var self = this;

    $scope.rubroVacio=false;
    self.resolucion = resolucion;
    self.contrato = contrato;
    self.boton_registrar=false;
    self.apropiacion_flag=true;
    self.CurrentDate = new Date();
    self.gridOptions_cdp = {};
    self.compromiso = null;
    self.rubros_seleccionados = [];
    self.rubros_select = [];
    self.responsable = "";
    self.masivo_seleccion = false;
    self.solicitudcdp_bool = false;
    self.solicitudresolucion_bool=false;
    self.disponibilidad = disponibilidad;
    var monto = 0;
    var solicitudes = [];
    var respuestas_solicitudes = [];
    var Solicitud_rp;
    var resolucion_estado ={};

    //si no hay contratos devuelve a la anterior interfaz
    if(self.contrato.length === 0){
      swal("Alerta", $translate.instant('NO_HAY_DATOS_REDIRIGIR'), "error").then(function() {
        $window.location.href = '#/rp_solicitud_personas';
      });
    }

    //solicitud por resolucion
    if(self.disponibilidad.length > 0 && self.resolucion.length > 0){    
      self.solicitudresolucion_bool=true;
      // si es una solicitud de rp por resolucion se escoje automaticamente la primera y unica disponibilidad apropiacion
      
    financieraRequest.get('disponibilidad_apropiacion','limit=-1&query=Disponibilidad.Id:'+self.disponibilidad[0].Id).then(function(response) {
      self.rubros_seleccionados.push(response.data[0]);
      });
    }

    //solicitud por cdp
    else if(self.disponibilidad.length >0 && self.resolucion.length === 0){
      self.solicitudcdp_bool = true;

      financieraRequest.get('disponibilidad_apropiacion','limit=-1&query=Disponibilidad.Id:'+self.disponibilidad[0].Id).then(function(response) {
        $scope.rubros = response.data;
        self.gridOptions_rubros.data = response.data;
        angular.forEach($scope.rubros, function(data){
            var rp = {
              Disponibilidad : data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
              Apropiacion : data.Apropiacion
            };
            financieraRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
              data.Saldo  = response.data;
            });
  
          });
      });

    } else{
      //si la disponibilidad debe escogerse en esta interfaz
      //////grid cdp//////
      self.solicitudcdp_bool = false;
      self.solicitudresolucion_bool=false;
      self.gridOptions_cdp = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableFiltering: true,
        multiSelect: false,
        columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia',   displayName:$translate.instant('VIGENCIA')},
        {field: 'NumeroDisponibilidad',   width:'10%',displayName:$translate.instant('ID')},
        {field: 'Estado.Descripcion',   displayName: $translate.instant('DESCRIPCION')},
        {field: 'Solicitud.Id',   displayName: $translate.instant('SOLICITUD')},
      ]};

      amazonAdministrativaRequest.get('contrato_disponibilidad','query=NumeroContrato:'+self.contrato[0].Numero_contrato+',Vigencia:'+self.contrato[0].Vigencia_contrato).then(function(response) {
        financieraRequest.get('disponibilidad','limit=-1&query=Estado.Nombre__not_in:Agotado,NumeroDisponibilidad:'+response.data[0].NumeroCdp+',Vigencia:'+response.data[0].VigenciaCdp).then(function(response) {
          self.gridOptions_cdp.data = response.data;
          angular.forEach(self.gridOptions_cdp.data, function(data){
     
            administrativaRequest.get('solicitud_disponibilidad','query=Id:'+data.Solicitud).then(function(response) {
              data.Solicitud = response.data[0];
            });
         });
      });
    });

    self.gridOptions_cdp.onRegisterApi = function(gridApiCdp){

    gridApiCdp.selection.on.rowSelectionChanged($scope,function(row){

     self.rubros_seleccionados = [];
     self.disponibilidad.push(row.entity);
     var CdpId = self.disponibilidad[0].Solicitud.Id;
     administrativaRequest.get('solicitud_disponibilidad','query=Id:'+CdpId).then(function(response){
      $scope.necesidad=response.data[0];
     });
 
     amazonAdministrativaRequest.get('informacion_persona_natural', 'query=Id:'+self.disponibilidad[0].Responsable).then(function(response) {
       if(response.data !== null){
       self.responsable = response.data[0];
     }else{
         self.responsable = "";
     }
     });
 
     financieraRequest.get('disponibilidad_apropiacion','limit=-1&query=Disponibilidad.Id:'+self.disponibilidad[0].Id).then(function(response) {
       $scope.rubros = response.data;
       self.gridOptions_rubros.data = response.data;
       angular.forEach($scope.rubros, function(data){
           var rp = {
             Disponibilidad : data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
             Apropiacion : data.Apropiacion
           };
           financieraRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
             data.Saldo  = response.data;
           });
 
         });
     });
   });
 };
 //////grid cdp//////
    }

    self.dep_ned = {
      JefeDependenciaSolicitante: 18
    };

    coreRequest.get('jefe_dependencia/'+self.dep_ned.JefeDependenciaSolicitante, ''
    ).then(function(response) {
      self.dependencia_solicitante_data = response.data;
    });


    if(self.solicitudresolucion_bool===true){
      self.gridOptions_contratos = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableFiltering: true,
   
     columnDefs : [
       {field: 'Id',             visible : false},
       {field: 'Numero_contrato',   width:'15%',displayName: $translate.instant('VINCULACION')},
       {field: 'Vigencia_contrato',  width:'15%' ,displayName: $translate.instant('VIGENCIA')},
       {field: 'Nombre_completo', width:'40%'  ,displayName:$translate.instant('NOMBRE')},
       {field: 'Id', width:'15%'  ,displayName: $translate.instant('DOCUMENTO')},
       {field: 'Valor_contrato', width:'15%', cellTemplate: '<div align="right">{{row.entity.Valor_contrato | currency:undefined:0 }}</div>',displayName: $translate.instant('VALOR')}
     ]
    };
    }else{
      self.gridOptions_contratos = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableFiltering: true,
   
     columnDefs : [
       {field: 'Id',             visible : false},
       {field: 'Numero_contrato',   width:'15%',displayName: $translate.instant('CONTRATO')},
       {field: 'Vigencia_contrato',  width:'16%' ,displayName: $translate.instant('VIGENCIA')},
       {field: 'Nombre_completo', width:'42%'  ,displayName:$translate.instant('NOMBRE')},
       {field: 'Id', width:'15%'  ,displayName: $translate.instant('DOCUMENTO')},
       {field: 'Valor_contrato', width:'12%', cellTemplate: '<div align="right">{{row.entity.Valor_contrato | currency:undefined:0 }}</div>',displayName: $translate.instant('VALOR')}
     ]
    };
    }


 self.gridOptions_contratos.data = self.contrato;

    self.gridOptions_compromiso = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      columnDefs: [{
          field: 'Id',
          displayName: $translate.instant('NUMERO'),
          width: '20%'
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '20%'
        },
        {
          field: 'Objeto',
          displayName: $translate.instant('OBJETO'),
          width: '60%'
        }
      ],
      onRegisterApi: function(gridApi) {
        self.gridApi = gridApi;

      }
    };

    self.gridOptions_rubros = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      enableVerticalScrollbar : 0,
      enableHorizontalScrollbar : 0,
      columnDefs: [{
          field: 'Apropiacion.Rubro.Codigo',
          displayName: $translate.instant('CODIGO'),
          width: "25%",
        },
        {
          field: 'Apropiacion.Rubro.Nombre',
          displayName: $translate.instant('NOMBRE'),
          width: "50%",
        },
        {
          field: 'FuenteFinanciamiento.Descripcion',
          displayName: $translate.instant('FUENTE_FINANCIAMIENTO'),
          width: "25%",
        }
      ],
    };

    self.gridOptions_rubros.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        self.selectRubro = row.entity;
      });
    };

    $scope.getTableStyle= function() {
      var rowHeight=30;
      var headerHeight=45;
      return {
      height: (self.gridOptions_rubros.data.length * rowHeight + headerHeight) + "px"
      };
    };

    financieraRequest.get('compromiso', 'limit=0').then(function(response) {
      self.gridOptions_compromiso.data = response.data;
    });

    self.proveedor = {

    };

    self.rubros = {

    };
    self.rubroSeleccionado = {

    };


    if (self.disponibilidad.Id !== null) {
      for (var i = 0; i < self.rubros.length; i++) {
        var saldo = self.DescripcionRubro(rubros[i].Id);
        rubros[i].saldo = saldo;
      }
    }

    self.agregarRubro = function(id) {
      var rubro_seleccionado = self.selectRubro;
      var bandera = true;

      $scope.seleccionado= rubro_seleccionado;
      if(rubro_seleccionado!=undefined){
        for (var i = 0; i < self.rubros_seleccionados.length; i++) {
          if (self.rubros_seleccionados[i].Id === rubro_seleccionado.Id) {
            bandera = false;
          }
        }
        if(bandera === true){
          self.rubros_seleccionados.push(rubro_seleccionado);
        }else{
          swal("Alertas", "Este rubro ya fue agregado", "error");
        }
      }else{
        swal("Alertas", "Debe seleccionar un rubro para agregar", "error");
      }
    }

    self.quitarRubro = function(id) {

      for (var i = 0; i < self.rubros_select.length; i++) {
        if (self.rubros_select[i].Id === id) {

          self.rubros.push(self.rubros_select[i]);
          self.rubros_select.splice(i, 1);
        }
      }
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {

        if (self.rubros_seleccionados[i].Id === id) {
          self.rubros_seleccionados.splice(i, 1)
        }
      }
    }

    self.DescripcionRubro = function(id) {
      var rubro;
      for (var i = 0; i < self.rubros.length; i++) {

        if (self.rubros[i].Id === id) {
          rubro = self.rubros[i];
        }
      }
      return rubro
    };

    $scope.saldosValor = function() {
      $scope.banderaRubro = true;
      //si es una solicitud por resolucion se hara la comparacion con los valores de los contratos
      if(self.resolucion.Id !== "undefined"){
        angular.forEach(self.contrato, function(v) {
          if (v.Valor < v.Valor_contrato || v.Valor_contrato===0 || isNaN(v.Valor_contrato) || v.Valor_contrato === undefined) {
            $scope.banderaRubro = false;
          }
        });

      //este caso es cuando se ingresan los valores en la interfaz  
      }else{
        angular.forEach(self.rubros_seleccionados, function(v) {
          if (v.Valor < v.ValorAsignado || v.ValorAsignado===0 || isNaN(v.ValorAsignado) || v.ValorAsignado === undefined) {
            $scope.banderaRubro = false;
          }
        });
      }
    };

    self.Registrar = function() {
      $scope.saldosValor();
      self.alerta_registro_rp = ["No se pudo solicitar el rp"];
      if (self.disponibilidad.NumeroDisponibilidad === null) {
        swal("Alertas", "Debe seleccionar el CDP objetivo del RP", "error");
        self.alerta_registro_rp = ["Debe seleccionar el CDP objetivo del RP"];
      } else if (self.rubros_seleccionados.length === 0) {
        swal("Alertas", "Debe seleccionar el Rubro objetivo del RP", "error");
        self.alerta_registro_rp = ["Debe seleccionar el Rubro objetivo del RP"];
      } else if (self.compromiso === null) {
        swal("Alertas", "Debe seleccionar el Compromiso del RP", "error");
        self.alerta_registro_rp = ["Debe seleccionar el Compromiso del RP"];
      } else if ($scope.banderaRubro === false) {
        swal({
          title: 'Error!',
          text: 'Valor incorrecto del registro presupuestal',
          type: 'error',
          confirmButtonText: 'Corregir'
        });
      }
      else {
        self.boton_registrar=true;
        for (var i = 0; i < self.rubros_seleccionados.length; i++) {
          self.rubros_seleccionados[i].ValorAsignado = parseFloat(self.rubros_seleccionados[i].ValorAsignado);
        }

//se envian todas las solicitudes de rp
if(self.contrato.length>1){
  self.masivo_seleccion=true;
}else{
  self.masivo_seleccion=false;
}        
        if(self.solicitudresolucion_bool===true){
        self.disponibilidad=self.disponibilidad[0];
        }
        for(var x=0;x<self.contrato.length;x++){
          Solicitud_rp = {};
          //se agrega el campo de monto para que se pueda iterar en la peticion de disponibilidad_apropiacion_solicitud_rp
          Solicitud_rp = {
            Vigencia: 2017,
            FechaSolicitud: self.CurrentDate,
            Cdp: self.disponibilidad.Id,
            Expedida: false,
            NumeroContrato: self.contrato[x].Numero_contrato,
            VigenciaContrato: self.contrato[x].Vigencia_contrato,
            Monto:parseInt(self.contrato[x].Valor_contrato),
            Compromiso: self.compromiso.Id,
            Justificacion_rechazo: 0,
            Masivo : self.masivo_seleccion
          };
          solicitudes.push(Solicitud_rp);
        }
        angular.forEach(solicitudes, function(solicitud_rp) {
          administrativaRequest.post('solicitud_rp', solicitud_rp).then(function(response) {
            respuestas_solicitudes.push(response.data);
            for (var i = 0; i < self.rubros_seleccionados.length; i++) {
              var Disponibilidad_apropiacion_solicitud_rp = {
                DisponibilidadApropiacion: self.rubros_seleccionados[i].Id,
                SolicitudRp :{
                  Id: response.data.Id,
                },
                //este campo debe generalizarse para utilzarlo tambien con los filtros de contrato y cdp
               // Monto: self.rubros_seleccionados[i].ValorAsignado,
               Monto:solicitud_rp.Monto
              };
              administrativaRequest.post('disponibilidad_apropiacion_solicitud_rp', Disponibilidad_apropiacion_solicitud_rp).then(function(responseD) {
                var imprimir = "<h2>Solicitudes creadas correctamente !</h2>"; 
                imprimir=imprimir + "<div style='height:150px;overflow:auto'><table class='col-md-8 col-md-offset-2'><tr><td style='height:20px;width:120px'><b>Numero solicitud rp</b></td><td style='height:10px;width:80px'><b>Numero contrato</b></td><td style='height:10px;width:80px'><b>Numero vigencia</b></td></tr>";
                for(var x=0;x<respuestas_solicitudes.length;x++){
                  
                  imprimir=imprimir+"<tr style='height:20px'><td>"+respuestas_solicitudes[x].Id+
                  "</td><td>"+respuestas_solicitudes[x].NumeroContrato+
                  "</td><td>"+respuestas_solicitudes[x].VigenciaContrato;
                };
                imprimir=imprimir+"</td></tr></table></div>";
                swal({
                  html:imprimir,
                  type: "success",
                  showCancelButton: true,
                  confirmButtonColor: "#449D44",
                  cancelButtonColor: "#C9302C",
                  confirmButtonText: $translate.instant('VOLVER_CONTRATOS'),
                  cancelButtonText: $translate.instant('SALIR'),
                }).then(function() {
                  //si da click en ir a contratistas
                  $window.location.href = '#/rp_solicitud_personas';
                }, function(dismiss) {
    
                  if (dismiss === 'cancel') {
                    //si da click en Salir
                    $window.location.href = '#';
                  }
                });
              });
            }
          });

        });
        //esta peticion debe quedar fuera del foreach para que solo se guarde un registro en resolucion estado
        resolucion_estado ={
          FechaRegistro:self.CurrentDate,
          Usuario:"",
          Estado:{
            Id:4,
          },
          Resolucion:self.resolucion
        };
        amazonAdministrativaRequest.post('resolucion_estado',resolucion_estado).then(function(response) {
          
        });
      }
    };

    self.gridOptions_compromiso.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        self.compromiso = row.entity;
      });
    };
  });
