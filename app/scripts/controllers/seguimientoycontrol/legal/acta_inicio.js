'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
 * @description
 * # SeguimientoycontrolLegalActaInicioCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
    .controller('SeguimientoycontrolLegalActaInicioCtrl', function ($log, $scope, $routeParams, $translate, argoNosqlRequest, contratoRequest, coreAmazonRequest, amazonAdministrativaRequest, adminMidRequest, novedadesMidRequest, novedadesRequest) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.elementos = ['uno', 'dos', 'tres', 'cuatro'];
        var self = this;
        self.diff_dias = null;
        self.contrato_id = $routeParams.contrato_id;
        self.contrato_vigencia = $routeParams.contrato_vigencia;
        self.contrato_obj = {};
        self.poliza_obj = {};
        self.fecha = {};
        self.fecha_inicio_contrato = {};
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        var f = new Date();
        self.fecha.dia_mes = f.getDate();
        self.fecha.mes = meses[f.getMonth()];
        self.fecha.anio = f.getFullYear();
        self.fecha_inicio = new Date();
        self.fecha_fin = new Date();
        var poliza = {};
        self.actualizar_fecha_inicio_seleccionada = function () {
            self.fecha_inicio_contrato.dia_mes = self.fecha_inicio.getDate();
            self.fecha_inicio_contrato.mes = meses[self.fecha_inicio.getMonth()];
            self.fecha_inicio_contrato.anio = self.fecha_inicio.getFullYear();
        }

        contratoRequest.get('contrato', self.contrato_id + '/' + self.contrato_vigencia).then(function (wso_response) {
            self.contrato_obj.id = wso_response.data.contrato.numero_contrato_suscrito;
            self.contrato_obj.objeto = wso_response.data.contrato.objeto_contrato;
            self.contrato_obj.valor = wso_response.data.contrato.valor_contrato;
            self.contrato_obj.plazo = wso_response.data.contrato.plazo_ejecucion;
            self.contrato_obj.supervisor = wso_response.data.contrato.supervisor.nombre;
            self.contrato_obj.supervisor_cedula = wso_response.data.contrato.supervisor.documento_identificacion;
            self.contrato_obj.supervisor_cargo = wso_response.data.contrato.supervisor.cargo;
            self.contrato_obj.VigenciaContrato = wso_response.data.contrato.vigencia;
            self.contrato_obj.FechaRegistro = wso_response.data.contrato.FechaRegistro;
            self.contrato_obj.contratista = String(wso_response.data.contrato.contratista);
            self.contrato_obj.FechaSuscripcion = String(wso_response.data.contrato.fecha_suscripcion);
            self.contrato_obj.UnidadEjecucion = String(wso_response.data.contrato.unidad_ejecucion);

            self.contrato_obj.cesion = 0; //Variable para cotrolar si el contrato tiene cesion
            self.estados = [];
            // Obtiene el estado al cual se quiere pasar el contrato
            amazonAdministrativaRequest.get('estado_contrato?query=NombreEstado:' + "En ejecucion").then(function (ec_response) {
                var estado_temp_to = {
                    "NombreEstado": "ejecucion"
                }
                if (ec_response.data[0].NombreEstado == "En ejecucion") {
                    self.estados[1] = estado_temp_to;
                }
            });
            //Verificar si el contrato ha tenido cesion
            novedadesMidRequest.get('novedad', self.contrato_obj.id + "/" + self.contrato_obj.VigenciaContrato).then(function (response_sql) {
                var elementos_cesion = response_sql.data.Body;
                if (elementos_cesion.length != '0') {
                    var last_newness = elementos_cesion[elementos_cesion.length - 1];




                    novedadesRequest.get('tipo_novedad', 'query=Id:' + last_newness.tiponovedad).then(function (nr_response) {
                        self.contrato_obj.tipo_novedad = nr_response.data[0].CodigoAbreviacion;
                        if (self.contrato_obj.tipo_novedad == "NP_CES") {
                            self.contrato_obj.contratista = last_newness.cesionario;
                            self.contrato_obj.cesion = 1;
                        }
                        novedadesRequest.get('poliza', 'query=IdNovedadesPoscontractuales:' + last_newness.id).then(function (nrp_response) {
                            poliza = nrp_response.data[0]
                        });


                        //Obtencion de datos del contratista
                        amazonAdministrativaRequest.get('informacion_proveedor?query=Id:' + self.contrato_obj.contratista).then(function (ip_response) {
                            var elementos_contratista = Object.keys(ip_response.data[0]).length;
                            if (elementos_contratista > 0) {
                                self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                                self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;
                            } else {
                                self.contrato_obj.contratista_documento = $translate.instant('NO_REGISTRA_ACTA_INICIO');
                                self.contrato_obj.contratista_nombre = $translate.instant('NO_REGISTRA_ACTA_INICIO');
                            }
                            amazonAdministrativaRequest.get('informacion_persona_natural?query=Id:' + ip_response.data[0].NumDocumento).then(function (ipn_response) {
                                coreAmazonRequest.get('ciudad', 'query=Id:' + ipn_response.data[0].IdCiudadExpedicionDocumento).then(function (c_response) {
                                    self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                                    self.contrato_obj.contratista_tipo_documento = ipn_response.data[0].TipoDocumento.ValorParametro;
                                });
                            });
                        });
                    });

                    //Obtencion de datos del Supervisor
                    amazonAdministrativaRequest.get('informacion_persona_natural?query=Id:' + self.contrato_obj.supervisor_cedula).then(function (ipns_response) {
                        coreAmazonRequest.get('ciudad', 'query=Id:' + ipns_response.data[0].IdCiudadExpedicionDocumento).then(function (cs_response) {
                            self.contrato_obj.supervisor_ciudad_documento = cs_response.data[0].Nombre;
                            self.contrato_obj.supervisor_tipo_documento = ipns_response.data[0].TipoDocumento.ValorParametro;
                            self.contrato_obj.supervisor_nombre_completo = ipns_response.data[0].PrimerNombre + " " + ipns_response.data[0].SegundoNombre + " " + ipns_response.data[0].PrimerApellido + " " + ipns_response.data[0].SegundoApellido;

                        });
                    });
                }
            });
            //Obtencion tipo de contrato
            amazonAdministrativaRequest.get('tipo_contrato?query=Id:' + wso_response.data.contrato.tipo_contrato).then(function (tc_response) {
                self.contrato_obj.tipo_contrato = tc_response.data[0].TipoContrato;
            });
        });
        //Obtencion de datos de la poliza
        contratoRequest.get('poliza_suscrito', self.contrato_id + '/' + self.contrato_vigencia).then(function (wso_response) {
            var cantidad_elementos = Object.keys(wso_response.data["poliza_contrato"]).length;
            if (cantidad_elementos > 0) {
                self.poliza_obj.numero_poliza = wso_response.data.poliza_contrato.numero_poliza;
                self.poliza_obj.fecha_aprobacion = wso_response.data.poliza_contrato.fecha_aprobacion;
                self.poliza_obj.fecha_expedicion = wso_response.data.poliza_contrato.fecha_expedicion;
            } else {
                self.poliza_obj.numero_poliza = $translate.instant('NO_REGISTRA_ACTA_INICIO');
                self.poliza_obj.fecha_aprobacion = $translate.instant('NO_REGISTRA_FECHA_APROBACION');
                self.poliza_obj.fecha_expedicion = $translate.instant('NO_REGISTRA_FECHA_EXPEDICION');
            }
        });
        /**
         * @ngdoc method
         * @name calculoTiempo
         * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaSuspensionCtrl
         * @description2017
         * Funcion que observa el cambio de fechas y calcula el periodo de suspension
         * @param {date} Fecha de reinicio
         */
        $scope.$watch('sLactaInicio.fecha_fin', function () {
            var dt1 = self.fecha_inicio;
            var dt2 = self.fecha_fin;
            var timeDiff = 0;

            if (dt2 != null) {
                timeDiff = Math.abs(dt2.getTime() - dt1.getTime());
            }
            var last_time = Math.ceil(timeDiff / (1000 * 3600 * 24))
            if (last_time == 0) {
                self.diff_dias = null;
            } else {
                self.diff_dias = last_time;
            }
        });
        /*app.controller('SelectEntidad', ['$scope', function($scope){
            
            $scope.e*legido = 'tres'
          }]);*/

        /**
         * @ngdoc method
         * @name generarActa
         * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
         * @description
         * funcion que valida la data de la novedad
         */
        self.generarActa = function () {
            if (self.fecha_inicio > self.fecha_fin) {
                swal(
                    'Oops...',
                    $translate.instant('DESCRIPCION_INICIO_ERROR_FECHA'),
                    'error'
                )
            } else {
                self.data_acta_inicio = {
                    contrato: self.contrato_obj.id,
                    fechafin: self.fecha_fin,
                    fechainicio: self.fecha_inicio,
                    vigencia: String(self.contrato_obj.VigenciaContrato)
                }
                self.cesion_nov = {
                    aclaracion: "",
                    camposaclaracion: null,
                    camposmodificacion: null,
                    camposmodificados: null,
                    cedente: 0,
                    cesionario: self.contrato_obj.contratista,
                    contrato: self.contrato_obj.id,
                    fechaadicion: "0001-01-0…1T00:00:00Z",
                    fechacesion: "0001-01-01T00:00:00Z",
                    fechaliquidacion: "0001-01-01T00:00:00Z",
                    fechaprorroga: "0001-01-01T00:00:00Z",
                    fecharegistro: "0001-01-01T00:00:00Z",
                    fechareinicio: "0001-01-01T00:00:00Z",
                    fechasolicitud: new Date(),
                    fechasuspension: "0001-01-01T00:00:00Z",
                    fechaterminacionanticipada: "0001-01-01T00:00:00Z",
                    motivo: "",
                    numeroactaentrega: 0,
                    numerocdp: "",
                    numerooficioestadocuentas: 0,
                    numerosolicitud: 0,
                    observacion: "",
                    periodosuspension: 0,
                    plazoactual: 0,
                    poliza: "",
                    tiempoprorroga: 0,
                    tiponovedad: "59d79683867ee188e42d8c98",
                    valoradicion: 0,
                    valorfinalcontrato: 0,
                    vigencia: "2017"
                }

                poliza.EntidadAseguradoraId = 1;
                poliza.NumeroPolizaId = self.numero_poliza
                console.log(poliza)



                /*novedadesRequest.put('poliza', 'query=IdNovedadesPoscontractuales:' + last_newness.id).then(function (nrp_response) {
                    poliza=nrp_response.data[0]
                });*/

                self.crearActa();
                /* argoNosqlRequest.post('novedad', self.cesion_nov).then(function (response_nosql) {
                     if (response_nosql.status == 200 || response_nosql.statusText == "OK") {
                         self.crearActa();
                     }
                 });*/

            }
        };

        /**
         * @ngdoc method
         * @name crearActa
         * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
         * @description
         * funcion que valida la generacion del acta de novedad
         */
        self.crearActa = function () {
            swal({
                title: $translate.instant('TITULO_BUEN_TRABAJO'),
                type: 'success',
                html: $translate.instant('DESCRIPCION_INICIO') + self.contrato_obj.id + $translate.instant('ANIO') + self.contrato_obj.VigenciaContrato + '.<br><br>' + $translate.instant('DESCRIPCION_INICIO_1'),
                showCloseButton: false,
                showCancelButton: false,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
                allowOutsideClick: false
            }).then(function () {
                //window.location.href = "#/seguimientoycontrol/legal";
            });
        };

        /**
         * @ngdoc method
         * @name format_date
         * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegalActaInicioCtrl
         * @description
         * funcion para el formateo de objetos tipo fecha a formato dd/mm/yyyy
         * @param {date} param
         */
        self.format_date = function (param) {

            var date = new Date(param);;
            var dd = date.getDate();
            var mm = date.getMonth() + 1;
            var yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var today = 'Día: ' + dd + '  Mes: ' + mm + '  Año: ' + yyyy;
            return today;
        };

        self.format_date_letter = function (param) {
            var cadena = param.split("-");
            var dd = cadena[2];
            var mm = cadena[1] - 1;
            var yyyy = cadena[0];
            var fecha = new Date(yyyy, mm, dd);
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            return fecha.toLocaleDateString("es-ES", options);
        };

        function Unidades(num) {

            switch (num) {
                case 1: return "Un";
                case 2: return "Dos";
                case 3: return "Tres";
                case 4: return "Cuatro";
                case 5: return "Cinco";
                case 6: return "Seis";
                case 7: return "Siete";
                case 8: return "Ocho";
                case 9: return "Nueve";
            }

            return "";
        }//Unidades()

        function Decenas(num) {

            var decena = Math.floor(num / 10);
            var unidad = num - (decena * 10);

            switch (decena) {
                case 1:
                    switch (unidad) {
                        case 0: return "Diez";
                        case 1: return "Once";
                        case 2: return "Doce";
                        case 3: return "Trece";
                        case 4: return "Catorce";
                        case 5: return "Quince";
                        default: return "Dieci" + Unidades(unidad);
                    }
                case 2:
                    switch (unidad) {
                        case 0: return "Veinte";
                        default: return "Veinti" + Unidades(unidad);
                    }
                case 3: return DecenasY("Treinta", unidad);
                case 4: return DecenasY("Cuarenta", unidad);
                case 5: return DecenasY("Cincuenta", unidad);
                case 6: return DecenasY("Sesenta", unidad);
                case 7: return DecenasY("Setenta", unidad);
                case 8: return DecenasY("Ochenta", unidad);
                case 9: return DecenasY("Noventa", unidad);
                case 0: return Unidades(unidad);
            }
        }//Decenas()

        function DecenasY(strSin, numUnidades) {
            if (numUnidades > 0)
                return strSin + " Y " + Unidades(numUnidades)

            return strSin;
        }//DecenasY()

        function Centenas(num) {
            var centenas = Math.floor(num / 100);
            var decenas = num - (centenas * 100);

            switch (centenas) {
                case 1:
                    if (decenas > 0)
                        return "Ciento " + Decenas(decenas);
                    return "Cien";
                case 2: return "Doscientos " + Decenas(decenas);
                case 3: return "Trescientos " + Decenas(decenas);
                case 4: return "Cuatroscientos " + Decenas(decenas);
                case 5: return "Quinientos " + Decenas(decenas);
                case 6: return "Seiscientos" + Decenas(decenas);
                case 7: return "Setecientos " + Decenas(decenas);
                case 8: return "Ochocientos " + Decenas(decenas);
                case 9: return "Novecientos " + Decenas(decenas);
            }

            return Decenas(decenas);
        }//Centenas()

        function Seccion(num, divisor, strSingular, strPlural) {
            var cientos = Math.floor(num / divisor)
            var resto = num - (cientos * divisor)
            var letras = "";
            if (cientos > 0)
                if (cientos > 1)
                    letras = Centenas(cientos) + " " + strPlural;
                else
                    letras = strSingular;
            if (resto > 0)
                letras += "";
            return letras;
        }//Seccion()

        function Miles(num) {
            var divisor = 1000;
            var cientos = Math.floor(num / divisor)
            var resto = num - (cientos * divisor)

            var strMiles = Seccion(num, divisor, "Un Mil", "Mil");
            var strCentenas = Centenas(resto);

            if (strMiles == "")
                return strCentenas;

            return strMiles + " " + strCentenas;
        }//Miles()

        function Millones(num) {
            var divisor = 1000000;
            var cientos = Math.floor(num / divisor)
            var resto = num - (cientos * divisor)

            var strMillones = Seccion(num, divisor, "Un Millón ", "Millones ");
            var strMiles = Miles(resto);

            if (strMillones == "")
                return strMiles;

            return strMillones + " " + strMiles;
        }//Millones()
    }).config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return date ? moment(date).format('DD/MM/YYYY') : '';
        };
    });