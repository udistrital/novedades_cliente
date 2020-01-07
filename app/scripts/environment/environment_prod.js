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
    WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
    ACADEMICA_SERVICE:
      "http://10.20.0.127/urano/index.php?data=B-7djBQWvIdLAEEycbH1n6e-3dACi5eLUOb63vMYhGq0kPBs7NGLYWFCL0RSTCu1yTlE5hH854MOgmjuVfPWyvdpaJDUOyByX-ksEPFIrrQQ7t1p4BkZcBuGD2cgJXeD",
    ACADEMICA_WSO_SERVICE:
      "https://autenticacion.udistrital.edu.co:8244/academica_jbpm/v1/",
    ADMINISTRATIVA_MID_SERVICE:
      "https:/c/tuleap.udistrital.edu.co/go_api/administrativa_mid_api/v1/",
    ADMINISTRATIVA_SERVICE:
      "https://tuleap.udistrital.edu.co/go_api/administrativa_api/v1/",
    ADMINISTRATIVA_PRUEBAS_SERVICE:
      "https://tuleap.udistrital.edu.co/go_api/administrativa_amazon_api/v1/",
    RESOLUCION_SERVICE:
      "https://tuleap.udistrital.edu.co/go_api/resoluciones_crud/v1/",
    ARKA_SERVICE: "https://tuleap.udistrital.edu.co/go_api/arka_api_crud/v1/",
    CONFIGURACION_SERVICE:
      "https://tuleap.udistrital.edu.co/go_api/configuracion_api/v1/",
    CORE_SERVICE: "https://tuleap.udistrital.edu.co/go_api/core_api/v1/",
    CORE_AMAZON_SERVICE:
      "https://tuleap.udistrital.edu.co/go_api/core_amazon_crud/v1/",
    FINANCIERA_MID_SERVICE:
      "https://tuleap.udistrital.edu.co/go_api/financiera_mid_api/v1/",
    FINANCIERA_SERVICE:
      "https://tuleap.udistrital.edu.co/go_api/financiera_api/v1/",
    MODELS_SERVICE: "scripts/models/",
    OIKOS_SERVICE: "https://tuleap.udistrital.edu.co/go_api/oikos_api/v1/",
    OIKOS_AMAZON_SERVICE:
      "https://tuleap.udistrital.edu.co/go_api/oikos_amazon_api/v1",
    PAGOS_SERVICE:
      "https://tuleap.udistrital.edu.co/go_api/services/academicaProxyService/ingresos_concepto/",
    TITAN_SERVICE: "https://tuleap.udistrital.edu.co/go_api/titan_api_crud/v1/",
    SICAPITAL_SERVICE: "http://10.20.0.127/sicws/ws/sicapitalAPI.php/?/",
    CONTRATO_SERVICE:
      "https://autenticacion.udistrital.edu.co:8244/administrativa_jbpm/v1/",
    NUXEO_SERVICE: "https://documental.portaoas.udistrital.edu.co/nuxeo/",
    HOMOLOGACION_SERVICE:
      "https://autenticacion.udistrital.edu.co:8244/dependencias_api/v1/",
    TOKEN: {
      AUTORIZATION_URL:
        "https://autenticacion.udistrital.edu.co/oauth2/authorize",
      URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
      CLIENTE_ID: "XdBq4QOfEZYT0cl_8qDh3fmF5_Qa",
      REDIRECT_URL: "http://administrativa.portaloas.udistrital.edu.co/",
      RESPONSE_TYPE: "code",
      SCOPE: "openid email",
      BUTTON_CLASS: "btn btn-warning btn-sm",
      SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
      SIGN_OUT_REDIRECT_URL:
        "http://administrativa.portaloas.udistrital.edu.co/",
      SIGN_OUT_APPEND_TOKEN: "true",
      REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
      CLIENT_SECRET: "lrVuDATX1o8TfXxz_jrEzBA2iIoa"
    }
  }
});
