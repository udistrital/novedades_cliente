    'use strict';
    /**
     * @ngdoc function
     * @name contractualClienteApp.controller:menuCtrl
     * @description
     * # menuCtrl
     * Controller of the contractualClienteApp
     */
    angular.module('contractualClienteApp')
        .controller('menuCtrl', function($location, CONF, $http, rolesService, $window, $scope, $rootScope, token_service, configuracionRequest, notificacion, $translate, $route, $mdSidenav) {
            var paths = [];
            $scope.language = {
                es: "btn btn-primary btn-circle btn-outline active",
                en: "btn btn-primary btn-circle btn-outline"
            };

            $scope.notificacion = notificacion;
            $scope.actual = "";
            $scope.token_service = token_service;
            $scope.breadcrumb = [];
            $scope.perfil = "ADMINISTRADOR ARGO";
            //Rama cumplidos
            $scope.logout = function() {
                token_service.logout();
            };

            if (token_service.live_token()) {
                token_service.getLoginData().then(function() {
                    $scope.token = token_service.getAppPayload();
                    if (!angular.isUndefined($scope.token.appUserRole)) {
                        var roles = "";
                        if (typeof $scope.token.appUserRole === "object") {
                            var rl = [];

                            for (
                                var index = 0; index < $scope.token.appUserRole.length; index++
                            ) {
                                if ($scope.token.appUserRole[index].indexOf(",") < 0) {
                                    rl.push(
                                        $scope.token.appUserRole[index] ==
                                        "Internal/everyone" ?
                                        "" :
                                        $scope.token.appUserRole[index]
                                    );
                                }
                            }
                            roles = rl.toString();
                            console.log(roles);
                        } else {
                            roles = $scope.token.appUserRole;
                        }
                        notificacion.changeStateNoView($scope.token.sub);

                        configuracionRequest.get("menu_opcion_padre/ArbolMenus/" + roles + "/" + CONF.APP_MENU, "")
                            .then(function(response) {
                                $rootScope.my_menu = response.data;
                            })
                            .catch(function(response) {
                                $rootScope.my_menu = response.data;
                            });
                    }
                });
            }

            var update_url = function() {
                $scope.breadcrumb = [''];
                for (var i = 0; i < paths.length; i++) {
                    if ($scope.actual === "/" + paths[i].path) {
                        $scope.breadcrumb = paths[i].padre;
                    } else if ('/' === $scope.actual) {
                        $scope.breadcrumb = [''];
                    }
                }
            };

            $scope.redirect_url = function(path) {
                var path_sub = path.substring(0, 4);
                switch (path_sub.toUpperCase()) {
                    case "HTTP":
                        $window.open(path, "_blank");
                        break;
                    default:
                        $location.path(path);
                        break;
                }
            };

            $scope.changeStateToNoView = function() {
                notificacion.changeStateNoView($scope.token.sub);
            };


            $http.get("scripts/models/app_menus.json")
                .then(function(response) {
                    $scope.menu_app = response.data;
                });

            $scope.$on('$routeChangeStart', function( /*next, current*/ ) {
                $scope.actual = $location.path();
                update_url();
            });

            $scope.changeLanguage = function(key) {
                $translate.use(key);
                switch (key) {
                    case 'es':
                        $scope.language.es = "btn btn-primary btn-circle btn-outline active";
                        $scope.language.en = "btn btn-primary btn-circle btn-outline";
                        break;
                    case 'en':
                        $scope.language.en = "btn btn-primary btn-circle btn-outline active";
                        $scope.language.es = "btn btn-primary btn-circle btn-outline";
                        break;
                    default:
                }
                $route.reload();
            };

            function buildToggler(componentId) {
                return function() {
                    $mdSidenav(componentId).toggle();
                };
            }

            $scope.toggleLeft = buildToggler('left');
            $scope.toggleRight = buildToggler('right');

            //Pendiente por definir json del menu
            (function($) {
                $(document).ready(function() {
                    $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        $(this).parent().siblings().removeClass('open');
                        $(this).parent().toggleClass('open');
                    });
                });
            })(jQuery);
        });
