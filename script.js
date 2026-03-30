var numSelected = null;
var tileSelected = null;

var errores = 0;
var timer = 0;
var timerInterval = null;

// configuraciones aleatoreas de tablero y solucion
var puzzles = [
    {
        tablero: [
            "--74916-5",
            "2---6-3-9",
            "-----7-1-",
            "-586----4",
            "--3----9-",
            "--62--187",
            "9-4-7---2",
            "67-83----",
            "81--45---"
        ],
        solucion: [
            "387491625",
            "241568379",
            "569327418",
            "758619234",
            "123784596",
            "496253187",
            "934176852",
            "675832941",
            "812945763"
        ]
    },
    {
        tablero: [
            "5-4------",
            "-7-1--3--",
            "----4-5--",
            "-9-3-----",
            "4-------1",
            "-----4-5-",
            "--1-3----",
            "--7--9-3-",
            "------1-9"
        ],
        solucion: [
            "534678912",
            "672195348",
            "198342567",
            "859761423",
            "426853791",
            "713924856",
            "961537284",
            "287419635",
            "345286179"
        ]
    },
    {
        tablero: [
            "4---6--8-",
            "-8-5-----",
            "--7------",
            "-2-----4-",
            "----8----",
            "-5-----2-",
            "-----6---",
            "-----7-3-",
            "-6--1---9"
        ],
        solucion: [
            "435269781",
            "682571493",
            "197834562",
            "826195347",
            "374682915",
            "951743628", 
            "519326874",
            "248957136",
            "763418259"
        ]
    }
];

var tablero = [];
var solucion = [];

function selectRandomPuzzle() {
    let randomIndex = Math.floor(Math.random() * puzzles.length);
    tablero = puzzles[randomIndex].tablero;
    solucion = puzzles[randomIndex].solucion;
}

window.onload = function() {
    selectRandomPuzzle();
    setGame();
    initGame();
}

function setGame() {
    //digitos 1-9
    for (let i = 1; i <= 9; i++) {
        let numero = document.createElement("div");
        numero.id = i;
        numero.innerText = i;
        numero.addEventListener("click", selectNumero);
        numero.classList.add("numero");
        document.getElementById("digitos").appendChild(numero);
    }

    //tablero 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.createElement("div");
            celda.id = r.toString() + "-" + c.toString();
            
            if (tablero[r][c] != "-") {
                celda.innerText = tablero[r][c];
                celda.classList.add("celda-start");
            }
            
            if (r == 2 || r == 5) {
                celda.classList.add("horizontal-line");
            }

            if (c == 2 || c == 5) {
                celda.classList.add("vertical-line");
            }

            celda.addEventListener("click", selectCelda);
            celda.classList.add("celda");
            document.getElementById("tablero").appendChild(celda);

        }
    }
}

function selectNumero() { 
    if (numSelected != null) {
        numSelected.classList.remove("numeroSeleccionado");
    }

    numSelected = this;
    numSelected.classList.add("numeroSeleccionado");
}

function selectCelda() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }
        this.innerText = numSelected.id;
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solucion[r][c] != numSelected.id) {
            errores += 1;
            document.getElementById("errores").innerText = errores;
            this.innerText = "";
        }
        else {
            this.innerText = numSelected.id;
            checkNumberComplete(numSelected.id);
            checkWin();
        }
    }
}

function checkNumberComplete(num) {
    // Checkeamos si todos los lugares donde va el numero estan completados
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (solucion[r][c] == num) {
                let celda = document.getElementById(r.toString() + "-" + c.toString());
                if (celda.innerText != num) {
                    document.getElementById(num).classList.remove("numeroCompleto");
                    return;
                }
            }
        }
    }
    document.getElementById(num).classList.add("numeroCompleto");
}

function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.getElementById(r.toString() + "-" + c.toString());
            if (celda.innerText != solucion[r][c]) {
                return;
            }
        }
    }
    // si llegamos aca, el jugador gano
    stopTimer();
    updateWinMessage();
    document.getElementById("win-screen").style.display = "flex";
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timer = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    document.querySelector(".contador").innerText = 
        minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
}

function updateWinMessage() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    let timeText = "Genial! Lo hiciste en " + minutes + " minutos y " + seconds + " segundos";
    document.querySelector(".win-message p").innerText = timeText;
}

function initGame() {
    selectRandomPuzzle();

    // limpiamos el tablero
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let celda = document.getElementById(r.toString() + "-" + c.toString());
            if (tablero[r][c] == "-") {
                celda.innerText = "";
                celda.classList.remove("celda-start");
            } else {
                celda.innerText = tablero[r][c];
                celda.classList.add("celda-start");
            }
        }
    }

    errores = 0;
    document.getElementById("errores").innerText = errores;
    document.getElementById("win-screen").style.display = "none";

    if (numSelected) {
        numSelected.classList.remove("numeroSeleccionado");
        numSelected = null;
    }
    // Reseteamos el timer
    resetTimer();
    startTimer();

    document.querySelector(".win-message p").innerText = "Felicitaciones";
    updateTimerDisplay();
    
    // Reseteamos los botones
    for (let i = 1; i <= 9; i++) {
        document.getElementById(i).classList.remove("numeroCompleto");
    }
}

function resetGame() {
    stopTimer();
    initGame();
}