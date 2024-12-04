import axiosApi from "../../services/axiosApi";
import { useEffect, useState } from "react";
import { Modal, Carousel } from "flowbite-react";

export default function PurchaseHistory() {

    const [payments, setPayments] = useState([]);
    const [collection, setCollection] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const dataPhoto = (index) => {
        setActiveIndex(index)
    }

    const handleOpenModal = (payment) => {
        setSelectedPayment(payment);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedPayment(null);
        setOpenModal(false);
    };

    const getPayments = async () => {
        try {
            const response = await axiosApi.get('payments/success/get_user_payments/');
            //console.log('Compras:', response.data);
            setPayments(response.data);
        } catch (error) {
            console.log('Error al obtener las Compras:', error);
        }
    };

    const getCollection = async (id) =>{
        try {
            const response = await axiosApi.get(`photos/collections/${id}`);
            if (response.data) {
                //console.log(response.data);
                setCollection(response.data);
            }
        } catch (error) {
            console.error('Error al obtener la Collection: ', error);
        }
    }

    const handlePriceColecction = () => {
        if (!collection.photos) return " $ 0";
        const precios = collection.photos.map(photo => parseFloat(photo.precio));
        const total = precios.reduce((acc, precio) => acc + precio, 0);
        return " $ "+total;
    }

    useEffect(() => {
        document.title = 'Administrar cuenta - Historial de Compras'
        getPayments();
    }, []);

    //console.log(collection);

    return (
        payments.length === 0 ?
        <div className="flex justify-center items-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Historial de Compras</h2>
                <p className="text-center">No realizaste ninguna compra hasta el momento!</p>
            </div>
        </div>
        :
        <div className="flex justify-start items-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Historial de Compras</h2>
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
                                        {
                                            payment.type_payment === 'photo' ?
                                                <img src={payment.photo_image} alt={payment.photo_title} />
                                            :
                                                <p>Collection Photo</p>
                                        }
                                    </div>
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    {
                                        payment.type_payment === 'photo' ?
                                            payment.photo_title
                                        :
                                            payment.collection_name
                                    }
                                </td>
                                <td className="border px-4 py-2 text-center">{payment.status}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        onClick={() => {
                                            if (payment.type_payment === 'collection') {
                                                getCollection(payment.collection);
                                            }
                                            handleOpenModal(payment);
                                        }}
                                        className="bg-[#b5179e] text-white py-2 px-3 rounded-lg">
                                        Mas Info
                                    </button>
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
                        {
                            selectedPayment.type_payment === 'photo' ?
                                <div>
                                    <img className="w-[400px] h-auto" src={selectedPayment.photo_image} alt={selectedPayment.photo_title} />
                                    <p className="text-center">{selectedPayment.photo_title}</p>
                                </div>
                            :
                                collection?.photos?.length > 0 &&
                                <div className="col-span-2 h-[350px] w-[350px]">
                                    <Carousel onSlideChange={dataPhoto} slide={false}>
                                        {collection?.photos?.map((photo) => (
                                            <img className="w-full h-full object-cover" key={photo.id} src={photo.image_url} alt={photo.title} />
                                        ))}
                                    </Carousel>
                                    <p className="text-center">{collection.photos[activeIndex].title} - $ {parseFloat(collection.photos[activeIndex].precio)}</p> 
                                </div>
                        }
                        </div>
                        <p className="my-4 mt-2">
                            <span className="font-semibold">Fecha:</span> {new Date(selectedPayment.created_at).toLocaleDateString()}
                        </p>
                        <p className="my-4">
                            <span className="font-semibold">Precio:</span>
                            {
                                selectedPayment.type_payment === 'photo' ?
                                    " $ " + parseInt(selectedPayment.photo_precio)
                                :
                                    handlePriceColecction()
                            }
                        </p>
                        <p className="my-4">
                            <span className="font-semibold">Metodo de Pago: </span>{selectedPayment.payment_type}
                        </p>
                        <p className="my-4">
                            <span className="font-semibold">Estado: </span>{selectedPayment.status}
                        </p>
                        <p className="my-4">
                            <span className="font-semibold">Vendida por: </span>
                            {
                                selectedPayment.type_payment === 'photo' ?
                                    selectedPayment.photo_username
                                :
                                    collection?.user?.username
                            }
                        </p>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            onClick={handleCloseModal}
                            className="bg-[#b5179e] text-white py-2 px-3 rounded-lg">
                            Cerrar
                        </button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}