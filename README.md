# ⚡ PokéBattle

Este es mi proyecto final. Decidí hacer una página inspirada en
Pokémon Showdown, pero haciendo una versión más sencilla.

La página permite crear un perfil, crear equipos de Pokémon y
después usar esos equipos para pelear contra una IA.

Para conseguir la información de los Pokémon utilicé PokéAPI.

---

## ¿Cómo usarlo?

Para abrir el proyecto lo hice con Visual Studio Code y Live Server.

Primero se abre `index.html` y desde ahí se puede:

1. Crear un perfil.
2. Seleccionar el perfil.
3. Crear un equipo.
4. Buscar un Pokémon por nombre o número.
5. Agregarlo al equipo.
6. Ir a la sección de batalla.
7. Seleccionar el equipo.
8. Empezar la batalla.

---

## Archivos del proyecto

El proyecto está separado de esta manera:

```text
PokéBattle/
│
├── index.html
├── equipos.html
├── batalla.html
│
├── css/
│   └── style.css
│
└── js/
    ├── app.js
    ├── equipos.js
    └── batalla.js