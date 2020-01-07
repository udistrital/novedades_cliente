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
    ADMINISTRATIVA_MID_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_mid_api/v1/",
    ADMINISTRATIVA_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_crud_api/v1/",
    ADMINISTRATIVA_PRUEBAS_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/",
    CONFIGURACION_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/",
    CORE_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_api/v1/",
    CORE_AMAZON_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_amazon_crud/v1/",
    FINANCIERA_MID_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/financiera_mid_api/v1/",
    FINANCIERA_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/financiera_crud_api/v1/",
    MODELS_SERVICE: "scripts/models/",
    OIKOS_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v1/",
    ARGO_NOSQL_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/novedades_crud/v1/",
    CONTRATO_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v1/",
      // "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v2/",
    NUXEO_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/nuxeo_api/v1/",
    HOMOLOGACION_SERVICE:
      "https://autenticacion.udistrital.edu.co:8244/dependencias_api/v1/",
    NOVEDADES_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/novedades_crud/v1/",
    NOVEDADES_MID_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/novedades_mid/v1/",
    TOKEN: {
      AUTORIZATION_URL:
        "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
      URL_USER_INFO:
        "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
      CLIENTE_ID: "OwOV0X4cpYgbSpDfm_FPKF0J6bwa",
      REDIRECT_URL: "https://pruebasnovedades.portaloas.udistrital.edu.co",
      RESPONSE_TYPE: "id_token token",
      SCOPE: "openid email documento",
      BUTTON_CLASS: "btn btn-warning btn-sm",
      SIGN_OUT_URL:
        "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
      SIGN_OUT_REDIRECT_URL:
        "https://pruebasnovedades.portaloas.udistrital.edu.co/",
      SIGN_OUT_APPEND_TOKEN: "true"
    }
  }
});
