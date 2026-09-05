import TransferForm from '../components/TransferForm';
import '../styles/pages/transfer.scss';

function Transferencias() {
    return (
        <main className="transfer-page">
            <h1>Transferencia</h1>
            <p>Elegí destinatario, ingresá el monto y confirmá el envío.</p>
            <TransferForm />
        </main>
    );
}

export default Transferencias;
