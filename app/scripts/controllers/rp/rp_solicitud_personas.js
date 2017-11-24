'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:RpSolicitudPersonasCtrl
 * @description
 * # RpSolicitudPersonasCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
.factory("contrato",function(){
      return {};
})
.controller('RpSolicitudPersonasCtrl', function($window, administrativaRequest,$scope, contrato,resolucion,financieraRequest,amazonAdministrativaRequest, adminMidRequest,$translate,disponibilidad) {
    var self = this;
    var query;
    var seleccion;
    var contrato_unidad={};
    var resoluciones= [];
    var contratos_disponibilidades = [];
    self.boton_solicitar = false;
    self.resolucion = resolucion;
    self.contrato = contrato;
    self.disponibilidad = disponibilidad;
    $scope.vigenciaModel = null;
    $scope.vigencias_resoluciones=null;
    self.longitud_grid = 0;
    $scope.contrato_int = $translate.instant('CONTRATO');
    $scope.vigencia_contrato = $translate.instant('VIGENCIA_CONTRATO');
    $scope.contratista_nombre = $translate.instant('NOMBRE_CONTRATISTA');
    $scope.contratista_documento = $translate.instant('DOCUMENTO_CONTRATISTA');
    $scope.valor_contrato = $translate.instant('VALOR');
    self.resolucion_bool=false;
    self.cdp_bool=false;
    self.contrato_bool = false;
    $scope.radioB=0;
    self.gridAp = null;
    self.gridApiCDP = null;
    self.gridApip = null;
    self.gridApiResolucion = null;
    self.resolucionNumero = "";
    self.resolucionId = "";
    self.tipoResolucion = "";

    self.disponibilidad.splice(0,self.disponibilidad.length);
    self.resolucion.splice(0,self.resolucion.length);

    //grid modal
    self.gridOptionsResolucionPersonas ={
      enableSelectAll: false,
      enableRowHeaderSelection: false,
      enableSorting: true,
      enableFiltering: true,
      enableRowSelection:false,
      multiSelect: false,
      columnDefs: [

        {field: 'Id',             visible : false},
        {field: 'Numero_contrato',   width:'14%',displayName: $translate.instant('VINCULACION'),},
        {field: 'Vigencia_contrato',  width:'12%' ,displayName: $translate.instant('VIGENCIA')},
        {field: 'Nombre_completo', width:'40%'  ,displayName:$translate.instant('NOMBRE')},
        {field: 'Id', width:'14%'  ,displayName: $translate.instant('DOCUMENTO')},
        {field: 'Valor_contrato', width:'20%', cellTemplate: '<div align="right">{{row.entity.Valor_contrato | currency:undefined:0 }}</div>',displayName: $translate.instant('VALOR')}
      ],
      onRegisterApi: function(gridApi) {
        self.gridApip = gridApi;
      }
    };

    //GRID CONTRATISTAS
    self.gridOptions = {
      enableSelectAll: false,
      enableRowHeaderSelection: false,
      enableSorting: true,
      enableFiltering: true,
      multiSelect: false,
      columnDefs: [{
          field: 'Id',
          displayName: $translate.instant('CONTRATO'),
          width: "15%",
          cellTemplate: '<div align="center">{{row.entity.Numero_contrato}}</div>'
        },
        {
          field: 'Vigencia_contrato',
          displayName: $translate.instant('VIGENCIA_CONTRATO'),
          visible: true,
          width: "15%",
        },
        {
          field: 'Nombre_completo',
          displayName: $translate.instant('NOMBRE_CONTRATISTA'),
          width: "30%"
        },
        {
          field: 'Id',
          displayName: $translate.instant('DOCUMENTO_CONTRATISTA'),
          cellTemplate: '<div align="center">{{row.entity.Id}}</div>',
          width: "20%",
        },
        {
          field: 'ContratoGeneral.ValorContrato',
          displayName: $translate.instant('VALOR'),
          cellTemplate: '<div align="right">{{row.entity.Valor_contrato | currency:undefined:0 }}</div>'
        },
      ],
      onRegisterApi: function(gridApi) {
        self.gridAp = gridApi;
      }
    };

    //<RESOLUCION GRID
    self.gridOptionsResolucion = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableSorting: true,
      enableFiltering: true,
      multiSelect: false,
      rowHeight: 40,
      columnDefs: [
        {
          field: 'Id',
          visible : false
        },
        {
          field: 'NumeroResolucion',
          displayName: $translate.instant('NUMERO_RESOLUCION'),
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
        },
        {
          field: 'IdTipoResolucion.NombreTipoResolucion',
          displayName: $translate.instant('TIPO_RESOLUCION'),
        },
        {
          field: 'FechaRegistro',
          displayName: $translate.instant('FECHA'),
          cellTemplate: '<div align="center">{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900" }}</div>'
        },
        {
          field:'Boton',
          displayName:$translate.instant('VER'),
          cellTemplate:'<a><span class="fa fa-eye" data-toggle="modal" data-target="#resolucionModal" ng-click="grid.appScope.rpSolicitudPersonas.setResolucion(row.entity)""></span></a>'
        }

      ],
      onRegisterApi: function(gridApi) {
        self.gridApiResolucion = gridApi;
      }
    };
    //RESOLUCION GRID>

    //<PROVEEDOR GRID
    self.gridOptionsProveedor = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableSorting: true,
      enableFiltering: true,
      multiSelect: false,
      columnDefs: [
        {
          field: 'Id',
          displayName: $translate.instant('ID'),
        },
        {
          field: 'NumDocumento',
          displayName: $translate.instant('NUMERO_DOCUMENTO'),
        },
        {
          field: 'Tipopersona',
          displayName: $translate.instant('TIPO_PERSONA'),
        },
        {
          field: 'NomProveedor',
          displayName: $translate.instant('NOMBRE_PROVEEDOR'),
          width: "50%",
        },
      ],
      onRegisterApi: function(gridApi) {
        self.gridApi = gridApi;
      }
    };

    //PROVEEDOR GRID>

    //CDP GRID para cargar los CDP hay que meter esto en una funcion
    
    self.gridOptions_cdp = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      multiSelect: false,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia',   displayName:$translate.instant('VIGENCIA'),width:'10%'},
        {field: 'NumeroDisponibilidad',   width:'10%',displayName:$translate.instant('ID'),width:'10%'},
        {field: 'Estado.Nombre',   displayName: $translate.instant('ESTADO'),width:'15%'},
        {field: 'Estado.Descripcion',   displayName: $translate.instant('DESCRIPCION'),width:'35%'},
        {field: 'Solicitud',   displayName: $translate.instant('SOLICITUD'),width:'10%'},
        {field: 'FechaRegistro',   displayName: $translate.instant('FECHA_REGISTRO'),width:'20%',
        cellTemplate: '<div align="center">{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900" }}</div>'},
    ],
    onRegisterApi: function(gridApi) {
      self.gridApiCDP = gridApi;
    }
    };

    //CDP GRID --

    //se busca de acuerdo al filtro seleccionado en la interfaz cdp,resolucion o contratos

    self.cargar_filtro = function(){
      var ultimo_estado;
      //si es filtro por contrato
      if ($scope.radioB === 1){
        self.resolucion_bool=false;
        self.cdp_bool=false;
        self.contrato_bool = true;

        amazonAdministrativaRequest.get('vigencia_contrato').then(function(response) {
          $scope.vigencias = response.data;
    
        //selecciona la vigencia actual
        var vigenciaActual=$scope.vigencias[0];
    
        amazonAdministrativaRequest.get('proveedor_contrato_persona/'+vigenciaActual).then(function(response) {
             self.gridOptions.data = response.data;
              self.longitud_grid = self.gridOptions.data.length;
            });
        });
      }
      
      //si es filtro por cdp
      if ($scope.radioB === 2){
        self.resolucion_bool=false;
        self.cdp_bool=true;
        self.contrato_bool = false;

        financieraRequest.get('disponibilidad','limit=-1&query=Estado.Nombre__not_in:Agotado').then(function(response) {
          self.gridOptions_cdp.data = response.data;
        });
      }

      //si es filtro por resolucion
      if ($scope.radioB === 3){

        amazonAdministrativaRequest.get('resolucion/vigencia_resolucion').then(function(response) {
          $scope.vigencias_resoluciones = response.data;
    
        //selecciona la vigencia actual
        var vigenciaActual=$scope.vigencias_resoluciones[0];
        var suma = 0;
        amazonAdministrativaRequest.get('resolucion/resolucion_por_estado/'+vigenciaActual+'/'+'/2',"").then(function(response) {
          self.gridOptionsResolucion.data=response.data;
            });
            
        });
        
        self.resolucion_bool=true;
        self.cdp_bool=false;
        self.contrato_bool = false;
      }

    };

    //se buscan los contratos por la vigencia seleccionada
    self.buscar_resoluciones_vigencia = function() {
      self.longitud_grid = 0;
      query = "";
      if ($scope.vigenciaModel !== undefined || $scope.vigenciaModel === null) {
        amazonAdministrativaRequest.get('proveedor_contrato_persona/'+$scope.vigenciaModel).then(function(response) {
         self.gridOptions.data = response.data;
          self.longitud_grid = self.gridOptions.data.length;
        });

      }
    };

    //se buscan los contratos por la vigencia seleccionada
    self.buscar_contratos_vigencia = function() {
      self.longitud_grid = 0;
      query = "";
      if ($scope.vigenciaModel !== undefined || $scope.vigenciaModel === null) {
        amazonAdministrativaRequest.get('proveedor_contrato_persona/'+$scope.vigenciaModel).then(function(response) {
         self.gridOptions.data = response.data;
          self.longitud_grid = self.gridOptions.data.length;
        });

      }
    };

    self.setResolucion= function(resolucion){
      self.gridOptionsResolucionPersonas.data=[];
      var vinculacion_docente = [];
      var contratistas = [];
      resoluciones = [];
      var cedula = "";
      var numContrato = "";
      var vigenciaContrato;
      //variables para mostrar en el modal
      self.resolucionId = resolucion.NumeroResolucion;
      self.resolucionVigencia = resolucion.Vigencia;
      //
      //peticion para traer los docentes asociados a una resolucion
      amazonAdministrativaRequest.get('vinculacion_docente',"limit=-1&query=IdResolucion.Id:"+resolucion.Id+",Estado:true").then(function(response) {
        if(response.data!=null){
        vinculacion_docente = response.data;
        //consulta para traer la informacion de las personas de los docentes asociados a una resolucion
        for(var x = 0;x<vinculacion_docente.length;x++){
          numContrato = vinculacion_docente[x].NumeroContrato;
          vigenciaContrato = vinculacion_docente[x].Vigencia;

          if(numContrato!=="" || vigenciaContrato!=="" || vigenciaContrato!==0){
            amazonAdministrativaRequest.get('proveedor_contrato_persona/'+numContrato+"/"+vigenciaContrato,"").then(function(response) { 
              if(response.data !== null){
                  resoluciones.push(response.data[0]);          
                }
              if(resoluciones.length===vinculacion_docente.length){
                self.gridOptionsResolucionPersonas.data=resoluciones;

              }
             });
          }

         };
        }
         
       });
           
           //self.gridOptionsResolucionPersonas.longitud_grid=self.gridOptionsResolucionPersonas.length;
    };

    self.mostrar_estadisticas = function() {
      var cedula;
      var numContrato;
      var vigenciaContrato;
      var contratistas = [];
      resoluciones = [];
      var vinculacion_docente = [];
      self.contrato.splice(0,self.contrato.length);
      self.resolucion.splice(0,self.resolucion.length);
     
      if($scope.radioB ===1){
        seleccion = self.gridAp.selection.getSelectedRows();
      }else if($scope.radioB ===2){
        seleccion = self.gridApiCDP.selection.getSelectedRows();
      }else if($scope.radioB ===3){
        seleccion = self.gridApiResolucion.selection.getSelectedRows();
      }

      if(seleccion.length===0){
        swal("Alertas", "Debe seleccionar un parametro para solicitar el registro presupuestal", "error");
      }else{
      self.boton_solicitar=true;  
      // si es solicitud por contrato
      if($scope.radioB ===1){
        
      for(var i=0;i<seleccion.length;i++){
        contrato_unidad = [];
        contrato_unidad.Numero_contrato = seleccion[i].Numero_contrato;
        contrato_unidad.Vigencia_contrato= seleccion[i].Vigencia_contrato;
        contrato_unidad.Id= seleccion[i].Id;
        contrato_unidad.Valor_contrato= seleccion[i].Valor_contrato;
        contrato_unidad.Nombre_completo= seleccion[i].Nombre_completo;
        contrato_unidad.Objeto_contrato= seleccion[i].Objeto_contrato;
        contrato_unidad.Fecha_registro= seleccion[i].Fecha_registro;
        self.contrato.push(contrato_unidad);  
      }
        self.saving = true;
        self.btnGenerartxt = "Generando...";
        self.saving = false;
        self.btnGenerartxt = "Generar";
         $window.location.href = '#/rp/rp_solicitud/';
    // si es solicitud por cdp
    }else if($scope.radioB ===2){
      self.disponibilidad.push(seleccion[0]);
      amazonAdministrativaRequest.get('contrato_disponibilidad',"query=NumeroCdp:"+self.disponibilidad[0].Id+",VigenciaCdp:"+self.disponibilidad[0].Vigencia).then(function(response) {
        contratos_disponibilidades= response.data;
        for(var x =0;x<contratos_disponibilidades.length;x++){
          amazonAdministrativaRequest.get('proveedor_contrato_persona/'+contratos_disponibilidades[x].NumeroContrato+"/"+contratos_disponibilidades[x].Vigencia,"").then(function(response) { 
            if(response.data !== null){
              self.contrato.push(response.data[0]); 
              if(contratos_disponibilidades.length===x){
                self.saving = true;
                self.btnGenerartxt = "Generando...";
                self.saving = false;
                self.btnGenerartxt = "Generar";
                $window.location.href = '#/rp/rp_solicitud/';
              }
            }
          });
        }
      });

    // si es solicitud por resolucion
    }else if($scope.radioB===3){
      self.resolucion.push(seleccion[0]);
        amazonAdministrativaRequest.get('vinculacion_docente',"limit=-1&query=IdResolucion.Id:"+seleccion[0].Id+",Estado:true").then(function(response) {
          if(response.data!==null){
          vinculacion_docente = response.data;
          //consulta para traer la informacion de las personas de los docentes asociados a una resolucion
          for(var x = 0;x<vinculacion_docente.length;x++){
            numContrato = vinculacion_docente[x].NumeroContrato;
            vigenciaContrato = vinculacion_docente[x].Vigencia;
            if(numContrato!=="" || vigenciaContrato!=="" || vigenciaContrato!==0){
              amazonAdministrativaRequest.get('proveedor_contrato_persona/'+numContrato+"/"+vigenciaContrato,"").then(function(response) { 
                if(response.data !== null){
                    self.contrato.push(response.data[0]); 
                  }
                if(self.contrato.length===vinculacion_docente.length){
                  amazonAdministrativaRequest.get('contrato_disponibilidad',"query=NumeroContrato:"+self.contrato[0].Numero_contrato+",Vigencia:"+self.contrato[0].Vigencia_contrato).then(function(response) {
                    
                    financieraRequest.get('disponibilidad',"query=NumeroDisponibilidad:"+response.data[0].NumeroCdp+",Vigencia:"+response.data[0].VigenciaCdp).then(function(response) {
                      self.disponibilidad.push(response.data[0]);
                      self.saving = true;
                      self.btnGenerartxt = "Generando...";
                      self.saving = false;
                      self.btnGenerartxt = "Generar";
                      $window.location.href = '#/rp/rp_solicitud/';
                    });
                  });
                }
               });
            }
           };
          }  
         });       
        }
      }
    };
});