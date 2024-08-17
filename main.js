var rowIdSequence = 100;

var leftColumnDefs = [
  { field: "id", rowDrag: true },
  { field: "color" },
  { field: "value1" },
  { field: "value2" },
];

var rightColumnDefs = [
  { field: "id", rowDrag: true },
  { field: "color" },
  { field: "value1" },
  { field: "value2" },
];
var leftApi;
var leftGridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  rowClassRules: {
    "red-row": 'data.color == "Red"',
    "green-row": 'data.color == "Green"',
    "blue-row": 'data.color == "Blue"',
  },
  getRowId: (params) => {
    return String(params.data.id);
  },
  rowData: createLeftRowData(),
  rowDragManaged: false,
  suppressMoveWhenRowDragging: true,
  columnDefs: leftColumnDefs,
//   onGridReady: (params) => {
//     addBinZone(params);
//     addGridDropZone(params, "Right");
//   },
};
var rightApi;
var rightGridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  rowClassRules: {
    "red-row": 'data.color == "Red"',
    "green-row": 'data.color == "Green"',
    "blue-row": 'data.color == "Blue"',
  },
  getRowId: (params) => {
    return String(params.data.id);
  },
  rowData: [],
  rowDragManaged: false,
  suppressMoveWhenRowDragging: true,
  columnDefs: rightColumnDefs,
  onRowDragEnter: onRowDragEnter,
  onRowDragEnd: onRowDragEnd,
  onRowDragMove: onRowDragMove,
  onRowDragLeave: onRowDragLeave,
//   onGridReady: (params) => {
//     addBinZone(params);
//     addGridDropZone(params, "Left");
//   },
};

function onRowDragEnter(e) {
    console.log("onRowDragEnter", e);
  }
  
  function onRowDragEnd(e) {
    console.log("onRowDragEnd", e);
  }
  
  function onRowDragMove(e) {
    console.log("onRowDragMove", e);
  }
  
  function onRowDragLeave(e) {
    console.log("onRowDragLeave", e);
  }

function createLeftRowData() {
  return ["Red", "Green", "Blue"].map(function (color) {
    return createDataItem(color);
  });
}

function createDataItem(color) {
  return {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };
}

function addRecordToGrid(side, data) {
  // if data missing or data has no it, do nothing
  if (!data || data.id == null) {
    return;
  }

  var gridApi = side === "left" ? leftApi : rightApi,
    // do nothing if row is already in the grid, otherwise we would have duplicates
    rowAlreadyInGrid = !!gridApi.getRowNode(data.id),
    transaction;

  if (rowAlreadyInGrid) {
    console.log("not adding row to avoid duplicates in the grid");
    return;
  }

  transaction = {
    add: [data],
  };

  gridApi.applyTransaction(transaction);
}

function onFactoryButtonClick(e) {
  var button = e.currentTarget,
    buttonColor = button.getAttribute("data-color"),
    side = button.getAttribute("data-side"),
    data = createDataItem(buttonColor);

  addRecordToGrid(side, data);
}

function binDrop(data) {
  // if data missing or data has no id, do nothing
  if (!data || data.id == null) {
    return;
  }

  var transaction = {
    remove: [data],
  };

  [leftApi, rightApi].forEach((api) => {
    var rowsInGrid = !!api.getRowNode(data.id);

    if (rowsInGrid) {
      api.applyTransaction(transaction);
    }
  });
}

function addBinZone(params) {
  var eBin = document.querySelector(".bin"),
    icon = eBin.querySelector("i"),
    dropZone = {
      getContainer: () => {
        return eBin;
      },
      onDragEnter: () => {
        eBin.style.color = "blue";
        icon.style.transform = "scale(1.5)";
      },
      onDragLeave: () => {
        eBin.style.color = "black";
        icon.style.transform = "scale(1)";
      },
      onDragStop: (dragStopParams) => {
        binDrop(dragStopParams.node.data);
        eBin.style.color = "black";
        icon.style.transform = "scale(1)";
      },
    };

  params.api.addRowDropZone(dropZone);
}

function addGridDropZone(params, side) {
  var grid = document.querySelector("#e" + side + "Grid"),
    dropZone = {
      getContainer: () => {
        return grid;
      },
      onDragStop: (params) => {
        addRecordToGrid(side.toLowerCase(), params.node.data);
      },
    };

  params.api.addRowDropZone(dropZone);
}

function loadGrid(side) {
  var grid = document.querySelector("#e" + side + "Grid");
  if (side === "Left") {
    leftApi = agGrid.createGrid(grid, leftGridOptions);
  } else {
    rightApi = agGrid.createGrid(grid, rightGridOptions);
  }
}

var buttons = document.querySelectorAll("button.factory");

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", onFactoryButtonClick);
}

loadGrid("Left");
loadGrid("Right");