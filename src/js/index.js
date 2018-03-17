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

    const canvasNoise = document.querySelector('.canvas__noise');
    const contextNoise = canvasNoise.getContext('2d');
    const bgCanvasNoise = document.createElement('canvas');
    const bgContextNoise = bgCanvasNoise.getContext('2d');

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
        navigator.getUserMedia({video: true, audio: false}, function (stream) {
            video.src = window.URL.createObjectURL(stream);
            track = stream.getTracks()[0];
        }, function (e) {
            console.error('Error!', e);
        });
    }

})();
