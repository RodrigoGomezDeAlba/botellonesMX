import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../services/userService';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: 'user',
        phone: '',
        address: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user.id);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            address: user.address || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveEdit = async (id) => {
        try {
            await updateUser(id, editForm);
            setEditingUser(null);
            loadUsers();
        } catch (err) {
            setError('Error al actualizar usuario');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`¿Estás seguro de eliminar al usuario "${name}"?`)) return;
        
        try {
            await deleteUser(id);
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al eliminar usuario');
        }
    };

    if (loading) return <div className="loading">Cargando usuarios...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Gestión de Usuarios</h2>
                <span className="user-count">Total: {users.length} usuarios</span>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                No hay usuarios registrados
                            </td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.id}>
                                {editingUser === user.id ? (
                                    <>
                                        <td>{user.id}</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleEditChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleEditChange}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                name="role"
                                                value={editForm.role}
                                                onChange={handleEditChange}
                                            >
                                                <option value="user">Usuario</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={editForm.phone}
                                                onChange={handleEditChange}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn-save" onClick={() => handleSaveEdit(user.id)}>
                                                Guardar
                                            </button>
                                            <button className="btn-cancel" onClick={handleCancelEdit}>
                                                Cancelar
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge ${user.role}`}>
                                                {user.role === 'admin' ? 'Admin' : 'Usuario'}
                                            </span>
                                        </td>
                                        <td>{user.phone || '—'}</td>
                                        <td>
                                            <button className="btn-edit" onClick={() => handleEdit(user)}>
                                                Editar
                                            </button>
                                            <button 
                                                className="btn-delete" 
                                                onClick={() => handleDelete(user.id, user.name)}
                                                disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUsers;