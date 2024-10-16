// Definimos opciones como array con sus posibles valores
let opciones = ['Piedra', 'Papel', 'Tijera', 'Lagarto', 'Spock'];
let victorias = 0;
let derrotas = 0;
let empates = 0;
let maxManos = 10; // Puedes cambiar este valor a 20 si es necesario

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

    let totalManos = parseInt(sessionStorage.getItem('totalManos')) || 0;
    totalManos++;
    sessionStorage.setItem('totalManos', totalManos); // Guardar total de manos en sessionStorage

    actualizarMarcador();
    mostrarResultado(mensaje); 
    guardarResultadoEnLocalStorage(totalManos, eleccionUsuario, resultadoRandom, mensaje);
    verificarGanador(totalManos); // Pasamos el total de manos aquí
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

// Guardar el resultado en local storage
function guardarResultadoEnLocalStorage(mano, eleccionUsuario, resultadoRandom, mensaje) {
    let resultados = JSON.parse(localStorage.getItem('resultados')) || [];
    let nuevoResultado = new Resultado(mano, eleccionUsuario, resultadoRandom, mensaje);
    resultados.push(nuevoResultado);
    localStorage.setItem('resultados', JSON.stringify(resultados));
}

// Verifica si alguien ganó la partida
function verificarGanador(totalManos) {
    let umbralVictorias = Math.ceil(maxManos / 2);

    if (victorias >= umbralVictorias || derrotas >= umbralVictorias || totalManos >= maxManos) {
        let mensajeFinal = victorias > derrotas ? 'Ganaste, genio del azar' :
                           derrotas > victorias ? 'Perdiste pichón' : 'Empate aburrido';
        mostrarMensajeFinal(mensajeFinal); 
        reiniciarPartida();
    }
}

// Muestra el mensaje final de la partida
// Al finalizar la partida
function mostrarMensajeFinal(mensajeFinal) {
    
    Swal.fire({
        title: mensajeFinal,
        text: "¿Seguimos jugando?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Iniciar partida',
        cancelButtonText: 'Salir',
    }).then((result) => {
        if (result.isConfirmed) {
            // Reinicia la partida si se presiona "Iniciar partida"
            reiniciarPartida();
            actualizarMarcador();
            document.getElementById('resultado').textContent = '';
            const botonesJuego = document.querySelectorAll('.opcion');
            botonesJuego.forEach(boton => {
                boton.disabled = false; // Habilitar botones
            });
        } 
    });
}

// Reinicia la partida
function reiniciarPartida() {
    victorias = 0;
    derrotas = 0;
    empates = 0;
    sessionStorage.removeItem('totalManos'); // Limpiar total de manos en sessionStorage

    const botonesJuego = document.querySelectorAll('.opcion');
    botonesJuego.forEach(boton => {
        boton.disabled = true;  
    });
}

// Iniciar juego basado en la elección del usuario
function iniciarJuego(eleccionUsuario) {
    let resultadoRandom = opcionesRandom(opciones);
    animarImagen();
    compararResultados(resultadoRandom, eleccionUsuario);
}

// Cargar resultados almacenados al cargar la página
function cargarResultadosAlCargarPagina() {
    let resultadosGuardados = JSON.parse(localStorage.getItem('resultados'));
    if (resultadosGuardados) {
        resultadosGuardados.forEach((resultado) => {
            mostrarResultado(resultado.mensaje);
            victorias += (resultado.mensaje.includes('Ganaste')) ? 1 : 0;
            derrotas += (resultado.mensaje.includes('Perdiste')) ? 1 : 0;
            empates += (resultado.mensaje === 'Empate') ? 1 : 0;
        });
        let totalManos = resultadosGuardados.length; // Total de manos jugadas
        sessionStorage.setItem('totalManos', totalManos); // Guardar total de manos en sessionStorage
        actualizarMarcador();
        
    }
}

// Agregar animación a la imagen principal
const imagenPrincipal = document.querySelector('img');
function animarImagen() {
    imagenPrincipal.classList.add('animated');
    setTimeout(() => {
        imagenPrincipal.classList.remove('animated');
    }, 1000);
}

// Evento para iniciar la partida
document.getElementById('iniciar-partida').addEventListener('click', () => {
    Swal.fire({
        title: '¿Estás seguro de que quieres iniciar una nueva partida?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Iniciar partida',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            reiniciarPartida();
            actualizarMarcador();
            
            document.getElementById('resultado').textContent = '';
            const botonesJuego = document.querySelectorAll('.opcion');
            botonesJuego.forEach(boton => {
                boton.disabled = false; // Habilitar botones solo si se acepta el confirm
            });
        }
    });
});

// Agregar eventos a los botones al cargar la página
window.onload = function() {
    const botonesJuego = document.querySelectorAll('.opcion');

    // Deshabilitamos los botones al cargar la página
    botonesJuego.forEach(boton => {
        boton.disabled = true;
    });

    // Cargar resultados si hay una partida guardada
    cargarResultadosAlCargarPagina();

    // Agregar eventos a los botones de opción
    botonesJuego.forEach(button => {
        button.addEventListener('click', (event) => {
            let eleccionUsuario = event.target.getAttribute('data-eleccion');
            iniciarJuego(eleccionUsuario);
        });
    });
}