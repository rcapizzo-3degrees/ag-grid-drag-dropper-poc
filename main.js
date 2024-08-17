var immutableStore = getData();

let gridApi;

window.addEventListener('storage', () => {
  
  const item = window.localStorage.getItem('ITEM');
  console.log('storage change', item, item > '');
  gridApi.setColumnsVisible(["DROP_COL"], item > '');
  gridApi.setColumnsVisible(["DRAG_COL"], item === '');

})

function show_drop_column (e) {
  console.log(e);
  gridApi.setColumnsVisible(["DROP_COL"], true);
  e.preventDefault();
}
function hide_drop_column (e) {
  console.log(e);
  gridApi.setColumnsVisible(["DROP_COL"], false);
  e.preventDefault();
}

const gridOptions = {
  columnDefs: [
    { 
      field: "DROP",
      colId: "DROP_COL",
      hide: true,

      cellRenderer: (o) => {
          
          const ediv = document.createElement('div');
          ediv.innerHTML = "drop";
          ediv.ondrop=(e) =>{
              e.preventDefault();
              let x = e.dataTransfer.getData("text");
              x = JSON.parse(x);
              //console.log('drop',e, x);
              console.log('drop', o.data, x);
              e.currentTarget.style.background = null;

          };
          ediv.ondragover = (e) => {
              //console.log('dragover',e)
              e.currentTarget.style.background = "red";
              e.preventDefault();
          };
          ediv.ondragleave = (e) => {
              e.currentTarget.style.background = null;
          }
          return ediv;
      }
   },
    { 
        field: "DRAG", 
        colId: "DRAG_COL",
        // hide: true,
        // rowDrag: true, 
        cellRenderer: (p) => {
            //console.log(p.data);
            const ediv = document.createElement('div');
            ediv.innerHTML = "drag";
            ediv.draggable = true;
            ediv.ondragstart = (e) => {
                e.currentTarget.style.border = "dashed";
                
                e.dataTransfer.setData("text", JSON.stringify(p.data));

                e.effectAllowed = "move";

                window.localStorage.setItem('ITEM', JSON.stringify(p.data));

                console.log('hacked',e);
            };
            
            ediv.ondragend = (e) => {
                e.currentTarget.style.border = null;
                window.localStorage.setItem('ITEM','');
                console.log('dragend',e);
            };
             return ediv;
        } 
    },
    { field: "athlete" },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ],
  defaultColDef: {
    width: 170,
    filter: true,
  },
  // this tells the grid we are doing updates when setting new data
  // onRowDragMove: onRowDragMove,
  // onRowDragEnter: onRowDragEnter,
  // onRowDragEnd: onRowDragEnd,
  // onRowDragLeave: onRowDragLeave,
  onRowClicked: onRowClicked,
  getRowId: getRowId,
  onSortChanged: onSortChanged,
  onFilterChanged: onFilterChanged,
  onGridReady: (params) => {
    // add id to each item, needed for immutable store to work
    immutableStore.forEach(function (data, index) {
      data.id = index;
    });

    params.api.setGridOption("rowData", immutableStore);
  },
};

var sortActive = false;
var filterActive = false;

function onRowClicked(e) {
    console.log('onRowCLicked',e);
}
function onRowDragEnter(e) {

    console.log("onRowDragEnter", e);
  }
  
  function onRowDragEnd(e) {
    console.log("onRowDragEnd", e);
  }
  
//   function onRowDragMove(e) {
//     console.log("onRowDragMove", e);
//   }
  
  function onRowDragLeave(e) {
    console.log("onRowDragLeave", e);
  }

// listen for change on sort changed
function onSortChanged() {
  var colState = gridApi.getColumnState() || [];
  sortActive = colState.some((c) => c.sort);
  // suppress row drag if either sort or filter is active
  var suppressRowDrag = sortActive || filterActive;
  console.log(
    "sortActive = " +
      sortActive +
      ", filterActive = " +
      filterActive +
      ", allowRowDrag = " +
      suppressRowDrag,
  );
  gridApi.setGridOption("suppressRowDrag", suppressRowDrag);
}

// listen for changes on filter changed
function onFilterChanged() {
  filterActive = gridApi.isAnyFilterPresent();
  // suppress row drag if either sort or filter is active
  var suppressRowDrag = sortActive || filterActive;
  console.log(
    "sortActive = " +
      sortActive +
      ", filterActive = " +
      filterActive +
      ", allowRowDrag = " +
      suppressRowDrag,
  );
  gridApi.setGridOption("suppressRowDrag", suppressRowDrag);
}

function getRowId(params) {
  return String(params.data.id);
}

// function onRowDragMove(event) {
// //    console.log(event);
//   var movingNode = event.node;
//   var overNode = event.overNode;

//   var rowNeedsToMove = movingNode !== overNode;

//   if (rowNeedsToMove) {
//     // the list of rows we have is data, not row nodes, so extract the data
//     var movingData = movingNode.data;
//     var overData = overNode.data;

//     var fromIndex = immutableStore.indexOf(movingData);
//     var toIndex = immutableStore.indexOf(overData);

//     var newStore = immutableStore.slice();
//     moveInArray(newStore, fromIndex, toIndex);

//     immutableStore = newStore;
//     gridApi.setGridOption("rowData", newStore);
// ``
//     gridApi.clearFocusedCell();
//   }

//   function moveInArray(arr, fromIndex, toIndex) {
//     var element = arr[fromIndex];
//     arr.splice(fromIndex, 1);
//     arr.splice(toIndex, 0, element);
//   }
// }

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  var gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
