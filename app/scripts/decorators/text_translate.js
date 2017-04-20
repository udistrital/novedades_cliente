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
  RESPONSABLE: "Responsable",
  CONTRATO: "Contrato",
  VIGENCIA_CONTRATO: "Vigencia contrato",
  FUENTE:"Fuente",
  SOLICITUD_PERSONAS:"Contratos para solicitud del registro presupuestal",
  VIGENCIA_ACTUAL:"Vigencia Actual ",
  VIGENCIA_SELECCIONADA:"Vigencia Seleccionada ",
  SELECCION_CDP:"Selección de CDP",
  UNIDAD_EJECUTORA:"Unidad ejecutora",
  ESTADO:"Estado",
  SELECCION_COMPROMISO:"Selección de Compromiso",
  SOLICITUD_RP: "Solicitud Registro Presupuestal",
  DATOS_RP:"Datos del Registro Presupuestal",
  BENEFICIARIO:"Beneficiario",
  NOMBRE_CONTRATISTA: "Nombre Contratista",
  DOCUMENTO_CONTRATISTA: "No Documento",
  CONTRATO: "Contrato",
  VALOR: "Valor",
  COMPROMISO: "Compromiso",
  NUMERO:"Número",
  VIGENCIA:"Vigencia",
  COMPROMISO_TIPO:"Tipo",
  VALOR_RP:"Valor registro presupuestal",
  SALDO_RP:"Saldo registro presupuestal",
  CDP:"CDP",
  DATOS_RP:"Datos del Registro Presupuestal",
  CONSECUTIVO:"Consecutivo",
  OBJETIVO:"Objetivo",
  OBJETO:"Objeto",
  ORDENADOR:"Ordenador",
};

var text_en = {
  SOLICITUD_RP:"INGLES",
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop ...",
  NECESIDADES: "Needs",
  NECESIDAD: "Need",
};

angular.module('contractualClienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
  });
