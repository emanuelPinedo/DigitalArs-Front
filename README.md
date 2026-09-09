# DigitalArs

Billetera virtual desarrollada como proyecto integrador para **Aceleración Tech Río Negro by Alkemy**.

Permite a los usuarios registrarse, autenticarse y gestionar sus operaciones financieras de forma segura, incluyendo la consulta de cuentas y movimientos, depósitos, transferencias y constitución de plazos fijos.

## Descripción

DigitalArs es una aplicación web desarrollada con **React + Vite** que funciona como interfaz de ususario para una billetera virtual.

## Funcionalidades principales

El frontend permite acceder a las siguientes funcionalidades:

### Usuario

* Registro e inicio de sesión.
* Consulta de saldo disponible.
* Visualización de últimos movimientos.
* Realización de depósitos.
* Realización de transferencias.
* Consulta y constitución de depósitos a plazo fijo.
* Gestión y actualización del perfil.
* Recepción de notificaciones en tiempo real.
* Cierre de sesión.

### Administrador

* Acceso a funcionalidades exclusivas según el rol `Admin`.
* Gestión de usuarios.
* Consulta y administración de información disponible para la gestión del sistema.

El acceso a las funcionalidades administrativas está restringido mediante el sistema de roles implementado en el backend y las rutas protegidas del frontend.

## Stack tecnológico

### Frontend

* **React + Vite** para el desarrollo de la aplicación web.
* **React Router DOM** para navegación y rutas protegidas.
* **Axios** para la comunicación con la API y el manejo de autenticación mediante interceptores.
* **Context API** para la gestión del estado de autenticación.
* **ReactBits** para componentes y recursos visuales.

### Backend

El frontend se comunica con la API REST de **DigitalArs** desarrollada en **.NET 10** mediante **Axios**.

La documentación completa del backend, incluyendo instalación, configuración, migraciones, Swagger/OpenAPI, Postman y tests, se encuentra en su repositorio:

[Repositorio Backend](https://github.com/RamEloisa/Proyecto_DigitalArs.git)

## Comunicación 

La URL base de la API se configura mediante la variable de entorno `VITE_API_URL` (formato disponible en `.env_example`):

```env
VITE_API_URL=https://localhost:{puerto}/api
```

Axios se utiliza para:

* Realizar solicitudes HTTP a los distintos endpoints de la API.
* Enviar el token JWT en las solicitudes que requieren autenticación.
* Gestionar las respuestas de la API.
* Detectar respuestas **401 (Unauthorized)** mediante interceptores y gestionar la sesión del usuario.

El flujo general de comunicación es:

```text
Usuario
   ↓
Frontend React
   ↓
Axios
   ↓
API REST .NET
   ↓
SQL Server
```

La API se encarga de la lógica de negocio, validaciones, autenticación y acceso a la base de datos, mientras que el frontend se ocupa de la interfaz y la interacción con el usuario.

## Instalación

### Requisitos previos

Antes de ejecutar el proyecto necesitás tener instalado:

* **Node.js** y **npm**.
* **Visual Studio Code** o cualquier editor de código.
* El **backend de DigitalArs** configurado y en ejecución (para poder consumir la API).

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

El frontend utiliza variables de entorno para configurar la URL de la API. Este archivo debe agregarse a `.gitignore`.

4. Iniciá el servidor de desarrollo:

```bash
npm run dev
```

5. Abrí en el navegador la URL indicada por Vite en la consola. Por defecto:

`http://localhost:5173`

## Estructura del proyecto  ///revisar esto

La estructura principal del frontend se organiza de la siguiente manera:

```text
src/
├── components/
│   ├── admin/
│   │   └── AuthContext.jsx
│   │   └── AuthContext.jsx
│   └── layout/
│       └── AuthContext.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useAuth.js
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Perfil.jsx
│   └── ...
├── services/
│   ├── AccountService.js
│   ├── AuthService.js
│   ├── FixedTermDepositService.js
│   ├── NotificationService.js
│   ├── api.js
│   └── ...
├── styles/
│   └── api.js
│   ├── components/
│   ├── layout/
├── App.jsx
├── main.jsx
└── ...
```

### Descripción de las carpetas principales

* **`components/`**: componentes reutilizables de la interfaz.
* **`context/`**: contextos utilizados para compartir estado global de la aplicación.
* **`hooks/`**: hooks personalizados.
* **`pages/`**: páginas principales de la aplicación.
* **`services/`**: configuración y servicios utilizados para la comunicación con el backend.
* **`styles/`**: diseño de estilos de componentes y páginas de la aplicación.
* **`App.jsx`**: componente principal y configuración general de las rutas.
* **`main.jsx`**: punto de entrada de la aplicación React.

## Autenticación y autorización

El frontend utiliza **JWT (JSON Web Token)** para gestionar la autenticación de los usuarios y controlar el acceso a las funcionalidades de la aplicación.

El flujo de autenticación es el siguiente:

1. El usuario ingresa sus credenciales desde el formulario de inicio de sesión.
2. El frontend envía las credenciales al endpoint de login del backend mediante **Axios**.
3. Si las credenciales son válidas, el backend devuelve un **JWT**.
4. El token se almacena en el navegador y se utiliza para mantener la sesión del usuario.
5. **Context API** gestiona el estado de autenticación dentro de la aplicación.
6. Las rutas protegidas verifican que exista una sesión válida antes de permitir el acceso.
7. El acceso a determinadas funcionalidades se controla según el **rol del usuario** (`User` o `Admin`).
8. Si la API devuelve un error **401 (Unauthorized)**, el frontend gestiona la sesión y redirige al usuario al inicio de sesión.

### Roles

* **User**: acceso a las funcionalidades disponibles para usuarios regulares, como consultar saldo y movimientos, realizar operaciones y gestionar su perfil.
* **Admin**: además de las funcionalidades de usuario, puede acceder a las funcionalidades administrativas habilitadas por el sistema.

## Estado del proyecto

El frontend de **DigitalArs** se encuentra en desarrollo y cuenta con las principales funcionalidades de la billetera digital implementadas e integradas con la API REST.

Actualmente incluye:

* Autenticación y gestión de sesiones mediante JWT.
* Rutas protegidas y control de acceso por roles.
* Consulta de saldo y movimientos.
* Depósitos y transferencias.
* Depósitos a plazo fijo.
* Gestión de perfil.
* Notificaciones en tiempo real.
* Funcionalidades administrativas.
* Integración con el backend desarrollado en .NET 10.
* Diseño responsive adaptado a múltiples formatos de pantalla.
* Tema claro y tema oscuro.

El proyecto puede continuar evolucionando con nuevas funcionalidades, mejoras de interfaz, optimizaciones y pruebas adicionales.
