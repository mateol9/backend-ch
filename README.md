# Servidor con ExpressJs

## Instalación

    git clone https://github.com/mateol9/backend-ch.git

    cd ./backend-ch

    npm install

## Iniciar Servidor

### Dentro de la carpeta backend-ch:

#### Con Node:

    node ./src/app.js

#### Con Nodemon:

    nodemon ./src/app.js

## Navegación

> Ingrese la ruta /products en la url para visualizar el array con los productos.

> Al añadir el query /products?limit={number} podra visualizar el array hasta el limite de productos que elija.

> Agregando un parametro con el numero de id del producto que desea, puede visualizar unicamente ese producto: /products/{id}.
