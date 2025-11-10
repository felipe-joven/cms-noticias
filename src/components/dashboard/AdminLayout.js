import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../Css/Dashboard.css';

const AdminLayout = ({ children }) => {
  const { user, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname.includes(path) ? 'active' : '';
  };

  return (
    <div className="magical-dashboard">
      <div className="row g-0">
        {/* Sidebar Mágico */}
        <nav className="col-md-3 col-lg-2 magical-sidebar">
          <div className="position-sticky pt-3">
            <div className="sidebar-brand">
              📊 Panel de Control
            </div>
            
            <div className="sidebar-user-info p-3 border-bottom border-neon">
              <div className="user-name">{userData?.displayName || user?.email}</div>
              <div className={`user-role ${userData?.role === 'editor' ? 'role-editor' : 'role-reporter'}`}>
                {userData?.role === 'editor' ? '✏️ Editor' : '📝 Reportero'}
              </div>
            </div>
            
            <ul className="nav flex-column mt-3">
              <li className="nav-item">
                <Link 
                  className={`sidebar-item ${isActive('/noticias')}`}
                  to="/admin/noticias"
                >
                  📰 {userData?.role === 'editor' ? 'Todas las Noticias' : 'Mis Noticias'}
                </Link>
              </li>
              
              {userData?.role === 'editor' && (
                <li className="nav-item">
                  <Link 
                    className={`sidebar-item ${isActive('/secciones')}`}
                    to="/admin/secciones"
                  >
                    📂 Gestión de Secciones
                  </Link>
                </li>
              )}
              
              <li className="nav-item">
                <Link 
                  className="sidebar-item"
                  to="/"
                >
                  🌐 Ver Sitio Público
                </Link>
              </li>
            </ul>

            <div className="mt-4 p-3 border-top border-neon">
              <button 
                className="btn-dashboard logout-btn w-100"
                onClick={handleLogout}
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-3 mb-4 border-bottom border-neon">
            <h1 className="dashboard-title">
              {location.pathname.includes('/editar/') && '✏️ Editar Noticia'}
              {location.pathname.includes('/nueva') && '📝 Nueva Noticia'}
              {location.pathname.includes('/secciones') && '📂 Gestión de Secciones'}
              {location.pathname === '/admin/noticias' && (
                userData?.role === 'editor' ? '📰 Todas las Noticias' : '📰 Mis Noticias'
              )}
            </h1>
            {location.pathname === '/admin/noticias' && (
              <Link to="/admin/noticias/nueva" className="btn-dashboard">
                + Nueva Noticia
              </Link>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;