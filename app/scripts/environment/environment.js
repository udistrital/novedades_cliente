"use strict";

// Reemplace contractualClienteApp por el nombre del módulo de la aplicación principal

/**
 * @ngdoc service
 * @name contractualClienteApp.config
 * @description
 * # config
 * Constant in the contractualClienteApp.
 */

angular.module("contractualClienteApp").constant("CONF", {
    APP: "argo", // Nombre de la app, esto cargará el logo.
    APP_MENU: "Novedades", // Ingrese valor de la aplicación asociado al menú registrado en wso2
    GENERAL: {
        NOTIFICACION_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/notificacion_mid/v1/",
        ARM_AWS_NOTIFICACIONES:"arn:aws:sns:us-east-1:699001025740:test-Polux",
        ADMINISTRATIVA_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_mid_api/v1/",
        ADMINISTRATIVA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_crud_api/v1/",
        ADMINISTRATIVA_PRUEBAS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/",
        CONFIGURACION_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/",
        CORE_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_api/v1/",
        //CORE_AMAZON_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8106/v1/",
        CORE_AMAZON_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_amazon_crud/v1/",
        FINANCIERA_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/financiera_mid_api/v1/",
        FINANCIERA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/financiera_crud_api/v1/",
        MODELS_SERVICE: "scripts/models/",
        OIKOS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v1/",
        ARGO_NOSQL_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/novedades_crud/v1/",
        CONTRATO_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v2/",
        //"https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v1/",
        NUXEO_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/nuxeo_api/v1/",
        HOMOLOGACION_SERVICE: "https://autenticacion.udistrital.edu.co:8244/dependencias_api/v1/",
        NOVEDADES_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/novedades_crud/v1/",
        //NOVEDADES_SERVICE: "http://localhost:8014/v1/",
        NOVEDADES_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/novedades_mid/v1/",
        //NOVEDADES_MID_SERVICE: "http://localhost:8013/v1/",
        DOCUMENTOS_CRUD: "https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/",
        //DOCUMENTOS_CRUD: "http://pruebasapi.intranetoas.udistrital.edu.co:8094/v1/",
        NOTIFICACION_WS: "wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws/join",
        AUTENTICATION_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/",
        TOKEN: {
            AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
            URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
            CLIENTE_ID: "sWe9_P_C76DWGOsLcOY4T7BYH6oa",
            REDIRECT_URL: "http://localhost:9000/",
            RESPONSE_TYPE: "id_token token",
            SCOPE: "openid email documento",
            BUTTON_CLASS: "btn btn-warning btn-sm",
            SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
            SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
            SIGN_OUT_APPEND_TOKEN: "true",
        },
    },
});
