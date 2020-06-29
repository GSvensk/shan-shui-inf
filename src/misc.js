document.addEventListener("mousemove", onMouseUpdate, false);
document.addEventListener("mouseenter", onMouseUpdate, false);
mouseX = 0;
mouseY = 0;

window.addEventListener("scroll", function (e) {
  document.getElementById("SETTING").style.left = Math.max(
    4,
    40 - window.scrollX
  );
});

window.addEventListener("scroll", function (e) {
  document.getElementById("SOURCE_BTN").style.left = Math.max(
    41,
    77 - window.scrollX
  );
});

rstyle("L", false);

MEM.lasttick = new Date().getTime();
document.getElementById("INP_SEED").value = SEED;
document
  .getElementById("BG")
  .setAttribute("style", "width:" + MEM.windx + "px");
update();
document.body.scrollTo(0, 0);
console.log(["SCROLLX", window.scrollX]);
present();
//draw();

rstyle("R", false);