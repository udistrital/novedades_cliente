'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.necesidad/necesidadService
 * @description
 * # necesidad/necesidadService
 * Service in the contractualClienteApp.
 */
angular.module('contractualClienteApp')
  .service('necesidadService', function (administrativaRequest) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;


    self.initNecesidad = function (IdNecesidad) {
      var trNecesidad = {};
      console.log(IdNecesidad)
      if (IdNecesidad) {
        administrativaRequest.get('necesidad', $.param({
          query: 'Id:' + IdNecesidad
        })).then(function (response) {
          trNecesidad.Necesidad = response.data[0];

          if (self.necesidad.TipoContratoNecesidad.Id === 2) { // Tipo Servicio
            administrativaRequest.get('detalle_servicio_necesidad', $.param({
              query: 'Necesidad:' + IdNecesidad
            })).then(function (response) {
              trNecesidad.DetalleServicioNecesidad = response.data[0];
            });
            administrativaRequest.get('actividad_especifica', $.param({
              query: 'Necesidad:' + IdNecesidad
            })).then(function (response) {
              trNecesidad.ActividadEspecifica = response.data;
            });

            administrativaRequest.get('actividad_economica_necesidad', $.param({
              query: 'Necesidad:' + IdNecesidad
            })).then(function (response) {
              trNecesidad.ActividadEconomicaNecesidad = response.data;
            });
          }
        });

        administrativaRequest.get('fuente_financiacion_rubro_necesidad', $.param({
          query: 'Necesidad:' + IdNecesidad
        })).then(function (response) {
          trNecesidad.Ffapropiacion = response.data;
        });

        administrativaRequest.get('marco_legal_necesidad', $.param({
          query: 'Necesidad:' + IdNecesidad
        })).then(function (response) {
          trNecesidad.MarcoLegalNecesidad = response.data;
        });

        administrativaRequest.get('dependencia_necesidad', $.param({
          query: 'Necesidad:' + IdNecesidad
        })).then(function (response) {
          trNecesidad.DependenciaNecesidad = response.data[0];

          return coreAmazonRequest.get('jefe_dependencia', $.param({
            query: "Id:" + trNecesidad.DependenciaNecesidad.JefeDependenciaDestino,
            limit: -1
          }))
        }).then(function (response) {
          trNecesidad.DependenciaNecesidadDestino = response.data[0].DependenciaId;

          return coreAmazonRequest.get('jefe_dependencia', $.param({
            query: "TerceroId:" + trNecesidad.DependenciaNecesidad.OrdenadorGasto,
            limit: -1
          }))
        }).then(function (response) {
          trNecesidad.RolOrdenadorGasto = response.data[0].DependenciaId;
        });

      } else {
        trNecesidad.Necesidad = {};
        trNecesidad.Necesidad.TipoNecesidad = { Id: 1 };
        trNecesidad.Necesidad.TipoContratoNecesidad = { Id: 0 };
        trNecesidad.Necesidad.DiasDuracion = 0;
        trNecesidad.Necesidad.UnicoPago = true;
        trNecesidad.Necesidad.AgotarPresupuesto = false;
        trNecesidad.Necesidad.Valor = 0;
        administrativaRequest.get('estado_necesidad', $.param({
          query: "Nombre:Solicitada"
        })).then(function (response) {
          trNecesidad.Necesidad.EstadoNecesidad = response.data[0];
        });
      }

      return new Promise(function (resolve, reject) {
        resolve(trNecesidad);
      });
    };

    return self;
  });
