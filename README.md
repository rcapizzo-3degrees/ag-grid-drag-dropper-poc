# ag-grid drag drop example
POC for drag-drop between different browser tabs/windows, using ag-grid.

## to run
- open this folder in visual studio
- install the "LiveServer" extension
- start the live server
- open the url in two separate tabs (same browser)
- drag the "DRAG" column - the other window will become "DROP"

## notes
- the mozilla.html file is a copy/paste example from the mozilla site.

## caveats
- this primarily uses javascript to handle the drag & drop, using the native [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).
- after trying a bunch of ag-grid built-in drag/drop stuff, ended up igoring all of that and rendering a custom div as part of the row. From there, I was able to hook up drag/drop functionality and have access to the whole row's data
- localStorage is used as a sort of event system to let the other window know that the drag has started. Don't love it, but good enough for demo. This isn't necessarily needed - could use any mechanism that can communicate across windows (SignalR, etc)

## future
- we'd need to hook these "ui" events to the backend via signalR, but that seems doable. The js events can call the c# events to apply data changes.