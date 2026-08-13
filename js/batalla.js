let jugador = [];

let enemigo = [];

let posicionJugador = 0;

let posicionEnemigo = 0;

let puedeAtacar = true;


const equipoIA = [
    "charmander",
    "squirtle",
    "bulbasaur"
];


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const perfil =
            obtenerPerfilActivo();


        if (!perfil) {

            document.getElementById(
                "errorBatalla"
            ).textContent =
                "Primero crea un perfil.";

            return;
        }


        const select =
            document.getElementById(
                "equipoBatalla"
            );


        perfil.equipos.forEach(
            function (equipo) {

                if (
                    equipo.pokemon.length > 0
                ) {

                    const opcion =
                        document.createElement(
                            "option"
                        );


                    opcion.value =
                        equipo.id;


                    opcion.textContent =
                        equipo.nombre;


                    select.appendChild(
                        opcion
                    );

                }

            }
        );


        if (
            select.options.length === 0
        ) {

            document.getElementById(
                "errorBatalla"
            ).textContent =
                "Necesitas un equipo con Pokémon.";

            document.getElementById(
                "comenzar"
            ).disabled = true;

        }


        document.getElementById(
            "comenzar"
        ).addEventListener(
            "click",
            comenzarBatalla
        );

    }
);


async function comenzarBatalla() {

    const perfil =
        obtenerPerfilActivo();


    const id =
        document.getElementById(
            "equipoBatalla"
        ).value;


    const equipo =
        perfil.equipos.find(
            e => e.id == id
        );


    if (!equipo) {
        return;
    }


    jugador =
        JSON.parse(
            JSON.stringify(
                equipo.pokemon
            )
        );


    enemigo = [];


    /*
        Creamos el equipo de la IA
    */

    for (
        let nombre of equipoIA
    ) {

        const pokemon =
            await obtenerPokemon(
                nombre
            );


        enemigo.push(
            pokemon
        );

    }


    /*
        HP inicial
    */

    jugador.forEach(
        function (pokemon) {

            pokemon.hpActual =
                pokemon.hp;

        }
    );


    enemigo.forEach(
        function (pokemon) {

            pokemon.hpActual =
                pokemon.hp;

        }
    );


    posicionJugador = 0;

    posicionEnemigo = 0;

    puedeAtacar = true;


    document.getElementById(
        "inicioBatalla"
    ).classList.add(
        "oculto"
    );


    document.getElementById(
        "batalla"
    ).classList.remove(
        "oculto"
    );


    escribir(
        "¡La batalla comienza!"
    );


    actualizarBatalla();

}


function obtenerJugador() {

    return jugador[
        posicionJugador
    ];

}


function obtenerEnemigo() {

    return enemigo[
        posicionEnemigo
    ];

}


function actualizarBatalla() {

    const p =
        obtenerJugador();


    const e =
        obtenerEnemigo();


    document.getElementById(
        "nombreJugador"
    ).textContent =
        p.name;


    document.getElementById(
        "nombreEnemigo"
    ).textContent =
        e.name;


    document.getElementById(
        "spriteJugador"
    ).src =
        p.sprite;


    document.getElementById(
        "spriteEnemigo"
    ).src =
        e.sprite;


    actualizarVida(
        "Jugador",
        p.hpActual,
        p.hp
    );


    actualizarVida(
        "Enemigo",
        e.hpActual,
        e.hp
    );


    mostrarMovimientos();

}


function actualizarVida(
    tipo,
    actual,
    maximo
) {

    const porcentaje =
        Math.max(
            0,
            actual / maximo * 100
        );


    document.getElementById(
        "barra" + tipo
    ).style.width =
        porcentaje + "%";


    document.getElementById(
        "vida" + tipo
    ).textContent =
        "HP: " +
        actual +
        " / " +
        maximo;

}


