import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Payments() {
    const location = useLocation();
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const paymentId = query.get('payment_id');
        const status = query.get('status');
        const merchantOrderId = query.get('merchant_order_id');

        setPaymentData({
            paymentId,
            status,
            merchantOrderId
        });
    }, [location]);

    return (
        <div className="flex justify-center items-center h-full">
            <h1>Historial de Pagos</h1>
            {paymentData && (
                <div>
                    <p>Payment ID: {paymentData.paymentId}</p>
                    <p>Status: {paymentData.status}</p>
                    <p>Merchant Order ID: {paymentData.merchantOrderId}</p>
                </div>
            )}
        </div>
    );
}

export default Payments;