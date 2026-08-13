let equipoActual = null;

const CACHE_POKEMON = "pokemonCache";


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const perfil =
            obtenerPerfilActivo();


        if (!perfil) {

            document.getElementById(
                "contenido"
            ).style.display = "none";

            return;
        }


        document.getElementById(
            "sinPerfil"
        ).style.display = "none";


        document.getElementById(
            "titulo"
        ).textContent =
            "Equipos de " +
            perfil.nombre;


        if (perfil.equipos.length > 0) {

            equipoActual =
                perfil.equipos[0].id;

        }


        mostrarEquipos();


        document.getElementById(
            "formEquipo"
        ).addEventListener(
            "submit",
            crearEquipo
        );


        document.getElementById(
            "formPokemon"
        ).addEventListener(
            "submit",
            buscarPokemon
        );

    }
);


function actualizarPerfil(perfil) {

    const perfiles =
        obtenerPerfiles();


    const posicion =
        perfiles.findIndex(
            p => p.id == perfil.id
        );


    perfiles[posicion] =
        perfil;


    guardarPerfiles(
        perfiles
    );

}


function crearEquipo(event) {

    event.preventDefault();


    const nombre =
        document.getElementById(
            "nombreEquipo"
        ).value.trim();


    const error =
        document.getElementById(
            "errorEquipo"
        );


    if (nombre.length < 2) {

        error.textContent =
            "El nombre del equipo es muy corto.";

        return;
    }


    const perfil =
        obtenerPerfilActivo();


    const equipo = {

        id: Date.now(),

        nombre: nombre,

        pokemon: []

    };


    perfil.equipos.push(
        equipo
    );


    actualizarPerfil(
        perfil
    );


    equipoActual =
        equipo.id;


    document.getElementById(
        "nombreEquipo"
    ).value = "";


    error.textContent = "";


    mostrarEquipos();

}


function mostrarEquipos() {

    const perfil =
        obtenerPerfilActivo();


    const contenedor =
        document.getElementById(
            "equipos"
        );


    contenedor.innerHTML = "";


    perfil.equipos.forEach(
        function (equipo) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "equipo";


            if (
                equipo.id ==
                equipoActual
            ) {

                div.classList.add(
                    "activo"
                );

            }


            let pokemonHTML = "";


            equipo.pokemon.forEach(
                function (pokemon) {

                    pokemonHTML += `

                        <div>

                            <img
                                src="${pokemon.sprite}"
                                alt="${pokemon.name}"
                            >

                            <p>
                                ${pokemon.name}
                            </p>

                        </div>

                    `;

                }
            );


            div.innerHTML = `

                <div class="equipo-arriba">

                    <div>

                        <h3>
                            ${equipo.nombre}
                        </h3>

                        <p>
                            ${equipo.pokemon.length}/6 Pokémon
                        </p>

                    </div>


                    <button>
                        Seleccionar
                    </button>

                </div>


                <div class="pokemon-equipo">

                    ${pokemonHTML}

                </div>

            `;


            div.querySelector(
                "button"
            ).addEventListener(
                "click",
                function () {

                    equipoActual =
                        equipo.id;


                    mostrarEquipos();

                }
            );


            contenedor.appendChild(
                div
            );

        }
    );

}


async function buscarPokemon(event) {

    event.preventDefault();


    const nombre =
        document.getElementById(
            "buscar"
        ).value.trim().toLowerCase();


    const mensaje =
        document.getElementById(
            "mensaje"
        );


    const perfil =
        obtenerPerfilActivo();


    const equipo =
        perfil.equipos.find(
            e => e.id == equipoActual
        );


    if (!equipo) {

        mensaje.textContent =
            "Primero crea un equipo.";

        return;
    }


    if (
        equipo.pokemon.length >= 6
    ) {

        mensaje.textContent =
            "El equipo ya tiene 6 Pokémon.";

        return;
    }


    if (!nombre) {

        mensaje.textContent =
            "Escribe un Pokémon.";

        return;
    }


    try {

        mensaje.textContent =
            "Buscando Pokémon...";


        const pokemon =
            await obtenerPokemon(
                nombre
            );


        mostrarPokemon(
            pokemon
        );


        mensaje.textContent =
            "Pokémon encontrado.";

    }

    catch {

        mensaje.textContent =
            "No se encontró ese Pokémon.";

    }

}


