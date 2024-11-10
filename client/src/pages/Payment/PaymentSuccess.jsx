import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosApi from "../../services/axiosApi";

function PaymentSuccess() {

    const navigate = useNavigate();

    const location = useLocation();
    const [paymentData, setPaymentData] = useState(null);

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

    const savePayment = () => {
        if (paymentData.paymentId && paymentData.id_photo && paymentData.status && paymentData.paymentType) {
            savePaymentData();
            navigate('/payments/historial')
        }else{
            navigate('/payments/historial')
        }
    }

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const paymentId = query.get('payment_id');
        const id_photo = query.get('external_reference');
        const status = query.get('status');
        const paymentType = query.get('payment_type');

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
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Detalles del Pago</h2>
                    <p className="mb-2">
                        <span className="font-semibold">Número de Operación:</span> {paymentData.paymentId}
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold">Estado de Pago:</span> {paymentData.status}
                    </p>
                    <p className="mb-4">
                        <span className="font-semibold">Metodo de Pago:</span> {paymentData.paymentType}
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
    );
}

export default PaymentSuccess