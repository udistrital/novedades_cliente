'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:NecesidadSolicitudNecesidadCtrl
 * @description
 * # NecesidadSolicitudNecesidadCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SolicitudNecesidadCtrl', function(administrativaRequest, $scope, agoraRequest, oikosRequest, coreRequest, financieraRequest) {
    var self = this;
    self.documentos=[];

    self.dep_ned = {
      JefeDependenciaSolicitante: 18
    };

    $scope.$watch('solicitudNecesidad.dependencia_destino',function(){
      self.dep_ned.DependenciaDestino=self.dependencia_destino;
      coreRequest.get('jefe_dependencia', $.param({
        query: "DependenciaId:"+self.dependencia_destino,
        limit: -1
      })).then(function(response2) {
        agoraRequest.get('informacion_persona_natural', $.param({
          query: 'Id:'+response2.data[0].TerceroId,
          limit: -1
        })).then(function(response) {
          self.jefe_destino = response.data[0];
          console.log(response.data[0]);
          console.log(response2.data[0]);
          self.dep_ned.JefeDependenciaDestino=response2.data[0].Id;
        });
      });
    },true);

    coreRequest.get('jefe_dependencia/'+self.dep_ned.JefeDependenciaSolicitante, ''
    ).then(function(response) {
      self.dependencia_solicitante_data = response.data;
    });



    $scope.$watch('solicitudNecesidad.rol_ordenador_gasto',function(){
      console.log("rol ordenador activado (? xD");
      console.log(self.rol_ordenador_gasto);
      coreRequest.get('jefe_dependencia', $.param({
        query: "DependenciaId:"+self.rol_ordenador_gasto,
        fields: "TerceroId",
        limit: -1
      })).then(function(response) {
        agoraRequest.get('informacion_persona_natural', $.param({
          query: 'Id:'+response.data[0].TerceroId,
          limit: -1
        })).then(function(response) {
          self.ordenador_gasto = response.data[0];
          console.log("Look ");
          console.log(response.data[0]);
          self.dep_ned.OrdenadorGasto=response.data[0].Id;
        });
      });
    },true);

    self.sup_sol_ned= {
      Estado: "Activo",
      Funcionario: 1234567890
    };

    agoraRequest.get('snies_area', $.param({
      limit: -1,
      query: 'Estado:ACTIVO'
    })).then(function(response) {
      self.snies_data = response.data;
    });

    $scope.$watch('solicitudNecesidad.snies',function(){
      agoraRequest.get('snies_nucleo_basico', $.param({
        query: 'IdArea.Id:'+self.snies,
        limit: -1
      })).then(function(response) {
        self.snies_nucleo_basico_data = response.data;
      });
    },true);

    oikosRequest.get('dependencia', $.param({
      limit: -1
    })).then(function(response) {
      self.dependencia_data = response.data;
    });

    coreRequest.get('ordenador_gasto', $.param({
      limit: -1
    })).then(function(response) {
      self.ordenador_gasto_data = response.data;
    });

    oikosRequest.get('dependencia', $.param({
      query: 'Id:12',
      limit: 0
    })).then(function(response) {
      self.dependencia_solicitante = response.data[0];
    });

    agoraRequest.get('informacion_persona_natural', $.param({
      query: 'Id:1234567890',
      limit: 0
    })).then(function(response) {
      self.persona_solicitante = response.data[0];
    });

    self.necesidad = {};
    self.necesidad.PlanAnualAdquisiciones = 20171;
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





    self.planes_anuales = [{
      Id: 1,
      Nombre: "Necesidad1 -2017"
    }];

    financieraRequest.get('unidad_ejecutora', $.param({
      limit: -1
    })).then(function(response) {
      self.unidad_ejecutora_data = response.data;
    });


    // function
    self.duracionEspecial = function(especial) {
      self.ver_duracion_fecha = false;
      if (especial === 'duracion') {
        self.ver_duracion_fecha = true;
        self.necesidad.UnicoPago = false;
        self.necesidad.AgotarPresupuesto = false;
      } else if (especial === "unico_pago") {
        self.necesidad.DiasDuracion = 0;
        self.necesidad.UnicoPago = true;
        self.necesidad.AgotarPresupuesto = false;
        self.ver_duracion_fecha = false;
      } else if (especial === "agotar_presupuesto") {
        self.necesidad.UnicoPago = false;
        self.necesidad.AgotarPresupuesto = true;
        self.ver_duracion_fecha = true;
      }
    };
    //

    self.calculo_total_dias = function() {
      if (self.anos === undefined) {
        self.anos = 0;
      }
      if (self.meses === undefined) {
        self.meses = 0;
      }
      if (self.dias === undefined) {
        self.dias = 0;
      }
      self.necesidad.DiasDuracion = ((parseInt(self.anos) * 360) + (parseInt(self.meses) * 30) + parseInt(self.dias));
    };
    //

    //Temporal viene dado por un servicio de javier
    agoraRequest.get('informacion_persona_natural', $.param({
      limit: -1
    })).then(function(response) {
      self.persona_data = response.data;
    });


    agoraRequest.get('parametro_estandar', $.param({
      query: "ClaseParametro:"+'Tipo Perfil',
      limit: -1
    })).then(function(response) {
      self.parametro_estandar_data = response.data;
    });
    //-----


    administrativaRequest.get('estado_necesidad', $.param({
      query: "Nombre:Solicitada"
    })).then(function(response) {
      self.necesidad.Estado = response.data[0];
    });


    administrativaRequest.get('modalidad_seleccion', $.param({
      limit: 0
    })).then(function(response) {
      self.modalidad_data = response.data;
    });

    administrativaRequest.get('tipo_rubro', $.param({
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
      if (self.necesidad.TipoRubro.Nombre === 'funcionamiento') {
        self.f_apropiacion_fun.push(Fap);
      } else {
        self.f_apropiacion_inv.push(Fap);
      }
    };

    $scope.$watch('solicitudNecesidad.f_apropiacion_inv', function() {
      self.valor_inv = 0;
      for (var i = 0; i < self.f_apropiacion_inv.length; i++) {
        self.f_apropiacion_inv[i].MontoParcial = 0;
        if (self.f_apropiacion_inv[i].fuentes !== undefined) {
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

      for (var j = 0; j < self.documentos.length; j++) {
        var marco = {};
        marco.MarcoLegal = self.documentos[j];
        self.marcos_legales.push(marco);
      }

      if (self.necesidad.TipoRubro.Nombre === "inversion") {
        for (var h = 0; h < self.f_apropiacion_inv.length; h++) {
          if (self.f_apropiacion_inv[h].fuentes !== undefined) {
            for (var k = 0; k < self.f_apropiacion_inv[h].fuentes.length; k++) {
              var f_ap = {};
              f_ap.Apropiacion = self.f_apropiacion_inv[h].Apropiacion;
              f_ap.MontoParcial = self.f_apropiacion_inv[h].fuentes[k].Monto;
              f_ap.FuenteFinanciacion = self.f_apropiacion_inv[h].fuentes[k].Fuente.Id;
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
        SupervisorSolicitudNecesidad: self.sup_sol_ned,
        Especificacion: self.especificaciones,
        ActividadEspecifica: self.ActividadEspecifica,
        ActividadEconomicaNecesidad: self.actividades_economicas_id,
        MarcoLegalNecesidad: self.marcos_legales,
        Ffapropiacion: self.f_apropiaciones,
        DependenciaNecesidad: self.dep_ned
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
