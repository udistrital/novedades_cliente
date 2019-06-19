# administrativa-cliente

En este repositorio en la rama “novedades” se encuentra el cliente del proyecto interno Argo, para despliegue local se debe tener corriendo [administrativa_NoSQL_api](https://github.com/udistrital/administrativa_NoSQL_api)  en el puerto 8083.
Se hace uso de :
* [Angular JS](https://angularjs.org/)
* [Bootstrap 3](https://getbootstrap.com/docs/3.3/)
* [Angular JS generator](https://github.com/fabianLeon/oas)
* [Node.js en la versión estabel](https://nodejs.org/en/)

## Configuración del proyecto
* Clonar el repositorio: 
    ```shell 
        git clone https://github.com/udistrital/administrativa_cliente.git
    ```
* Abrir una terminal en la raíz del proyecto y cambiar a la rama "novedades".
    ```shell 
        git checkout novedades
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

Para ejcutar el proyecto localmente se debe verificar en el archivo “config.js”, ubicado en la carpeta app/scripts/services/, que las apis estén correactamente configuradas y que se esté usando **conf_local**:
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

* **Variables de Entorno** para despliegue local:
```
    var conf_local = {
        WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
        ACADEMICA_SERVICE: "http://10.20.0.127/urano/index.php?data=B-7djBQWvIdLAEEycbH1n6e-
        3dACi5eLUOb63vMYhGq0kPBs7NGLYWFCL0RSTCu1yTlE5hH854MOgmjuVfPWyvdpaJDUOyByX-
        ksEPFIrrQQ7t1p4BkZcBuGD2cgJXeD",
        ACADEMICA_WSO_SERVICE: "https://jbpm.udistritaloas.edu.co:8243/services/academicaProxy/",
        ADMINISTRATIVA_MID_SERVICE: "http://localhost:8082/v1/",
        ADMINISTRATIVA_SERVICE: "http://localhost:8085/v1/",
        ADMINISTRATIVA_PRUEBAS_SERVICE: "http://localhost:8084/v1/",
        RESOLUCION_SERVICE: "http://10.20.0.254/resoluciones_crud/v1/",
        ARGO_NOSQL_SERVICE: "http://10.20.2.43:8083/v1/",
        ARKA_SERVICE: "https://autenticacion.udistrital.edu.co:8244/arka_api_crud/v1/",
        CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
        CORE_SERVICE: "http://10.20.0.254/core_api/v1/",
        CORE_AMAZON_SERVICE: "http://10.20.0.254/core_amazon_crud/v1/",
        FINANCIERA_MID_SERVICE: "http://10.20.0.254/financiera_mid_api/v1/",
        FINANCIERA_SERVICE: "http://10.20.0.254/financiera_api/v1/",
        MODELS_SERVICE: "scripts/models/",
        NOTIFICACION_WS: "ws://10.20.2.134:8080/ws/join",
        OIKOS_SERVICE: "http://10.20.0.254/oikos_api/v1/",
        OIKOS_AMAZON_SERVICE: "http://10.20.0.254/oikos_amazon_api/v1/",
        PAGOS_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxyService/ingresos_concepto/",
        TITAN_SERVICE: "http://10.20.0.254/titan_api_crud/v1/",
        SICAPITAL_SERVICE: "http://10.20.0.127/sicws/ws/sicapitalAPI.php/?/",
        CONTRATO_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services/contratoSuscritoProxyService/",
        NUXEO_SERVICE: "https://documental.udistrital.edu.co/nuxeo/",
        HOMOLOGACION_SERVICE:"https://autenticacion.udistrital.edu.co:8244/dependencias_api/v1/",
        TOKEN: {
            AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
            URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
            CLIENTE_ID: "pszmROXqfec4pTShgF_fn2DAAX0a",
            REDIRECT_URL: "http://localhost:9000/",
            RESPONSE_TYPE: "code",
            SCOPE: "openid email",
            BUTTON_CLASS: "btn btn-warning btn-sm",
            SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
            SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
            SIGN_OUT_APPEND_TOKEN: "true",
            REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
            CLIENT_SECRET: "2crHq2IRkFHEVTBfpznLhKHyKVIa"
        },
    };
```