import { useEffect, useState } from 'react';
import axiosApi from '../../services/axiosApi';
import { useParams } from 'react-router-dom';
export default function Portafolio() {
    const { id } = useParams(); // Obtener el ID del portafolio de la URL
    const [portafolio, setPortafolio] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchPortafolio = async () => {
        try {
          const response = await axiosApi.get(`portafolio/portafolios/${id}/`); // Asegúrate de que esta sea la ruta correcta
          setPortafolio(response.data);
        } catch (error) {
          console.error('Error fetching portafolio:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPortafolio();
    }, [id]);
  
    if (loading) {
      return <div>Cargando...</div>;
    }
  
    if (!portafolio) {
      return <div>No se encontró el portafolio.</div>;
    }

    console.log(portafolio)
  
    return (
      <div className='flex justify-center items-center h-full w-full'>
        <h1>{portafolio.name}</h1>
        <p>{portafolio.description}</p>
        <p>¿Es público? {portafolio.is_public ? 'Sí' : 'No'}</p>
  
        <h2>Colecciones</h2>
        <ul>
          {portafolio.collections && portafolio.collections.map((collection) => (
            <li key={collection.id}>
              <h3>{collection.name}</h3>
              <p>{collection.description}</p>
              <h4>Fotos en esta colección:</h4>
              <ul>
                {collection.photographies.map((photo) => (
                  <li key={photo.id}>
                    <img src={photo.image} alt={photo.title} />
                    <p>{photo.title}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
}
