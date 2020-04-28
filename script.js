var atomOrConstant = new RegExp("([A-Z]|[0-1])", "g");
var letters = new RegExp("[A-Z]", "g");
var unaryOrBinaryComplexFormula = new RegExp(
  "([(][!]([A-Z]|[0-1])[)])|([(]([A-Z]|[0-1])((&)|(\\|)|(->)|(~))([A-Z]|[0-1])[)])",
  "g"
);

var val = -1
var replaceFormula = "R";
var tempFormula;
var Formula = "";
var gen_formula;
var SYMBOLS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function input_values() {
  document.getElementById("TableBody").innerHTML = "";
  document.getElementById("continueButtonDiv").innerHTML = "";
  var inputStringVar = document.getElementById("inputString").value;
  if (!verificationFormula(inputStringVar)) {
    alert("Введенная строка не является формулой");
  } else {
    var variablesArr = searchVariables(inputStringVar);
    drawInputTable(variablesArr, inputStringVar);
  }
}

function verificationFormula(formula) {
  if (formula.match(atomOrConstant) != null) {
    while (formula != tempFormula) {
      tempFormula = formula;
      formula = formula.replace(unaryOrBinaryComplexFormula, replaceFormula);
    }
    if (formula.length == 1) return true;
    else return false;
  } else {
    return false;
  }
}

function newFormula() {
  var type = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
  switch (type) {
    case 1:
      var answer = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
      if (answer == 1) Formula = "1";
      else Formula = "0";
      break;

    case 2:
      var answer = Math.floor(Math.random() * (25 - 0 + 1)) + 0;
      Formula = SYMBOLS[answer];
      break;

    case 3:
      Formula = newFormula();
      Formula = "(" + "!" + Formula + ")";
      break;

    case 4:
      var relation = "";
      var type = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
      switch (type) {
        case 1:
          relation = "&";
          break;

        case 2:
          relation = "|";
          break;

        case 3:
          relation = "->";
          break;

        case 4:
          relation = "~";
          break;
      }

      var leftFormula = newFormula();
      var rightFormula = newFormula();
      Formula = "(" + leftFormula + relation + rightFormula + ")";
      break;
  }
  return Formula;
}

function print() {
  document.getElementById("generate_formula").innerHTML = newFormula();
  document.getElementById("result_1").innerHTML = "";
  document.getElementById("result_4").innerHTML = "Ответ";
  gen_formula = document.getElementById("generate_formula").textContent;
  if (gen_formula == 0 || gen_formula == 1) {
    val = gen_formula
  } else if (SYMBOLS.includes(gen_formula)) {
    val = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    res = gen_formula + "=" + val;
    document.getElementById("result_1").innerHTML = res;
  } else {
    perem = gen_formula.match(letters);
    if (perem == null) {
       val = calculateValue(gen_formula);
    } else {
      var mass_without = [];
      for (var i = 0; i < perem.length; i++) {
        if (mass_without.indexOf(perem[i]) == -1) {
          mass_without.push(perem[i]);
        }
      }
      var mass_means = [];
      var all = [];
      var b;
      for (var i = 0; i < mass_without.length; i++) {
        b = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
        mass_means.push(b);
        all[i] = mass_without[i] + "=" + mass_means[i];
      }
      document.getElementById("result_1").innerHTML = all;
      for (j = 0; j < mass_without.length; j++) {
        gen_formula = gen_formula.replace(
          new RegExp(mass_without[j], "g"),
          mass_means[j]
        );
      }
      mass_means.join();
      val = calculateValue(gen_formula); 
    }
  }
}

function checkUserAnswer() {
  var number = document.getElementById("text-number").value;
  if (number == "") {
    alert("Вы не ввели число");
    return;
  }
  if (val == number) {
    document.getElementById("result_4").innerHTML = "Правильно";
  } else {
    document.getElementById("result_4").innerHTML = "Не правильно";
  }
}

function searchVariables(inputStringVar) {
  var variablesArr = [];
  var stringLength = inputStringVar.length; 
  for (var i = 0; i < stringLength; i++) {
    if (inputStringVar[i].match(/([A-Z])/)) {
      if (variablesArr.indexOf(inputStringVar[i]) == -1) {
        variablesArr.push(inputStringVar[i]); 
      }
    }
  }
  return variablesArr; 
}

