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
    var disponibilidad_flag=true;
    self.resolucion = resolucion[0];
    console.log(self.resolucion);
    self.contrato = contrato;
    self.disponibilidad = "";
    $scope.rubroVacio=false;
    self.CurrentDate = new Date();
    var mes=self.CurrentDate.getMonth()+1;
    var dia=self.CurrentDate.getDay();
    var ano=self.CurrentDate.getFullYear();
    self.gridOptions_cdp = {};
    self.compromiso = null;
    self.rubros_seleccionados = [];
    self.rubros_select = [];
    self.responsable = "";
    self.masivo_seleccion = false;
    var Solicitud_id;
    var solicitudes = [];
    var respuestas_solicitudes = [];
    var Solicitud_rp;
    var resolucion_estado ={};

    if(self.contrato.length === 0){
      swal("Alerta", $translate.instant('NO_HAY_DATOS_REDIRIGIR'), "error").then(function() {
        //si da click en ir a contratistas
        $window.location.href = '#/rp_solicitud_personas';
      });
    }

    if(disponibilidad.length > 0){
      console.log(disponibilidad[0]);
      self.disponibilidad = disponibilidad[0];

      disponibilidad_flag=false;
       
     financieraRequest.get('disponibilidad_apropiacion','limit=-1&query=Disponibilidad.Id:'+self.disponibilidad.Id).then(function(response) {
      
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
      console.log(self.disponibilidad);
    }else{
      //////grid cdp//////
 
    self.gridOptions_cdp.onRegisterApi = function(gridApi){
   //set gridApi on scope
   self.gridApi = gridApi;
   gridApi.selection.on.rowSelectionChanged($scope,function(row){
     self.rubros_seleccionados = [];
     self.disponibilidad = row.entity;
     var CdpId = self.disponibilidad.Solicitud.Id;
     administrativaRequest.get('solicitud_disponibilidad','query=Id:'+CdpId).then(function(response){
       $scope.necesidad=response.data[0];
     });
 
     amazonAdministrativaRequest.get('informacion_persona_natural', 'query=Id:'+self.disponibilidad.Responsable).then(function(response) {
       if(response.data !== null){
       self.responsable = response.data[0];
     }else{
         self.responsable = "";
     }
     });
 
     financieraRequest.get('disponibilidad_apropiacion','limit=-1&query=Disponibilidad.Id:'+self.disponibilidad.Id).then(function(response) {
 
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

    self.gridOptions_cdp = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      multiSelect: false,
      columnDefs : [
      {field: 'Id',             visible : false},
      {field: 'Vigencia',   displayName: 'Vigencia'},
      {field: 'NumeroDisponibilidad',   width:'10%',displayName: 'Id'},
      {field: 'Estado.Descripcion',   displayName: 'Descripcion'},
      {field: 'Solicitud.Necesidad',   displayName: 'Necesidad'},
    ]};
      financieraRequest.get('disponibilidad','limit=-1&query=Estado.Nombre__not_in:Agotado').then(function(response) {
        self.gridOptions_cdp.data = response.data;
        angular.forEach(self.gridOptions_cdp.data, function(data){
   
       administrativaRequest.get('solicitud_disponibilidad','query=Id:'+data.Solicitud).then(function(response) {
         data.Solicitud = response.data[0];
     });
 
       });
 
    });

    self.gridOptions_contratos = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
 
   columnDefs : [
     {field: 'Id',             visible : false},
     {field: 'Numero_contrato',   width:'15%',displayName: $translate.instant('CONTRATO')},
     {field: 'Vigencia_contrato',  width:'15%' ,displayName: $translate.instant('VIGENCIA')},
     {field: 'Nombre_completo', width:'50%'  ,displayName:$translate.instant('NOMBRE')},
     {field: 'Id', width:'20%'  ,displayName: $translate.instant('DOCUMENTO')},
   ]
 
 };

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
      angular.forEach(self.rubros_seleccionados, function(v) {
        if (v.Valor < v.ValorAsignado || v.ValorAsignado===0 || isNaN(v.ValorAsignado) || v.ValorAsignado === undefined) {
          $scope.banderaRubro = false;
        }
      });
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

        for (var i = 0; i < self.rubros_seleccionados.length; i++) {
          self.rubros_seleccionados[i].ValorAsignado = parseFloat(self.rubros_seleccionados[i].ValorAsignado);
        }

//se envian todas las solicitudes de rp
if(self.contrato.length>1){
  self.masivo_seleccion=true;
}else{
  self.masivo_seleccion=false;
}        
        for(var x=0;x<self.contrato.length;x++){
          Solicitud_rp = {};
          Solicitud_rp = {
            Vigencia: 2017,
            FechaSolicitud: self.CurrentDate,
            Cdp: self.disponibilidad.Id,
            Expedida: false,
            NumeroContrato: self.contrato[x].Numero_contrato,
            VigenciaContrato: self.contrato[x].Vigencia_contrato,
            Compromiso: self.compromiso.Id,
            Justificacion_rechazo: 0,
            Masivo : self.masivo_seleccion
          };
          console.log(Solicitud_rp);
          solicitudes.push(Solicitud_rp);
        }

        angular.forEach(solicitudes, function(solicitud_rp) {
          administrativaRequest.post('solicitud_rp', solicitud_rp).then(function(response) {
            Solicitud_id = response.data;
            respuestas_solicitudes.push(Solicitud_id);
            console.log(respuestas_solicitudes);
            for (var i = 0; i < self.rubros_seleccionados.length; i++) {
              var Disponibilidad_apropiacion_solicitud_rp = {
                DisponibilidadApropiacion: self.rubros_seleccionados[i].Id,
                SolicitudRp : Solicitud_id,
                Monto: self.rubros_seleccionados[i].ValorAsignado,
              };
              administrativaRequest.post('disponibilidad_apropiacion_solicitud_rp', Disponibilidad_apropiacion_solicitud_rp).then(function(responseD) {


              if(i === self.rubros_seleccionados.length){
                resolucion_estado ={
                  FechaRegistro:self.CurrentDate,
                  Usuario:"",
                  Estado:{
                    Id:4,
                  },
                  Resolucion:self.resolucion
                };
                console.log(resolucion_estado);
                amazonAdministrativaRequest.post('resolucion_estado',resolucion_estado).then(function(response) {
                  
                });
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
              }
              });
            }
          });

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
