import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'El nombre debe tener al menos 2 caracteres';
        }
        
        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'La contraseña debe tener al menos una mayúscula';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'La contraseña debe tener al menos un número';
        }
        
        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Teléfono inválido (debe tener 10 dígitos)';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        
        if (!validate()) {
            return;
        }

        setLoading(true);

        const result = await register(formData);
        if (result.success) {
            navigate('/catalog');
        } else {
            setGeneralError(result.error || 'Error al registrarse');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <h2>Registro de Usuario</h2>
            {generalError && <div className="error-message">{generalError}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'input-error' : ''}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label>Contraseña (mínimo 6 caracteres, mayúscula y número)</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'input-error' : ''}
                    />
                    {errors.password && <span className="field-error">{errors.password}</span>}
                </div>
                <div className="form-group">
                    <label>Teléfono (10 dígitos)</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'input-error' : ''}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                    <label>Dirección</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Registrarse'}
                </button>
            </form>
            <p>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
        </div>
    );
}

export default Register;