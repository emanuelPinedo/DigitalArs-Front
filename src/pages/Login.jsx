import LoginForm from '../components/LoginForm';
import Topography from '../components/Topography';
import logo from '../assets/images/logo.svg';
import '../styles/pages/login.scss';

//admin@digitalars.com
// Admin123!
// juan.perez@digitalars.com
// maria.gomez@digitalars.com
// User123!


function Login() {
    return (
        <main className='login-page'>

            <div className="login-visual" style={{ backgroundColor: '#232125' }}>
                <Topography/>
            </div>

            <div className="login-form-container">

                <div className="login-logo">
                    <img
                        src={logo}
                        alt="DigitalArs"
                    />
                    <h2>Digital<span>Ars</span></h2>
                    <p>Wallet</p>
                </div>

                <LoginForm />

            </div>
        
        </main>
    );
}

export default Login