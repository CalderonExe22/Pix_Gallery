import { useEffect, useState } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from "prop-types";
import CardPhoto from '../../components/Cards/CardPhoto/CardPhoto';

export default function Portafolio({idUser}) {
    //const { id } = useParams(); // Obtener el ID del portafolio de la URL
    const [portafolio, setPortafolio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchPortafolio = async (id) => {
        try {
          const response = await axiosApi.get(`portafolio/portafolios/${id}/`); // Asegúrate de que esta sea la ruta correcta
          setPortafolio(response.data);
        } catch (error) {
          console.error('Error fetching portafolio:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPortafolio(idUser);
    }, [idUser]);
  
    if (loading) {
      return <div>Cargando...</div>;
    }
  
    if (!portafolio) {
      return <div>No se encontró el portafolio.</div>;
    }

    console.log(portafolio)
  
    return (
    <div className='flex flex-col justify-center items-center h-full w-full'>
      <div className='flex flex-col items-center w-full pt-10 pb-10 gap-5'>
        <h1 className='font-semibold text-4xl'>{portafolio.name}</h1>
        <p>{portafolio.description}</p>
      </div>
      {portafolio.collections.map((collection) => (
        <div className='flex flex-col w-full pt-10 pb-10 gap-5' key={collection.id}>
          <h1 className='font-semibold text-3xl'>
            {collection.name}
          </h1>
          <p>{collection.description}</p>
          <div className='grid grid-cols-5 grid-flow-row gap-8'>
            {collection.photos.map((photo) => (
              <CardPhoto id={photo.id} key={photo.id} url={photo.image_url} title={photo.title} />
            ))}
          </div>
        </div>
      ))}
    </div> 
    )
}

Portafolio.propTypes = {
  idUser: PropTypes.number
}