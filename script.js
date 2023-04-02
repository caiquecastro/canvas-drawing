const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const resultImage = document.querySelector('#result');

let pathBegin = null;

const squares = [];

const bgImage = new Image();
bgImage.src = '/paisagem.jpg';
bgImage.addEventListener("load", () => {
    canvas.width = bgImage.width / 5;
    canvas.height = bgImage.height / 5;
    context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}, { once: true });

function clearCanvas() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

function drawSquares() {
    context.strokeStyle = "blue";
    context.setLineDash([0]);
    context.fillStyle = "rgba(0, 0, 0, .5)";
    for (let square of squares) {
        context.strokeRect(square.x, square.y, square.width, square.height);
    }
}

canvas.addEventListener("mousedown", (e) => {
    const canvasRect = e.target.getBoundingClientRect();
    const x = e.x - canvasRect.left;
    const y = e.y - canvasRect.top;

    pathBegin = { x, y };
});

canvas.addEventListener("mouseup", (e) => {
    if (!pathBegin) {
        console.log('skip mouseup');
    }

    const canvasRect = e.target.getBoundingClientRect();
    const x = e.x - canvasRect.left;
    const y = e.y - canvasRect.top;
    const width = x - pathBegin.x;
    const height = y - pathBegin.y;

    squares.push({
        ...pathBegin,
        width,
        height,
    });

    console.log(pathBegin, width, height);

    clearCanvas();
    drawSquares();

    pathBegin = null;
});

canvas.addEventListener("mousemove", (e) => {
    if (!pathBegin) {
        return;
    }

    const canvasRect = e.target.getBoundingClientRect();
    const x = e.x - canvasRect.left;
    const y = e.y - canvasRect.top;
    const width = x - pathBegin.x;
    const height = y - pathBegin.y;

    clearCanvas();
    drawSquares();
    context.strokeStyle = "black";
    context.setLineDash([10]);
    context.strokeRect(pathBegin.x, pathBegin.y, width, height);
});

const button = document.querySelector("button");

button.addEventListener("click", async () => {
    const response = await fetch("/.netlify/functions/crop-image", {
        method: "POST",
        body: JSON.stringify({
            squares,
        }),
    });

    const buffer = await response.arrayBuffer();
    const blob = new Blob( [ buffer ] );
    const url = URL.createObjectURL( blob );

    resultImage.src = url;

    resultImage.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
});