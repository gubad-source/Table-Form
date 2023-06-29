//////////////////////table-form//////////////////////////
let tableForm = document.querySelector("#tableForm");

let tableWrapper = document.querySelector("#table-wrapper");

let tableEditInput = document.querySelector("#table-edit-input");

let openTableElem = null;

let tableData = {
  row: 0,
  column: 0,
};

tableForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let row = Number(document.querySelector("#row").value);

  if (isNaN(row) || row < 1) {
    return;
  }

  let column = Number(document.querySelector("#column").value);

  if (isNaN(column) || column < 1) {
    return;
  }

  tableData.row = row;
  tableData.column = column;

  generateTable();
});

function generateTable() {
  let table = document.createElement("table");
  table.classList.add("table");
  table.classList.add("table-striped");
  table.classList.add("editable");

  let thead = document.createElement("thead");
  let headTr = document.createElement("tr");
  for (let i = 0; i < tableData.column; i++) {
    let th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.addEventListener("click", openInput);
    th.innerText = "Başlıq";
    headTr.append(th);
  }
  thead.append(headTr);
  table.append(thead);

  let tbody = document.createElement("tbody");

  for (let i = 0; i < tableData.row; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < tableData.column; j++) {
      let td = document.createElement("td");
      td.innerText = j + 1;
      td.addEventListener("click", openInput);
      tr.append(td);
    }
    tbody.append(tr);
  }

  table.append(tbody);

  tableWrapper.innerHTML = "";
  tableWrapper.append(table);
}

function openInput() {
  var rect = this.getBoundingClientRect();

  tableEditInput.style.left = rect.left + "px";
  tableEditInput.style.top = rect.top + 5 + "px";
  tableEditInput.classList.remove("d-none");

  openTableElem = this;
}

tableEditInput
  .querySelector("#complete")
  .addEventListener("click", completeInput);
tableEditInput.querySelector("#close").addEventListener("click", closeInput);

function closeInput() {
  tableEditInput.querySelector("#text").value = "";
  tableEditInput.classList.add("d-none");
}

function completeInput() {
  let text = tableEditInput.querySelector("#text").value;

  if (text == "") {
    return;
  }

  openTableElem.innerText = text;

  closeInput();
}

//////////////////////multiple-select//////////////////////////

let btns = {
  undo: document.querySelector("#undo_redo_undo"),
  rightAll: document.querySelector("#undo_redo_rightAll"),
  rightSelected: document.querySelector("#undo_redo_rightSelected"),
  leftSelected: document.querySelector("#undo_redo_leftSelected"),
  leftAll: document.querySelector("#undo_redo_leftAll"),
  redo: document.querySelector("#undo_redo_redo"),
};

let selects = {
  left: document.querySelector("#source"),
  right: document.querySelector("#destination"),
};

let prosess = [];
let undoProsess = [];

btns.rightAll.addEventListener("click", function () {
  let options = Array.from(selects.left.children);
  let changedOptions = [];

  options.forEach((option) => {
    changedOptions.push(option);
    selects.right.append(option);
  });

  addProses("rightAll", changedOptions);
});

btns.leftAll.addEventListener("click", function () {
  let options = Array.from(selects.right.children);
  let changedOptions = [];

  options.forEach((option) => {
    changedOptions.push(option);
    selects.left.append(option);
  });

  addProses("leftAll", changedOptions);
});

btns.rightSelected.addEventListener("click", function () {
  let options = Array.from(selects.left.children);

  let changedOptions = [];

  options.forEach((option, index) => {
    if (option.selected) {
      changedOptions.push(option);
      selects.right.append(option);
    }
  });

  addProses("rightSelected", changedOptions);
});

btns.leftSelected.addEventListener("click", function () {
  let options = Array.from(selects.right.children);
  let changedOptions = [];

  options.forEach((option) => {
    if (option.selected) {
      changedOptions.push(option);
      selects.left.append(option);
    }
  });

  addProses("leftSelected", changedOptions);
});

btns.undo.addEventListener("click", function () {
  if (prosess.length == 0) {
    return false;
  }

  let lastProses = prosess[prosess.length - 1];

  switch (lastProses.type) {
    case "rightSelected":
      lastProses.options.forEach((option) => {
        selects.left.append(option);
      });
      break;
    case "leftSelected":
      lastProses.options.forEach((option) => {
        selects.right.append(option);
      });
      break;
    case "rightAll":
      lastProses.options.forEach((option) => {
        selects.left.append(option);
      });
      break;
    case "leftAll":
      lastProses.options.forEach((option) => {
        selects.right.append(option);
      });
      break;
    default:
      console.log("wrong proses");
      break;
  }

  let deleted = prosess.pop();
  undoProsess.unshift(deleted);
});

btns.redo.addEventListener("click", function () {
  if (undoProsess.length == 0) {
    return false;
  }

  let lastProses = undoProsess[0];

  switch (lastProses.type) {
    case "rightSelected":
      lastProses.options.forEach((option) => {
        selects.right.append(option);
      });

      prosess.push({
        type: "rightSelected",
        options: lastProses.options,
      });
      break;
    case "leftSelected":
      lastProses.options.forEach((option) => {
        selects.left.append(option);
      });

      prosess.push({
        type: "leftSelected",
        options: lastProses.options,
      });
      break;
    case "rightAll":
      lastProses.options.forEach((option) => {
        selects.right.append(option);
      });

      prosess.push({
        type: "rightAll",
        options: lastProses.options,
      });

      break;
    case "leftAll":
      lastProses.options.forEach((option) => {
        selects.left.append(option);
      });

      prosess.push({
        type: "leftAll",
        options: lastProses.options,
      });
      break;
  }

  undoProsess.shift();
});

///////proseslerin arxivlenmesi undo ve redo ucun
function addProses(type, changedOptions) {
  let item = {
    type: type,
    options: changedOptions,
  };

  prosess.push(item);
}
