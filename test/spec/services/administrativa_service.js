'use strict';

describe('Service: administrativaRequest', function () {

  // load the service's module
  beforeEach(module('administrativaService'));

  // instantiate service
  var administrativaRequest;
  beforeEach(inject(function (administrativaRequest) {
    administrativaRequest = administrativaRequest;
  }));

  it('should do something', function () {
    expect(!!administrativaRequest).toBe(true);
  });

});
