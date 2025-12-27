import "./App.css";
import ConcertContainer from "./components/ConcertContainer";
import Favorites from "./components/Favorites/Favorites";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ConcertContainer />} />
                <Route path="/favorites" element={<Favorites />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
