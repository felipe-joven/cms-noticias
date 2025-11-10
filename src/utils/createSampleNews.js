import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { NEWS_STATUS } from './constants';

export const createSampleNews = async () => {
  try {
    console.log('🎯 Creando noticias de ejemplo...');

    const sampleNews = [
      {
        titulo: 'Primera Noticia de Prueba',
        subtitulo: 'Esta es una noticia de prueba para verificar que el sistema funciona',
        contenido: `Esta es una noticia de ejemplo creada automáticamente para demostrar el funcionamiento del CMS de noticias.

Puedes editar esta noticia o crear nuevas desde el panel administrativo.

¡El sistema está funcionando correctamente!`,
        categoria: 'Tecnología',
        imagen: 'https://picsum.photos/800/400?random=10',
        autor: 'system',
        autorNombre: 'Sistema',
        estado: NEWS_STATUS.PUBLICADO,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        titulo: 'Otra Noticia de Ejemplo',
        subtitulo: 'Más contenido de prueba para el sitio web',
        contenido: `Esta es otra noticia de ejemplo para tener más contenido en el sitio.

Puedes categorizar las noticias en diferentes secciones como Tecnología, Deportes, Cultura, etc.

Cada noticia puede tener una imagen y contenido formateado.`,
        categoria: 'Educación',
        imagen: 'https://picsum.photos/800/400?random=11',
        autor: 'system',
        autorNombre: 'Sistema',
        estado: NEWS_STATUS.PUBLICADO,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
    ];

    // Agregar noticias de ejemplo
    for (const newsItem of sampleNews) {
      await addDoc(collection(db, 'news'), newsItem);
      console.log('✅ Noticia creada:', newsItem.titulo);
    }

    console.log('🎉 Noticias de ejemplo creadas exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error creando noticias de ejemplo:', error);
    return false;
  }
};