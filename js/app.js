const PERFILES = "perfiles";
const PERFIL_ACTIVO = "perfilActivo";


function obtenerPerfiles() {

    return JSON.parse(
        localStorage.getItem(PERFILES) || "[]"
    );

}


function guardarPerfiles(perfiles) {

    localStorage.setItem(
        PERFILES,
        JSON.stringify(perfiles)
    );

}


function obtenerPerfilActivo() {

    const id =
        localStorage.getItem(PERFIL_ACTIVO);

    const perfiles =
        obtenerPerfiles();

    return perfiles.find(
        perfil => perfil.id == id
    );

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const formulario =
            document.getElementById(
                "formPerfil"
            );

        if (!formulario) {
            return;
        }


        mostrarPerfiles();


        formulario.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nombre =
                    document.getElementById(
                        "nombre"
                    ).value.trim();


                const error =
                    document.getElementById(
                        "error"
                    );


                if (nombre.length < 2) {

                    error.textContent =
                        "El nombre debe tener al menos 2 caracteres.";

                    return;
                }


                const perfiles =
                    obtenerPerfiles();


                const existe =
                    perfiles.some(
                        perfil =>
                            perfil.nombre.toLowerCase() ===
                            nombre.toLowerCase()
                    );


                if (existe) {

                    error.textContent =
                        "Ese perfil ya existe.";

                    return;
                }


                const nuevoPerfil = {

                    id: Date.now(),

                    nombre: nombre,

                    equipos: []

                };


                perfiles.push(
                    nuevoPerfil
                );


                guardarPerfiles(
                    perfiles
                );


                localStorage.setItem(
                    PERFIL_ACTIVO,
                    nuevoPerfil.id
                );


                document.getElementById(
                    "nombre"
                ).value = "";


                error.textContent = "";


                mostrarPerfiles();

            }
        );

    }
);


function mostrarPerfiles() {

    const contenedor =
        document.getElementById(
            "perfiles"
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = "";


    const perfiles =
        obtenerPerfiles();


    perfiles.forEach(
        function (perfil) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "perfil";


            div.innerHTML = `

                <div>

                    <h3>
                        ${perfil.nombre}
                    </h3>

                    <p>
                        ${perfil.equipos.length}
                        equipo(s)
                    </p>

                </div>


                <button>
                    Seleccionar
                </button>

            `;


            div.querySelector(
                "button"
            ).addEventListener(
                "click",
                function () {

                    localStorage.setItem(
                        PERFIL_ACTIVO,
                        perfil.id
                    );


                    window.location.href =
                        "equipos.html";

                }
            );


            contenedor.appendChild(
                div
            );

        }
    );

}
