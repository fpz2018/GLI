import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    request_type: 'info'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

    try {
      await axios.post(`${API}/contact`, formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        request_type: 'info'
      });
    } catch (error) {
      setError('Er is een fout opgetreden. Probeer het later opnieuw.');
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm text-center" data-testid="success-message">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bericht verzonden!</h2>
          <p className="text-gray-600 mb-6">
            Bedankt voor uw bericht. We nemen zo spoedig mogelijk contact met u op.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn btn-primary"
          >
            Nieuw bericht verzenden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="contact-title">
              Contact
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Heeft u vragen over de GLI programma's in Zeist? Neem contact met ons op. 
              We helpen u graag verder met persoonlijke begeleiding en informatie.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6" data-testid="contact-form-title">
                Stuur ons een bericht
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-testid="error-message">
                    <div className="text-red-700 text-sm">{error}</div>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="form-label">
                    Volledige naam *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    data-testid="name-input"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    E-mailadres *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    data-testid="email-input"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
                    Telefoonnummer
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    data-testid="phone-input"
                  />
                </div>

                <div>
                  <label htmlFor="request_type" className="form-label">
                    Onderwerp
                  </label>
                  <select
                    id="request_type"
                    name="request_type"
                    className="form-input"
                    value={formData.request_type}
                    onChange={handleChange}
                    data-testid="request-type-select"
                  >
                    <option value="info">Algemene informatie</option>
                    <option value="referral">Verwijzing/Aanmelding</option>
                    <option value="support">Ondersteuning deelnemer</option>
                    <option value="professional">Professionele vraag</option>
                    <option value="other">Anders</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="form-label">
                    Uw bericht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    required
                    className="form-input resize-none"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Beschrijf uw vraag of opmerking..."
                    data-testid="message-textarea"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary"
                  data-testid="submit-btn"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Verzenden...
                    </span>
                  ) : (
                    'Bericht verzenden'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="card p-6" data-testid="contact-details">
                <h3 className="text-xl font-semibold mb-4">Contactgegevens</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Telefoon</h4>
                      <p className="text-gray-600">030-234 5678</p>
                      <p className="text-sm text-gray-500">Ma-Vr: 08:00 - 17:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">E-mail</h4>
                      <p className="text-gray-600">info@zorg4zeist.nl</p>
                      <p className="text-sm text-gray-500">We reageren binnen 24 uur</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Adres</h4>
                      <p className="text-gray-600">
                        Zorg4Zeist<br/>
                        Hoofdstraat 123<br/>
                        3701 DN Zeist
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="card p-6" data-testid="office-hours">
                <h3 className="text-xl font-semibold mb-4">Openingstijden</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Maandag - Vrijdag</span>
                    <span className="font-medium">08:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zaterdag</span>
                    <span className="font-medium">09:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zondag</span>
                    <span className="text-gray-500">Gesloten</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    <strong>Spoed?</strong> Voor dringende vragen buiten kantooruren 
                    kunt u contact opnemen met uw huisarts.
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="card p-6 bg-orange-50 border-orange-200" data-testid="emergency-contact">
                <h3 className="text-xl font-semibold mb-4 text-orange-800">
                  Spoedgevallen
                </h3>
                <p className="text-orange-700 mb-4">
                  Bij medische spoedgevallen tijdens uw GLI traject:
                </p>
                <div className="space-y-2">
                  <p className="text-orange-700">
                    <strong>Huisartspost:</strong> 0900-8844
                  </p>
                  <p className="text-orange-700">
                    <strong>Spoedeisende hulp:</strong> 112
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;