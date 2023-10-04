# Proyecto de Backend para Gestión de Usuarios, Rutinas y Ejercicios de Entrenamiento.

Este es un proyecto de backend que proporciona una API para la gestión de usuarios, rutinas y ejercicios de entrenamiento. La aplicación está construida utilizando Node.js, Express y MongoDB como base de datos.

## Endpoints de la API

La API proporciona los siguientes endpoints:

/api/users: Gestión de usuarios (registro, inicio de sesión, obtención de detalles de usuario).

/api/routines: Gestión de rutinas (creación, obtención de rutinas por usuario).

/api/exercises: Gestión de ejercicios de entrenamiento (creación, obtención de ejercicios).

## Autorización y Roles

La API utiliza un sistema de autorización basado en roles. Cada usuario puede tener uno de dos roles: "usuario" o "administrador". Los administradores tienen acceso a ciertas operaciones que los usuarios normales no tienen.
