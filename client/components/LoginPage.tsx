'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [isLoginView, setIsLoginView] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { login, signup } = useAuth();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            await signup(email, password);
            setSuccessMessage('Account created successfully! Please log in.');
            setIsLoginView(true);
            setPassword('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const activeTabClasses = 'bg-blue-500 text-white';
    const inactiveTabClasses = 'bg-gray-200 text-gray-700';

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-300">
                    <button
                        onClick={() => { setIsLoginView(true); setError(''); setSuccessMessage(''); }}
                        className={`w-1/2 p-3 font-semibold focus:outline-none transition-colors ${isLoginView ? activeTabClasses : inactiveTabClasses}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLoginView(false); setError(''); setSuccessMessage(''); }}
                        className={`w-1/2 p-3 font-semibold focus:outline-none transition-colors ${!isLoginView ? activeTabClasses : inactiveTabClasses}`}
                    >
                        Sign Up
                    </button>
                </div>

                <h1 className="text-2xl font-bold mb-4 text-center">{isLoginView ? 'Login' : 'Create Account'}</h1>

                <form onSubmit={isLoginView ? handleLogin : handleSignup}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder={!isLoginView ? '8 characters minimum' : ''} required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        {isLoginView ? 'Login' : 'Sign Up'}
                    </button>

                    {successMessage && <p className="mt-4 text-green-600 text-center">{successMessage}</p>}
                    {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
}