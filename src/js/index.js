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
            setTimeout(function () {
                anxiety = null;
            }, 1500);
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
