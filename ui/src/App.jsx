import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LineChart from "./components/chart/LineChart";
import Home from "./Home";
import Possession from "./Possession";
import PatrimoineApp from "./Patrimoine";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Show from "./showAll";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="bg-light min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-light bg-primary">
          <div className="container">
            <Link className="navbar-brand text-white" to="/">
              <h1 className="font-weight-bold">Wealth App</h1>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item mx-3">
                  <Link className="nav-link text-light" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link text-light" to="/possession">
                    Possession
                  </Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link text-light" to="/patrimoine">
                    Patrimoine
                  </Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link text-light" to="/show">
                    All
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/possession" element={<Possession />} />
            <Route path="/patrimoine" element={<PatrimoineApp />} />
            <Route path="/show" element={<Show />} />
            <Route path="/chart" element={<LineChart />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