function mostrarMovimientos() {

    const contenedor =
        document.getElementById(
            "movimientos"
        );


    const pokemon =
        obtenerJugador();


    contenedor.innerHTML = "";


    pokemon.moves.forEach(
        function (move) {

            const boton =
                document.createElement(
                    "button"
                );


            boton.textContent =
                move.name;


            boton.disabled =
                !puedeAtacar;


            boton.addEventListener(
                "click",
                function () {

                    atacar(
                        move
                    );

                }
            );


            contenedor.appendChild(
                boton
            );

        }
    );

}


async function atacar(move) {

    if (!puedeAtacar) {
        return;
    }


    puedeAtacar = false;


    const p =
        obtenerJugador();


    const e =
        obtenerEnemigo();


    const poder =
        await obtenerPoder(
            move.url
        );


    /*
        Fórmula de daño
    */

    const daño =
        Math.max(
            1,

            Math.floor(
                (
                    poder *
                    p.attack
                )
                /
                e.defense
                *
                0.5
            )
        );


    e.hpActual =
        Math.max(
            0,
            e.hpActual - daño
        );


    escribir(
        p.name +
        " usó " +
        move.name +
        " e hizo " +
        daño +
        " de daño."
    );


    actualizarBatalla();


    /*
        Pokémon enemigo derrotado
    */

    if (
        e.hpActual <= 0
    ) {

        escribir(
            e.name +
            " quedó fuera de combate."
        );


        posicionEnemigo++;


        if (
            posicionEnemigo >=
            enemigo.length
        ) {

            terminar(true);

            return;

        }


        escribir(
            "La IA envía a " +
            obtenerEnemigo().name
        );


        puedeAtacar = true;


        actualizarBatalla();


        return;

    }


    /*
        Turno de la IA
    */

    setTimeout(
        turnoIA,
        800
    );

}


async function turnoIA() {

    const p =
        obtenerJugador();


    const e =
        obtenerEnemigo();


    const movimiento =
        e.moves[
            Math.floor(
                Math.random() *
                e.moves.length
            )
        ];


    const poder =
        await obtenerPoder(
            movimiento.url
        );


    const daño =
        Math.max(
            1,

            Math.floor(
                (
                    poder *
                    e.attack
                )
                /
                p.defense
                *
                0.5
            )
        );


    p.hpActual =
        Math.max(
            0,
            p.hpActual - daño
        );


    escribir(
        "La IA usó " +
        movimiento.name +
        " e hizo " +
        daño +
        " de daño."
    );


    actualizarBatalla();


    /*
        Pokémon del jugador derrotado
    */

    if (
        p.hpActual <= 0
    ) {

        escribir(
            p.name +
            " quedó fuera de combate."
        );


        posicionJugador++;


        if (
            posicionJugador >=
            jugador.length
        ) {

            terminar(false);

            return;

        }


        escribir(
            "Entra " +
            obtenerJugador().name
        );

    }


    puedeAtacar = true;


    actualizarBatalla();

}


async function obtenerPoder(url) {

    try {

        const respuesta =
            await fetch(
                url
            );


        if (!respuesta.ok) {

            return 40;

        }


        const datos =
            await respuesta.json();


        if (
            datos.power === null
        ) {

            return 40;

        }


        return datos.power;

    }

    catch {

        return 40;

    }

}


async function obtenerPokemon(nombre) {

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


    return pokemon;

}


function escribir(texto) {

    const registro =
        document.getElementById(
            "registro"
        );


    const linea =
        document.createElement(
            "p"
        );


    linea.textContent =
        texto;


    registro.prepend(
        linea
    );

}


function terminar(gano) {

    puedeAtacar = false;


    const resultado =
        document.getElementById(
            "resultado"
        );


    resultado.classList.remove(
        "oculto"
    );


    if (gano) {

        resultado.innerHTML = `

            <h2>
                🏆 ¡VICTORIA!
            </h2>

            <p>
                Derrotaste a todo el equipo
                de la IA.
            </p>

        `;

    }

    else {

        resultado.innerHTML = `

            <h2>
                💀 DERROTA
            </h2>

            <p>
                Todos tus Pokémon
                quedaron fuera de combate.
            </p>

        `;

    }

}
