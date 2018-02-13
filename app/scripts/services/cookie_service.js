'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.orden
 * @description
 * # orden
 * Factory in the contractualClienteApp.
 */
angular.module('contractualClienteApp')
  .factory('cookie', function ($cookies) {
    var methods = {
        get: function(name) {
            return $cookies.get(name);
        }
    };
    return methods;
    });
