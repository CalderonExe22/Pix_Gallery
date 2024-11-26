import PropTypes from 'prop-types';
import axiosApi from '../../services/axiosApi';

function PaymentCollections({ onPayment }) {

    const handlePayment = async () => {
        try {
            const precio = await handlePriceColecction();
            const response = await axiosApi.post('payments/create_preference/', {
                title: onPayment.name,
                precio: precio,
                id_payment: onPayment.id,
                type_payment: "collection",
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

    const handlePriceColecction = () => {
        if (!onPayment.photos) return "0";
        const precios = onPayment.photos.map(photo => parseFloat(photo.precio));
        const total = precios.reduce((acc, precio) => acc + precio, 0);
        return total;
    }

    return (
        <div>
            {
                <button 
                    className="text-white py-2 px-4 bg-blue-600"
                    onClick={() => handlePayment()}>
                    Pagar Licencia
                </button>
            }
        </div>
        
    );
}

export default PaymentCollections;

PaymentCollections.propTypes = {
    onPayment: PropTypes.object,
};