'use strict';

/**
* @ngdoc function
* @name clienteApp.controller:ResolucionBusquedaDocenteCtrl
* @description
* # ResolucionBusquedaDocenteCtrl
*/
angular.module('contractualClienteApp')
  .controller('ResolucionBusquedaDocenteCtrl', function (adminMidRequest, resolucion, administrativaRequest, $scope, $window, $mdDialog, $translate, gridApiService) {
    $scope.listaResoluciones = [];
    $scope.idDocente = "";

    $scope.queryDocente = function (query) {
      //console.log(query)

      // valida la cedula de la persona
      var intId = parseInt(query);

      var q = $.param({
        limit: -1,
        query: "IdPersona:" + intId.toString()
      });

      var resultados = administrativaRequest.get("vinculacion_docente/", q).then(function (lista) {
        $scope.listaResoluciones = [];
        if (lista.data == null || lista.data.length === 0) {
          return;
        }
        lista.data.forEach(function (elem) {
          var idResolucion = elem.IdResolucion.Id;
          administrativaRequest.get("resolucion/" + idResolucion).then(function (res) {
            var NumeroResolucion = res.data.NumeroResolucion;
            if (!$scope.listaResoluciones.includes(NumeroResolucion)) {
              $scope.listaResoluciones.push(NumeroResolucion);
            }
          });
        });
      });
    };



  });