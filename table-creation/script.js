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
