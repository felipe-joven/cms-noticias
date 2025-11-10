import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useNews } from '../../hooks/useNews';
import { CATEGORIES, NEWS_STATUS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import './../../Css/NewsForm.css';

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { createNews, updateNews } = useNews();
  
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    contenido: '',
    categoria: '',
    imagen: '',
    estado: NEWS_STATUS.EDICION
  });
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // URLs de imágenes de ejemplo
  const SAMPLE_IMAGES = [
    'https://picsum.photos/800/400?random=1',
    'https://picsum.photos/800/400?random=2',
    'https://picsum.photos/800/400?random=3',
    'https://picsum.photos/800/400?random=4'
  ];

  useEffect(() => {
    if (id) {
      loadNewsItem();
      setIsEditing(true);
    }
  }, [id]);

  const loadNewsItem = async () => {
    try {
      const docRef = doc(db, 'news', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const newsData = docSnap.data();
        
        // Verificar permisos
        if (userData?.role === 'reportero' && newsData.autor !== user.uid) {
          alert('No tienes permisos para editar esta noticia');
          navigate('/admin/noticias');
          return;
        }
        
        setFormData({
          id: docSnap.id,
          ...newsData
        });
      } else {
        alert('Noticia no encontrada');
        navigate('/admin/noticias');
      }
    } catch (error) {
      console.error('Error loading news:', error);
      alert('Error al cargar la noticia');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      imagen: imageUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.titulo.trim() || !formData.contenido.trim() || !formData.categoria) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      const newsData = {
        titulo: formData.titulo.trim(),
        subtitulo: formData.subtitulo.trim(),
        contenido: formData.contenido.trim(),
        categoria: formData.categoria,
        imagen: formData.imagen.trim(),
        estado: formData.estado,
        autor: user.uid,
        autorNombre: user.displayName || user.email
      };

      if (isEditing) {
        await updateNews(id, newsData);
        alert('✅ Noticia actualizada correctamente');
      } else {
        await createNews(newsData);
        alert('✅ Noticia creada correctamente');
      }

      navigate('/admin/noticias');
    } catch (error) {
      console.error('Error saving news:', error);
      alert('❌ Error al guardar la noticia: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="news-form-container">
      <div className="row">
        <div className="col-lg-8">
          <div className="form-card-magical">
            <h2 className="form-title-magical">
              {isEditing ? '✏️ Editar Noticia' : '📝 Crear Nueva Noticia'}
            </h2>
            
            <form onSubmit={handleSubmit} className="form-magical">
              <div className="form-group">
                <label>📰 Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ingresa el título de la noticia"
                />
              </div>

              <div className="form-group">
                <label>📋 Subtítulo</label>
                <input
                  type="text"
                  name="subtitulo"
                  value={formData.subtitulo}
                  onChange={handleChange}
                  placeholder="Un breve resumen de la noticia"
                />
              </div>

              <div className="form-group">
                <label>🖼️ URL de la Imagen</label>
                <input
                  type="url"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <div className="form-help">
                  Puedes usar una de las imágenes de ejemplo o ingresar cualquier URL
                </div>
              </div>

              <div className="form-group">
                <label>📂 Categoría *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>📄 Contenido *</label>
                <textarea
                  name="contenido"
                  rows="10"
                  value={formData.contenido}
                  onChange={handleChange}
                  required
                  placeholder="Escribe el contenido completo de la noticia aquí..."
                />
              </div>

              {userData?.role === 'reportero' && (
                <div className="form-group">
                  <label>📊 Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value={NEWS_STATUS.EDICION}>🔄 En Edición</option>
                    <option value={NEWS_STATUS.TERMINADO}>✅ Terminado (Listo para revisión)</option>
                  </select>
                </div>
              )}

              {userData?.role === 'editor' && isEditing && (
                <div className="form-group">
                  <label>📊 Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value={NEWS_STATUS.EDICION}>🔄 En Edición</option>
                    <option value={NEWS_STATUS.TERMINADO}>📋 Terminado</option>
                    <option value={NEWS_STATUS.PUBLICADO}>🌐 Publicado</option>
                    <option value={NEWS_STATUS.DESACTIVADO}>⏸️ Desactivado</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-dashboard primary"
                  disabled={loading}
                >
                  {loading ? '💾 Guardando...' : (isEditing ? '📤 Actualizar Noticia' : '✨ Crear Noticia')}
                </button>
                <button 
                  type="button" 
                  className="btn-dashboard secondary"
                  onClick={() => navigate('/admin/noticias')}
                >
                  ↩️ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar con imágenes de ejemplo */}
        <div className="col-lg-4">
          <div className="dashboard-card">
            <h6 className="card-title-magical">🖼️ Imágenes de Ejemplo</h6>
            <p className="card-text-magical">
              Haz clic en una imagen para usarla en tu noticia
            </p>
            
            <div className="image-grid">
              {SAMPLE_IMAGES.map((imageUrl, index) => (
                <div key={index} className="image-item">
                  <div 
                    className={`image-thumbnail-magical ${
                      formData.imagen === imageUrl ? 'selected' : ''
                    }`}
                    onClick={() => handleImageSelect(imageUrl)}
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Ejemplo ${index + 1}`}
                      className="img-fluid"
                    />
                    {formData.imagen === imageUrl && (
                      <div className="selected-indicator">✓ Seleccionada</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de ayuda */}
          <div className="dashboard-card mt-3">
            <h6 className="card-title-magical">💡 Consejos</h6>
            <ul className="tips-list">
              <li>📌 Los campos con * son obligatorios</li>
              <li>🎯 Usa títulos claros y descriptivos</li>
              <li>📝 El subtítulo debe resumir la noticia</li>
              <li>🔍 Revisa el contenido antes de guardar</li>
              <li>🖼️ Selecciona una imagen atractiva</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;