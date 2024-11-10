import PropTypes from 'prop-types';
import axiosApi from '../../services/axiosApi';

function PaymentButton({ onPayment }) {
    const handlePayment = async () => {
        try {
            const response = await axiosApi.post('payments/create_preference/', {
                title: onPayment.title,
                price: parseFloat(onPayment.price),
                id_photo: onPayment.id,
            });

            const preference = response.data;

            const script = document.createElement('script');
            script.src = 'https://sdk.mercadopago.com/js/v2';
            script.type = 'text/javascript';
            script.dataset.preferenceId = preference.id;
            document.body.appendChild(script);
            
            //console.log(preference)
            //console.log(preference.response.sandbox_init_point);
            window.location.href = preference.response.init_point;
        } catch (error) {
            console.error('Error al crear la preferencia de pago:', error);
        }
    };

    return (
        <div>
            {onPayment.price == 0 ? 
                <button 
                    className="bg-green-500 text-white py-2 px-4">
                    Descargar
                </button> 
                :
                <button 
                    className="bg-blue-500 text-white py-2 px-4" 
                    onClick={handlePayment}>
                    Pagar Licencia
                </button>
            }
        </div>
        
    );
}

PaymentButton.propTypes = {
    onPayment: PropTypes.shape({
        title: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        id: PropTypes.number.isRequired,
    }).isRequired,
};

export default PaymentButton;