/*
    BUSCAR POKÉMON

    Primero revisa localStorage.

    Si ya existe:
    NO hace fetch.

    Si no existe:
    consulta PokéAPI y lo guarda.
*/

async function obtenerPokemon(nombre) {

    const cache =
        JSON.parse(
            localStorage.getItem(
                CACHE_POKEMON
            ) || "{}"
        );


    /*
        Revisar caché
    */

    if (cache[nombre]) {

        console.log(
            "Pokémon obtenido desde localStorage"
        );

        return cache[nombre];

    }


    /*
        Si no está guardado,
        consultar PokéAPI.
    */

    const respuesta =
        await fetch(
            "https://pokeapi.co/api/v2/pokemon/" +
            nombre
        );


    if (!respuesta.ok) {

        throw new Error(
            "Pokémon no encontrado"
        );

    }


    const datos =
        await respuesta.json();


    const stats = {};


    datos.stats.forEach(
        function (item) {

            stats[
                item.stat.name
            ] =
                item.base_stat;

        }
    );


    const pokemon = {

        id:
            datos.id,

        name:
            datos.name,

        sprite:
            datos.sprites.front_default,

        hp:
            stats.hp,

        attack:
            stats.attack,

        defense:
            stats.defense,

        speed:
            stats.speed,

        moves:
            datos.moves
                .slice(0, 4)
                .map(
                    function (item) {

                        return {

                            name:
                                item.move.name,

                            url:
                                item.move.url

                        };

                    }
                )

    };


    /*
        Guardar Pokémon
        en localStorage.
    */

    cache[nombre] =
        pokemon;


    /*
        También guardamos
        por número.
    */

    cache[pokemon.id] =
        pokemon;


    localStorage.setItem(
        CACHE_POKEMON,
        JSON.stringify(cache)
    );


    return pokemon;

}


function mostrarPokemon(pokemon) {

    const contenedor =
        document.getElementById(
            "pokemon"
        );


    let movimientos = "";


    pokemon.moves.forEach(
        function (move) {

            movimientos += `

                <span class="movimiento">
                    ${move.name}
                </span>

            `;

        }
    );


    contenedor.innerHTML = `

        <div class="pokemon-card">

            <img
                src="${pokemon.sprite}"
                alt="${pokemon.name}"
            >


            <div>

                <h2>
                    ${pokemon.name}
                </h2>


                <div class="estadisticas">

                    <span>
                        HP: ${pokemon.hp}
                    </span>

                    <span>
                        Ataque: ${pokemon.attack}
                    </span>

                    <span>
                        Defensa: ${pokemon.defense}
                    </span>

                    <span>
                        Velocidad: ${pokemon.speed}
                    </span>

                </div>


                <p>
                    <b>Movimientos:</b>
                </p>


                <div class="lista-movimientos">

                    ${movimientos}

                </div>


                <br>


                <button id="agregar">
                    Agregar al equipo
                </button>

            </div>

        </div>

    `;


    document.getElementById(
        "agregar"
    ).addEventListener(
        "click",
        function () {

            agregarPokemon(
                pokemon
            );

        }
    );

}


function agregarPokemon(pokemon) {

    const perfil =
        obtenerPerfilActivo();


    const equipo =
        perfil.equipos.find(
            e => e.id == equipoActual
        );


    const mensaje =
        document.getElementById(
            "mensaje"
        );


    if (
        equipo.pokemon.length >= 6
    ) {

        mensaje.textContent =
            "El equipo ya tiene 6 Pokémon.";

        return;
    }


    const existe =
        equipo.pokemon.some(
            p => p.id == pokemon.id
        );


    if (existe) {

        mensaje.textContent =
            "Ese Pokémon ya está en el equipo.";

        return;
    }


    equipo.pokemon.push(
        pokemon
    );


    actualizarPerfil(
        perfil
    );


    mostrarEquipos();


    mensaje.textContent =
        pokemon.name +
        " fue agregado al equipo.";

}
