import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';
import { useAuth } from '../../context/AuthContext';
import { NEWS_STATUS } from '../../utils/constants';

const NewsList = () => {
  const { news, loading, getNews, changeNewsStatus, deleteNews } = useNews();
  const { user, userData } = useAuth();
  const [filter, setFilter] = useState('todas');

  useEffect(() => {
    getNews();
  }, []);

  // Filtrar noticias según el rol y filtro
  const filteredNews = news.filter(item => {
    if (userData?.role === 'reportero' && item.autor !== user.uid) {
      return false;
    }
    
    if (filter !== 'todas' && item.estado !== filter) {
      return false;
    }
    
    return true;
  });

  const handleStatusChange = async (newsId, newStatus) => {
    try {
      await changeNewsStatus(newsId, newStatus);
      getNews();
    } catch (error) {
      alert('Error al cambiar estado: ' + error.message);
    }
  };

  const handleDelete = async (newsId) => {
    if (window.confirm('¿Estás seguro de eliminar esta noticia?')) {
      try {
        await deleteNews(newsId);
        getNews();
      } catch (error) {
        alert('Error al eliminar noticia: ' + error.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      [NEWS_STATUS.EDICION]: 'warning',
      [NEWS_STATUS.TERMINADO]: 'info',
      [NEWS_STATUS.PUBLICADO]: 'success',
      [NEWS_STATUS.DESACTIVADO]: 'secondary'
    };
    
    return `badge bg-${statusColors[status] || 'secondary'}`;
  };

  const canEdit = (newsItem) => {
    return userData?.role === 'editor' || newsItem.autor === user.uid;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando noticias...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros y estadísticas */}
      <div className="row mb-4">
        <div className="col-md-6">
          <select 
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="todas">Todas las noticias</option>
            <option value={NEWS_STATUS.EDICION}>En Edición</option>
            <option value={NEWS_STATUS.TERMINADO}>Terminado</option>
            <option value={NEWS_STATUS.PUBLICADO}>Publicado</option>
            <option value={NEWS_STATUS.DESACTIVADO}>Desactivado</option>
          </select>
        </div>
        <div className="col-md-6 text-end">
          <span className="text-muted">
            Mostrando {filteredNews.length} de {news.length} noticias
          </span>
        </div>
      </div>

      {/* Lista de noticias */}
      <div className="row">
        {filteredNews.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="text-muted mb-3">
              <i className="fas fa-newspaper fa-3x"></i>
            </div>
            <h5>No hay noticias</h5>
            <p className="text-muted">
              {filter === 'todas' 
                ? 'Crea tu primera noticia para comenzar' 
                : `No hay noticias con estado "${filter}"`
              }
            </p>
            {filter === 'todas' && (
              <Link to="/admin/noticias/nueva" className="btn btn-primary">
                Crear Primera Noticia
              </Link>
            )}
          </div>
        ) : (
          filteredNews.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 news-card">
                {item.imagen && (
                  <img 
                    src={item.imagen} 
                    className="card-img-top" 
                    alt={item.titulo}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={getStatusBadge(item.estado)}>
                      {item.estado}
                    </span>
                    {userData?.role === 'editor' && (
                      <small className="text-muted">
                        {item.autorNombre}
                      </small>
                    )}
                  </div>
                  
                  <h6 className="card-title">{item.titulo}</h6>
                  <p className="card-text text-muted small flex-grow-1">
                    {item.subtitulo || item.contenido?.substring(0, 100) + '...'}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        {item.categoria}
                      </small>
                      <small className="text-muted">
                        {item.fechaCreacion?.toDate?.().toLocaleDateString()}
                      </small>
                    </div>
                    
                    <div className="btn-group w-100" role="group">
                      {canEdit(item) && (
                        <Link 
                          to={`/admin/noticias/editar/${item.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Editar
                        </Link>
                      )}
                      
                      {/* Acciones para reporteros */}
                      {userData?.role === 'reportero' && item.autor === user.uid && (
                        <>
                          {item.estado === NEWS_STATUS.EDICION && (
                            <button
                              className="btn btn-outline-info btn-sm"
                              onClick={() => handleStatusChange(item.id, NEWS_STATUS.TERMINADO)}
                            >
                              Terminar
                            </button>
                          )}
                          {item.estado === NEWS_STATUS.TERMINADO && (
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => handleStatusChange(item.id, NEWS_STATUS.EDICION)}
                            >
                              Volver a Editar
                            </button>
                          )}
                        </>
                      )}
                      
                      {/* Acciones para editores */}
                      {userData?.role === 'editor' && (
                        <>
                          {item.estado === NEWS_STATUS.TERMINADO && (
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleStatusChange(item.id, NEWS_STATUS.PUBLICADO)}
                            >
                              Publicar
                            </button>
                          )}
                          {item.estado === NEWS_STATUS.PUBLICADO && (
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleStatusChange(item.id, NEWS_STATUS.DESACTIVADO)}
                            >
                              Desactivar
                            </button>
                          )}
                          {item.estado === NEWS_STATUS.DESACTIVADO && (
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleStatusChange(item.id, NEWS_STATUS.PUBLICADO)}
                            >
                              Reactivar
                            </button>
                          )}
                        </>
                      )}
                      
                      {/* Eliminar (solo editores o el autor) */}
                      {(userData?.role === 'editor' || item.autor === user.uid) && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsList;