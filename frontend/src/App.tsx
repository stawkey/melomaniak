import "./App.css";
import Table from "./components/Table";

// TODO: refactor Table.tsx
// TODO: show/hide columns
// TODO: better & responsive column width
// TODO: optimize resizing so it doesn't rerender too much https://tanstack.com/table/latest/docs/guide/column-sizing
// TODO: make it pretty lol

function App() {
    return (
        <div>
            <h1 style={{ textAlign: "left", margin: 0 }}>Filharmonia</h1>
            <Table />
        </div>
    );
}

export default App;
