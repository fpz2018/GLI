import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'inwoner'
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters lang zijn');
      setLoading(false);
      return;
    }

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    const result = await register(registerData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const roleOptions = [
    { value: 'inwoner', label: 'Inwoner - Geïnteresseerd in GLI programma\'s' },
    { value: 'deelnemer', label: 'Deelnemer - Actief in een GLI programma' },
    { value: 'verwijzer', label: 'Verwijzer - Huisarts of zorgverlener' },
    { value: 'professional', label: 'Professional - Leefstijlcoach of zorgprofessional' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Registreren bij GLI Zeist
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Of{' '}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
            log in met bestaand account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit} data-testid="register-form">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-testid="error-message">
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="form-label">
                Volledige naam
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                data-testid="name-input"
              />
            </div>

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
              <label htmlFor="role" className="form-label">
                Ik ben een...
              </label>
              <select
                id="role"
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                data-testid="role-select"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                data-testid="password-input"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Bevestig wachtwoord
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                data-testid="confirm-password-input"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
                data-testid="register-submit-btn"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Account aanmaken...
                  </span>
                ) : (
                  'Account aanmaken'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Door te registreren gaat u akkoord met onze voorwaarden en privacybeleid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;