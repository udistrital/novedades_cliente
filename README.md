# administrativa-cliente

En este repositorio se encuentra el cliente del proyecto interno Argo, para despliegue local se debe tener corriendo [administrativa_NoSQL_api](https://github.com/udistrital/administrativa_NoSQL_api)  en el puerto 8083.
Se hace uso de :
* [Angular JS](https://angularjs.org/)
* [Bootstrap 3](https://getbootstrap.com/docs/3.3/)
* [Angular JS generator](https://github.com/fabianLeon/oas)
* [Node.js en la versión estable](https://nodejs.org/en/)

## Configuración del proyecto

* Clonar el repositorio: 
    ```shell 
        git clone https://github.com/udistrital/novedades_cliente.git
    ```
* Instalar yo, grunt, bower y generator- karma y generator-oas
    ```shell 
        npm install -g grunt-cli bower yo generator-karma generator-oas
    ```
* Instalar dependencias
    ```shell 
        npm install
    ```
    ```shell 
        bower install
    ```


## Ejecución del proyecto

Para ejcutar el proyecto localmente se debe verificar en el archivo “config.js”, ubicado en la carpeta app/scripts/services/, que las apis estén correactamente configuradas y que estén deplegadas.

**conf_local**:
```
angular.module('contractualClienteApp').constant('CONF', { 
    GENERAL: conf_local
    });
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

Inicalmente se verá una pantalla sin menú ni opciones de navegación, para acceder a Argo ir a la siguiente ruta ***/#/seguimientoycontrol/legal*** [link aquí](http://localhost:9000/#/seguimientoycontrol/legal)


## Pruebas unitaras

La pruebas se relizan con [karma](https://karma-runner.github.io/latest/index.html), ejecutar el comando:
    ```shell 
        grunt test
    ```

## Dependencias Utilizadas

* **API CRUD**: [administrativa_NoSQL_api](https://github.com/udistrital/administrativa_NoSQL_api ) se encarga de gestionar la base de datos de novedades.

* **Herramienta utilizada**: [AngularJS generator](https://github.com/fabianLeon/oas)

* **APIs** para despliegue local:

  * WSO2_SERVICE: Servidor en local de la oficina
  * ACADEMICA_SERVICE: Servidor en local de la oficina
  * ACADEMICA_WSO_SERVICE: Servidor JBPM
  * ADMINISTRATIVA_MID_SERVICE: Servidor en local de la oficina
  * ADMINISTRATIVA_SERVICE: Servidor en local de la oficina
  * ADMINISTRATIVA_PRUEBAS_SERVICE: Servidor en local de la oficina
  * RESOLUCION_SERVICE: Servidor en local de la oficina
  * ARGO_NOSQL_SERVICE: Local -> http://localhost:8083/v1/
  * ARKA_SERVICE: Servidor en local de la oficina
  * CONFIGURACION_SERVICE: Servidor en local de la oficina
  * CORE_SERVICE: Servidor en local de la oficina
  * CORE_AMAZON_SERVICE: Servidor en local de la oficina
  * FINANCIERA_MID_SERVICE: Servidor en local de la oficina
  * FINANCIERA_SERVICE: Servidor en local de la oficina
  * NOTIFICACION_WS: Servidor de notificaciones de local de la oficina
  * OIKOS_SERVICE: Servidor en local de la oficina
  * OIKOS_AMAZON_SERVICE: Servidor en local de la oficina
  * PAGOS_SERVICE: Servidor en local de la oficina
  * TITAN_SERVICE: Servidor en local de la oficina
  * SICAPITAL_SERVICE: Servidor de Si Capital de local de la oficina
  * CONTRATO_SERVICE: Servidor en local de la oficina
  * NUXEO_SERVICE: Servidor de nuxeo(Gestor Documental)

