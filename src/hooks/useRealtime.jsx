import { useContext } from 'react';
import RealtimeContext from '../context/RealtimeContext';

function useRealtime() {
    const context = useContext(RealtimeContext);

    if (!context) {
        throw new Error('useRealtime debe usarse dentro de RealtimeProvider.');
    }

    return context;
}

export default useRealtime;
