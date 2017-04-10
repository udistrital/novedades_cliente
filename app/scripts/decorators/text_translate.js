"use strict";

/**
 * @ngdoc function
 * @name contractualClienteApp.decorator:TextTranslate
 * @description
 * # TextTranslate
 * Decorator of the contractualClienteApp
 */
var text_es = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Ahora puede comenzar con el desarrollo ...",
  NECESIDADES: "Necesidades",
  NECESIDAD: "Necesidad",
  SOLICITUD: "Solicitud"
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
