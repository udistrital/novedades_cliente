'use strict';

angular.module('contractualClienteApp')
    .factory('pdfMakerService', function ($http, $translate) {
        var self = {};

        var docDefinition = {
            content: [
                {
                    style: ['header', "p"],
                    margin: [0, 0, 0, 15],
                    table: {
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,
                        widths: ['10%', '*', '40%'],
                        body: [
                            [
                                { text: 'Image Ud', rowSpan: 4 },
                                { text: 'Solicitud Necesidad'.toUpperCase(), rowSpan: 4, margin: [0, 33, 0, 0], style: "headerTitle" },
                                { text: "Dependencia Solicitante", style: "title1", border: [true, true, true, false] }
                            ],
                            [
                                "",
                                "",
                                { text: "Sección de Almacén General e Inventarios".toUpperCase(), border: [true, false, true, true] }
                            ],
                            [
                                "",
                                "",
                                {
                                    alignment: 'center',
                                    columns: [
                                        [{ text: "Vigencia", style: "title1" }, 2017],
                                        [{ text: "No. Solicitud", style: "title1" }, 349]
                                    ],
                                    columnGap: 10
                                }
                            ],
                            [
                                "",
                                "",
                                "Página 1 de 1",

                            ]
                        ]
                    }
                },
                {
                    style: "p",
                    layout: {
                        fillColor: function (i, node) {
                            return (i % 2 === 1) ? '#CCCCCC' : null;
                        }
                    },
                    table: {
                        headerRows: 0,
                        widths: ["100%"],

                        body: [
                            [{ alignment: "center", text: [{ bold: true, text: "Fecha de Solicitud: " }, "17 de Enero de 2017"] }],
                            [{ style: "title1", text: "JUSTIFICACIÓN (Identifique de forma clara y conta la necesidad de la contratación)" }],
                            [{ alignment: "justify", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.".toUpperCase() }],
                            [{ style: "title2", text: "ESPECIFICACIONES TÉCNICAS: Si la compra o el servicio que contempla especificaciones del orden técnico describalas." }],
                            [
                                {
                                    table: {
                                        headerRows: 1,
                                        widths: ["auto", "auto", "*", "auto"],
                                        body: [
                                            ["Descripción", "", "Cantidad", "Unidad"],
                                            [["Cod. 1", "Especificación:"],
                                            ["TÉCNICO", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'"],
                                            { text: 1, alignment: "center" },
                                                ""]
                                        ]
                                    }
                                }
                            ],
                            [{ style: "title1", text: "Información del contacto".toUpperCase() }],
                            [[
                                {
                                    columnGap: 10,
                                    columns: [
                                        { style: "title2", text: "Objeto:", width: "auto" },
                                        { alignment: "justify", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'" }
                                    ]
                                },
                                {
                                    columnGap: 10,
                                    columns: [
                                        { style: "title2", text: "Duración:", width: "auto" },
                                        { text: "" }
                                    ]
                                },
                                {
                                    columnGap: 10,
                                    columns: [
                                        { style: "title2", text: "Valor Estimado:", width: "auto" },
                                        { text: "$24.344.611.00" }
                                    ]
                                }
                            ]],
                            [{ style: "title1", text: "Datos del supervisor/interventor".toUpperCase() }],
                            [[
                                {
                                    columnGap: 10,
                                    columns: [
                                        { style: "title2", text: "Nombre:", width: "12%" },
                                        { text: "Victor Hugo Sandoval Ramirez".toUpperCase() }
                                    ]
                                },
                                {
                                    columnGap: 10,
                                    columns: [
                                        { style: "title2", text: "Dependencia:", width: "12%" },
                                        { text: "Sección de almacén General e Inventarios".toUpperCase() }
                                    ]
                                },
                            ]],
                            [{ style: "title1", text: "Plan de Contratación/Rubro Presupuestal y/o centro de costos".toUpperCase() }],
                            [[
                                {
                                    margin: [0, 0, 0, 5],
                                    columnGap: 10,
                                    columns: [
                                        { text: "3-1-001-01-02-10-0000-0", width: "auto" },
                                        { text: "Remuneración Servicios Técnicos".toUpperCase(), width: "*" },
                                        { text: "$24,344,661".toUpperCase(), width: "auto" }
                                    ]
                                },
                                {
                                    alignment: "center",
                                    columnGap: 10,
                                    columns: [
                                        { text: "", width: "10%" },
                                        { text: "Centro de Costo".toUpperCase() },
                                        { text: "" },
                                        { text: "Actividad".toUpperCase() },
                                        { text: "" },
                                    ]
                                },
                                {
                                    columnGap: 10,
                                    columns: [
                                        { text: 130401, width: "10%" },
                                        { text: "Sección de Almacén e Inventarios" },
                                        { text: 2, width: "auto" },
                                        { text: "Grupo de Actividades Administrativas" },
                                        { text: "$24,344,661", width: "auto" },
                                    ]
                                },
                            ]],
                            [{ style: "title1", text: "Marco Legal".toUpperCase() }],
                            [{ text: "Ningunas" }],
                            [{ style: "title1", text: "Requisitos Mínimos".toUpperCase() }],
                            [[
                                {
                                    table: {
                                        headerRows: 1,
                                        widths: ["auto", "*", "*"],
                                        body: [
                                            ["Secuencia", "Requisito", "Observaciones"],
                                            [1, "Técnico".toUpperCase(), "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur."]
                                        ]
                                    }
                                }
                            ]],
                            [{ style: "title1", text: "Anexos".toUpperCase() }],
                            [[
                                {
                                    table: {
                                        headerRows: 1,
                                        widths: ["auto", "*", "*"],
                                        body: [
                                            ["Secuencia", "Requisito", "Observaciones"],
                                        ]
                                    }
                                }
                            ]],
                            [""],
                            [{
                                alignment: "center",
                                margin: [10, 30, 10, 20],
                                stack: [
                                    "Victor Hugo Sandoval Ramirez".toUpperCase(),
                                    { bold: true, text: "Firma del Responsable de la dependencia solicitante" }
                                ]
                            }]
                        ]
                    }
                }
            ],

            styles: {
                header: {
                    alignment: 'center',
                },
                p: {
                    fontSize: 9
                },
                headerTitle: {
                    fontSize: 10,
                    bold: true,
                    alignment: "center"
                },
                title1: {
                    fontSize: 9,
                    bold: true,
                    alignment: "center"
                },
                title2: {
                    fontSize: 9,
                    bold: true,
                }

            },
            pageMargins: [50, 60, 60, 60],
            // a string or { width: number, height: number }
            pageSize: 'letter',

            // by default we use portrait, you can change it to landscape if you wish
            pageOrientation: 'portrait',

        }
        return self;
    });
