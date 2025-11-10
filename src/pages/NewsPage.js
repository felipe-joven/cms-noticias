import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { NEWS_STATUS } from '../utils/constants';
import Header from '../components/public/Header';
import { collection, getDocs } from 'firebase/firestore';
import '../Css/NewsPage.css';

const NewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    loadNews();
  }, [id]);

  const loadNews = async () => {
    try {
      const docRef = doc(db, 'news', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const newsData = docSnap.data();
        
        // Verificar que la noticia esté publicada
        if (newsData.estado !== NEWS_STATUS.PUBLICADO) {
          navigate('/');
          return;
        }
        
        setNews({
          id: docSnap.id,
          ...newsData
        });
        
        // Cargar noticias relacionadas (misma categoría)
        loadRelatedNews(newsData.categoria, docSnap.id);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading news:', error);
      navigate('/');
    }
    setLoading(false);
  };

  const loadRelatedNews = async (category, currentNewsId) => {
    try {
      // En una implementación real, harías una consulta a Firestore
      // Por ahora simulamos cargando todas y filtrando
      const querySnapshot = await getDocs(collection(db, 'news'));
      const allNews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const related = allNews
        .filter(item => 
          item.id !== currentNewsId && 
          item.categoria === category &&
          item.estado === NEWS_STATUS.PUBLICADO
        )
        .slice(0, 3);
      
      setRelatedNews(related);
    } catch (error) {
      console.error('Error loading related news:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando noticia...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div>
        <Header />
        <div className="container text-center py-5">
          <h3>Noticia no encontrada</h3>
          <Link to="/" className="btn btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">{news.categoria}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {news.titulo}
            </li>
          </ol>
        </nav>

        <article>
          {/* Header de la noticia */}
          <header className="mb-4">
            <span className="badge bg-primary mb-2">{news.categoria}</span>
            <h1 className="display-5 fw-bold">{news.titulo}</h1>
            {news.subtitulo && (
              <p className="lead text-muted">{news.subtitulo}</p>
            )}
            
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-4">
              <div>
                <strong>Por {news.autorNombre}</strong>
              </div>
              <div className="text-muted">
                {formatDate(news.fechaCreacion)}
              </div>
            </div>
          </header>

          {/* Imagen destacada */}
          {news.imagen && (
            <div className="mb-4">
              <img 
                src={news.imagen} 
                className="img-fluid rounded w-100" 
                alt={news.titulo}
                style={{ maxHeight: '500px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Contenido */}
          <div className="news-content mb-5">
            {news.contenido.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 fs-5">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Metadatos */}
          <footer className="border-top pt-3">
            <div className="row">
              <div className="col-md-6">
                <small className="text-muted">
                  <strong>Publicado:</strong> {formatDate(news.fechaCreacion)}
                </small>
              </div>
              <div className="col-md-6 text-md-end">
                <small className="text-muted">
                  <strong>Actualizado:</strong> {formatDate(news.fechaActualizacion)}
                </small>
              </div>
            </div>
          </footer>
        </article>

        {/* Noticias relacionadas */}
        {relatedNews.length > 0 && (
          <section className="mt-5 pt-4 border-top">
            <h3 className="mb-4">Noticias relacionadas</h3>
            <div className="row">
              {relatedNews.map(related => (
                <div key={related.id} className="col-md-4 mb-3">
                  <div className="card h-100">
                    {related.imagen && (
                      <img 
                        src={related.imagen} 
                        className="card-img-top" 
                        alt={related.titulo}
                        style={{ height: '150px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h6 className="card-title">
                        <Link 
                          to={`/noticia/${related.id}`}
                          className="text-decoration-none"
                        >
                          {related.titulo}
                        </Link>
                      </h6>
                      <small className="text-muted">
                        {formatDate(related.fechaCreacion)}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Botón volver */}
        <div className="text-center mt-5">
          <Link to="/" className="btn btn-outline-primary">
            ← Volver a todas las noticias
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;