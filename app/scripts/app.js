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
        'coreAmazonService',
        'administrativaService',
        'agoraService',
        'oikosService',
        'oikosAmazonService',
        'financieraMidService',
        'adminMidService',
        'sicapitalService',
        'contratacion_service',
        'contratacion_mid_service',
        'titan_service',
        'amazonAdministrativaService',
        'academicaService',
        'contratoService',
        'nvd3',
    ])
    .run(function(amMoment) {
        amMoment.changeLocale('es');
    })
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
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
            .when('/vinculacionespecial/resolucion_generacion', {
                templateUrl: 'views/vinculacionespecial/resolucion_generacion.html',
                controller: 'ResolucionGeneracionCtrl',
                controllerAs: 'resolucionGeneracion'
            })
            .when('/vinculacionespecial/hojas_de_vida_seleccion/:idResolucion', {
                templateUrl: 'views/vinculacionespecial/hojas_de_vida_seleccion.html',
                controller: 'HojasDeVidaSeleccionCtrl',
                controllerAs: 'hojasDeVidaSeleccion'
            })
            .when('/vinculacionespecial/contrato_registro', {
                templateUrl: 'views/vinculacionespecial/contrato_registro.html',
                controller: 'ContratoRegistroCtrl',
                controllerAs: 'contratoRegistro'
            })
            .when('/vinculacionespecial/resolucion_gestion', {
                templateUrl: 'views/vinculacionespecial/resolucion_gestion.html',
                controller: 'ResolucionGestionCtrl',
                controllerAs: 'resolucionGestion'
            })
            .when('/vinculacionespecial/resolucion_detalle/:idResolucion', {
                templateUrl: 'views/vinculacionespecial/resolucion_detalle.html',
                controller: 'ResolucionDetalleCtrl',
                controllerAs: 'resolucionDetalle'
            })
            .when('/vinculacionespecial/resolucion_vista', {
                templateUrl: 'views/vinculacionespecial/resolucion_vista.html',
                controller: 'ResolucionVistaCtrl',
                controllerAs: 'resolucionVista'
            })
            .when('/vinculacionespecial/resolucion_administracion', {
                templateUrl: 'views/vinculacionespecial/resolucion_administracion.html',
                controller: 'ResolucionAdministracionCtrl',
                controllerAs: 'resolucionAdministracion'
            })
            .when('/vinculacionespecial/resolucion_aprobacion', {
                templateUrl: 'views/vinculacionespecial/resolucion_aprobacion.html',
                controller: 'ResolucionAprobacionCtrl',
                controllerAs: 'resolucionAprobacion'
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
            .when('/vinculacionespecial/cancelar_contrato_docente', {
                templateUrl: 'views/vinculacionespecial/cancelar_contrato_docente.html',
                controller: 'CancelarContratoDocenteCtrl',
                controllerAs: 'cancelarContratoDocente'
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
            .otherwise({
                redirectTo: '/'
            });
    }]);