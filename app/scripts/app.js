'use strict';

/**
 * @ngdoc overview
 * @name contractualClienteApp
 * @description
 * # contractualClienteApp
 *
 * Main module of the application.
 */
angular
  .module('contractualClienteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'afOAuth2',
    'treeControl',
    'ngMaterial',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.treeView',
    'ui.grid.selection',
    'ui.grid.pagination',
    'ui.grid.exporter',
    'ui.grid.autoResize',
    'ngStorage',
    'ngWebSocket',
    'angularMoment',
    'ui.utils.masks',
    'pascalprecht.translate',
    'financieraService',
    'coreService',
    'administrativaService',
    'agoraService',
    'oikosService',
    'financieraMidService',
    'adminMidService',
    'sicapitalService',
    'nvd3',
    'textAngular',
  ])
    .run(function(amMoment) {
      amMoment.changeLocale('es');
    })
    .config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("");
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/notificaciones', {
        templateUrl: 'views/notificaciones.html',
        controller: 'NotificacionesCtrl',
        controllerAs: 'notificaciones'

      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/necesidad/solicitud_necesidad', {
        templateUrl: 'views/necesidad/solicitud_necesidad.html',
        controller: 'SolicitudNecesidadCtrl',
        controllerAs: 'solicitudNecesidad'
      })
      .when('/necesidades', {
        templateUrl: 'views/necesidad/necesidades.html',
        controller: 'NecesidadesCtrl',
        controllerAs: 'necesidades'
      })
      .when('/rp_solicitud_personas', {
        templateUrl: 'views/rp/rp_solicitud_personas.html',
        controller: 'RpSolicitudPersonasCtrl',
        controllerAs: 'rpSolicitudPersonas'
      })
      .when('/rp/rp_solicitud/', {
        templateUrl: 'views/rp/rp_solicitud.html',
        controller: 'RpSolicitudCtrl',
        controllerAs: 'rpSolicitud'
      })
      .when('/seguimientoycontrol/financiero', {
        templateUrl: 'views/seguimientoycontrol/financiero.html',
        controller: 'SeguimientoycontrolFinancieroCtrl',
        controllerAs: 'sFinanciero'
      })
      .when('/seguimientoycontrol/financiero/contrato', {
        templateUrl: 'views/seguimientoycontrol/financiero/contrato.html',
        controller: 'SeguimientoycontrolFinancieroContratoCtrl',
        controllerAs: 'sFcontrato'
      })
      .when('/seguimientoycontrol/financiero/ordenes_pago', {
        templateUrl: 'views/seguimientoycontrol/financiero/ordenes_pago.html',
        controller: 'SeguimientoycontrolFinancieroOrdenesPagoCtrl',
        controllerAs: 'sFordenesPago'
      })
      .when('/seguimientoycontrol/financiero/estadisticas', {
        templateUrl: 'views/seguimientoycontrol/financiero/estadisticas.html',
        controller: 'SeguimientoycontrolFinancieroEstadisticasCtrl',
        controllerAs: 'sFestadisticas'
      })
      .when('/minutas/creacion_minuta', {
        templateUrl: 'views/minutas/creacion_minuta.html',
        controller: 'MinutasCreacionMinutaCtrl',
        controllerAs: 'creacionMinuta'
      })
      .when('/minutas/generacion_minuta', {
        templateUrl: 'views/minutas/generacion_minuta.html',
        controller: 'MinutaGeneracionMinutaCtrl',
        controllerAs: 'generacionMinuta'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
