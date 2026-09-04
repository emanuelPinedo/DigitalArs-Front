import LoginForm from '../components/LoginForm';
// aca hay que importar el componente UI ???

//admin@digitalars.com
// Admin123!
// juan.perez@digitalars.com
// maria.gomez@digitalars.com
// User123!


function Login() {
    return (
        <main className='login-page'>

            <div className="login-visual">
                {/* componente Topography */}
            </div>

            <div className="login-form-container">

                <div className="login-logo">
                    <img
                        src="/logo.png"
                        alt="DigitalArs Wallet"
                    />
                </div>

                <LoginForm />

            </div>
        
        </main>
    );
}

export default Login