import Card from "../components/Card";
import DepositForm from "../components/depositForm.jsx";
import "../styles/pages/deposit.scss";
import AccountDetails from "../components/accountDetails.jsx";


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
                    <AccountDetails />
                </Card>
            </div>
        </main>
    );
}



export default Deposit;