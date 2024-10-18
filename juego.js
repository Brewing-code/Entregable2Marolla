// Definimos opciones como array con sus posibles valores
let opciones = []; // Cambiamos a un array vacío que se llenará con fetch
let victorias = 0;
let derrotas = 0;
let empates = 0;
let maxManos = 10; // Valor por defecto

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
function guardarResultadoEnLocalStorage(totalManos, eleccionUsuario, resultadoRandom, mensaje) {
    let resultados = JSON.parse(localStorage.getItem('resultados')) || [];
    let nuevoResultado = new Resultado(totalManos, eleccionUsuario, resultadoRandom, mensaje);
    resultados.push(nuevoResultado);
    localStorage.setItem('resultados', JSON.stringify(resultados));
}

// Guardar el estado de la partida en localStorage
function guardarEstadoPartidaEnLocalStorage() {
    const estadoPartida = {
        victorias: victorias,
        derrotas: derrotas,
        empates: empates,
        totalManos: parseInt(sessionStorage.getItem('totalManos')) || 0
    };
    localStorage.setItem('partidaEnCurso', JSON.stringify(estadoPartida));
}

// Reinicia la partida
function reiniciarPartida() {
    sessionStorage.removeItem('totalManos'); // Limpiar total de manos en sessionStorage
    localStorage.removeItem('partidaEnCurso'); // Limpiar estado de partida
    localStorage.removeItem('resultados');
    victorias = 0;
    derrotas = 0;
    empates = 0;
    const botonesJuego = document.querySelectorAll('.opcion');
    botonesJuego.forEach(boton => {
        boton.disabled = true;  
    });
}

// Muestra el mensaje final de la partida
function mostrarMensajeFinal(mensajeFinal) {
    Swal.fire({
        title: mensajeFinal,
        text: "¿Seguimos jugando?",
        background: 'rgb(6, 18, 87)',
        color: 'whitesmoke',  // Color del texto
        customClass: {
            popup: 'popup-custom',
            confirmButton: 'confirm-button-custom',
            cancelButton: 'cancel-button-custom'
        },
        showCancelButton: true,
        confirmButtonText: 'Sigamos',
        cancelButtonText: 'Ya fue, es un embole',
    }).then((result) => {
        if (result.isConfirmed) {
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
    guardarEstadoPartidaEnLocalStorage(); // Guardar el estado parcial tras cada mano
    verificarGanador(totalManos); // Pasamos el total de manos aquí
}

// Cargar estado de la partida en curso al cargar la página
function cargarEstadoPartida() {
    const partidaGuardada = JSON.parse(localStorage.getItem('partidaEnCurso'));
    if (partidaGuardada) {
        victorias = partidaGuardada.victorias;
        derrotas = partidaGuardada.derrotas;
        empates = partidaGuardada.empates;
        let totalManos = partidaGuardada.totalManos;
        
        sessionStorage.setItem('totalManos', totalManos); // Restablecer el total de manos en sessionStorage
        actualizarMarcador();

        // Habilitar los botones para continuar la partida
        const botonesJuego = document.querySelectorAll('.opcion');
        botonesJuego.forEach(boton => {
            boton.disabled = false;
        });

        document.getElementById('resultado').textContent = 'Termina lo que empezaste, querubín';
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

// Iniciar juego basado en la elección del usuario
function iniciarJuego(eleccionUsuario) {
    let resultadoRandom = opcionesRandom(opciones);
    animarImagen();
    compararResultados(resultadoRandom, eleccionUsuario);
}

// Mostrar modal de instrucciones al cargar la página por primera vez
function mostrarModalInstrucciones() {
    Swal.fire({
        title: 'Instrucciones',
        text: 'Para empezar a jugar selecciona el número de manos y luego presiona "Iniciar Partida".',
        background: 'rgb(6, 18, 87)',
        color: 'whitesmoke',  // Color del texto
        customClass: {
            popup: 'popup-custom',
            confirmButton: 'confirm-button-custom',
        },
        confirmButtonText: 'Entendido'
    });
}

// Cargar opciones desde un archivo JSON usando fetch y async/await
async function cargarOpciones() {
    try {
        const response = await fetch('opciones.json'); // Carga el archivo JSON
        if (!response.ok) throw new Error('Error en la carga del archivo');
        
        const data = await response.json(); // Convierte la respuesta en JSON
        opciones = data.opciones; // Actualiza el array de opciones
    } catch (error) {
        console.error('Error al cargar opciones:', error); // Maneja errores
    }
}

// Evento para iniciar la partida
document.getElementById('iniciar-partida').addEventListener('click', () => {
    // Obtener la opción seleccionada
    const seleccion = document.getElementById('opciones-partida').value;
    maxManos = parseInt(seleccion); // Actualiza maxManos según la selección

    Swal.fire({
        title: '¿Estás seguro de que quieres iniciar una nueva partida?',
        showCancelButton: true,
        confirmButtonText: 'Iniciar partida',
        cancelButtonText: 'Cancelar',
        background: 'rgb(6, 18, 87)',
        color: 'whitesmoke',  // Color del texto
        customClass: {
            popup: 'popup-custom',
            confirmButton: 'confirm-button-custom',
            cancelButton: 'cancel-button-custom'
        },
    }).then((result) => {
        if (result.isConfirmed) {
            reiniciarPartida();
            cargarEstadoPartida(); // Cargar el estado de la partida    
            actualizarMarcador(); // Actualizar el marcador al inicio
            const botonesJuego = document.querySelectorAll('.opcion');
            botonesJuego.forEach(boton => {
                boton.disabled = false; // Habilitar botones
            });
        }
    });
});

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', async () => {
    await cargarOpciones(); // Cargar las opciones al iniciar
    cargarEstadoPartida(); // Cargar el estado de la partida    
    if (!localStorage.getItem('partidaEnCurso') && !localStorage.getItem('resultados')) {
        mostrarModalInstrucciones(); // Mostrar modal de instrucciones
    }
});

// Asignar eventos a los botones de opciones
const botonesJuego = document.querySelectorAll('.opcion');
botonesJuego.forEach(boton => {
    boton.addEventListener('click', () => iniciarJuego(boton.dataset.eleccion));
});