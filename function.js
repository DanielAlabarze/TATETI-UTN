
// Selecciona todos los elementos HTML con la clase 'square' (los cuadrados del tablero).
const squares = document.querySelectorAll('.square');
// Selecciona todos los elementos HTML con la clase 'reset' (los botones de reinicio).
const resetBtn = document.querySelectorAll('.reset');
// Selecciona todos los elementos HTML con la clase 'icon-turn' (los elementos que muestran el turno actual).
const iconTurn = document.querySelectorAll('.icon-turn');
// Selecciona el elemento HTML con la clase 'modal' (la ventana modal que se muestra al ganar).
const modal = document.querySelector('.modal');
// Selecciona los elementos HTML que muestran el contador de victorias para X y O.
const counterTextX = document.querySelector('.counterX');
const counterTextO = document.querySelector('.counterO');
const counterTextEmpates = document.querySelector('.counterEmpates');
// Selecciona el elemento HTML que representa la línea ganadora.
let winningLine = document.querySelector('.winning-line');

// Selecciona el botón para resetear el historial de victorias.
const resetHistorial = document.querySelector('.btn');

// Añade un event listener al botón de resetear historial.
resetHistorial.addEventListener('click', () => {
    // Guarda los contadores de X y O en localStorage con valor 0.
    localStorage.setItem("counterX", JSON.stringify(0));
    localStorage.setItem("counterO", JSON.stringify(0));
    localStorage.setItem("counterEmpates", JSON.stringify(0));
    // Resetea las variables de contador a 0.
    counterO = 0;
    counterX = 0;
    counterEmpates = 0;

    // Actualiza el texto de los contadores en la pantalla.
    counterTextX.textContent = 0;
    counterTextO.textContent = 0;
    counterTextEmpates.textContent = 0;
});

// Define la variable 'turn' para controlar el turno actual (inicialmente "X").
let turn = "X";
// Define las combinaciones ganadoras posibles (índices de los cuadrados).
let combinations = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
// Define las transformaciones CSS para la línea ganadora según la combinación.
let winLines = [
    "translateY(-115px)",
    "none",
    "translateY(115px)",
    "translateX(-115px) rotateZ(90deg)",
    "rotateZ(90deg)",
    "translateX(115px) rotateZ(90deg)",
    "rotateZ(45deg)",
    "rotateZ(135deg)"
];

// Contador de casillas jugadas.
let counterPlace = 0;

// Variable para almacenar el ganador (inicialmente vacío).
let winner = "";

// Recupera los contadores de X y O del localStorage o inicialízalos a 0.
let counterX = localStorage.getItem("counterX") ? JSON.parse(localStorage.getItem("counterX")) : 0;
let counterO = localStorage.getItem("counterO") ? JSON.parse(localStorage.getItem("counterO")) : 0;
let counterEmpates = localStorage.getItem("counterEmpates") ? JSON.parse(localStorage.getItem("counterEmpates")) : 0;

// Llama a la función Initial() al cargar la página.
Initial();

// Itera sobre cada cuadrado del tablero.
squares.forEach((square, i) => {
    // Añade un event listener a cada cuadrado para el evento 'click'.
    square.addEventListener('click', () => {
        // Si no hay ganador y el cuadrado está vacío.
        if(winner == "" && square.textContent == ""){
            // Coloca la marca del jugador actual en el cuadrado.
            square.textContent = turn;

            // Detecta si hay un ganador.
            DetectWinner(i);
            // Guarda el estado del juego en localStorage.
            saveGame();

            // Si no hay ganador después de la jugada.
            if(winner == ""){
                // Cambia el turno al otro jugador.
                turn = turn == "X" ? "O" : "X";
                // Actualiza el icono que muestra el turno actual.
                iconTurn.forEach(icon => icon.textContent = turn );

                // Guarda el turno actual en localStorage.
                localStorage.setItem("turn", JSON.stringify(turn));

                // Incrementa el contador de casillas jugadas.
                counterPlace++;

                // Si se han jugado todas las casillas y no hay ganador, es un empate.
                if(counterPlace >= 9 && winner == "") {
                    console.log("¡Es un empate!");
                    counterEmpates++; // Incrementa el contador de empates
                    counterTextEmpates.textContent = counterEmpates; // Actualiza la pantalla
                    localStorage.setItem("counterEmpates", JSON.stringify(counterEmpates)); // Guarda en localStorage
                    showModal("¡Empate!"); // Muestra el modal de empate
                }
            }
        }
    });
});

// Añade event listeners a los botones de reinicio para llamar a la función Reset().
resetBtn.forEach(btn => btn.addEventListener('click', () => { Reset(); }));

