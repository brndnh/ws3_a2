import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// redirects to /login if not authed

export default function ProtectedRoute({ children }) {
    const { isAuthed } = useAuth();
    if (!isAuthed) return <Navigate to="/login" replace />;
    return children;
}
