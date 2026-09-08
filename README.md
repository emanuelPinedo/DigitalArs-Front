# DigitalArs

Billetera virtual desarrollada como proyecto integrador para Aceleración Tech Río Negro by Alkemy. Permite a los usuarios
registrarse, autenticarse y gestionar sus operaciones financieras de forma segura, incluyendo la consulta de cuentas y movimientos, depósitos, transferencias y constitución de plazos fijos.

## Descripción

DigitalArs es una aplicación web compuesta por una API REST desarrollada en .NET y un frontend desarrollado en React.

## Stack tecnológico

**Backend**
- .NET 10 / C#
- ASP.NET Core Web API
- Entity Framework Core (Code First) + SQL Server
- Autenticación JWT (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- BCrypt (`BCrypt.Net-Next`) para hasheo de contraseñas
- Mapster para mapeo entidad ↔ DTO
- FluentValidation para validación de requests
- Swagger / OpenAPI para documentación interactiva

**Frontend**
- React + Vite
- React Router DOM para navegación y rutas protegidas por sesión y por rol
- Axios para comunicación con la API, con interceptores para el manejo del token y respuestas 401
- ReactBits para componentes y recursos visuales
- Context API para gestión del estado de autenticación

## Instalación — Frontend

1. Cloná el repositorio y abrilo en Visual Studio Code.

2. Parado en la carpeta del frontend:

   ```bash
   npm install
   ```

3. Creá un archivo `.env` en la raíz del frontend (no se commitea) con la URL
   de tu backend:

   ```
   VITE_API_URL=https://localhost:7139/api
   ```

   (Ajustá el puerto al que te haya asignado Visual Studio al correr la API.)

4. Corré el proyecto:

   ```bash
   npm run dev
   ```

5. Abrí la URL que te indique la consola (por defecto `http://localhost:5173`).







