'use strict';

describe('Controller: SeguimientoycontrolFinancieroCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var SeguimientoycontrolFinancieroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeguimientoycontrolFinancieroCtrl = $controller('SeguimientoycontrolFinancieroCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SeguimientoycontrolFinancieroCtrl.awesomeThings.length).toBe(3);
  });
});
