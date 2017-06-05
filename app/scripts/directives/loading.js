'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:loading
 * @description
 * # loading
 */
angular.module('contractualClienteApp')
  .directive('loading', function () {
    return {
      restrict: 'E',
      scope:{
          load:'=',
          tam:'='
        },

      template: '<div class="loading" ng-show="load">' +
                   '<i class="fa fa-clock-o fa-spin fa-{{tam}}x faa-burst animated  text-info" aria-hidden="true" ></i>' +
                   '</div>',
      controller:function($scope){
        console.log($scope.load);
      },
      controllerAs:'d_loading'
    };
});
