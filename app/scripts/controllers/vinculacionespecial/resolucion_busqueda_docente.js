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
      console.log(query)
      //var results = query ? self.states.filter(createFilterFor(query)) : self.states;
      //https://tuleap.udistrital.edu.co/go_api/administrativa_api/v1/vinculacion_docente/?limit=-1&query=IdPersona:<idpersona>

      // valida la cedula de la persona
      var intId = parseInt(query);

      var q = $.param({
        limit: -1,
        query: "IdPersona:" + intId.toString()
      });

      var resultados = administrativaRequest.get("vinculacion_docente/", q).then(function (lista) {
        var listaResoluciones = [];
        if (lista.data == null || lista.data.length === 0) {
          $scope.listaResoluciones = [];
          return;
        }
        lista.data.forEach(function (elem) {
          var idResolucion = elem.IdResolucion.Id;
          administrativaRequest.get("resolucion/" + idResolucion).then(function (res) {
            listaResoluciones.push(res.data.NumeroResolucion);
          });
        });

        $scope.listaResoluciones = listaResoluciones;
      });
    };



  });