import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'flowbite-react';
import axiosApi from '../../services/axiosApi';

function PaymentCollections({ onPayment }) {

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handlePriceColecction = () => {
        if (!onPayment.photos) return "0";
        const precios = onPayment.photos.map(photo => parseFloat(photo.precio));
        const total = precios.reduce((acc, precio) => acc + precio, 0);
        return total;
    };

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
            window.location.href = preference.response.sandbox_init_point;
        } catch (error) {
            console.error('Error al crear la preferencia de pago:', error);
        }
    };

    return (
        <div>
            <button 
                className="text-white py-2 px-4 bg-blue-600 rounded-md"
                onClick={handleOpenModal}>
                Pagar Licencia
            </button>
            <Modal show={openModal} onClose={handleCloseModal} size="5xl">
                <Modal.Header>
                    <span className="text-2xl font-bold mb-4">{onPayment.name}</span>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col items-center">
                        <div className="overflow-hidden overflow-y-auto">
                            <div className="grid grid-cols-2 gap-10 p-2">
                                {onPayment.photos && onPayment.photos.map(photo => (
                                    <div key={photo.id} className="w-[400px] h-[400px] p-4 bg-white rounded-lg shadow-lg">
                                        <p className="text-center text-lg font-semibold mb-2">{photo.title}</p>
                                        <img className='h-[300px] w-[auto] mx-auto rounded-md' src={photo.image_url} alt={photo.title} />
                                        <p className="text-center text-lg font-semibold mt-2">Precio ${parseInt(photo.precio)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="flex flex-col items-center">
                    <p className="text-center text-xl font-semibold">Precio Total: ${handlePriceColecction()}</p>
                    <button 
                        className="text-white py-2 px-4 mt-2 bg-blue-600 rounded-md"
                        onClick={handlePayment}>
                        Pagar Licencia
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PaymentCollections;

PaymentCollections.propTypes = {
    onPayment: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
};