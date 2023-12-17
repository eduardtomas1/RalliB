document.addEventListener("mousemove", moviment);

function moviment (e)
{
    let cotxe = document.getElementById("choco");

    let x = (e.clientX * 7) / 250;
    let y = (e.clientY * 7) / 250;

    cotxe.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
}