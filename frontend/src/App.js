import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <h1>BotellonesMX</h1>
                    <div className="nav-links">
                        <Link to="/">Inicio</Link>
                        <Link to="/catalog">Catálogo</Link>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;