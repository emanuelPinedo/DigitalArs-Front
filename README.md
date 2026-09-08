# DigitalArs

Billetera virtual desarrollada como proyecto integrador para **Aceleración Tech Río Negro by Alkemy**.

Permite a los usuarios registrarse, autenticarse y gestionar sus operaciones financieras de forma segura, incluyendo la consulta de cuentas y movimientos, depósitos, transferencias y constitución de plazos fijos.

## Descripción

DigitalArs es una aplicación web desarrollada con **React + Vite** que consume una API REST desarrollada en **.NET 10**.

La aplicación permite:

* Registro e inicio de sesión de usuarios.
* Consulta de saldo y movimientos.
* Realización de depósitos y transferencias.
* Constitución y consulta de depósitos a plazo fijo.
* Consulta y actualización del perfil.
* Visualización de notificaciones en tiempo real.
* Acceso a funcionalidades administrativas según el rol del usuario.

El frontend y el backend se encuentran en repositorios independientes y se comunican mediante HTTP.

## Stack tecnológico

### Frontend

* **React + Vite** para el desarrollo de la aplicación web.
* **React Router DOM** para navegación y rutas protegidas.
* **Axios** para la comunicación con la API y el manejo de autenticación mediante interceptores.
* **Context API** para la gestión del estado de autenticación.
* **ReactBits** para componentes y recursos visuales.

### Backend

El frontend consume la API REST desarrollada en **.NET 10**.

La documentación completa del backend, incluyendo instalación, configuración, migraciones, Swagger/OpenAPI, Postman y tests, se encuentra en su repositorio:

[Repositorio Backend](https://github.com/RamEloisa/Proyecto_DigitalArs.git)

## Instalación

### Requisitos previos

Antes de ejecutar el proyecto necesitás tener instalado:

* **Node.js** y **npm**.
* **Visual Studio Code** o cualquier editor de código.
* El **backend de DigitalArs** configurado y en ejecución.

### Configuración

1. Cloná el repositorio y abrilo en Visual Studio Code.

2. Desde la carpeta raíz del frontend, instalá las dependencias:

```bash
npm install
```

3. Creá un archivo `.env` en la raíz del proyecto con la URL del backend:

```env
VITE_API_URL=https://localhost:{puerto}/api
```

> El puerto depende de la configuración local del backend.

4. Iniciá el servidor de desarrollo:

```bash
npm run dev
```

5. Abrí en el navegador la URL indicada por Vite en la consola. Por defecto:

`http://localhost:5173`

## Variables de entorno

El frontend utiliza variables de entorno para configurar la URL de la API.

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://localhost:{puerto}/api

