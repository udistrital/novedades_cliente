'use strict';

describe('Controller: AprobacionOrdenadorCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var AprobacionOrdenadorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AprobacionOrdenadorCtrl = $controller('AprobacionOrdenadorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AprobacionOrdenadorCtrl.awesomeThings.length).toBe(3);
  });
});
