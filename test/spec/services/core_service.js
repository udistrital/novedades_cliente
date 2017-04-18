'use strict';

describe('Service: coreService', function () {

  // load the service's module
  beforeEach(module('coreService'));

  // instantiate service
  var coreService;
  beforeEach(inject(function (coreRequest) {
    coreRequest = coreRequest;
  }));

  it('should do something', function () {
    expect(!!coreRequest).toBe(true);
  });

});
