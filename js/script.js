const pantallaConfig = document.getElementById("pantalla-configuracion");
const pantallaTurno = document.getElementById("pantalla-turno");
const pantallaFinal = document.getElementById("pantalla-final");

const equipoTxt = document.getElementById("equipo-actual");
const rondaTxt = document.getElementById("ronda-actual");
const tiempoTxt = document.getElementById("tiempo-restante");

const palabraTxt = document.getElementById("palabra-principal");
const prohibidasUl = document.getElementById("palabras-prohibidas");

const puntosATxt = document.getElementById("puntos-a");
const puntosBTxt = document.getElementById("puntos-b");

const btnCambiar = document.getElementById("btn-cambiar");
const btnPlay = document.getElementById("btn-play");

const cartaDiv = document.getElementById("carta");
const preTurnoDiv = document.getElementById("pre-turno");

let tiempoTurno = 60;
let rondasPorEquipo = 5;

let equipoActual = 0;
let rondaA = 1;
let rondaB = 1;

let puntosA = 0;
let puntosB = 0;

let tiempo;
let muerteSubita = false;
let turnosMS = 0;

let esperandoPlay = true;
let cambioUsado = false;

/* ====== MAZO ====== */
let mazo = [];
let indiceCarta = 0;

/* ====== MEZCLAR ====== */
function mezclarCartas() {
    mazo = [...cartas];
    for (let i = mazo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
    }
    indiceCarta = 0;
}

/* ====== COMENZAR ====== */
document.getElementById("btn-comenzar").onclick = () => {
    tiempoTurno = +document.querySelector("input[name='tiempo']:checked").value;
    rondasPorEquipo = +document.querySelector("input[name='rondas']:checked").value;

    mezclarCartas();

    pantallaConfig.style.display = "none";
    pantallaTurno.style.display = "block";
    iniciarTurno();
};

/* ====== REGLAMENTO ====== */
document.getElementById("btn-reglamento").onclick = () =>
    document.getElementById("modal-reglamento").style.display = "block";

document.getElementById("btn-cerrar-reglamento").onclick = () =>
    document.getElementById("modal-reglamento").style.display = "none";

/* ====== TURNO ====== */
function iniciarTurno() {
    actualizarUI();
    nuevaCarta();

    esperandoPlay = true;
    cartaDiv.classList.add("oculto");
    preTurnoDiv.style.display = "block";

    tiempoTxt.textContent = `⏱ ${tiempoTurno}s`;
    btnCambiar.disabled = true;
}

/* ====== PLAY ====== */
btnPlay.onclick = () => {
    if (!esperandoPlay) return;

    esperandoPlay = false;
    preTurnoDiv.style.display = "none";
    cartaDiv.classList.remove("oculto");

    btnCambiar.disabled = muerteSubita;
    cambioUsado = false;

    let t = tiempoTurno;
    tiempoTxt.textContent = `⏱ ${t}s`;

    clearInterval(tiempo);
    tiempo = setInterval(() => {
        t--;
        tiempoTxt.textContent = `⏱ ${t}s`;
        if (t <= 0) {
            clearInterval(tiempo);
            penalizar();
        }
    }, 1000);
};

/* ====== CARTA ====== */
function nuevaCarta() {
    if (indiceCarta >= mazo.length) {
        alert("🚫 Se terminaron las cartas");
        finalizar();
        return;
    }

    const carta = mazo[indiceCarta];
    indiceCarta++;

    palabraTxt.textContent = carta.palabra;
    prohibidasUl.innerHTML = "";

    carta.prohibidas.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        prohibidasUl.appendChild(li);
    });
}

/* ====== UI ====== */
function actualizarUI() {
    equipoTxt.textContent = `Turno Equipo ${equipoActual === 0 ? "A" : "B"}`;
    rondaTxt.textContent = muerteSubita
        ? "⚡ MUERTE SÚBITA"
        : `Ronda ${equipoActual === 0 ? rondaA : rondaB} de ${rondasPorEquipo}`;
}

/* ====== PUNTOS ====== */
function sumar() {
    equipoActual === 0 ? puntosA++ : puntosB++;
    avanzar();
}

function penalizar() {
    equipoActual === 0 ? puntosA-- : puntosB--;
    avanzar();
}

/* ====== AVANZAR ====== */
function avanzar() {
    clearInterval(tiempo);

    puntosATxt.textContent = puntosA;
    puntosBTxt.textContent = puntosB;

    if (muerteSubita) {
        turnosMS++;
        if (turnosMS >= 2 && puntosA !== puntosB) return finalizar();
    } else {
        equipoActual === 0 ? rondaA++ : rondaB++;
        if (rondaA > rondasPorEquipo && rondaB > rondasPorEquipo) {
            if (puntosA === puntosB) {
                muerteSubita = true;
                turnosMS = 0;
            } else return finalizar();
        }
    }

    equipoActual = equipoActual === 0 ? 1 : 0;
    iniciarTurno();
}

/* ====== FINAL ====== */
function finalizar() {
    pantallaTurno.style.display = "none";
    pantallaFinal.style.display = "block";

    document.getElementById("final-a").textContent = puntosA;
    document.getElementById("final-b").textContent = puntosB;
    document.getElementById("ganador").textContent =
        puntosA > puntosB ? "🏆 Ganó Equipo A" : "🏆 Ganó Equipo B";
}

document.getElementById("btn-acierto").onclick = sumar;
document.getElementById("btn-error").onclick = penalizar;

btnCambiar.onclick = () => {
    if (!cambioUsado && !muerteSubita) {
        cambioUsado = true;
        nuevaCarta();
    }
};

document.getElementById("btn-reiniciar").onclick = () => location.reload();
