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
 //   contextTime.shadowBlur = 1;
    contextTime.lineCap = 'round';
//    contextTime.shadowColor = '#00ffff';

    // Background
    gradient = contextTime.createRadialGradient(250, 250, 5, 250, 250, 300);
    gradient.addColorStop(0, '#262627');
    gradient.addColorStop(1, '#2d2d2e');
    contextTime.fillStyle = gradient;
    //ctx.fillStyle = 'rgba(00 ,00 , 00, 1)';
  //  contextTime.fillRect(0, 0, 500, 500);
   //linear-gradient(#262627, #2d2d2e)
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


// var canvas = document.getElementById("canvas");
// 		var ctx = canvas.getContext("2d");

// 		ctx.strokeStyle = '#00ffff';
// 		ctx.lineWidth = 17;
// 		ctx.shadowBlur= 15;
// 		ctx.shadowColor = '#00ffff'

// 		function degToRad(degree){
// 			var factor = Math.PI/180;
// 			return degree*factor;
// 		}

// 		function renderTime(){
// 			var now = new Date();
// 			var today = now.toDateString();
// 			var time = now.toLocaleTimeString();
// 			var hrs = now.getHours();
// 			var min = now.getMinutes();
// 			var sec = now.getSeconds();
// 			var mil = now.getMilliseconds();
// 			var smoothsec = sec+(mil/1000);
//       var smoothmin = min+(smoothsec/60);


// 			//Hours
// 			ctx.beginPath();
// 			ctx.arc(250,250,200, degToRad(270), degToRad((hrs*30)-90));
// 			ctx.stroke();
// 			//Minutes
// 			ctx.beginPath();
// 			ctx.arc(250,250,170, degToRad(270), degToRad((smoothmin*6)-90));
// 			ctx.stroke();
// 			//Seconds
// 			ctx.beginPath();
// 			ctx.arc(250,250,140, degToRad(270), degToRad((smoothsec*6)-90));
// 			ctx.stroke();
// 			//Date
// 			ctx.font = "25px Helvetica";
// 			ctx.fillStyle = 'rgba(00, 255, 255, 1)'
// 			ctx.fillText(today, 175, 250);
// 			//Time
// 			ctx.font = "25px Helvetica Bold";
// 			ctx.fillStyle = 'rgba(00, 255, 255, 1)';
// 			ctx.fillText(time+":"+mil, 175, 280);

// 		}
