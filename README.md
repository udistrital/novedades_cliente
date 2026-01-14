# novedades_cliente

El aplicativo tiene la finalidad de realizar novedades pos-contractuales sobre diferentes contratos.

Se permiten realizar novedades como:
- Adicion
- Adicion y prorroga
- Terminacion
- Liquidacion
- Cesion

Como feature sobre el aplicativo , se espera que realizar las respectivas modificacione spara poder realizar multiples novedades obre un mismo contrato con los calculos adecuados que esto requiere.

## Especificaciones Técnicas

### Tecnologías Implementadas y Versiones

* [Angular JS](https://angularjs.org/)
* [Bootstrap 3](https://getbootstrap.com/docs/3.3/)
* [Angular JS generator](https://github.com/fabianLeon/oas)
* [Node.js en la versión estable](https://nodejs.org/en/)

### Variables de Entorno
```shell
# En Pipeline
SLACK_AND_WEBHOOK: WEBHOOK de Slack Grupo ci-covid-serverles
AWS_ACCESS_KEY_ID: llave de acceso ID Usuario AWS
AWS_SECRET_ACCESS_KEY: Secreto de Usuario AWS
```

### Ejecución del Proyecto

Instalación

Node v14.21.23

```shell
# Clonar el repositorio:
git clone https://github.com/udistrital/novedades_cliente

# Instalar yo, grunt, bower y generator- karma y generator-oas
npm install -g grunt-cli bower yo generator-karma generator-oas

#Instalar dependencias
npm install
bower install
```
Iniciar el servidor en local

```bash
#  Para ejcutar el proyecto localmente se deben de verificar las variables de los diferentes servicios
#  las cuales se encuentran en la ruta `/app/scripts/enviroment` ,
#  en esta ruta se encuentran 3 archivos uno para cada ambiente (dev, test, prod)

/app/scripts/enviroment
```
Ahora se puede correr el api de la siguiente manera:
```shell
grunt serve
```
Para crear el build de la aplicación:
```shell
grunt build
```

El cliente se depliega en el puerto [9000](http://localhost:9000).

### Pruebas unitaras

La pruebas se relizan con [karma](https://karma-runner.github.io/latest/index.html), ejecutar el comando:
```bash
grunt test
```

## Estado CI

| Develop | Relese 0.0.1 | Master |
| -- | -- | -- |
|[![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/novedades_cliente/status.svg?ref=refs/heads/develop)](https://hubci.portaloas.udistrital.edu.co/udistrital/novedades_cliente)|[![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/novedades_cliente/status.svg?ref=refs/heads/release/0.0.1)](https://hubci.portaloas.udistrital.edu.co/udistrital/novedades_cliente)|[![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/novedades_cliente/status.svg)](https://hubci.portaloas.udistrital.edu.co/udistrital/novedades_cliente)|


## Licencia

This file is part of novedades_cliente

novedades_cliente is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

novedades_cliente is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with novedades_cliente. If not, see https://www.gnu.org/licenses/.
