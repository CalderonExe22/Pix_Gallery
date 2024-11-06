import { useNavigate } from "react-router-dom"

function PaymentFailure() {

    const navigate = useNavigate();

    return (
        <div className="pt-96">
            <h1>Probando ando el Failure</h1>
            <button onClick={() => navigate('/payments/historial')}>Historial de Pagos</button>
        </div>
    )
}

export default PaymentFailure