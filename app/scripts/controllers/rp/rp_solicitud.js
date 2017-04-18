'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:RpSolicitudCtrl
 * @description
 * # RpSolicitudCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('RpSolicitudCtrl', function($window,administrativaRequest,$scope,financieraRequest,$routeParams) {
    var self = this;
    //self.solicitudPersonas=solicitudPersonas;
    self.Contrato = $routeParams.contrato;
    self.Vigencia = $routeParams.vigencia;
    self.Nombre = $routeParams.nombre;
    self.Valor = $routeParams.valor;
    self.Documento = $routeParams.documento;
    $scope.rubroVacio=false;
    self.CurrentDate = new Date();
    self.alertas = false;
    self.alerta = "";
    self.valor_rp = "";
    self.compromiso = null;
    self.rubros_seleccionados = [];
    self.rubros_select = [];



    self.gridOptions_compromiso = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      columnDefs: [{
          field: 'Id',
          displayName: 'Numero',
          width: '20%'
        },
        {
          field: 'Vigencia',
          displayName: 'Vigencia',
          width: '20%'
        },
        {
          field: 'TipoCompromisoTesoral.Nombre',
          displayName: 'Tipo Compromiso',
          width: '60%'
        }
      ],
      onRegisterApi: function(gridApi) {
        self.gridApi = gridApi;

      }
    };
    financieraRequest.get('compromiso', 'limit=0').then(function(response) {
      self.gridOptions_compromiso.data = response.data;
    });


    self.proveedor = {

    };
    self.cdp = {

    };

    self.rubros = {

    };
    self.rubroSeleccionado = {

    };


    if (self.cdp.Id != null) {
      for (var i = 0; i < self.rubros.length; i++) {
        var saldo = self.DescripcionRubro(rubros[i].Id);
        rubros[i].saldo = saldo;
        alert(saldo);
      }
    }

    self.agregarRubro = function(id) {
      var rubro_seleccionado = self.DescripcionRubro(id);
      if(rubro_seleccionado!=undefined){
        self.rubros_seleccionados.push(rubro_seleccionado);
        $scope.seleccionado= rubro_seleccionado;
        for (var i = 0; i < self.rubros.length; i++) {

          if (self.rubros[i].Id == id) {
            self.rubros_select.push(rubro_seleccionado);
            self.rubros.splice(i, 1)
          }
        }
      }else{
        swal("Alertas", "Debe seleccionar un rubro para agregar", "error");
      }
    }

    self.quitarRubro = function(id) {

      for (var i = 0; i < self.rubros_select.length; i++) {
        if (self.rubros_select[i].Id == id) {

          self.rubros.push(self.rubros_select[i]);
          self.rubros_select.splice(i, 1)
        }
      }
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {

        if (self.rubros_seleccionados[i].Id == id) {
          self.rubros_seleccionados.splice(i, 1)
        }
      }
    }

    self.DescripcionRubro = function(id) {
      var rubro;
      for (var i = 0; i < self.rubros.length; i++) {

        if (self.rubros[i].Id == id) {
          rubro = self.rubros[i];
        }
      }
      return rubro
    };

    $scope.saldosValor = function() {
      $scope.banderaRubro = true;
      var i=0;
      angular.forEach(self.rubros_seleccionados, function(v) {
        if (v.Saldo < v.ValorAsignado || v.ValorAsignado===0 || isNaN(v.ValorAsignado) || v.ValorAsignado === undefined) {
          $scope.banderaRubro = false;
        }
      });
    }

    self.Registrar = function() {
      $scope.saldosValor();
      self.alerta_registro_rp = ["No se pudo solicitar el rp"];
      if (self.cdp.NumeroDisponibilidad == null) {
        swal("Alertas", "Debe seleccionar el CDP objetivo del RP", "error");
        self.alerta_registro_rp = ["Debe seleccionar el CDP objetivo del RP"];
      } else if (self.rubros_seleccionados.length == 0) {
        swal("Alertas", "debe seleccionar el Rubro objetivo del RP", "error");
        self.alerta_registro_rp = ["Debe seleccionar el Rubro objetivo del RP"];
      } else if (self.compromiso == null) {
        swal("Alertas", "debe seleccionar el Compromiso del RP", "error");
        self.alerta_registro_rp = ["Debe seleccionar el Compromiso del RP"];
      } else if ($scope.banderaRubro === false) {
        swal({
          title: 'Error!',
          text: 'Valor incorrecto del registro presupuestal',
          type: 'error',
          confirmButtonText: 'Corregir'
        })
      }
      else {

        for (var i = 0; i < self.rubros_seleccionados.length; i++) {
          self.rubros_seleccionados[i].ValorAsignado = parseFloat(self.rubros_seleccionados[i].ValorAsignado);
        }

        var SolicitudRp = {
          Vigencia: 2017,
          FechaSolicitud: self.CurrentDate,
          Cdp: self.cdp.Id,
          Expedida: false,
          NumeroContrato: self.Contrato,
          VigenciaContrato: self.Vigencia,
          Compromiso: self.compromiso.Id
        }

          administrativaRequest.post('solicitud_rp', SolicitudRp).then(function(response) {
            for (var i = 0; i < self.rubros_seleccionados.length; i++) {
              var Disponibilidad_apropiacion_solicitud_rp = {
                DisponibilidadApropiacion: self.rubros_seleccionados[i].Id,
                SolicitudRp: response.data.Id,
                Monto: self.rubros_seleccionados[i].ValorAsignado,
              }

              administrativaRequest.post('disponibilidad_apropiacion_solicitud_rp', Disponibilidad_apropiacion_solicitud_rp).then(function(responseD) {
              });
            }


            var fechaFormato = SolicitudRp.FechaSolicitud.getDay() + "/" + SolicitudRp.FechaSolicitud.getMonth() + "/" + SolicitudRp.FechaSolicitud.getFullYear();

            swal({
              html: "<label>Se inserto correctamente la solicitud del registro presupuestal con los siguientes datos</label><br><br><label><b>Vigencia solicitud:</b></label> " + response.data.Vigencia + "<br><label><b>Fecha solicitud:</b></label>:" + fechaFormato +
                "<br><label><b>Numero contrato:</b></label>" + response.data.NumeroContrato + "<br><label><b>Vigencia contrato:</b></label>" + response.data.VigenciaContrato,
              type: "success",
              showCancelButton: true,
              confirmButtonColor: "#449D44",
              cancelButtonColor: "#C9302C",
              confirmButtonText: "Volver a contratos",
              cancelButtonText: "Salir",
            }).then(function() {
              //si da click en ir a contratistas
              $window.location.href = '#/rp_solicitud_personas';
            }, function(dismiss) {

              if (dismiss === 'cancel') {
                //si da click en Salir
                $window.location.href = '#';
              }
            })

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
