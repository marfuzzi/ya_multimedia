const audio = document.querySelector('.audio');
const canvasAudio = document.querySelector('.camera__audio');
const contextAudio = canvasAudio.getContext('2d');

let widthAudio = 0;
let heightAudio = 0;
let loopAudio;
let analyser;
let distortion;
let gainNode;
let biquadFilter;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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
    gainNode.connect(audioCtx.destination); // connecting the different audio graph nodes together

    audioFrame();
}

function audioFrame() {
    widthAudio = canvasAudio.width = video.clientWidth;
    heightAudio = canvasAudio.height = video.clientHeight;

    startAudio();
}
function startAudio() {
    loopAudio = loopAudio || requestAnimationFrame(playAudio);
}

function playAudio() {
    loopAudio = requestAnimationFrame(playAudio);
    analyser.fftSize = 2048;
    let bufferLength = analyser.frequencyBinCount; // half the FFT value
    let dataArray = new Uint8Array(bufferLength); // create an array to store the data

    contextAudio.clearRect(0, 0, widthAudio, heightAudio);
    analyser.getByteTimeDomainData(dataArray); // get waveform data and put it into the array created above

    contextAudio.fillStyle = 'rgb(200, 200, 200)'; // draw wave with canvas
    contextAudio.fillRect(0, 0, widthAudio, heightAudio);

    contextAudio.lineWidth = 2;
    contextAudio.strokeStyle = 'rgb(0, 0, 0)';

    contextAudio.beginPath();

    let sliceWidth = parseInt(widthAudio) * 1.0 / bufferLength;
    let x = 0;

    for( var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * heightAudio/2;

    if (i === 0) {
        contextAudio.moveTo(x, y);
    } else {
        contextAudio.lineTo(x, y);
    }

    x += sliceWidth;
  }

  contextAudio.lineTo(widthAudio, heightAudio/2);
  contextAudio.stroke();
}
