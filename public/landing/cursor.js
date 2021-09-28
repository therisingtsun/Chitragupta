var cursor = document.querySelector(".cursor");
var cursor2 = document.querySelector(".cursor2");

document.addEventListener("mousemove", function(ev) {
    requestAnimationFrame(function () {
        cursor.style = cursor2.style = `left: ${ev.clientX}px; top: ${ev.clientY}px;`;
    });
});