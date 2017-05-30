'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.contrato
 * @description
 * # contrato
 * Factory in the contractualClienteApp.
 */
angular.module('contractualClienteApp')
  .factory('contrato', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
