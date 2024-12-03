import PropTypes from 'prop-types';
import axiosApi from '../../services/axiosApi';
import { useState, useEffect } from 'react';
import ButtonDownload from '../ButtonDownload/ButtonDownload';

function PaymentPhoto({ onPayment }) {

    const [isPayment, setIsPayment] = useState(true);

    const getPayments = async () => {
        try {
            const response = await axiosApi.get('payments/success/get_user_payments/');
            const payments = response.data.filter(payment => payment.photo === onPayment.id && payment.status === 'approved');
            setIsPayment(payments.length > 0);
            console.log(payments);
        } catch (error) {
            console.log('Error al obtener los pagos:', error);
        }
    };

    const handlePayment = async () => {
        try {
            const response = await axiosApi.post('payments/create_preference/', {
                title: onPayment.title,
                precio: parseFloat(onPayment.precio),
                id_payment: onPayment.id,
                type_payment: "photo",
            });
            const preference = response.data;
            const script = document.createElement('script');
            script.src = 'https://sdk.mercadopago.com/js/v2';
            script.type = 'text/javascript';
            script.dataset.preferenceId = preference.id;
            document.body.appendChild(script);
            //console.log(preference)
            //console.log(preference.response.sandbox_init_point);
            window.location.href = preference.response.sandbox_init_point;
        } catch (error) {
            console.error('Error al crear la preferencia de pago:', error);
        }
    };

    useEffect(() => {
        getPayments();
    }, []);

    return (
        <>
            {onPayment.is_free || !isPayment ? 
                <ButtonDownload title={onPayment?.title} image_url={onPayment?.image_url} />
                :
                <button 
                    className="p-2 bg-[#b5179e] text-white rounded-lg font-bold"
                    onClick={handlePayment}>
                    Pagar Licencia
                </button>
            }
        </>
        
    );
}

PaymentPhoto.propTypes = {
    onPayment: PropTypes.shape({
        title: PropTypes.string.isRequired,
        precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        id: PropTypes.number.isRequired,
        is_free: PropTypes.bool.isRequired,
        image_url: PropTypes.string.isRequired,
    }).isRequired,
};

export default PaymentPhoto;