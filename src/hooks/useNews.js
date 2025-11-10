import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener todas las noticias
  const getNews = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'news'), orderBy('fechaCreacion', 'desc'))
      );
      const newsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNews(newsData);
    } catch (error) {
      console.error('Error getting news:', error);
    }
    setLoading(false);
  };

  // Crear nueva noticia
  const createNews = async (newsData) => {
    try {
      const newsWithMetadata = {
        ...newsData,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };

      const docRef = await addDoc(collection(db, 'news'), newsWithMetadata);
      return docRef.id;
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  };

  // Actualizar noticia
  const updateNews = async (id, newsData) => {
    try {
      const updateData = { 
        ...newsData, 
        fechaActualizacion: new Date() 
      };

      await updateDoc(doc(db, 'news', id), updateData);
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  };

  // Cambiar estado de noticia
  const changeNewsStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'news', id), {
        estado: newStatus,
        fechaActualizacion: new Date()
      });
    } catch (error) {
      console.error('Error changing status:', error);
      throw error;
    }
  };

  // Eliminar noticia
  const deleteNews = async (id) => {
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  };

  return {
    news,
    loading,
    getNews,
    createNews,
    updateNews,
    changeNewsStatus,
    deleteNews
  };
};