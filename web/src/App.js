import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import ItemDetails from './pages/ItemDetails';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import './global.css';

// simple header with auth links + logout
function Header() {
  const { isAuthed, logout, user } = useAuth();
  return (
    <header style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Link to="/">home</Link>
      {isAuthed ? (
        <>
          <span style={{ color: '#666' }}>signed in as {user?.email}</span>
          <button onClick={logout}>log out</button>
        </>
      ) : (
        <>
          <Link to="/login">log in</Link>
          <Link to="/signup">sign up</Link>
        </>
      )}
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* protected */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditItem /></ProtectedRoute>} />
          <Route path="/item/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />

          <Route path="*" element={<div style={{ padding: 16 }}>not found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
