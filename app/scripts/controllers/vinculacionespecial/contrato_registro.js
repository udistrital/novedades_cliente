'use strict';

/**
 * @ngdoc function
 * @name clienteApp.controller:ContratoRegistroCtrl
 * @description
 * # ContratoRegistroCtrl
 * Controller of the clienteApp
 */
angular.module('contractualClienteApp')
  .controller('ContratoRegistroCtrl', function (administrativaRequest,adminMidRequest,oikosRequest,coreRequest,financieraRequest,contratacion_request,contratacion_mid_request,sicapitalRequest,idResolucion,$mdDialog,lista,resolucion,$translate) {
  	
  	var self = this;

    self.idResolucion=idResolucion;

    administrativaRequest.get("resolucion_vinculacion_docente/"+self.idResolucion).then(function(response){
      self.datosFiltro=response.data;

      oikosRequest.get("dependencia/"+self.datosFiltro.IdFacultad.toString()).then(function(response){
        self.contratoGeneralBase.SedeSolicitante=response.data.Id.toString();
        self.sede_solicitante_defecto=response.data.Nombre;
      });
      administrativaRequest.get("precontratado/"+self.idResolucion.toString()).then(function(response){   

        self.contratados=response.data;
        if(self.contratados != null){
          self.contratados.forEach(function(row){
            console.log("row");     
            console.log(row.Id); 
            adminMidRequest.get("calculo_salario/Contratacion/"+row.Id.toString()).then(function(response){
              console.log("SCA VOY");
              console.log(response);
              row.ValorContrato=response.data;
            });
          });
        }
      });
      coreRequest.get("ordenador_gasto","query=DependenciaId%3A"+self.datosFiltro.IdFacultad.toString()).then(function(response){
        if(response.data==null){
          coreRequest.get("ordenador_gasto/1").then(function(response){
            self.ordenadorGasto=response.data;
          })
        }else{
          self.ordenadorGasto=response.data[0];
        }
      });
    });

    coreRequest.get("punto_salarial","sortby=Vigencia&order=desc&limit=1").then(function(response){
      self.punto_salarial=response.data[0];
    });

    coreRequest.get("salario_minimo","sortby=Vigencia&order=desc&limit=1").then(function(response){
      self.salario_minimo=response.data[0];
    });


    sicapitalRequest.get("disponibilidad/cdpfiltro/2017/1/VIGENTE").then(function(response){
      self.cdp_opciones=response.data;
    });

    self.asignarValoresDefecto = function(){
      self.contratoGeneralBase={}
      self.contratoGeneralBase.Vigencia=new Date().getFullYear();
      self.contratoGeneralBase.FormaPago={Id:240};
      self.contratoGeneralBase.DescripcionFormaPago="Abono a Cuenta Mensual de acuerdo a puntas y hotras laboradas";
      self.contratoGeneralBase.Justificacion="Docente de Vinculacion Especial";
      self.contratoGeneralBase.UnidadEjecucion={Id:205};
      self.contratoGeneralBase.LugarEjecucion={Id:2};
      self.contratoGeneralBase.Observaciones="Contrato de Docente Vinculación Especial";
      self.contratoGeneralBase.TipoControl=181;
      self.contratoGeneralBase.ClaseContratista=33;
      self.contratoGeneralBase.TipoMoneda=137;
      self.contratoGeneralBase.OrigenRecursos=149;
      self.contratoGeneralBase.OrigenPresupuesto=156;
      self.contratoGeneralBase.TemaGastoInversion=166;
      self.contratoGeneralBase.TipoGasto=146;
      self.contratoGeneralBase.RegimenContratacion=136;
      self.contratoGeneralBase.Procedimiento=132;
      self.contratoGeneralBase.ModalidadSeleccion=123;
      self.contratoGeneralBase.TipoCompromiso=35;
      self.contratoGeneralBase.TipologiaContrato=46;
      self.contratoGeneralBase.FechaRegistro=new Date();
      self.contratoGeneralBase.UnidadEjecutora=1;
      self.contratoGeneralBase.Condiciones="Sin condiciones";
    }

    self.asignarValoresDefecto();

    financieraRequest.get("unidad_ejecutora/1").then(function(response){
      self.unidad_ejecutora_defecto=response.data;
    })
    administrativaRequest.get("parametros/240").then(function(response){
      self.forma_pago_defecto=response.data;
    })
    administrativaRequest.get("parametros/136").then(function(response){
      self.regimen_contratacion_defecto=response.data;
    })


    self.cancelar = function(){
      $mdDialog.hide();
    }

    /*self.calcularSalario = function(){
        adminMidRequest.post("calculo_salario/Precontratacion/"+self.nivelAcademico+"/"+persona.Id+"/"+self.datosValor.NumSemanas+"/"+self.datosValor.NumHorasSemanales+"/asociado/"+self.datosValor.dedicacion).then(function(response){
          if(typeof(response.data)=="number"){
            self.valorContrato=response.data;
              swal({
                title: $translate.instant('VALOR_CONTRATO'),
                text: NumeroALetras(response.data),
                type: "info",
                confirmButtonText: $translate.instant('ACEPTAR'),
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
              });
              self.asignarValoresDefecto();
        }else{
          swal({
                title: "Peligro",
                text: $translate.instant('NO_CALCULADO_SALARIO'),
                type: "danger",
                confirmButtonText: $translate.instant('ACEPTAR'),
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
              });
        }
        });
    }*/

    self.realizarContrato = function(){
      if(self.contratoGeneralBase.cdp && self.contratoGeneralBase.Observaciones && self.contratoGeneralBase.Justificacion){        
        self.contratoGeneralBase.NumeroSolicitudNecesidad=parseInt(self.getNumeroDisponibilidadSeleccionada());
        self.contratoGeneralBase.NumeroCdp=parseInt(self.getNumeroNecesidadDisponibilidadSeleccionada());
        if(self.datosFiltro.Dedicacion=="HCH"){
          self.contratoGeneralBase.TipoContrato={Id: 3};
          self.contratoGeneralBase.ObjetoContrato="Docente de Vinculación Especial - Honorarios";
        }else{
          self.contratoGeneralBase.TipoContrato={Id: 2};
          self.contratoGeneralBase.ObjetoContrato="Docente de Vinculación Especial - Salario";
        }        
        swal({
          title: $translate.instant('EXPEDIR'),
          text: $translate.instant('SEGURO_EXPEDIR'),
          html:
              '<p><b>'+$translate.instant('NUMERO')+': </b>'+resolucion.Numero.toString()+'</p>'+
              '<p><b>'+$translate.instant('FACULTAD')+': </b>'+resolucion.Facultad+'</p>'+
              '<p><b>'+$translate.instant('NIVEL_ACADEMICO')+': </b>'+resolucion.NivelAcademico+'</p>'+
              '<p><b>'+$translate.instant('DEDICACION')+': </b>'+resolucion.Dedicacion+'</p>',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: $translate.instant('ACEPTAR'),
          cancelButtonText: $translate.instant('CANCELAR'),
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false
        }).then(function () {
                self.guardarContratos();
                }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal({
                        text: $translate.instant('EXPEDICION_NO_REALIZADA'),
                        type: 'error'
                    })
                }
            })
      }else{
        swal({
          text: $translate.instant('DATOS_INCOMPLETOS'),
          title: "Alerta",
          type: "warning",
          confirmButtonText: $translate.instant('ACEPTAR'),
          showLoaderOnConfirm: true,
        });
      }
    }

    self.guardarContratos = function(){
      var conjuntoContratos=[];
      var errorInsercion = false;
      if(self.contratados){
        self.contratados.forEach(function(contratado){
          var contratoGeneral=JSON.parse(JSON.stringify(self.contratoGeneralBase));
          contratoGeneral.Contratista=contratado.Documento;
          contratoGeneral.DependenciaSolicitante=contratado.ProyectoCurricular.toString();
          contratoGeneral.PlazoEjecucion=contratado.Semanas*7;
          contratoGeneral.OrdenadorGasto=self.ordenadorGasto.Id;
          contratoGeneral.ValorContrato=contratado.ValorContrato;
          var contratoVinculacion={
            ContratoGeneral: contratoGeneral,
            VinculacionDocente: {Id: contratado.Id}
          }
          if(self.datosFiltro.NivelAcademico.toLowerCase()=="pregrado"){
            contratoVinculacion.VinculacionDocente.IdPuntoSalarial=self.punto_salarial.Id;
          }else if(self.datosFiltro.NivelAcademico.toLowerCase()=="posgrado"){
            contratoVinculacion.VinculacionDocente.IdSalarioMinimo=self.salario_minimo.Id;
          }
          conjuntoContratos.push(contratoVinculacion);
        });
        var expedicionResolucion={
          Vinculaciones: conjuntoContratos,
          idResolucion: self.idResolucion
        }     
          administrativaRequest.post("contrato_general/InsertarContratos",expedicionResolucion).then(function(response){
            if(typeof(response.data)=="object"){
              swal({
                        title: $translate.instant('EXPEDIDA'),
                        text: $translate.instant('DATOS_REGISTRADOS'),
                        type: 'success',
                        confirmButtonText: $translate.instant('ACEPTAR')
                      });
                      administrativaRequest.get("resolucion_vinculacion").then(function(response){
                          lista.resolucionesInscritas.data=response.data;
                          lista.resolucionesInscritas.data.forEach(function(resolucion){
                              if(resolucion.FechaExpedicion.toString()=="0001-01-01T00:00:00Z"){
                                  resolucion.FechaExpedicion=null;
                              }
                          })
                      });  
                      $mdDialog.hide()
                    }else{
                      swal({
                        title: "Alerta",
                        text: $translate.instant('PROBLEMA_EXPEDICION'),
                        type: "warning",
                        confirmButtonText: $translate.instant('ACEPTAR'),
                        showLoaderOnConfirm: true,
                      });
                    }
          })
      }else{
                swal({
                  text: $translate.instant('NO_DOCENTES'),
                  title: "Alerta",
                  type: "warning",
                  confirmButtonText: $translate.instant('ACEPTAR'),
                  showLoaderOnConfirm: true,
                });
      }
    }

    self.getNumeroDisponibilidadSeleccionada = function(){
      if(self.contratoGeneralBase.cdp){
        var numeroDisponibilidad = JSON.parse(self.contratoGeneralBase.cdp).DISPONIBILIDAD;
        return numeroDisponibilidad;
      }
      return null;
    }

    self.getObjetoDisponibilidadSeleccionada = function(){
      if(self.contratoGeneralBase.cdp){
        var textoObjeto = JSON.parse(self.contratoGeneralBase.cdp).OBJETODISP;
        return textoObjeto;
      }
      return null;
    }

    self.getNumeroNecesidadDisponibilidadSeleccionada = function(){
      if(self.contratoGeneralBase.cdp){
        var numeroNecesidad = JSON.parse(self.contratoGeneralBase.cdp).NUMERONECESIDAD;
        return numeroNecesidad;
      }
      return null;
    }

  });