function drawInputTable(variablesArr, inputStringVar) {
  var tbody = document.getElementById("TableBody");
  var row1 = document.createElement("tr"); 
  var row2 = document.createElement("tr");
  for (var i = 0; i < variablesArr.length; i++) {
    var cell = document.createElement("td"); 
    cell.innerHTML = variablesArr[i];
    row1.appendChild(cell);
  }
  for (var i = 0; i < variablesArr.length; i++) {
    var cell = document.createElement("td"); 
    cell.innerHTML = '<input type="number" min=0 max=1 id="input' + i + '">';
    row2.appendChild(cell);
  }
  tbody.appendChild(row1);
  tbody.appendChild(row2);

  continueButton = document.createElement("button");
  continueButton.innerHTML = "Рассчитать возможные значения формулы";
  document.getElementById("continueButtonDiv").appendChild(continueButton);
  var stringWithPartialValues = inputStringVar;
  continueButton.onclick = function () {
    var redusedVarArr = [];
    for (var i = 0; i < variablesArr.length; i++) {
      var inputValue = document.getElementById("input" + i).value; 
      if (inputValue) {
        inputValue = parseInt(inputValue);
        stringWithPartialValues = stringWithPartialValues.replace(
          new RegExp(variablesArr[i], "g"),
          inputValue
        ); 
      } else {
        redusedVarArr.push(variablesArr[i]);
      }
    }

    var tbody = document.getElementById("TableBody");
    tbody.innerHTML = ""; 
    document.getElementById("continueButtonDiv").innerHTML = "";
    createHeadline(tbody, redusedVarArr); 
    var numOfCombinations = Math.pow(2, redusedVarArr.length); 
    for (var i = 0; i < numOfCombinations; i++) {
      var values = i.toString(2); 
      while (values.length < redusedVarArr.length) {
        values = "0" + values;
      }

      var stringWithValues = stringWithPartialValues;
      for (j = 0; j < redusedVarArr.length; j++) {
        stringWithValues = stringWithValues.replace(
          new RegExp(redusedVarArr[j], "g"),
          values[j]
        ); 
      }
      var value = calculateValue(stringWithValues); 
      addInResult(tbody, values, value, redusedVarArr); 
    }
  };


  function createHeadline(tbody, redusedVarArr) {
    var row = document.createElement("tr"); 
    for (var i = 0; i < redusedVarArr.length; i++) {
      var cell = document.createElement("td"); 
      cell.innerHTML = redusedVarArr[i];
      row.appendChild(cell);
    }
    var cell = document.createElement("td"); 
    cell.innerHTML = "Результат";
    row.appendChild(cell);
    tbody.appendChild(row);
  }
}
function addInResult(tbody, values, value, redusedVarArr) {
  var row = document.createElement("tr"); 
  for (var i = 0; i < redusedVarArr.length; i++) {

    var cell = document.createElement("td");
    cell.innerHTML = values[i];
    row.appendChild(cell);
  }
  var cell = document.createElement("td"); 
  cell.innerHTML = value; 
  row.appendChild(cell);
  tbody.appendChild(row);
}

function calculateValue(stringWithValues) {
  var unary_formula = /\(\!([01])\)/g;
  var binary_formula = /\(([01])([\&\|\~]|(\-\>))([01])\)/g;
  var conjunction = /\(([01])(\&)([01])\)/g;
  var disjunction = /\(([01])(\|)([01])\)/g;
  var implication = /\(([01])(\-\>)([01])\)/g;
  var equivalence = /\(([01])(\~)([01])\)/g;

  while (
    stringWithValues.match(unary_formula) ||
    stringWithValues.match(binary_formula)
  ) {
    if (stringWithValues.match(unary_formula)) {
      var match = stringWithValues.match(unary_formula);
      for (var i = 0; i < match.length; i++) {
        stringWithValues = stringWithValues.replace(
          match[i],
          unary_formula_result(match[i])
        );
      }
    } else if (stringWithValues.match(conjunction)) {
      var match = stringWithValues.match(conjunction);
      for (var i = 0; i < match.length; i++) {
        stringWithValues = stringWithValues.replace(
          match[i],
          conjunction_result(match[i])
        );
      }
    } else if (stringWithValues.match(disjunction)) {
      var match = stringWithValues.match(disjunction);
      for (var i = 0; i < match.length; i++) {
        stringWithValues = stringWithValues.replace(
          match[i],
          disjunction_result(match[i])
        );
      }
    } else if (stringWithValues.match(implication)) {
      var match = stringWithValues.match(implication);
      for (var i = 0; i < match.length; i++) {
        stringWithValues = stringWithValues.replace(
          match[i],
          implication_result(match[i])
        );
      }
    } else if (stringWithValues.match(equivalence)) {
      var match = stringWithValues.match(equivalence);
      for (var i = 0; i < match.length; i++) {
        stringWithValues = stringWithValues.replace(
          match[i],
          equivalence_result(match[i])
        );
      }
    }
  }

  return stringWithValues;
}

function unary_formula_result(match) {
  if (match.match(/\(\!([1])\)/g)) {
    return 0;
  } else {
    return 1;
  }
}

function conjunction_result(match) {
  if (match.match(/\(([1])(\&)([1])\)/g)) {
    return 1;
  } else {
    return 0;
  }
}

function disjunction_result(match) {
  if (match.match(/\(([0])(\|)([0])\)/g)) {
    return 0;
  } else {
    return 1;
  }
}

function implication_result(match) {
  if (
    match.match(/\(([0])(\-\>)([01])\)/g) ||
    match.match(/\(([1])(\-\>)([1])\)/g)
  ) {
    return 1;
  } else {
    return 0;
  }
}

function equivalence_result(match) {
  if (
    match.match(/\(([0])(\~)([0])\)/g) ||
    match.match(/\(([1])(\~)([1])\)/g)
  ) {
    return 1;
  } else {
    return 0;
  }
}
