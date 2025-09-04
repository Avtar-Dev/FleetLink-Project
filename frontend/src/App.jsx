import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AddVehiclePage from "./pages/AddVehiclePage";
import SearchBookPage from "./pages/SearchBookPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 20 }}>
        <nav className="nav-bar">
          <Link to="/" className="nav-link">
            Search & Book
          </Link>
          <span className="divider">|</span>
          <Link to="/add" className="nav-link">
            Add Vehicle
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<SearchBookPage />} />
          <Route path="/add" element={<AddVehiclePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
