'use strict';

describe('Controller: MinutasCreacionMinutaCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var MinutasCreacionMinutaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MinutasCreacionMinutaCtrl = $controller('MinutasCreacionMinutaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MinutasCreacionMinutaCtrl.awesomeThings.length).toBe(3);
  });
});
