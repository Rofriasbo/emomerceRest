# Configuración del Entorno para el Proyecto eCommerce-REST

Este documento describe los pasos necesarios para configurar y ejecutar el entorno de desarrollo para el proyecto **eCommerce-REST**.

## Requisitos Previos

Asegúrate de que tu sistema cumpla con los siguientes requisitos:

- **Node.js** v16 o superior (incluye npm)
- **Git** para clonar el repositorio (opcional si ya descargaste el código fuente)
- Un gestor de base de datos compatible (detallado en la configuración de `.env`)

## Instrucciones de Configuración

1. **Clonar el Repositorio**

   Si aún no tienes el código, clónalo desde el repositorio remoto:

   ```bash
   git clone https://github.com/KaryMC18/CarritoCompra_ApiRest.git
   cd ecomerce-rest
   ```

2. **Instalar Dependencias**

   Ejecuta el siguiente comando para instalar todas las dependencias necesarias especificadas en `package.json`:

   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**

   El archivo `.env` contiene las variables necesarias para la configuración del proyecto. Asegúrate de que existe un archivo `.env` en la raíz del proyecto. Si no lo tienes, crea uno basado en el archivo de ejemplo (si está disponible) o configura las siguientes variables:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=usuario
   DB_PASSWORD=contraseña
   DB_NAME=ecommerce_db
   JWT_SECRET=clave_secreta
   ```

   Ajusta los valores según tu entorno local o de producción.

4. **Iniciar el Servidor**

   Una vez configurado, puedes iniciar el servidor con el siguiente comando:

   ```bash
   npm start
   ```

   El servidor debería iniciar en el puerto especificado (por defecto `http://localhost:3000`).

## Estructura del Proyecto

- **`server.js`**: Archivo principal para inicializar el servidor.
- **`package.json`**: Contiene las dependencias y scripts del proyecto.
- **`.env`**: Archivo de configuración para variables sensibles.
- **`node_modules/`**: Directorio con las dependencias instaladas.

## Notas Adicionales

- Para ejecutar pruebas, si el proyecto tiene scripts definidos, usa:

  ```bash
  npm test
  ```

- Si encuentras problemas relacionados con permisos, usa el prefijo `sudo` al instalar dependencias.

## Problemas Comunes

- **El servidor no inicia:**
  - Verifica que las dependencias estén instaladas correctamente.
  - Asegúrate de que el archivo `.env` esté configurado adecuadamente.

- **Conexión a la base de datos fallida:**
  - Revisa que la base de datos esté corriendo y las credenciales sean correctas.


