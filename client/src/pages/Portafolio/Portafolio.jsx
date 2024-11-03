import { useEffect,useState } from "react";
import axiosApi from "../../services/axiosApi";
import { useParams } from "react-router-dom";
export default function Portafolio() {
    const { id } = useParams();
    const [portafolio, setPortafolio] = useState([]);
    const fetchPortafolio = async (id) => {
        try {
            const response = await axiosApi.get(`portafolio/portafolios/${id}/`);
            setPortafolio(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchPortafolio(id);
    }, [id]);
    console.log(portafolio);
    return (
        <div className="flex justify-center items-center h-full">
            <div key={portafolio.id} className="flex flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-800">{portafolio.name}</h1>
                <p className="text-gray-800">{portafolio.description}</p>
            </div>                
        </div>
    )
}