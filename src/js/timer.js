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

    contextTime.strokeStyle = '#28d1fa';
    contextTime.lineWidth = 1;
    contextTime.shadowBlur = 1;
    contextTime.lineCap = 'round';
    contextTime.shadowColor = '#28d1fa';

    contextTime.fillRect(0,0,500,500);

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
    // contextTime.font ='15px Arial';
    // contextTime.fillStyle = '28d1fa';
    // contextTime.fillText(time, 90, 270);
}

function degToRad(degree) {
    let factor = Math.PI/180;
    return degree*factor;
}
