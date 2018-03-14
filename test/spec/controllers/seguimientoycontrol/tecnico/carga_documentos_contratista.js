'use strict';

describe('Controller: SeguimientoycontrolTecnicoCargaDocumentosContratistaCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var SeguimientoycontrolTecnicoCargaDocumentosContratistaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeguimientoycontrolTecnicoCargaDocumentosContratistaCtrl = $controller('SeguimientoycontrolTecnicoCargaDocumentosContratistaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SeguimientoycontrolTecnicoCargaDocumentosContratistaCtrl.awesomeThings.length).toBe(3);
  });
});
