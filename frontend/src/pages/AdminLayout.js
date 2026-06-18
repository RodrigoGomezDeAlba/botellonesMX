import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function AdminLayout() {
    return (
        <div className="admin-layout">
            <div className="admin-sidebar">
                <h3>Panel Admin</h3>
                <nav className="admin-nav">
                    <NavLink 
                        to="/admin" 
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                        end
                    >
                        Dashboard
                    </NavLink>
                    <NavLink 
                        to="/admin/products" 
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                    >
                        Productos
                    </NavLink>
                    <NavLink 
                        to="/admin/users" 
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                    >
                        Usuarios
                    </NavLink>
                    <NavLink 
                        to="/admin/orders" 
                        className={({ isActive }) => isActive ? 'active-link' : ''}
                    >
                        Pedidos
                    </NavLink>
                </nav>
            </div>
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;