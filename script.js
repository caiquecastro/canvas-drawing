const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const button = document.querySelector("button");
const images = document.querySelector("#result-images");

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
    let sourceX = pathBegin.x;
    let sourceY = pathBegin.y;
    const x = e.x - canvasRect.left;
    const y = e.y - canvasRect.top;
    let width = x - pathBegin.x;
    let height = y - pathBegin.y;

    if (width < 0) {
        width *= -1;
        sourceX -= width;
    }

    if (height < 0) {
        height *= -1;
        sourceY -= height;
    }

    squares.push({
        x: sourceX,
        y: sourceY,
        width,
        height,
    });

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


button.addEventListener("click", async () => {
    images.innerHTML = "";
    const requests = squares.map(async ({ width, height, x, y }) => {
        const response = await fetch("/.netlify/functions/crop-image", {
            method: "POST",
            body: JSON.stringify({
                width, height, x, y,
            }),
        });
    
        const buffer = await response.arrayBuffer();
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
    
        const resultImage = document.createElement("img");
        resultImage.src = url;

        images.append(resultImage);
    
        resultImage.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
    });

    await Promise.all(requests);
});