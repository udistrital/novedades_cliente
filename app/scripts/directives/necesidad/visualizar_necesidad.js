'use strict';

/**
 * @ngdoc directive
 * @name contractualClienteApp.directive:necesidad/visualizarNecesidad
 * @description
 * # necesidad/visualizarNecesidad
 */
angular.module('contractualClienteApp')
  .directive('visualizarNecesidad', function () {
    return {
      restrict: 'E',
      scope:{
          vigencia:'=',
          numero: '='
      },
      templateUrl: 'views/directives/necesidad/visualizar_necesidad.html',
      controller:function (financieraRequest,administrativaRequest,$scope) {
        var self = this;

        $scope.$watch('[vigencia,numero]',function(){
          self.cargar_necesidad();
        });

        self.cargar_necesidad=function(){
          administrativaRequest.get('necesidad',$.param({
            query: "NumeroElaboracion:"+$scope.numero+",Vigencia:"+$scope.vigencia
          })).then(function(response){
            self.v_necesidad=response.data[0];
            administrativaRequest.get('marco_legal_necesidad',$.param({
              query: "Necesidad:"+response.data[0].Id,
              fields: "MarcoLegal"
            })).then(function(response){
              console.log(response);
              self.marco_legal=response.data;
            });
            administrativaRequest.get('fuente_financiacion_rubro_necesidad',$.param({
              query: "SolicitudNecesidad:"+response.data[0].Id,
              fields: "FuenteFinanciacion,Apropiacion,MontoParcial"
            })).then(function(response){
              //self.f_necesidad=response.data;
              //------------
              var dateArrKeyHolder = [];
              var dateArr = [];
              angular.forEach(response.data, function(item, key) {
                  dateArrKeyHolder[item.Apropiacion] = dateArrKeyHolder[item.Apropiacion]||{};
                  var obj = dateArrKeyHolder[item.Apropiacion];
                  if(Object.keys(obj).length == 0)
                  dateArr.push(obj);

                  financieraRequest.get('apropiacion',$.param({
                    query: "Id:"+item.Apropiacion,
                    fields: "Rubro,Valor"
                  })).then(function(response){
                    //console.log(response);
                    obj.Apropiacion = response.data[0];
                  });

                  //obj.Apropiacion = item.Apropiacion;
                  obj.Fuentes  = obj.Fuentes || [];

                  var i_fuente={};
                  financieraRequest.get('fuente_financiacion',$.param({
                    query: "Id:"+item.FuenteFinanciacion
                  })).then(function(response){
                    //console.log(response);
                    console.log("entro e jhizo algo");
                    i_fuente.FuenteFinanciacion=response.data[0];
                  });
                  i_fuente.MontoParcial=item.MontoParcial
                  obj.Fuentes.push(i_fuente);
                  //obj.fuentes.push({FuenteFinanciacion:item.FuenteFinanciacion, MontoParcial: item.MontoParcial });
              });


              self.ff_necesidad=dateArr;

              //-----------
            });
            console.log(self.v_necesidad);
          });
        };

      },
      controllerAs:'d_visualizarNecesidad'
    };
  });
