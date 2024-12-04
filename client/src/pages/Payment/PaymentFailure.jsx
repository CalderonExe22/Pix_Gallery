import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import axiosApi from "../../services/axiosApi";
import { Carousel } from "flowbite-react";

function PaymentFailure() {

    const navigate = useNavigate();
    const location = useLocation();
    const [paymentData, setPaymentData] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const dataPhoto = (index) => {
        setActiveIndex(index)
    }

    const savePaymentData = async () => {
        if (paymentData.type_payment === 'photo') {
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
        } else {
            try {
                await axiosApi.post('/payments/success/', {
                    payment_id: paymentData.paymentId,
                    collection: paymentData.id_photo,
                    status: paymentData.status,
                    payment_type: paymentData.paymentType,
                });
            } catch (error) {
                console.error('Error saving payment data:', error);
            }
        }
    };

    const fetchPhoto = async (id , type) =>{
        try {
            const endpoint = type === 'collection' ? `photos/collections/${id}` : `photos/photography/${id}/`;
            const response = await axiosApi.get(endpoint);
            if (response.data) {
                console.log(response.data);
                setPhoto(response.data);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    const savePayment = () => {
        if (paymentData.paymentId != 'null' && paymentData.status != 'null' && paymentData.paymentType != 'null') {
            savePaymentData();
            navigate('/purchase-history')
        }else{
            navigate('/purchase-history')
        }
    }

    const handlePriceColecction = () => {
        const precios = photo.photos.map(photo => parseFloat(photo.precio));
        const total = precios.reduce((acc, precio) => acc + precio, 0);
        return "$ "+total;
    }

    useEffect(() => {
        document.title = 'Pago rechazado'
        const query = new URLSearchParams(location.search);
        const paymentId = query.get('payment_id');
        const [id_photo, type_payment] = query.get('external_reference').split('-');
        const status = query.get('status');
        const paymentType = query.get('payment_type');
        fetchPhoto(id_photo, type_payment);
        setPaymentData({
            paymentId,
            type_payment,
            id_photo,
            status,
            paymentType,
        });
    }, [location]);
    console.log(paymentData);
    return (
        <div className="flex justify-center items-center h-full">
            {paymentData && photo && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-center text-2xl font-bold mb-4">Número de Operación {paymentData?.paymentId}</h2>
                    <div className="flex justify-center">
                        {
                            paymentData?.type_payment === 'photo' ?
                                <div>
                                    <img className="w-[400px] h-auto" src={photo?.image_url} alt={photo?.title} />
                                    <p className="text-center">{photo?.title}</p>
                                </div>
                                :
                                <div className="col-span-2 h-[350px] w-[350px]">
                                    <Carousel onSlideChange={dataPhoto} slide={false}>
                                        {photo?.photos?.map((photo) => (
                                            <img className="w-full h-full object-cover" key={photo.id} src={photo.image_url} alt={photo.title} />
                                        ))}
                                    </Carousel>
                                    <p className="text-center">{photo.photos[activeIndex].title} - $ {parseFloat(photo.photos[activeIndex].precio)}</p> 
                                </div>
                        }
                    </div>
                    <p className="my-4">
                        <span className="font-semibold">Precio: </span>
                        {
                            paymentData?.type_payment === 'photo' ?
                            <span>$ {parseInt(photo?.precio)}</span>
                            :
                            handlePriceColecction()
                        }
                    </p>
                    <p className="my-4">
                        <span className="font-semibold">Metodo de Pago:</span> {paymentData.paymentType}
                    </p>
                    <p className="my-4">
                        <span className="font-semibold">Estado:</span> {paymentData.status}
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

export default PaymentFailure