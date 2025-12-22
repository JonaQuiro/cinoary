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

let tiempoTurno = 60;
let rondasPorEquipo = 5;

let equipoActual = 0;
let rondaA = 1;
let rondaB = 1;

let puntosA = 0;
let puntosB = 0;

let tiempo;
let cartaActual;
let cartasUsadas = [];

let muerteSubita = false;
let turnosMS = 0;
let cambioUsado = false;

// CONFIG
document.getElementById("btn-comenzar").onclick = () => {
    tiempoTurno = +document.querySelector("input[name='tiempo']:checked").value;
    rondasPorEquipo = +document.querySelector("input[name='rondas']:checked").value;

    pantallaConfig.style.display = "none";
    pantallaTurno.style.display = "block";
    iniciarTurno();
};

// REGLAMENTO
document.getElementById("btn-reglamento").onclick = () =>
    document.getElementById("modal-reglamento").style.display = "block";

document.getElementById("btn-cerrar-reglamento").onclick = () =>
    document.getElementById("modal-reglamento").style.display = "none";

// TURNO
function iniciarTurno() {
    actualizarUI();
    nuevaCarta();

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

    btnCambiar.disabled = muerteSubita;
    cambioUsado = false;
}

function nuevaCarta() {
    let disponibles = cartas.filter(c => !cartasUsadas.includes(c));
    if (disponibles.length === 0) cartasUsadas = [];

    cartaActual = disponibles[Math.floor(Math.random() * disponibles.length)];
    cartasUsadas.push(cartaActual);

    palabraTxt.textContent = cartaActual.palabra;
    prohibidasUl.innerHTML = "";
    cartaActual.prohibidas.forEach(p => {
        let li = document.createElement("li");
        li.textContent = p;
        prohibidasUl.appendChild(li);
    });
}

function actualizarUI() {
    equipoTxt.textContent = `Turno Equipo ${equipoActual === 0 ? "A" : "B"}`;
    rondaTxt.textContent = muerteSubita ? "⚡ TURNO DECISIVO" :
        `Ronda ${equipoActual === 0 ? rondaA : rondaB} de ${rondasPorEquipo}`;
}

function sumar() {
    equipoActual === 0 ? puntosA++ : puntosB++;
    avanzar();
}

function penalizar() {
    equipoActual === 0 ? puntosA-- : puntosB--;
    avanzar();
}

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
                document.body.classList.add("muerte-subita");
                turnosMS = 0;
            } else return finalizar();
        }
    }

    equipoActual = equipoActual === 0 ? 1 : 0;
    iniciarTurno();
}

function finalizar() {
    document.body.classList.remove("muerte-subita");
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
