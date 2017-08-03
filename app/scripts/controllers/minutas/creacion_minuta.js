'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:MinutasCreacionMinutaCtrl
 * @description
 * # MinutasCreacionMinutaCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('MinutasCreacionMinutaCtrl', function ($location, $translate) {
    var self = this;

    self.changeView = function(view) {
      $location.path(view); // ruta a la nueva vista
    }
  });
