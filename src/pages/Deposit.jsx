import Card from "../components/Card";
import DepositForm from "../components/depositForm.jsx";
import "../styles/pages/deposit.scss";


function getAccountBalance(account) {
    if (!account) {
        return null;
    }

    const value = account.balance ?? account.availableBalance ?? account.price;

    return Number.isFinite(Number(value)) ? Number(value) : null;
}


function Deposit() {
    
    return (
        <main className='deposit-page'>
            <div className="deposit-layout">
                <Card 
                    titleName="Nuevo deposito"
                    className="deposit-card"
                >
                    <DepositForm />
                </Card>
                <Card 
                    titleName="Datos de tu cuenta" 
                    className="account-data-card"
                >
                    <p className="dep"></p>
                </Card>
            </div>
        </main>
    );
}



export default Deposit;