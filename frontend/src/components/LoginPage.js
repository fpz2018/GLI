import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Inloggen bij GLI Zeist
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Of{' '}
          <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
            registreer een nieuw account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit} data-testid="login-form">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-testid="error-message">
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="form-label">
                E-mailadres
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                data-testid="email-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                data-testid="password-input"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
                data-testid="login-submit-btn"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Bezig met inloggen...
                  </span>
                ) : (
                  'Inloggen'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <button
                type="button"
                onClick={() => setFormData({ email: 'inwoner@demo.nl', password: 'demo123' })}
                className="btn btn-outline text-xs"
                data-testid="demo-inwoner-btn"
              >
                Demo Inwoner
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'deelnemer@demo.nl', password: 'demo123' })}
                className="btn btn-outline text-xs"
                data-testid="demo-deelnemer-btn"
              >
                Demo Deelnemer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'verwijzer@demo.nl', password: 'demo123' })}
                className="btn btn-outline text-xs"
                data-testid="demo-verwijzer-btn"
              >
                Demo Verwijzer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'professional@demo.nl', password: 'demo123' })}
                className="btn btn-outline text-xs"
                data-testid="demo-professional-btn"
              >
                Demo Professional
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;