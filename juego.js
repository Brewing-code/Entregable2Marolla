// Definimos opciones como array con sus posibles valores
let opciones = ['Piedra', 'Papel', 'Tijera', 'Lagarto', 'Spock'];
let victorias = 0;
let derrotas = 0;
let empates = 0;
let totalManos = 0;
let maxManos = 10;

class Resultado {
    constructor(mano, eleccionUsuario, resultadoRandom, mensaje) {
        this.mano = mano;
        this.eleccionUsuario = eleccionUsuario;
        this.resultadoRandom = resultadoRandom;
        this.mensaje = mensaje;
    }
}

// Función que selecciona una opción aleatoria del array
function opcionesRandom(arr) {
    let opcionRandom = Math.floor(Math.random() * arr.length);
    return arr[opcionRandom];
}

// Función que compara los resultados y determina el ganador
function compararResultados(resultadoRandom, eleccionUsuario) {
    let combinacion = resultadoRandom + '-' + eleccionUsuario;
    let mensaje;

    switch (combinacion) {
        case 'Piedra-Tijera':
        case 'Piedra-Lagarto':
        case 'Lagarto-Spock':
        case 'Lagarto-Papel':
        case 'Spock-Piedra':
        case 'Spock-Tijera':
        case 'Tijera-Lagarto':
        case 'Tijera-Papel':
        case 'Papel-Spock':
        case 'Papel-Piedra':
            mensaje = `${resultadoRandom} gana a ${eleccionUsuario}. Perdiste.`;
            derrotas++;
            break;
        case 'Tijera-Piedra':
        case 'Lagarto-Piedra':
        case 'Spock-Lagarto':
        case 'Papel-Lagarto':
        case 'Piedra-Spock':
        case 'Tijera-Spock':
        case 'Lagarto-Tijera':
        case 'Papel-Tijera':
        case 'Spock-Papel':
        case 'Piedra-Papel':
            mensaje = `${eleccionUsuario} gana a ${resultadoRandom}. Ganaste.`;
            victorias++;
            break;
        default:
            mensaje = "Empate";
            empates++;
            break;
    }

    totalManos++;
    actualizarMarcador();
    mostrarResultado(mensaje); 
    guardarResultadoEnSessionStorage(totalManos, eleccionUsuario, resultadoRandom, mensaje); 
    verificarGanador();
}

// Muestra el resultado de cada mano en el div #resultado
function mostrarResultado(mensaje) {
    document.getElementById('resultado').textContent = mensaje;
}

// Actualiza el marcador en la interfaz
function actualizarMarcador() {
    document.getElementById('victorias').textContent = victorias;
    document.getElementById('derrotas').textContent = derrotas;
    document.getElementById('empates').textContent = empates;
}

//Creamos un dropdown y guardamos el resultado de cada mano.
function actualizarHistorialDropdown() {
    let resultados = JSON.parse(sessionStorage.getItem('resultados')) || [];
    let dropdownContent = document.getElementById('dropdown-content');
    dropdownContent.innerHTML = ''; 

    resultados.forEach((resultado, index) => {
        let p = document.createElement('p');
        p.textContent = `Mano ${resultado.mano}: ${resultado.mensaje}`;
        dropdownContent.appendChild(p);
    });
}

// Mostrar/ocultar el dropdown
document.getElementById('dropdown-button').addEventListener('click', () => {
    let dropdownContent = document.getElementById('dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
});

function guardarResultadoEnSessionStorage(mano, eleccionUsuario, resultadoRandom, mensaje) {
    let resultados = JSON.parse(sessionStorage.getItem('resultados')) || [];
    
    // Creamos una nueva instancia de Resultado
    let nuevoResultado = new Resultado(mano, eleccionUsuario, resultadoRandom, mensaje);
    
    resultados.push(nuevoResultado); 
    sessionStorage.setItem('resultados', JSON.stringify(resultados)); 
    actualizarHistorialDropdown(); 
}

// Verifica si alguien ganó la partida según el tipo "mejor de"
function verificarGanador() {
    let umbralVictorias = Math.ceil(maxManos / 2);

    if (victorias > umbralVictorias || derrotas > umbralVictorias || totalManos === maxManos) {
        let mensajeFinal = victorias > derrotas ?  'Ganaste, genio del azar' :
            derrotas > victorias ?  'Perdiste pichon' : 'Empate aburrido';
        mostrarMensajeFinal(mensajeFinal); 
        reiniciarPartida();
    }
}

// Muestra el mensaje final de la partida en el div #mensaje-final
function mostrarMensajeFinal(mensajeFinal) {
    document.getElementById('mensaje-final').textContent = mensajeFinal; 
}


function reiniciarPartida() {
    victorias = 0;
    derrotas = 0;
    empates = 0;
    totalManos = 0;
    const botonesJuego = document.querySelectorAll('.opcion');
    botonesJuego.forEach(boton => {
        boton.disabled = true;  
    });
}

// Iniciar juego basado en la elección del usuario
function iniciarJuego(eleccionUsuario) {
    let resultadoRandom = opcionesRandom(opciones);
    compararResultados(resultadoRandom, eleccionUsuario);
}

// Evento para iniciar la partida
document.getElementById('iniciar-partida').addEventListener('click', () => {
    maxManos = parseInt(document.getElementById('opciones-partida').value);
    reiniciarPartida();
    actualizarMarcador();
    document.getElementById('mensaje-final').textContent = '';
    document.getElementById('resultado').textContent = '';
    sessionStorage.removeItem('resultados');
});

// Agregamos eventos a los botones al cargar la página
window.onload = function() {
    const botonesJuego = document.querySelectorAll('.opcion');

    // Deshabilitamos los botones al cargar la página
    botonesJuego.forEach(boton => {
        boton.disabled = true;
    });

    // Agregamos eventos a los botones de opción
    document.querySelectorAll('.opcion').forEach(button => {
        button.addEventListener('click', (event) => {
            let eleccionUsuario = event.target.getAttribute('data-eleccion');
            iniciarJuego(eleccionUsuario);
        });

        // Habilitamos los botones cuando se presiona 'iniciar-partida'
        document.getElementById('iniciar-partida').addEventListener('click', function() {
            botonesJuego.forEach(boton => {
                boton.disabled = false;
            });
        });
    });

    // Agregamos animación a la imagen principal
    const imagenPrincipal = document.querySelector('img');
    function animarImagen() {
        imagenPrincipal.classList.add('animated');
        setTimeout(() => {
            imagenPrincipal.classList.remove('animated');
        }, 500);
    }

    // Agregamos evento de animación a los botones
    document.querySelectorAll('.opcion').forEach(button => {
        button.addEventListener('click', animarImagen);
    });
};