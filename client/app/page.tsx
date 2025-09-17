'use client';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';

export default function HomePage() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
    );
  }

  return token ? <Dashboard /> : <LoginPage />;
}