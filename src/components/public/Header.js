import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../Css/Header.css';

const Header = () => {
  const { user } = useAuth();

  return (
    <nav className="magical-header">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link className="header-brand" to="/">
            📰 NoticiasCMS
          </Link>
          
          <div className="header-nav d-none d-lg-flex">
            <Link className="nav-link" to="/">
              Inicio
            </Link>
          </div>
            
          <div className="d-flex">
            {user ? (
              <Link to="/admin" className="header-btn">
                🗂️ Panel Admin
              </Link>
            ) : (
              <Link to="/login" className="header-btn">
                🔑 Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;