import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import '../../Css/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'reportero'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;

      // Actualizar perfil
      await updateProfile(user, {
        displayName: formData.displayName
      });

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: formData.email,
        displayName: formData.displayName,
        role: formData.role,
        createdAt: new Date()
      });

      navigate('/admin');
    } catch (error) {
      setError('Error al registrar: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="magical-auth-container">
      <div className="auth-card-magical">
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">Únete a nuestro equipo periodístico</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>👤 Nombre completo</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
              placeholder="Tu nombre completo"
            />
          </div>
          
          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label>🔒 Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <div className="form-group">
            <label>🎭 Rol</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="reportero">📝 Reportero</option>
              <option value="editor">✏️ Editor</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? '🔄 Creando cuenta...' : '🚀 Registrarse'}
          </button>
        </form>
        
        <Link to="/login" className="auth-link">
          ¿Ya tienes cuenta? 🔑 Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
};

export default Register;