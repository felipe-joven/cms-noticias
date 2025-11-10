import React from 'react';
import { Link } from 'react-router-dom';
import '../../Css/NewsCard.css';

const NewsCard = ({ news, featured = false }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (featured) {
    return (
      <div className="col-12 mb-4">
        <div className={`news-card-magical featured-news-magical ${news.imagen ? 'h-100' : ''}`}>
          <div className="row g-0 h-100">
            {news.imagen && (
              <div className="col-md-6">
                <img 
                  src={news.imagen} 
                  className="news-card-image h-100"
                  alt={news.titulo}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className={news.imagen ? "col-md-6" : "col-12"}>
              <div className="news-card-body">
                <span className="news-card-badge">
                  {news.categoria}
                </span>
                <h3 className="news-card-title">
                  <Link to={`/noticia/${news.id}`}>
                    {news.titulo}
                  </Link>
                </h3>
                <p className="news-card-subtitle">
                  {news.subtitulo}
                </p>
                <p className="news-card-content">
                  {truncateText(news.contenido, 200)}
                </p>
                <div className="news-card-footer">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span className="news-card-author">
                      Por {news.autorNombre}
                    </span>
                    <span className="news-card-date">
                      {formatDate(news.fechaCreacion)}
                    </span>
                  </div>
                </div>
                <Link 
                  to={`/noticia/${news.id}`}
                  className="news-card-btn"
                >
                  📖 Leer más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-card-magical">
      {news.imagen && (
        <img 
          src={news.imagen} 
          className="news-card-image"
          alt={news.titulo}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}
      <div className="news-card-body">
        <span className="news-card-badge">
          {news.categoria}
        </span>
        <h5 className="news-card-title">
          <Link to={`/noticia/${news.id}`}>
            {truncateText(news.titulo, 60)}
          </Link>
        </h5>
        <p className="news-card-content">
          {truncateText(news.subtitulo || news.contenido, 120)}
        </p>
        <div className="news-card-footer">
          <div className="d-flex justify-content-between align-items-center w-100">
            <span className="news-card-author">
              {news.autorNombre}
            </span>
            <span className="news-card-date">
              {formatDate(news.fechaCreacion)}
            </span>
          </div>
        </div>
        <Link 
          to={`/noticia/${news.id}`}
          className="news-card-btn"
        >
          📖 Leer más
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;