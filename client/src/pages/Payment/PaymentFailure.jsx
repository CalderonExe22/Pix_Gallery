import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import axiosApi from "../../services/axiosApi";

function PaymentFailure() {

    const navigate = useNavigate();
    const location = useLocation();
    const [paymentData, setPaymentData] = useState(null);
    const [photo, setPhoto] = useState(null);

    const savePaymentData = async () => {
        try {
            await axiosApi.post('/payments/success/', {
                payment_id: paymentData.paymentId,
                photo: paymentData.id_photo,
                status: paymentData.status,
                payment_type: paymentData.paymentType,
            });
        } catch (error) {
            console.error('Error saving payment data:', error);
        }
    };

    const fetchPhoto = async (id) =>{
        try {
            const response = await axiosApi.get(`photos/photography/${id}/`)
            if(response.data){
                setPhoto(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const savePayment = () => {
        if (paymentData.paymentId != 'null' && paymentData.status != 'null' && paymentData.paymentType != 'null') {
            savePaymentData();
            navigate('/payments/historial')
        }else{
            navigate('/payments/historial')
        }
    }

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        //console.log(query);
        const paymentId = query.get('payment_id');
        const id_photo = query.get('external_reference');
        const status = query.get('status');
        const paymentType = query.get('payment_type');
        fetchPhoto(id_photo);
        setPaymentData({
            paymentId,
            id_photo,
            status,
            paymentType,
        });
    }, [location]);

    return (
        <div className="flex justify-center items-center h-full">
            {paymentData && (
                (paymentData?.paymentId === 'null' && paymentData?.status === 'null' && paymentData?.paymentType === 'null') ?
                <div>
                    <h2 className="text-center text-2xl font-bold mb-4">Pago Cancelado</h2>
                    <p className="text-center">
                        Lo sentimos, tu pago ha sido cancelado antes de completarse correctamente. 
                        Por favor, intenta nuevamente mas tarde.
                    </p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
                    >
                        Regresar al Home
                    </button>
                </div>
                :
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-center text-2xl font-bold mb-4">Número de Operación {paymentData?.paymentId}</h2>
                    <div className="flex justify-center">
                        <img className="w-[400px] h-auto" src={photo?.image_url} alt={photo?.title} />
                    </div>
                    <p className="text-center">{photo?.title}</p>
                    <p className="my-4">
                        <span className="font-semibold">Precio:</span> {photo?.price}
                    </p>
                    <p className="my-4">
                        <span className="font-semibold">Metodo de Pago:</span> {paymentData?.paymentType}
                    </p>
                    <p className="my-4">
                        <span className="font-semibold">Estado:</span> {paymentData?.status}
                    </p>
                    <button 
                        onClick={() => savePayment()} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Historial de Pagos
                    </button>
                </div>
            )}
        </div>
    )
}

export default PaymentFailure