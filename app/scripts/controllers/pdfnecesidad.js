'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:PdfnecesidadCtrl
 * @description
 * # PdfnecesidadCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('PdfnecesidadCtrl', function (pdfMakerNecesidadesService, administrativaRequest, $scope, necesidadService) {


    pdfMakerNecesidadesService.init().then(function () {
      var IdNecesidad = 102659;
      var IdNecesidad = 102634;
      return necesidadService.initNecesidad(IdNecesidad)

    }).then(function (response) {
      $scope.trNecesidad = response;
      console.log($scope.trNecesidad)
      var a = pdfMake.createPdf(pdfMakerNecesidadesService.docDefinition($scope.trNecesidad))

      a.getDataUrl(function (outDoc) {
        document.querySelector('#vistaPDF').src = outDoc;
      });
    })

  });
