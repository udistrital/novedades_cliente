"use strict";

/**
 * @ngdoc function
 * @name contractualClienteApp.decorator:TextTranslate
 * @description
 * # TextTranslate
 * Decorator of the contractualClienteApp
 */
var text_es = {
  BTN: {
    VER: "Ver",
    SELECCIONAR: "Seleccionar",
    CANCELAR: "Cancelar",
    CONFIRMAR: "Confirmar",
    AGREGAR: "Agregar",
    REGISTRAR: "Registrar",
    SOLICITAR_RP:"Solicitar RP",
    QUITAR_RUBRO: "Quitar",
  },
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Ahora puede comenzar con el desarrollo ...",
  NECESIDADES: "Necesidades",
  NECESIDAD: "Necesidad",
  SOLICITUD: "Solicitud",
  //SOLICITUD RP
  CONTRATO: "Contrato",
  VIGENCIA_CONTRATO: "Vigencia contrato",

  FUENTE:"Fuente",
  SOLICITUD_PERSONAS_PANEL:"Contratos para solicitud del registro presupuestal",
  VIGENCIA_ACTUAL:"Vigencia Actual ",
  VIGENCIA_SELECCIONADA:"Vigencia Seleccionada ",
  CDP_PANEL:"Selección de CDP",
  COMPROMISO_PANEL:"Selección de compromiso",
  SOLICITUD_RP_PANEL:"Solicitud registro presupuestal",
  BENEFICIARIO:"Beneficiario",
  NOMBRE_CONTRATISTA: "Nombre Contratista",
  DOCUMENTO_CONTRATISTA: "No Documento",
  CONTRATO: "Contrato",
  NUMERO_CONTRATO: "No Contrato",
  VIGENCIA_CONTRATO: "Vigencia Contrato",
  VALOR_CONTRATO: "Valor Contrato",
  CONSECUTIVO_ID: "Consecutivo id",
  CONSECUTIVO_OBJETO:"Objeto",
  CONSECUTIVO_ORDENADOR:"Ordenador",
  COMPROMISO: "Compromiso",
  COMPROMISO_NUMERO:"Numero",
  COMPROMISO_VIGENCIA:"Vigencia",
  COMPROMISO_TIPO:"Tipo",
  VALOR_RP:"Valor registro presupuestal",
  SALDO_RP:"Saldo registro presupuestal",
  CDP:"CDP",
  DATOS_RP:"Datos del Registro Presupuestal",
  CDP_CONSECUTIVO:"Consecutivo",
  CDP_OBJETIVO:"Objetivo",
  CDP_ORDENADOR:"Ordenador",
};

var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop ...",
  NECESIDADES: "Needs",
  NECESIDAD: "Need"
};

angular.module('contractualClienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
  });
