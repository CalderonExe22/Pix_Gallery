import axiosApi from "../../services/axiosApi";
import { useEffect, useState } from "react";
import { Modal, Button } from "flowbite-react";

function PaymentsHistorial() {

    const [payments, setPayments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    
    const handleOpenModal = (payment) => {
        setSelectedPayment(payment);
        setOpenModal(true);
    };
    
    const handleCloseModal = () => {
        setSelectedPayment(null);
        setOpenModal(false);
    };

    useEffect(() => {
        const getPayments = async () => {
            try {
                const response = await axiosApi.get('payments/success/');
                console.log('Pagos:', response.data);
                setPayments(response.data);
            } catch (error) {
                console.log('Error al obtener los pagos:', error);
            }
        };
        getPayments();
    }, []);

    return (
        <div className="flex justify-center items-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Historial de Pagos</h2>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Photo</th>
                            <th className="border px-4 py-2">Titulo</th>
                            <th className="border px-4 py-2">Estado</th>
                            <th className="border px-4 py-2">Mas Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2 text-center">
                                    <div className="w-[75x] h-[75px] flex justify-center">
                                        <img src={payment.photo_image} alt={payment.photo_title} />
                                    </div>
                                </td>
                                <td className="border px-4 py-2 text-center">{payment.photo_title}</td>
                                <td className="border px-4 py-2 text-center">{payment.status}</td>
                                <td className="border px-4 py-2 text-center">
                                    <Button onClick={() => handleOpenModal(payment)}>Mas Info</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedPayment && (
                <Modal show={openModal} onClose={handleCloseModal}>
                    <Modal.Header><span className="text-2xl font-bold">Número de Operación {selectedPayment.payment_id}</span></Modal.Header>
                    <Modal.Body>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-center">
                            <img className="w-[400px] h-auto" src={selectedPayment.photo_image} alt={selectedPayment.title} />
                        </div>
                        <p className="text-center">{selectedPayment.photo_title}</p>
                        <p className="my-4">
                            <span className="font-semibold">Número de Operación:</span> {selectedPayment.payment_id}
                        </p>
                        <p className="my-4">
                            <span className="font-semibold">Precio:</span> {selectedPayment.photo_price}
                        </p>
                        <p className="my-4">
                            <span className="font-semibold">Metodo de Pago:</span> {selectedPayment.payment_type}
                        </p>
                        <p className="my-4">
                            <span className="font-semibold">Estado:</span> {selectedPayment.status}
                        </p>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleCloseModal}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default PaymentsHistorial;