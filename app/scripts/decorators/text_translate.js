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
    VER_SEGUIMIENTO_FINANCIERO:"Ver seguimiento financiero"
  },
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Ahora puede comenzar con el desarrollo ...",
  NECESIDADES: "Necesidades",
  NECESIDAD: "Necesidad",
  SOLICITUD: "Solicitud",
  //SOLICITUD RP
  SELECCIONE_UNA_VIGENCIA:"Seleccione una vigencia diferente",
  RESPONSABLE_DOCUMENTO: "Responsable documento",
  RESPONSABLE: "Responsable",
  DATOS_APROPIACIONES: "Datos de las apropiaciones",
  MODALIDAD_SELECCION: "Modalidad Selección",
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
  NOMBRE_CONTRATISTA: "Nombre",
  DOCUMENTO_CONTRATISTA: "No Documento",
  NOMBRE: "Nombre",
  CONTRATO: "Contrato",
  FUENTE_FINANCIAMIENTO: "Fuente Financiamiento",
  VALOR: "Valor",
  COMPROMISO: "Compromiso",
  NUMERO:"Número",
  VIGENCIA:"Vigencia",
  COMPROMISO_TIPO:"Tipo",
  VALOR_RP:"Valor registro presupuestal",
  SALDO_AP:"Saldo apropiación",
  CDP:"CDP",
  CODIGO: "Codigo",
  CONSECUTIVO:"Consecutivo",
  OBJETIVO:"Objetivo",
  OBJETO:"Objeto",
  ORDENADOR:"Ordenador",
  //SEGUMIENTO FINANCIERO
  SEGUIMIENTO_FINANCIERO:"Seguimiento financiero",
  DATOS_CONTRATO:"Datos contrato",
  ORDENES_PAGO: "Ordenes pago",
  ESTADISTICAS : "Estadisticas",
};

var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop ...",
  NECESIDADES: "Needs",
  NECESIDAD: "Need",
  BTN: {
    VER: "See",
    SELECCIONAR: "Choose",
    CANCELAR: "Cancel",
    CONFIRMAR: "Confirm",
    AGREGAR: "Add",
    REGISTRAR: "Register",
    SOLICITAR_RP:"RP request",
    QUITAR_RUBRO: "Delete",
    VER_SEGUIMIENTO_FINANCIERO:"See financial monitoring"
  },
  //SOLICITUD RP
  RESPONSABLE_DOCUMENTO: "Person responsible identification",
  SELECCIONE_UNA_VIGENCIA:"Choose a diferente validity",
  RESPONSABLE: "Person responsible",
  DATOS_APROPIACIONES: "Appropiation data",
  MODALIDAD_SELECCION: "Selection method",
  CONTRATO: "Contract",
  VIGENCIA_CONTRATO: "Contract validity",
  FUENTE:"Source",
  SOLICITUD_PERSONAS:"Contracts for budget registers",
  VIGENCIA_ACTUAL:"Current validity",
  VIGENCIA_SELECCIONADA:"Chosen validity",
  SELECCION_CDP:"CDP choise",
  UNIDAD_EJECUTORA:"Performer unity",
  ESTADO:"State",
  SELECCION_COMPROMISO:"Agreement choose",
  SOLICITUD_RP: "Budget register request",
  DATOS_RP:"Buget register data",
  BENEFICIARIO:"Beneficiary",
  NOMBRE_CONTRATISTA: "Name",
  DOCUMENTO_CONTRATISTA: "Identification",
  NOMBRE: "Name",
  CONTRATO: "Contract",
  FUENTE_FINANCIAMIENTO: "Funding source",
  VALOR: "Value",
  COMPROMISO: "Agreement",
  NUMERO:"Number",
  VIGENCIA:"Validity",
  COMPROMISO_TIPO:"Tipe",
  VALOR_RP:"Budget register value",
  SALDO_AP:"Appropiation reminder",
  CDP:"CDP",
  CODIGO: "Code",
  CONSECUTIVO:"Consecutive",
  OBJETIVO:"Objective",
  OBJETO:"Object",
  ORDENADOR:"Authorizer",
  //SEGUMIENTO FINANCIERO
  SEGUIMIENTO_FINANCIERO:"Financial monitoring",
  DATOS_CONTRATO:"Contract data",
  ORDENES_PAGO: "Pay orders",
  ESTADISTICAS : "Statistics",
};

angular.module('contractualClienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
  });
