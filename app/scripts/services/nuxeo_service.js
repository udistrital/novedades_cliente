'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.nuxeoService
 * @description
 * # nuxeoService
 * Factory in the contractualClienteApp.
 */
angular.module('contractualClienteApp')
  .factory('nuxeo', function ($q, CONF) {
    // Service logic
    // ...

    // Public API here
    Nuxeo.promiseLibrary($q);
    return new Nuxeo({

        baseURL: CONF.GENERAL.NUXEO_SERVICE,
        auth: {
            method: 'basic',
            username: 'Administrator',
            password: 'S1st3m4s04S=Fr331P4'
        }
      });
  });
