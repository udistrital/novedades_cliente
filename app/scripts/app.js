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
    'administrativaService'
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
      .when('/necesidad/aprobar/:Vigencia/:Id', {
        templateUrl: 'views/necesidad/aprobar_necesidad.html',
        controller: 'AprobarNecesidadCtrl',
        controllerAs: 'aprobarNecesidad'
      })
      .when('/necesidad/ver/:Vigencia/:Id', {
        templateUrl: 'views/necesidad/ver_necesidad.html',
        controller: 'VerNecesidadCtrl',
        controllerAs: 'verNecesidad'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
