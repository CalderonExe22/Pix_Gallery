import axiosApi from "../../services/axiosApi";
import { useEffect, useState } from "react";

function PaymentsHistorial() {

    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const getPayments = async () => {
            try {
                const response = await axiosApi.get('payments/success/');
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
                            <th className="border px-4 py-2">Número de Operación</th>
                            <th className="border px-4 py-2">Estado de Pago</th>
                            <th className="border px-4 py-2">Metodo de Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{payment.payment_id}</td>
                                <td className="border px-4 py-2">{payment.status}</td>
                                <td className="border px-4 py-2">{payment.payment_type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PaymentsHistorial;