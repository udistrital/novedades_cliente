'use strict';

describe('Service: financieraRequest', function () {

  // load the service's module
  beforeEach(module('financieraService'));

  // instantiate service
  var financieraRequest;
  beforeEach(inject(function (financieraRequest) {
    financieraRequest = financieraRequest;
  }));

  it('should do something', function () {
    expect(!!financieraRequest).toBe(true);
  });

});
