// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.ieRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 100);
    }
  );
})();

var fpsElement = document.getElementById("fps");

var then = Date.now() / 1000; // get time in seconds
const FPSs = [];
let counter = 0;
var render = function () {
  var now = Date.now() / 1000; // get time in seconds
  counter++;
  // compute time since last frame
  var elapsedTime = now - then;
  then = now;

  // compute fps
  var fps = elapsedTime !== 0 ? 1 / elapsedTime : 1;
  FPSs.unshift(fps);
  if (FPSs.length < 30) {
    requestAnimFrame(render);
    return;
  }
  FPSs.pop();
  if (counter % 10 === 0) {
    avgFpsOfLast10Frames = FPSs.reduce((a, b) => a + b) / FPSs.length;
    console.log("Avg fps of last 30 frames: ", avgFpsOfLast10Frames);
    fpsElement.innerText = avgFpsOfLast10Frames.toFixed(2);
  }
  requestAnimFrame(render);
};
render();
