// Classes....
class Operation {
	
	constructor(num1 = " ", num2 = " ", operator = " ", result) {
		this.num1 = num1;
		this.num2 = num2;
		this.operator = operator;
		this.result = result;
	}

	addToHistoryPanel() {
		addToHistoryPanel(this)
	}

	calculateResult(equation) {
		const result = parser.evaluate(equation);
		operation.result = String(result);
		operation.num2 = mainDisplay.innerHTML;
	}

}

// Variables....
let operation = new Operation();
const parser = math.parser();
const history = JSON.parse(localStorage.getItem("history")) ?? [];
let helpData = null;

// Elements...
const mainDisplay = document.getElementById("mainDisplay");
const subDisplay = document.getElementById("subDisplay");
const historyContainer = document.getElementById("historyContainer");
const historyPanel = document.getElementById("historyContent");
const historyIcon = document.getElementById("iconHistory");
const helpMode = document.getElementById("helpMode");
const helpDescription = document.getElementById("helpDescription");

// Setup...
parser.set("ln", function (number) {
	return math.evaluate("log(" + number + ", e)");
});

history.forEach((operation) => {
	addToHistoryPanel(operation);
});

// Async await...
const fetchHelpData = async () => {
	const resp = await fetch("./help.JSON");
	const data = await resp.json();

	return data;
};

fetchHelpData().then((data) => {
	helpData = data.help;
});

// Events....
setOperatorEvent("plus", "+")
setOperatorEvent("substract", "-")
setOperatorEvent("multiply", "*")
setOperatorEvent("divide", "/")
setOperatorEvent("power", "^")

for (let index = 0; index < 10; index++) {
	document.getElementById("num" + index).onclick = () => {
		addNumberToDisplay(String(index));
	};
}

var operationButtons = document.getElementsByClassName("operation")
for (let index = 0; index < operationButtons.length; index++) {
	operationButtons[index].onmouseover = () => {
		setMouseoverEvent(operationButtons[index].id)
	}
}

document.getElementById("changeSign").onclick = () => {
	let content = mainDisplay.innerHTML;
	mainDisplay.innerHTML =
		content[0] != "-" ? "-" + content : content.substring(1);
};

document.getElementById("comma").onclick = () => {
	addDecimalPlace();
};

document.getElementById("CE").onclick = () => {
	mainDisplay.innerHTML = "0";
};

document.getElementById("C").onclick = () => {
	clearAll();
};

document.getElementById("equal").onclick = () => {
	performEqualOperation();
};

document.getElementById("pi").onclick = () => {
	addNumberToDisplay("pi");
};

document.getElementById("sqrt").onclick = () => {
	surroundOperatorClick("sqrt");
};

document.getElementById("log10").onclick = () => {
	surroundOperatorClick("log10");
};

document.getElementById("ln").onclick = () => {
	surroundOperatorClick("ln");
};

historyIcon.onclick = () => {
	toggleHistoryPanel();
};

helpMode.onclick = () => {
	helpMode.checked ? helpDescription.style.display = 'block' : helpDescription.style.display = 'none'
}

// Keyboard Events....
document.addEventListener("keydown", (event) => {
	var key = event.key;
	for (let index = 0; index < 10; index++) {
		key == index && addNumberToDisplay(key);
	}
	key == "Enter" && performEqualOperation();
	key == "+" && operatorClick(key);
	key == "*" && operatorClick(key);
	key == "-" && operatorClick(key);
	key == "/" && operatorClick(key);
	key == "^" && operatorClick(key);
	key == "." && addDecimalPlace();
	key == "," && addDecimalPlace();
	if (key == "Backspace") {
		mainDisplay.innerHTML = mainDisplay.innerHTML.slice(0, -1);
	}
});

// Functions....
function addNumberToDisplay(number) {
	// Emptying for next operation
	if (subDisplay.innerHTML.includes("=")) {
		subDisplay.innerHTML = "";
		mainDisplay.innerHTML = "";
	}

	// Replacing empty value
	if (mainDisplay.innerHTML == "0") {
		mainDisplay.innerHTML = "";
	}

	// Appending number
	mainDisplay.innerHTML += number
}

function operatorClick(operator) {
	subDisplay.innerHTML = mainDisplay.innerHTML + " " + operator + " ";
	operation.num1 = mainDisplay.innerHTML;
	operation.operator = operator;
	mainDisplay.innerHTML = "0";
}

function surroundOperatorClick(operator) {
	mainDisplay.innerHTML = operator + "(" + mainDisplay.innerHTML + ")";
}

function clearAll() {
	operation = new Operation();
	subDisplay.innerHTML = "";
	mainDisplay.innerHTML = "0";
}

function addDecimalPlace() {
	let content = mainDisplay.innerHTML;
	if (!content.includes(".")) {
		mainDisplay.innerHTML = content + ".";
	}
}

function performEqualOperation() {
	if (subDisplay.innerHTML.includes("=")) {
		subDisplay.innerHTML = "";
	}

	// Calculating result
	let equation = subDisplay.innerHTML + mainDisplay.innerHTML;
	operation.calculateResult(equation)

	// Update screen
	mainDisplay.innerHTML = operation.result;
	subDisplay.innerHTML = equation + " =";

	// Add History
	history.push(operation);
	if (history.length >= 15) {
		history.shift();
		historyPanel.removeChild(historyPanel.firstChild);
	}
	localStorage.setItem("history", JSON.stringify(history));
	operation.addToHistoryPanel(historyPanel);
	operation = new Operation();
}

function toggleHistoryPanel() {
	let isShown = historyContainer.style.maxWidth
	if (isShown) {
		// Collapse
		historyContainer.style.maxWidth = null;
		historyContainer.style.maxHeight = null;
	} else {
		// Show
		historyContainer.style.maxWidth = "90vw";
		historyContainer.style.maxHeight = "90vh";
	}
}

function addToHistoryPanel(operation) {
	let element = document.createElement("p");
	const { num1, operator, num2, result } = operation;
	element.innerHTML = num1 + " " + operator + " " + num2 + " = " + result;
	historyPanel.appendChild(element);
}

function getHelpDataDescription(name) {
	if (helpData == null) {
		return "No se pudo cargar los datos de ayuda";
	}

	return helpData[name]?.description ?? "Null";
}

function setMouseoverEvent(name) {
	if (!helpMode.checked) {
		return;
	}

	const description = getHelpDataDescription(name);
	helpDescription.innerHTML = description
}

function setOperatorEvent(id, operator) {
	document.getElementById(id).onclick = () => {
		operatorClick(operator);
	};
}