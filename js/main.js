const audio = document.querySelector('.audio');
const canvasAudio = document.querySelector('.camera__audio');
const contextAudio = canvasAudio.getContext('2d');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let widthAudio = 0;
let heightAudio = 0;
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
    analyser.getByteTimeDomainData(dataArray);

    contextAudio.lineTo(widthAudio, heightAudio/2);
    contextAudio.strokeStyle = '#28d1fa';
    contextAudio.lineWidth = 1;
    contextAudio.shadowBlur = 1;
    contextAudio.shadowColor = '#28d1fa';
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
    contextAudio.stroke();
}

(() => {
    navigator.getUserMedia = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

    if (!navigator.getUserMedia) {
        return false;
    }

    const video = document.querySelector('.camera__video');
    const canvasInvert = document.querySelector('.canvas__invert');
    const contextInvert = canvasInvert.getContext('2d');
    const controlls = document.querySelector('.controls-left');

    const radar = document.querySelector('.radar');

    let width = 0;
    let height = 0;
    let loopVideo;
    let track;
    let noise;
    let anxiety;
    let zoom;

    getWebcam();

    video.addEventListener('loadedmetadata', captureFrame);

    function captureFrame() {
        width = canvasInvert.width = video.videoWidth;
        height = canvasInvert.height = video.videoHeight;
        startVideo();
    }

    function startVideo() {
        loopVideo = loopVideo || requestAnimationFrame(playVideo);
    }

    function playVideo() {
        loopVideo = requestAnimationFrame(playVideo);
        noise ? addNoise(bgContextNoise, contextNoise, width, height) : contextNoise.clearRect(0, 0, width, height);
        if (anxiety) {
            video.classList.add('anxiety');
            controlls.style.display = 'none';
            setTimeout(function () { anxiety = null; }, 1500);
        } else {
            video.classList.remove('anxiety');
            controlls.style.display = 'block';
            addInvert(contextInvert, video, width, height);
        }
    }

    function getWebcam() {
        navigator.getUserMedia({video: true, audio: true}, function (stream) {
            video.src = window.URL.createObjectURL(stream);
            track = stream.getTracks()[0];
            audioStream(stream);
        }, function (e) {
            console.error('Error!', e);
        });
    }

    document.addEventListener('click', function (event) {
        if (event.target.className === 'photo-img') {
            event.target.remove();
        }
        if (event.target.classList.contains('button-photo')) {
            takePhoto(canvasInvert);
        }
        if (event.target.classList.contains('button-noise')) {
            noise = noise ? null : true;
            toogle(noise, event.target);
        }
        if (event.target.classList.contains('button-anxiety')) {
            anxiety = true;
        }
        if (event.target.classList.contains('button-zoom')) {
            radar.style.display = zoom ? 'none' : 'block';
            zoom = zoom ? null : true;
            toogle(zoom, event.target);
        }
    });

    function toogle(param, e) {
        param ? e.classList.add('active') : e.classList.remove('active');
    }

    requestAnimationFrame(renderTime);
})();

const addInvert = (context, video, width, height) => {
    context.drawImage(video, 0, 0, width, height);
    let idata = context.getImageData(0, 0, width, height);
    let imageDataFiltered = invertColor(idata);
    context.putImageData(imageDataFiltered, 0, 0);
};

function invertColor(imageData) {
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 150 - pixels[i];
        pixels[i + 1] = 150 - pixels[i + 1];
        pixels[i + 2] = 150 - pixels[i + 2];
    }
    return imageData;
}

const canvasNoise = document.querySelector('.canvas__noise');
const contextNoise = canvasNoise.getContext('2d');
const bgCanvasNoise = document.createElement('canvas');
const bgContextNoise = bgCanvasNoise.getContext('2d');


const addNoise = (bgContext, context, width, height) => {
    let idata = bgContext.createImageData(width, height);
    let buffer32 = new Uint32Array(idata.data.buffer);
    let len = buffer32.length;

    let pr = 456 * Math.random();
    let prs = 716 * Math.random();

    for (let i = 0; i < len; i++) {
        buffer32[i] = (((pr % 255)|0) << 24) | 0x440000;
        pr += prs * 1.2;
    }
    context.putImageData(idata, 0, 0);
};

const collection = document.querySelector('.photo-collection');
const snap = document.querySelector('.snap');
const button = document.querySelector('.button-foto');

const takePhoto = (canvas) => {
    let img = document.querySelectorAll('.photo-img');
    if (img.length>2) {
        img[0].remove();
    }
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.classList.add('photo');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img class="photo-img" src="${data}" alt="Handsome Man" />`;
    collection.insertBefore(link, collection.firsChild);
};

function renderTime() {
    requestAnimationFrame(renderTime);
    const canvasTime = document.querySelector('.canvasTime');
    const contextTime = canvasTime.getContext('2d');

    let now = new Date();
    let today = now.toDateString();
    let time = now.toLocaleTimeString();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let milliseconds = now.getMilliseconds();
    let newSeconds = seconds + (milliseconds/1000);

    contextTime.strokeStyle = '#00ffff';
    contextTime.lineWidth = 1;
    contextTime.lineCap = 'round';

    // Background
    gradient = contextTime.createRadialGradient(250, 250, 5, 250, 250, 300);
    gradient.addColorStop(0, '#262627');
    gradient.addColorStop(1, '#2d2d2e');
    contextTime.fillStyle = gradient;

    // hours
    contextTime.beginPath();
    contextTime.arc(125,125,100,degToRad(270),degToRad(hours*15-90));
    contextTime.stroke();

    // minutes
    contextTime.beginPath();
    contextTime.arc(125,125,70,degToRad(270),degToRad(minutes*6-90));
    contextTime.stroke();

    // seconds
    contextTime.beginPath();
    contextTime.arc(125,125,40,degToRad(270),degToRad(newSeconds*6-90));
    contextTime.stroke();

    // time
    contextTime.font ='15px Arial';
    contextTime.fillStyle = '28d1fa';
    contextTime.fillText(time, 90, 270);
}

function degToRad(degree) {
    let factor = Math.PI/180;
    return degree*factor;
}
