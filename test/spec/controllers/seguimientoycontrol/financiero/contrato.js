'use strict';

describe('Controller: SeguimientoycontrolFinancieroContratoCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var SeguimientoycontrolFinancieroContratoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeguimientoycontrolFinancieroContratoCtrl = $controller('SeguimientoycontrolFinancieroContratoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SeguimientoycontrolFinancieroContratoCtrl.awesomeThings.length).toBe(3);
  });
});
