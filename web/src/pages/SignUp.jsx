import { useState } from 'react';
import { signUp, signIn } from '../api';
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [err, setErr] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr('');

        // client-side checks
        if (!email || !password) return setErr('please enter email and password');
        if (password.length < 6) return setErr('password must be at least 6 characters');
        if (password !== confirm) return setErr('passwords do not match');

        try {
            await signUp(email.trim(), password);
            // auto-login after signup
            const data = await signIn(email.trim(), password); // { token, user }
            login(data);
            navigate('/');
        } catch (e) {
            setErr(e.message || 'sign up failed');
        }
    };

    return (
        <div className="form-container">
            <h1>sign up</h1>
            <form onSubmit={onSubmit}>
                <input type="email" placeholder="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="password (min 6)" value={password}
                    onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                <input type="password" placeholder="confirm password" value={confirm}
                    onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
                {err && <p style={{ color: 'crimson' }}>{err}</p>}
                <button type="submit">create account</button>
            </form>
            <p className="mt-2">
                already have an account? <Link to="/login">log in</Link>
            </p>
        </div>
    );
}
