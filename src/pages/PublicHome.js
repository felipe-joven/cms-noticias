import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { NEWS_STATUS, CATEGORIES } from '../utils/constants';
import Header from '../components/public/Header';
import NewsCard from '../components/public/NewsCard';

const PublicHome = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todas');

  useEffect(() => {
    loadPublishedNews();
  }, []);

  const loadPublishedNews = async () => {
    try {
      setLoading(true);
      
      // CONSULTA OPTIMIZADA CON ÍNDICE
      const q = query(
        collection(db, 'news'),
        where('estado', '==', NEWS_STATUS.PUBLICADO),
        orderBy('fechaCreacion', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const newsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setNews(newsData);
      
    } catch (error) {
      console.error('Error cargando noticias:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = selectedCategory === 'todas' 
    ? news 
    : news.filter(item => item.categoria === selectedCategory);

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-dark text-white py-5 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold">Noticias CMS</h1>
              <p className="lead">El portal de noticias más confiable y actualizado</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/login" className="btn btn-outline-light btn-lg">
                Acceso Administrativo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Filtro de categorías */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <button
                className={`btn ${selectedCategory === 'todas' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory('todas')}
              >
                Todas las Noticias
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando noticias...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-5">
            <h3>No hay noticias publicadas</h3>
            <p className="text-muted">
              {selectedCategory === 'todas' 
                ? 'Aún no hay noticias publicadas en el sitio.' 
                : `No hay noticias publicadas en la categoría "${selectedCategory}"`
              }
            </p>
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión para Crear Noticias
            </Link>
          </div>
        ) : (
          <>
            {/* Noticia destacada */}
            {filteredNews.length > 0 && selectedCategory === 'todas' && (
              <section className="mb-5">
                <h2 className="mb-4">Noticia Destacada</h2>
                <NewsCard news={filteredNews[0]} featured={true} />
              </section>
            )}

            {/* Todas las noticias */}
            <section>
              <h2 className="mb-4">
                {selectedCategory === 'todas' ? 'Todas las Noticias' : `Noticias de ${selectedCategory}`}
                <small className="text-muted ms-2">({filteredNews.length})</small>
              </h2>
              
              <div className="row">
                {filteredNews.map((newsItem, index) => (
                  <div key={newsItem.id} className="col-md-6 col-lg-4 mb-4">
                    <NewsCard 
                      news={newsItem} 
                      featured={index === 0 && selectedCategory === 'todas' && filteredNews.length > 1}
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Noticias CMS</h5>
              <p>Tu fuente confiable de información actualizada.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p>&copy; 2025 Noticias CMS. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;