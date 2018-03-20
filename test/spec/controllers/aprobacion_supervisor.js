'use strict';

describe('Controller: AprobacionSupervisorCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var AprobacionSupervisorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AprobacionSupervisorCtrl = $controller('AprobacionSupervisorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AprobacionSupervisorCtrl.awesomeThings.length).toBe(3);
  });
});
