const audio = document.querySelector('.audio');
const canvasAudio = document.querySelector('.camera__audio');
const contextAudio = canvasAudio.getContext('2d');
const canvasFrequency = document.querySelector('.canvas__frequency');
const contextFrequency = canvasFrequency.getContext('2d');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let widthAudio = 0;
let heightAudio = 0;
let widthFrequency = 0;
let heightFrequency = 0;
let loopAudio;
let analyser;
let distortion;
let gainNode;
let biquadFilter;

function audioStream(stream) {
    analyser = audioCtx.createAnalyser();
    distortion = audioCtx.createWaveShaper();
    gainNode = audioCtx.createGain();
    biquadFilter = audioCtx.createBiquadFilter();
    connectAudio(stream);
}

function connectAudio(stream) {
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.connect(distortion);
    distortion.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    audioFrame();
}

function audioFrame() {
    widthAudio = canvasAudio.width = audio.clientWidth;
    heightAudio = canvasAudio.height = audio.clientHeight;
    widthFrequency = canvasFrequency.width;
    heightFrequency = canvasFrequency.height;
    startAudio();
}
function startAudio() {
    loopAudio = loopAudio || requestAnimationFrame(playAudio);
}

function playAudio() {
    loopAudio = requestAnimationFrame(playAudio);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    contextAudio.clearRect(0, 0, widthAudio, heightAudio);
    contextFrequency.clearRect(0, 0, widthFrequency, heightFrequency);

    analyser.getByteTimeDomainData(dataArray);

    contextAudio.lineTo(widthAudio, heightAudio/2);

    contextAudio.beginPath();

    let sliceWidth = widthAudio/ bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128;
        let y = v * heightAudio/2;
        if (i === 0) {
            contextAudio.moveTo(x, y);
        } else {
            contextAudio.lineTo(x, y);
        }
        x += sliceWidth;
    }
    // отрисовка звукового сигнала
    contextAudio.strokeStyle = '#28d1fa';
    contextAudio.lineWidth = 1;
    contextAudio.shadowBlur = 1;
    contextAudio.shadowColor = '#28d1fa';
    contextAudio.stroke();

    // отрисовка частоты
    let frequency = Math.max.apply(Math, dataArray);
    let gradient = contextFrequency.createLinearGradient(0, 0, 250, 0);
    gradient.addColorStop(0, 'black');
    gradient.addColorStop(1, '#28d1fa');
    contextFrequency.fillStyle = gradient;
    contextFrequency.fillRect(0, 0, frequency, heightFrequency);
}

