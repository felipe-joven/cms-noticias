import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { NEWS_STATUS } from './constants';

export const initSampleData = async () => {
  try {
    console.log('Verificando datos de ejemplo...');
    
    // Verificar si ya existen noticias
    const newsSnapshot = await getDocs(collection(db, 'news'));
    
    if (newsSnapshot.size > 0) {
      console.log('Ya existen noticias en la base de datos');
      return;
    }

    console.log('Creando noticias de ejemplo...');

    // Noticias de ejemplo
    const sampleNews = [
      {
        titulo: 'Avances Revolucionarios en Inteligencia Artificial',
        subtitulo: 'Nuevos modelos de IA prometen transformar la industria tecnológica',
        contenido: `Los últimos desarrollos en inteligencia artificial están marcando un antes y un después en la industria tecnológica. Empresas líderes han presentado modelos capaces de comprender y generar lenguaje natural con una precisión sin precedentes.

Estos avances no solo impactarán en la forma en que interactuamos con la tecnología, sino que también abren nuevas posibilidades en campos como la medicina, la educación y la investigación científica.

Expertos predicen que en los próximos años veremos aplicaciones que hoy parecen ciencia ficción, desde asistentes virtuales ultra-inteligentes hasta sistemas de diagnóstico médico asistidos por IA.`,
        categoria: 'Tecnología',
        imagen: 'https://picsum.photos/800/400?random=1',
        autor: 'system',
        autorNombre: 'Equipo Editorial',
        estado: NEWS_STATUS.PUBLICADO,
        fechaCreacion: new Date('2025-01-15'),
        fechaActualizacion: new Date('2025-01-15')
      },
      {
        titulo: 'Gran Triunfo del Equipo Local en Campeonato Nacional',
        subtitulo: 'El equipo de la ciudad se corona campeón tras emocionante final',
        contenido: `En una noche histórica para el deporte local, nuestro equipo se consagró campeón del torneo nacional tras vencer en la final por 3-2 en un partido lleno de emociones.

Los jugadores demostraron un espíritu de lucha incansable, remontando un marcador adverso en los minutos finales del encuentro. El capitán del equipo anotó el gol decisivo en el minuto 89, desatando la euforia entre los miles de aficionados que abarrotaron el estadio.

Esta victoria representa el primer título nacional para la ciudad en más de una década, marcando un hito en la historia del club.`,
        categoria: 'Deportes',
        imagen: 'https://picsum.photos/800/400?random=2',
        autor: 'system',
        autorNombre: 'Departamento Deportivo',
        estado: NEWS_STATUS.PUBLICADO,
        fechaCreacion: new Date('2025-01-14'),
        fechaActualizacion: new Date('2025-01-14')
      },
      {
        titulo: 'Nuevas Medidas Económicas para Impulsar el Crecimiento',
        subtitulo: 'El gobierno anuncia paquete de estímulos para sectores estratégicos',
        contenido: `El Ministerio de Economía ha presentado hoy un ambicioso paquete de medidas destinadas a reactivar el crecimiento económico y apoyar a los sectores más afectados por la situación global.

Entre las principales iniciativas se incluyen incentivos fiscales para pequeñas y medianas empresas, programas de financiamiento a tasas preferenciales y apoyo directo a industrias estratégicas como la tecnología y las energías renovables.

Analistas económicos han recibido positivamente estas medidas, aunque advierten sobre la importancia de su implementación efectiva y el monitoreo constante de los resultados.`,
        categoria: 'Economía',
        imagen: 'https://picsum.photos/800/400?random=3',
        autor: 'system',
        autorNombre: 'Análisis Económico',
        estado: NEWS_STATUS.PUBLICADO,
        fechaCreacion: new Date('2025-01-13'),
        fechaActualizacion: new Date('2025-01-13')
      },
      {
        titulo: 'Festival Cultural Atrae a Miles de Visitantes',
        subtitulo: 'Evento multicultural celebra la diversidad y el arte local',
        contenido: `El festival cultural anual ha superado todas las expectativas, recibiendo a más de 50,000 visitantes durante sus cinco días de duración. El evento, que celebra la diversidad cultural de la región, presentó una amplia variedad de expresiones artísticas.

Desde exposiciones de arte contemporáneo hasta presentaciones de danza tradicional, el festival ofreció algo para todos los gustos. Los organizadores destacaron la participación récord de artistas locales y la positiva respuesta del público.

"Este festival demuestra el vibrante panorama cultural de nuestra ciudad y su capacidad para organizar eventos de talla internacional", comentó el director del evento.`,
        categoria: 'Cultura',
        imagen: 'https://picsum.photos/800/400?random=4',
        autor: 'system',
        autorNombre: 'Cultura y Espectáculos',
        estado: NEWS_STATUS.PUBLICADO,
        fechaCreacion: new Date('2025-01-12'),
        fechaActualizacion: new Date('2025-01-12')
      },
      {
        titulo: 'Descubrimiento Científico en el Campo de la Medicina',
        subtitulo: 'Investigadores desarrollan nuevo tratamiento para enfermedades crónicas',
        contenido: `Un equipo internacional de científicos ha anunciado un avance significativo en el tratamiento de enfermedades crónicas. El nuevo enfoque terapéutico, resultado de años de investigación, muestra resultados prometedores en ensayos clínicos.

La terapia combina técnicas de medicina personalizada con tecnologías de última generación, ofreciendo nuevas esperanzas a pacientes que hasta ahora tenían opciones limitadas de tratamiento.

"Este descubrimiento representa un paso importante hacia tratamientos más efectivos y menos invasivos", explicó la directora del proyecto de investigación.`,
        categoria: 'Salud',
        imagen: 'https://picsum.photos/800/400?random=5',
        autor: 'system',
        autorNombre: 'Ciencia y Salud',
        estado: NEWS_STATUS.PUBLICADO,
        fechaCreacion: new Date('2025-01-11'),
        fechaActualizacion: new Date('2025-01-11')
      }
    ];

    // Agregar noticias de ejemplo
    for (const newsItem of sampleNews) {
      await addDoc(collection(db, 'news'), newsItem);
      console.log('Noticia creada:', newsItem.titulo);
    }

    console.log('✅ Datos de ejemplo creados exitosamente');
  } catch (error) {
    console.error('❌ Error creando datos de ejemplo:', error);
  }
};