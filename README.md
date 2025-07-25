# Code-Fu README Badge

## Desarrollado por

![CodeFU staff](https://code-fu-readme-badge-1c0198600f3b.herokuapp.com/badges/dalvarez.svg)
![CodeFU staff](https://code-fu-readme-badge-1c0198600f3b.herokuapp.com/badges/cruiz.svg)

## Descripción del Proyecto

Code-Fu README Badge es un proyecto diseñado para proporcionar insignias personalizadas para los staffs de Code-FU.

Si eres miembro del staff puedes acceder a tu badge personalizada a través del siguiente link:

https://code-fu-readme-badge-1c0198600f3b.herokuapp.com/badges/staffCode.svg

Reemplaza `staffCode` en la url con tu código de staff y listo, podrás ver tu badge, la cual puedes usar donde quieras

## Prerequisitos

Para poder utilizar este proyecto en un entorno local, se necesitan tener instalados los siguientes programas:

- [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) ![22.14.0+](https://img.shields.io/badge/22.14.0%2B-gray?style=for-the-badge)
- [![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/) ![10.8.3+](https://img.shields.io/badge/10.8.3%2B-gray?style=for-the-badge)
- [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/) ![3.13.2+](https://img.shields.io/badge/3.13.2%2B-gray?style=for-the-badge)
- [![Git](https://img.shields.io/badge/Git-%23F05033?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)

## Instalación

Para instalar el proyecto junto a sus dependencias, sigue estos pasos:

```bash
git clone https://github.com/DavidGDA/code-fu-readme-badge.git
cd code-fu-readme-badge
npm install

# Cree un entorno virtual de python y instale sus dependencias
python -m venv .venv
python -m pip install -r requirements.txt
```

## Uso

Para ejecutar el servidor de desarrollo, ejecute el siguiente comando:

```bash
npm run dev
```

Navegue hacia [localhost:3000](http://localhost:3000) deberia de observar "App is running"

## Uso con Docker

Para ejecutar el proyecto utilizando Docker, sigue estos pasos:

1. Asegúrate de tener Docker instalado en tu sistema. Puedes descargarlo e instalarlo desde [aquí](https://www.docker.com/get-started).

2. Construye la imagen de Docker:

    ```bash
    docker build -t code-fu-readme-badge .
    ```

3. Ejecuta el contenedor de Docker:

    ```bash
    docker run -p 3000:3000 code-fu-readme-badge
    ```

4. Navega hacia [localhost:3000](http://localhost:3000) en tu navegador. Deberías ver "App is running".

## Contribución

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`).
4. Sube tus cambios (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.
