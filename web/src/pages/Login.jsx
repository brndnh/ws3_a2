import { useState } from 'react';
import { signIn } from '../api';
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        if (!email || !password) return setErr('please enter email and password');

        try {
            const data = await signIn(email.trim(), password); // { token, user }
            login(data);
            navigate('/');
        } catch (e) {
            setErr(e.message || 'login failed');
        }
    };

    return (
        <div className="form-container">
            <h1>log in</h1>
            <form onSubmit={onSubmit}>
                <input type="email" placeholder="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
                {err && <p style={{ color: 'crimson' }}>{err}</p>}
                <button type="submit">log in</button>
            </form>
            <p className="mt-2">
                don&apos;t have an account? <Link to="/signup">sign up</Link>
            </p>
        </div>
    );
}
