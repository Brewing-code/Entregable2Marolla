// Definimos opciones como array con sus posibles valores
let opciones = ['Piedra', 'Papel', 'Tijera', 'Lagarto', 'Spock'];

// Función que selecciona una opción aleatoria del array
function opcionesRandom(arr) {
    let opcionRandom = Math.floor(Math.random() * arr.length); // Calcula un índice aleatorio dentro del rango del array
    return arr[opcionRandom]; // Retorna la opción seleccionada del array
}

// Función que permite al usuario elegir una opción a través de un prompt
function elegirOpcion(arr) {
    let opcionesPrompt = 'Ingrese su elección:\n';
    for (let i = 0; i < arr.length; i++) {
        opcionesPrompt += `${i + 1}: ${arr[i]}\n`; // Agregamos las opciones numeradas al mensaje del prompt
    }

    let eleccion = prompt(opcionesPrompt); 
    let indice = parseInt(eleccion) - 1; // Convierte la elección a índice del array
    if (indice >= 0 && indice < arr.length) { // Verifica que la elección sea válida
        return arr[indice]; // Retorna la opción seleccionada
    } else {
        alert("Opción no válida"); // Muestra alerta si la opción es inválida
        return null; 
    }
}

// Función que compara los resultados y determina el ganador
function compararResultados(resultadoRandom, eleccionUsuario) {
    if (eleccionUsuario === null) { // Verifica si la elección del usuario es inválida
        alert("Elegiste una opción inválida. Ingresa una opción válida.");
        return;
    }

    let combinacion = resultadoRandom + '-' + eleccionUsuario; // Combina ambas opciones para evaluar
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
            console.log(`${resultadoRandom} gana a ${eleccionUsuario}. Perdiste`);
            alert(`${resultadoRandom} gana a ${eleccionUsuario}. Perdiste`);
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
            console.log(`${eleccionUsuario} gana a ${resultadoRandom}. Ganaste`);
            alert(`${eleccionUsuario} gana a ${resultadoRandom}. Ganaste`);
            break;
        default:
            console.log("Empate");
            alert("Empate");
            break;
    }
}

// Función principal que maneja el flujo del juego
function iniciarJuego() {
    let loopJuego = true; 
    while (loopJuego) {
        let resultadoRandom = opcionesRandom(opciones); // Obtiene una opción aleatoria
        console.log(resultadoRandom); // Muestra la opción aleatoria en la consola

        let eleccionUsuario = elegirOpcion(opciones); // Obtiene la elección del usuario
        console.log("El usuario eligió:", eleccionUsuario); 

        compararResultados(resultadoRandom, eleccionUsuario); // Compara los resultados y determina el ganador
        loopJuego = confirm("¿Quieres volver a jugar?");
    }
    alert("Gracias por Jugar RPSLS"); 
}

// Inicia el juego cuando la ventana se ha cargado completamente
window.onload = function() {
    iniciarJuego();
};