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
        // Librerias
        'ngCookies',
        'angular-loading-bar',
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        //'ngSanitize',
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
        'ui.grid.exporter',
        'ui.grid.expandable',
        'ui.grid.pinning',
        'ngStorage',
        'ngWebSocket',
        'angularMoment',
        'ui.utils.masks',
        'pascalprecht.translate',
        'nvd3',
        'ui.knob',
        'file-model',
        'angularBootstrapFileinput',
        // Servicios
        'financieraService',
        'coreService',
        'coreAmazonService',
        'administrativaService',
        'agoraService',
        'oikosService',
        'oikosAmazonService',
        'financieraMidService',
        'adminMidService',
        'sicapitalService',
        'titan_service',
        'amazonAdministrativaService',
        'academicaService',
        'contratoService',
        'gridOptionsService',
        'configuracionService',
        'requestService',
        'gridApiService',
        'colombiaHolidaysService',
        'nuxeoClient',
        'implicitToken',
        'novedadesService',
        'novedadesMidService',
        'core'
    ])
    .run(function(amMoment) {
        amMoment.changeLocale('es');
      })
      .factory('httpRequestInterceptor', function () {
          return {
              request: function (config) {
  
                  if (window.localStorage.getItem('access_token') !== undefined && window.localStorage.getItem('access_token') !== null) {
                      config.headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('access_token');
                  }
                  config.headers['Accept'] = 'application/json';
                  config.headers['Content-Type'] = 'application/json';
                  
                  return config;
              }
          };
      })
      .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        // cfpLoadingBarProvider.spinnerTemplate = '<div class="loading-div"><div><span class="fa loading-spinner"></div><div class="fa sub-loading-div">Por favor espere, cargando...</div></div>';
        cfpLoadingBarProvider.spinnerTemplate = '';
    }])
    .config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment.utc(date).format('YYYY-MM-DD') : '';
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor')
    })
    .config(['$locationProvider', '$routeProvider' ,'$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
    
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
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
            .when('/plantillas/generacion_minuta', {
                templateUrl: 'views/plantillas/generacion_plantilla.html',
                controller: 'GeneracionPlantillaCtrl',
                controllerAs: 'generacionPlantilla'
            })
            .when('/plantillas/lista_plantillas', {
                templateUrl: 'views/plantillas/lista_plantillas.html',
                controller: 'ListaPlantillasCtrl',
                controllerAs: 'listaPlantillas'
            })
            .when('/necesidad/necesidad_externa', {
                templateUrl: 'views/necesidad/necesidad_externa.html',
                controller: 'NecesidadExternaCtrl',
                controllerAs: 'necesidadExterna'
            })
            .when('/necesidad/necesidad_contratacion_docente', {
                templateUrl: 'views/necesidad/necesidad_contratacion_docente.html',
                controller: 'NecesidadContratacionDocenteCtrl',
                controllerAs: 'necesidadContratacionDocente'
            })
            .when('/seguimientoycontrol/legal', {
              templateUrl: 'views/seguimientoycontrol/legal.html',
              controller: 'SeguimientoycontrolLegalCtrl',
              controllerAs: 'sLegal'
            })
            .when('/seguimientoycontrol/legal/acta_inicio/:contrato_id/:contrato_vigencia', {
              templateUrl: 'views/seguimientoycontrol/legal/acta_inicio.html',
              controller: 'SeguimientoycontrolLegalActaInicioCtrl',
              controllerAs: 'sLactaInicio'
            })
            .when('/seguimientoycontrol/legal/acta_suspension/:contrato_id/:contrato_vigencia', {
              templateUrl: 'views/seguimientoycontrol/legal/acta_suspension.html',
              controller: 'SeguimientoycontrolLegalActaSuspensionCtrl',
              controllerAs: 'sLactaSuspension'
            })
            .when('/seguimientoycontrol/legal/acta_reinicio/:contrato_id/:contrato_vigencia', {
              templateUrl: 'views/seguimientoycontrol/legal/acta_reinicio.html',
              controller: 'SeguimientoycontrolLegalActaReinicioCtrl',
              controllerAs: 'sLactaReinicio'
            })
            .when('/seguimientoycontrol/legal/acta_cesion/:contrato_id/:contrato_vigencia', {
              templateUrl: 'views/seguimientoycontrol/legal/acta_cesion.html',
              controller: 'SeguimientoycontrolLegalActaCesionCtrl',
              controllerAs: 'sLactaCesion'
            })
            .when('/seguimientoycontrol/legal/acta_adicion_prorroga/:contrato_id/:contrato_vigencia', {
              templateUrl: 'views/seguimientoycontrol/legal/acta_adicion_prorroga.html',
              controller: 'SeguimientoycontrolLegalActaAdicionProrrogaCtrl',
              controllerAs: 'sLactaAdicionProrroga'
            })
            .when('/seguimientoycontrol/legal/acta_liquidacion', {
              templateUrl: 'views/seguimientoycontrol/legal/acta_liquidacion.html',
              controller: 'SeguimientoycontrolLegalActaLiquidacionCtrl',
              controllerAs: 'sLactaLiquidacion'
            })
            .when('/seguimientoycontrol/legal/acta_terminacion_liquidacion_bilateral/:contrato_id/:contrato_vigencia', {
              templateUrl: 'views/seguimientoycontrol/legal/acta_terminacion_liquidacion_bilateral.html',
              controller: 'SeguimientoycontrolLegalActaTerminacionLiquidacionBilateralCtrl',
              controllerAs: 'sLactaTerminacionAnticipada'
            })
            .when('/seguimientoycontrol/legal/novedad_otro_si_aclaratorio', {
              templateUrl: 'views/seguimientoycontrol/legal/novedad_otro_si_aclaratorio.html',
              controller: 'SeguimientoycontrolLegalNovedadOtroSiAclaratorioCtrl',
              controllerAs: 'sLotroSiAclaratorio'
            })
            .when('/seguimientoycontrol/legal/novedad_otro_si_modificatorio', {
              templateUrl: 'views/seguimientoycontrol/legal/novedad_otro_si_modificatorio.html',
              controller: 'SeguimientoycontrolLegalNovedadOtroSiModificatorioCtrl',
              controllerAs: 'sLotroSiModificatorio'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
