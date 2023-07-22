async function main() {
    const pyodide = await loadPyodide();
    pyodide.runPython(`
    import random
    def gen():
        res = [[365]]
        res.append([random.randrange(0, 101) for _ in range(26)])
        for _ in range(365):
            res.append([random.randrange(0, 20001) for _ in range(26)])
        return res
    `);
    return pyodide;
}
let pyodideReadyPromise = main();

async function gen(seed) {
    let pyodide = await pyodideReadyPromise;
    try {
        pyodide.runPython("random.seed("+ seed +")");
        let input = pyodide.runPython("gen()").toJs();
        return ArrayToString(input);
    } catch (err) {
        console.log("error");
        return "";
    }
}

function computeScore(input, output) {
    const N = input[0][0];
    const c = input[1];
    for (let i = 0; i < N; i++) {
        if(typeof(output[i][0]) != "number"){
            return { score: 0, error: output[i][0] + " is not number" };
        }
        if(output[i][0] < 1 || output[i][0] > 26){
            return { score: 0, error: output[i][0] + " is not contest" };
        }
    }
    
    let last = new Array(26);
    for(let i = 0; i < 26; i++)last[i] = -1;

    let answer = 0;
    for (let i = 0; i < N; i++) {
        answer += input[2 + i][output[i][0] - 1];
        last[output[i][0] - 1] = i;
        for (let j = 0; j < 26; j++){
            answer -= c[j] * (i - last[j]);
        }
    }

    return { score: answer, error: "" };
}

function StringToArray(value) {
    const outputs = value.replace(/\r\n|\r/g, "\n").split('\n');
    let output = [];
    for (let out of outputs) {
        const outs = out.split(/\s+/);
        let words = [];
        for (let word of outs) {
            if (word != '') {
                let w = Number(word);
                words.push(isNaN(w)?word:w);
            }
        }
        if (words.length != 0) {
            output.push(words);
        }
    }
    return output;
}

function ArrayToString(values) {
    let result = "";
    for(let value of values) {
        for (let i = 0; i < value.length; i++){
            result += value[i];
            if(i != value.length) result += " ";
        }
        result += "\n";
    }
    return result;
}

let contestV;
let contestH;

function visInit(){
    contestV = document.createElement('table');
    
    let tr = document.createElement('tr');
    for (let j = 0; j < 26; j++) {
        let td = document.createElement('td');
        td.textContent = "" + String.fromCharCode('A'.charCodeAt(0) + j);
        td.className = "ContestType";
        tr.appendChild(td);
    }
    contestV.appendChild(tr);
    
    tr = document.createElement('tr');
    for (let j = 0; j < 26; j++) {
        let td = document.createElement('td');
        td.textContent = 0;
        td.className = "ContestValue";
        tr.appendChild(td);
    }
    contestV.appendChild(tr);
    contestV.className = "Contest";

    document.getElementsByClassName('visualize')[0].appendChild(contestV);
    contestH = document.createElement('table');
    contestH.className = "Contes";
    document.getElementsByClassName('visualize')[0].appendChild(contestH);
}
visInit();

function changeInput(){

    const input = StringToArray(document.getElementById("input").value);
    let D = input[0][0];

    let conV = contestV.rows[1].cells;
    for(let i = 0; i < 26; i++){
        conV[i].innerHTML = input[1][i];
    }
    
    contestH.innerHTML = "";
    for(let i = 0; i < D; i++){
        let tr = document.createElement("tr");
        for(let j = 0; j < 26; j++){
            let td = document.createElement("td");
            td.textContent = input[i+2][j];
            td.className = "ContestHolds";
            td.onclick = function(){clicked(this);};
            tr.appendChild(td);
        }
        contestH.appendChild(tr);
    }

    visualize();
}

function OutputColor(input,output){
    const D = input[0][0];
    
    let last = new Array(26);
    for(let i = 0; i < 26; i++)last[i] = -1;

    let answer = 0;
    for (let i = 0; i < D; i++) {
        last[output[i][0] - 1] = i;
        for (let j = 0; j < 26; j++){
            contestH.rows[i].cells[j].className = "ContestHolds";
            let diff = (i - last[j]) * 3;
            diff = Math.min(255, diff);
            let col = (255 - diff).toString(16);
            if(col.length === 1)col = "0" + col;
            contestH.rows[i].cells[j].style.background = "#ff" + col + col;
        }
        contestH.rows[i].cells[output[i][0] - 1].className += " ContestHold";
        contestH.rows[i].cells[output[i][0] - 1].style.background = "";
    }
}

function visualize() {
    document.getElementById("result").innerHTML = "";
    document.getElementById("score").innerHTML = "Score = 0 (error)";
    try {
        const input = StringToArray(document.getElementById("input").value);
        const output = StringToArray(document.getElementById("output").value);
        const result = computeScore(input, output);
        if (result.error === "") {
            document.getElementById("score").innerHTML = "Score = " + Math.max(0, 1000000 + result.score) + " (" + result.score + ")";
        } else {
            document.getElementById("result").innerHTML = "<p>" + result.error + "</p>";
        }
        OutputColor(input, output);
        return;
    }catch (error) {
        console.log(error);
        document.getElementById("result").innerHTML = "<p>Invalid</p>";
        return;
    }

}

async function generate() {
    const seed = document.getElementById("seed").value;
    const input = await gen(seed);
    document.getElementById("input").value = input;
    changeInput();
}
generate();

let manualMode = false;
function changeMode(){
    manualMode = !manualMode;
}

function clicked(Cell){
    if(manualMode === false) return;
    let rowINX = Cell.parentNode.rowIndex;
    let cellINX = Cell.cellIndex;
    const output = StringToArray(document.getElementById("output").value);
    while(output.length <= rowINX){
        output.push([1]);
    }
    output[rowINX][0] = cellINX + 1;
    document.getElementById("output").value = ArrayToString(output);
    visualize();
}