# Tarea 2: Sistemas Distribuidos

Integrantes del grupo: Guillermo Martínez, Benjamín Ojeda

Tecnologías utilizadas Nodejs y Kafka.

Modulos de Node utilizados:

* express -> utilizado para la api
* Kafkajs -> librería para implementar kafka
* fs -> leer y escribir archivos JSON

## Instrucciones de ejecución

* Clonar el repositorio de github: https://github.com/Benja-Suprinha/tarea1
* Luego de clonarlo, se deben ingresar los siguientes comandos:
```shell
docker-compose build
docker-compose up
```
Con esto se levantan los servicios y podemos utilizar la app en el localhost.

### Preguntas

* ¿Por qué Kafka funciona bien en este escenario? 

Funciona bien porque kafka permite enviar información de alguna actualización, a todas las consumers que tengan un mismo tópico. Facilita la comunicación unidireccional entre apis

* Basado en las tecnologías que usted tiene a su disposición (Kafka, backend) ¿Qué haría usted para manejar
una gran cantidad de usuarios al mismo tiempo?

Escalar horizontalmente, en este contexto seria replicar las apis para así generar mas instancias y, por ende existirían mas consumers.

### Errores

Haciendo las ultimas pruebas en la apliación, nos surgieron los siguientes errores con el zookeper:

* KafkaJSNumberOfRetriesExceeded
* "error":"There is no leader for this topic-partition as we are in the middle of a leadership election"
* cause: KafkaJSProtocolError: There is no leader for this topic-partition as we are in the middle of a leadership election
