import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

const SectionManager = () => {
  const { userData } = useAuth();
  const [sections, setSections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'sections'));
      const sectionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSections(sectionsData);
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    setLoading(true);
    try {
      if (editingSection) {
        await updateDoc(doc(db, 'sections', editingSection.id), {
          ...formData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'sections'), {
          ...formData,
          createdAt: new Date()
        });
      }
      
      setShowForm(false);
      setEditingSection(null);
      setFormData({ nombre: '', descripcion: '' });
      loadSections();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Error al guardar la sección');
    }
    setLoading(false);
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({ nombre: section.nombre, descripcion: section.descripcion });
    setShowForm(true);
  };

  const handleDelete = async (sectionId) => {
    if (window.confirm('¿Estás seguro de eliminar esta sección?')) {
      try {
        await deleteDoc(doc(db, 'sections', sectionId));
        loadSections();
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Error al eliminar la sección');
      }
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingSection(null);
    setFormData({ nombre: '', descripcion: '' });
  };

  // Solo editores pueden acceder
  if (userData?.role !== 'editor') {
    return (
      <div className="alert alert-warning">
        No tienes permisos para acceder a esta sección.
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestión de Secciones</h4>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Nueva Sección
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
              {editingSection ? 'Editar Sección' : 'Nueva Sección'}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre de la Sección *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={cancelEdit}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de secciones */}
      <div className="row">
        {sections.map((section) => (
          <div key={section.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{section.nombre}</h5>
                <p className="card-text text-muted">{section.descripcion}</p>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEdit(section)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(section.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionManager;