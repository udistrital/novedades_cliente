'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadSolicitudNecesidadCtrl
 * @description
 * # NecesidadSolicitudNecesidadCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
.controller('SolicitudNecesidadCtrl', function(administrativaRequest, $scope) {
  var self = this;

  self.necesidad = {};
  self.necesidad.PlanAnualAdquisiciones = 20171;
  self.necesidad.TecnicasUniformes = false;
  self.necesidad.UnidadEjecutora = 1;
  self.necesidad.UnicoPago = true;
  self.necesidad.AgotarPresupuesto = false;
  self.necesidad.Valor = 0;
  self.fecha = new Date();
  self.necesidad.DiasDuracion = 0;
  self.f_apropiacion_fun = [];
  self.f_apropiacion_inv = [];
  self.ActividadEspecifica = [];
  self.especificaciones = [];
  self.actividades_economicas_id = [];
  self.valor_inv = 0;
  self.valor_fun = 0;



  //....token
  self.estado_necesidad_necesidad = {
    Estado: {
      Id: 0
    },
    Necesidad: {
      Id: 0
    },
    Responsable: 1
  }

  //..

  self.planes_anuales = [{
    Id: 1,
    Nombre: "Necesidad1 -2017"
  }]

  // function
  self.duracionEspecial = function(especial) {
    self.ver_duracion_fecha = false;
    if (especial == 'duracion') {
      self.ver_duracion_fecha = true;
      self.necesidad.UnicoPago = false;
      self.necesidad.AgotarPresupuesto = false;
    } else if (especial == "unico_pago") {
      self.necesidad.DiasDuracion = 0;
      self.necesidad.UnicoPago = true;
      self.necesidad.AgotarPresupuesto = false;
      self.ver_duracion_fecha = false;
    } else if (especial == "agotar_presupuesto") {
      self.necesidad.UnicoPago = false;
      self.necesidad.AgotarPresupuesto = true;
      self.ver_duracion_fecha = false;
    }
  };
  //

  self.calculo_total_dias = function(anos, meses, dias) {
    if (self.anos == undefined) {
      self.anos = 0;
    }
    if (self.meses == undefined) {
      self.meses = 0;
    }
    if (self.dias == undefined) {
      self.dias = 0;
    }
    self.necesidad.DiasDuracion = ((parseInt(self.anos) * 360) + (parseInt(self.meses) * 30) + parseInt(self.dias));
  }
  //

  //Temporal viene dado por un servicio de javier
  administrativaRequest.get('informacion_persona_natural', $.param({
    limit: 0
  })).then(function(response) {
    self.persona_data = response.data;
  });

  administrativaRequest.get('dependencia', $.param({
    limit: 0
  })).then(function(response) {
    self.dependencia_data = response.data;
  });

  //-----

  administrativaRequest.get('modalidad_seleccion', $.param({
    limit: 0
  })).then(function(response) {
    self.modalidad_data = response.data;
  });

  administrativaRequest.get('tipo_fuente_financiacion', $.param({
    limit: 0
  })).then(function(response) {
    self.tipos_fuentes_finan = response.data;
  });

  administrativaRequest.get('servicio', $.param({
    limit: 0
  })).then(function(response) {
    self.servicio_data = response.data;
  });



  self.agregar_ffapropiacion = function(apropiacion) {
    var Fap = {
      aprop: apropiacion,
      Apropiacion: apropiacion.Id,
      MontoParcial: 0,
    };
    if (self.necesidad.TipoFuenteFinanciacion.Nombre == 'funcionamiento') {
      self.f_apropiacion_fun.push(Fap);
    } else {
      self.f_apropiacion_inv.push(Fap);
    }
  };

  $scope.$watch('solicitudNecesidad.f_apropiacion_inv', function() {
    self.valor_inv = 0;
    for (var i = 0; i < self.f_apropiacion_inv.length; i++) {
      self.f_apropiacion_inv[i].MontoParcial = 0;
      if (self.f_apropiacion_inv[i].fuentes != undefined) {
        for (var k = 0; k < self.f_apropiacion_inv[i].fuentes.length; k++) {
          self.f_apropiacion_inv[i].MontoParcial += self.f_apropiacion_inv[i].fuentes[k].Monto;
        }
      }
      self.valor_inv += self.f_apropiacion_inv[i].MontoParcial;
    }
  }, true);

  $scope.$watch('solicitudNecesidad.f_apropiacion_fun', function() {
    self.valor_fun = 0;
    for (var i = 0; i < self.f_apropiacion_fun.length; i++) {
      self.valor_fun += self.f_apropiacion_fun[i].MontoParcial;
    }
  }, true);


  self.agregarActEsp = function(actividad) {
    var a = {};
    a.Descripcion = actividad;
    self.ActividadEspecifica.push(a);
  };

  self.quitar_act_esp = function(i) {
    self.ActividadEspecifica.splice(i, 1);
  };

  self.crear_solicitud = function() {

    self.marcos_legales = [];
    self.f_apropiaciones = [];

    for (var i = 0; i < self.actividades_economicas.length; i++) {
      var Act_Economica = {};
      Act_Economica.ActividadEconomica = self.actividades_economicas[i].Id;
      self.actividades_economicas_id.push(Act_Economica);
    }

    for (var i = 0; i < self.documentos.length; i++) {
      var marco = {};
      marco.MarcoLegal = self.documentos[i];
      self.marcos_legales.push(marco);
    }

    if (self.necesidad.TipoFuenteFinanciacion.Nombre == "inversion") {
      for (var i = 0; i < self.f_apropiacion_inv.length; i++) {
        if (self.f_apropiacion_inv[i].fuentes != undefined) {
          for (var k = 0; k < self.f_apropiacion_inv[i].fuentes.length; k++) {
            var f_ap = {};
            f_ap.Apropiacion = self.f_apropiacion_inv[i].Apropiacion;
            f_ap.MontoParcial = self.f_apropiacion_inv[i].fuentes[k].Monto;
            f_ap.FuenteFinanciacion = self.f_apropiacion_inv[i].fuentes[k].Fuente.Id;
            self.f_apropiaciones.push(f_ap);
          }
        }
      }
      self.necesidad.Valor = self.valor_inv;
    } else {
      self.f_apropiaciones = self.f_apropiacion_fun;
      self.necesidad.Valor = self.valor_fun;
    }


    self.tr_necesidad = {
      Necesidad: self.necesidad,
      SupervisorSolicitudNecesidad: self.supervisor_solicitud,
      EstadoNecesidadNecesidad: {
        Estado: {
          Id: 1
        },
        Responsable: self.dependencia_necesidad.JefeDependenciaSolicitante
      },
      Especificacion: self.especificaciones,
      ActividadEspecifica: self.ActividadEspecifica,
      ActividadEconomicaNecesidad: self.actividades_economicas_id,
      MarcoLegalNecesidad: self.marcos_legales,
      Ffapropiacion: self.f_apropiaciones,
      DependenciaNecesidad: self.dependencia_necesidad
    };

    administrativaRequest.post("tr_necesidad", self.tr_necesidad).then(function(response) {
      self.alerta = "";
      for (var i = 1; i < response.data.length; i++) {
        self.alerta = self.alerta + response.data[i] + "\n";
      }
      swal("", self.alerta, response.data[0]);
      console.log(response.data);
    });
  };


});
