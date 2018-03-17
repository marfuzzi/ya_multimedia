(function () {
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
    const bgCanvasInvert = document.createElement('canvas');
    const bgContextInvert = bgCanvasInvert.getContext('2d');

    const radar = document.querySelector('.radar');

    const audio = document.querySelector('.audio');
    const canvasAudio = document.querySelector('.camera__audio');
    const contextAudio = canvasAudio.getContext('2d');


    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    let width = 0;
    let height = 0;
    let widthAudio = 0;
    let heightAudio = 0;
    let loopVideo;
    let loopAudio;
    let track;
    let noise;
    let anxiety;
    let zoom;
    let analyser;
    let distortion;
    let gainNode;
    let biquadFilter;

    getWebcam();


    video.addEventListener('loadedmetadata', captureFrame);
    requestAnimationFrame(renderTime);

    document.addEventListener('click', function (event) {
        if (event.target.className === 'photo-img') {
            event.target.remove();
        }
        if (event.target.classList.contains('button-photo')) {
            takePhoto(canvasInvert);
        }
        if (event.target.classList.contains('button-noise')) {
            noise = noise ? null : true;
        }
        if (event.target.classList.contains('button-anxiety')) {
            anxiety = true;
        }
        if (event.target.classList.contains('button-zoom')) {
            radar.style.display = zoom ? 'none' : 'block';
            zoom = zoom ? null : true;
        }
    });

    function captureFrame() {
        width = canvasInvert.width = video.videoWidth;
        height = canvasInvert.height = video.videoHeight;

        centerX = width / 2;
        centerY = height / 2;

        bgCanvasInvert.width = width;
        bgCanvasInvert.height = height;

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
            setTimeout(function () { anxiety = null; }, 1000);
        } else {
            video.classList.remove('anxiety');
            addInvert(bgContextInvert, contextInvert, video, width, height);
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
        var bufferLength = analyser.frequencyBinCount; // half the FFT value
        var dataArray = new Uint8Array(bufferLength); // create an array to store the data

        contextAudio.clearRect(0, 0, widthAudio, heightAudio);
        analyser.getByteTimeDomainData(dataArray); // get waveform data and put it into the array created above

        contextAudio.fillStyle = 'rgb(200, 200, 200)'; // draw wave with canvas
        contextAudio.fillRect(0, 0, widthAudio, heightAudio);

        contextAudio.lineWidth = 2;
        contextAudio.strokeStyle = 'rgb(0, 0, 0)';

        contextAudio.beginPath();

      var sliceWidth = widthAudio * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * heightAudio/2;

        if(i === 0) {
            contextAudio.moveTo(x, y);
        } else {
            contextAudio.lineTo(x, y);
        }

        x += sliceWidth;
      }

      contextAudio.lineTo(widthAudio, heightAudio/2);
      contextAudio.stroke();
    }
})();
