'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.rolesService
 * @description
 * # rolesService
 * Service in the contractualClienteApp.
 */
angular.module('contractualClienteApp')
  .service('rolesService', function (token_service) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    self = this;

    if (token_service.live_token()) {
      var roles = "";
      if (typeof token_service.token.role === "object") {
          var rl = [];
          for (var index = 0; index < token_service.token.role.length; index++) {
              if (token_service.token.role[index].indexOf("/") < 0) {
                  rl.push(token_service.token.role[index]);
              }
          }
          roles = rl.toString();
      } else {
          roles = token_service.token.role;
      }

      roles = roles.replace(/,/g, '%2C');
      configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/Argo', '').then(function (response) {

          $rootScope.my_menu = response.data;

      });
  }

  });
