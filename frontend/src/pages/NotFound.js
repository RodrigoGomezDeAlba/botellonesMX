import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="not-found">
            <h1>404</h1>
            <h2>Página no encontrada</h2>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <Link to="/" className="btn-primary">
                Volver al Inicio
            </Link>
        </div>
    );
}

export default NotFound;