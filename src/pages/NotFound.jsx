import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/pages/notfound.scss';

function NotFound() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="not-found">

            <div className="not-found__card">

                <span className="not-found__code">
                    404
                </span>

                <h1>
                    Página no encontrada
                </h1>

                <p>
                    La página que buscás no existe o fue movida.
                </p>

                <Link
                    to={isAuthenticated ? '/dashboard' : '/login'}
                    className="not-found__button"
                >
                    Volver
                </Link>

            </div>

        </div>
    );
}

export default NotFound;