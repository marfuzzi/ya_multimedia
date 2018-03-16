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

    let width = 0;
    let height = 0;
    let loopVideo;
    let track;

    getWebcam();

    video.addEventListener('loadedmetadata', captureFrame);

    document.addEventListener('click', function (event) {
        if (event.target.className === 'photo-img') {
            event.target.remove();
        }
        if (event.target.classList.contains('button-photo')) {
            takePhoto(canvasInvert);
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
        addInvert(bgContextInvert, contextInvert, video, width, height);
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
