const DrawSize = 600;
const Margin = 30;
const app = new PIXI.Application({
    width: DrawSize + Margin * 2,
    height: DrawSize + Margin * 2,
    resolution: window.devicePixelRatio || 1,
    autoResize: true,
    backgroundColor: 0xeeeeee,
    autoDensity: true,
    antialias: true,
});
document.body.appendChild(app.view);
const graph = new PIXI.Graphics();
app.stage.addChild(graph);
const lineColor = 0x292929;
const circleColor = 0xff4500;
const lineWidth = 3;
const CircleRadius = 5;

// todo
function gen(seed) {
    return "4\n0 0\n1 0\n1 1\n0 1\n";
}

function computeScore(input, output) {
    let N = input[0][0];
    let answer = 0;
    for (let i = 0; i < N; i++) {
        answer += Math.hypot(input[output[(i + 1) % N]][0] - input[output[i]][0], input[output[(i + 1) % N]][1] - input[output[i]][1]);
    }
    let err = "";
    for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
            if (output[i] == output[j]) err = (i + 1) + ", " + (j + 1) + "is same point";
        }
    }
    return { score: answer, error: err };
}

function StringToArray(value) {
    const outputs = value.replace(/\r\n|\r/g, "\n").split('\n');
    let output = [];
    for (let out of outputs) {
        const outs = out.split(/\s+/);
        let words = [];
        for (let word of outs) {
            if (word != '') words.push(Number(word));
        }
        if (words.length != 0) {
            output.push(words);
        }
    }
    return output;
}

function compressInput(input) {
    const N = input[0][0];
    let mnX = input[1][0], mxX = input[1][0];
    let mnY = input[1][1], mxY = input[1][1];
    for (let i = 2; i <= N; i++) {
        mnX = Math.min(mnX, input[i][0]);
        mnY = Math.min(mnY, input[i][1]);
        mxX = Math.max(mxX, input[i][0]);
        mxY = Math.max(mxY, input[i][1]);
    }
    const Length = Math.max(mxY - mnY, mxX - mnX);
    const centerX = (mxX + mnX) / 2;
    const centerY = (mxY + mnY) / 2;

    let result = [];
    for (let i = 1; i <= N; i++) {
        result.push(
            [
                Margin + DrawSize / 2 + (input[i][0] - centerX) * DrawSize / Length,
                Margin + DrawSize / 2 + (input[i][1] - centerY) * DrawSize / Length,
            ]);
    }
    return result;
}

function changeTurn(turn) {
    const maxTurn = Number(document.getElementById("turn").max);
    const newTurn = Math.min(Math.max(0, turn), maxTurn);
    document.getElementById("turn").value = newTurn;
    document.getElementById("turnBar").value = newTurn;
    visualize();
}

function visualize() {
    document.getElementById("result").innerHTML = "";
    document.getElementById("score").innerHTML = "Score = " + 0;
    graph.clear();
    try {
        const input = StringToArray(document.getElementById("input").value);
        const output = StringToArray(document.getElementById("output").value);

        const t = document.getElementById("turn").value;

        if (t == 0) {
            document.getElementById("score").innerHTML = "Score = " + 0;
        } else {
            const result = computeScore(input, output[t - 1]);
            if (result.error === '') {
                document.getElementById("score").innerHTML = "Score = " + result.score;
            } else {
                document.getElementById("result").innerHTML = "<p>" + result.error + "</p>";
                return;
            }
        }
        // 頂点を書く
        const positions = compressInput(input);
        const N = input[0][0];

        if (t != 0) {
            graph.lineStyle(lineWidth, lineColor);
            graph.moveTo(positions[output[t - 1][N - 1] - 1][0], positions[output[t - 1][N - 1] - 1][1]);
            for (let i = 0; i < N; i++) {
                graph.lineTo(positions[output[t - 1][i] - 1][0], positions[output[t - 1][i] - 1][1]);
                graph.moveTo(positions[output[t - 1][i] - 1][0], positions[output[t - 1][i] - 1][1]);
            }
        }

        for (let i = 0; i < N; i++) {
            graph.beginFill(circleColor).lineStyle(0, circleColor);
            graph.drawCircle(positions[i][0], positions[i][1], CircleRadius);
            graph.endFill();
        }

    } catch (error) {
        console.log(error);
        document.getElementById("result").innerHTML = "<p>Invalid</p>";
    }
}

function generate() {
    const seed = document.getElementById("seed").value;
    const input = gen(seed);
    document.getElementById("input").value = input;
    updateInOut();
}
generate();

function updateInOut() {
    const output = StringToArray(document.getElementById("output").value);
    document.getElementById("turn").max = output.length;
    document.getElementById("turnBar").max = output.length;
    changeTurn(output.length);
}

function download() {

}

/*
1 2 3 4
1 3 2 4
1 3 4 2

*/