// Función para inicializar el juego.
function Initial(){
    // Recupera el turno del localStorage o inicialízalo a "X".
    turn = localStorage.getItem("turn") ? JSON.parse(localStorage.getItem("turn")) : "X";
    // Actualiza el icono que muestra el turno actual.
    iconTurn.forEach(icon => icon.textContent = turn );
    // Oculta la ventana modal.
    modal.style.display = "none";

    // Muestra los contadores de victorias en la pantalla.
    counterTextO.textContent = counterO;
    counterTextX.textContent = counterX;
    counterTextEmpates.textContent = counterEmpates;

    // Si hay datos guardados en localStorage para los cuadrados, los carga.
    if(localStorage.getItem("squares")){
        let squaresContent = JSON.parse(localStorage.getItem("squares"));

        squares.forEach((square, i) => {
            square.textContent = squaresContent[i];
        });
    }
}

// Función para reiniciar el juego.
function Reset(){
    // Reinicia el turno a "X".
    turn = "X";
    // Reinicia el ganador.
    winner = "";
    // Reinicia el contador de casillas jugadas.
    counterPlace = 0;
    // Oculta la ventana modal.
    modal.style.display = "none";
    // Actualiza los contadores en la pantalla.
    counterTextO.textContent = counterO;
    counterTextX.textContent = counterX;
    counterTextEmpates.textContent = counterEmpates;
    // Actualiza el icono del turno.
    iconTurn.forEach(icon => icon.textContent = turn );
    // Oculta la línea ganadora.
    winningLine.style.display = "none";

    // Limpia el contenido de todos los cuadrados.
    squares.forEach(square => square.textContent = "" );

    // Guarda el estado del juego en localStorage.
    saveGame();
}

// Función para guardar el estado del juego en localStorage.
function saveGame(){
    let content = [];
    squares.forEach(square => content.push(square.textContent) );
    localStorage.setItem("squares", JSON.stringify(content));
}

// Función para detectar si hay un ganador.
function DetectWinner(i){
    // Filtra las combinaciones ganadoras que incluyen el índice del cuadrado actual.
    let combinationWinner = combinations.filter(combination => combination.includes(i));

    let counterTurn = 0;

    // Itera sobre las combinaciones ganadoras encontradas.
    for(let i = 0; i < combinationWinner.length; i++){
        // Itera sobre los índices de cada combinación ganadora.
        for(let j = 0; j < combinationWinner[i].length; j++){
            // Si el cuadrado correspondiente a ese índice tiene la marca del jugador actual.
            if (squares[combinationWinner[i][j]].textContent == turn) {
                // Incrementa el contador de marcas consecutivas.
                counterTurn++;
            }
        }
        // Si no hay 3 marcas consecutivas, reinicia el contador.
        if(counterTurn < 3) { counterTurn = 0; }
        // Si hay 3 marcas consecutivas, hay un ganador.
        else{
            // Llama a la función Win() para finalizar el juego.
            Win(combinationWinner[i]);
            break;
        }
    }
}

// Función para finalizar el juego cuando hay un ganador.
function Win(combinationWinner) {
    // Asigna el ganador al jugador actual.
    winner = turn;

    // Incrementa el contador de victorias del ganador.
    if (winner == "X") { counterX++; }
    else { counterO++; }

    // Actualiza los contadores en la pantalla.
    counterTextO.textContent = counterO;
    counterTextX.textContent = counterX;
    counterTextEmpates.textContent = counterEmpates;

    // Guarda los contadores actualizados en localStorage.
    localStorage.setItem("counterX", JSON.stringify(counterX));
    localStorage.setItem("counterO", JSON.stringify(counterO));
    localStorage.setItem("counterEmpates", JSON.stringify(counterEmpates));

    // Muestra el modal con el mensaje de victoria y el ganador.
    showModal("¡Victoria!", winner);

    // Encuentra el índice de la combinación ganadora en el array 'combinations'.
    let index = combinations.findIndex(combi => combi == combinationWinner);

    // Muestra la línea ganadora y aplica la transformación CSS correspondiente.
    winningLine.style.display = "flex";
    winningLine.style.transform = winLines[index];
}

// Función para mostrar el modal con un mensaje dado.
function showModal(message, winner) {
    modal.querySelector(".title span").textContent = message;
    const subtitle = modal.querySelector(".subtitle");

    if (winner) {
        subtitle.textContent = `Ha ganado ${winner}`;
        subtitle.style.display = "block"; // Asegura que se muestre
    } else {
        subtitle.style.display = "none"; // Oculta el subtítulo en caso de empate
    }

    modal.style.display = "flex";
}