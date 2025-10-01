import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FAQPage = () => {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${API}/faqs`);
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
    setLoading(false);
  };

  const categories = [
    { value: 'alle', label: 'Alle vragen' },
    { value: 'algemeen', label: 'Algemeen' },
    { value: 'verwijzing', label: 'Verwijzing' },
    { value: 'traject', label: 'Traject' },
    { value: 'programmas', label: "Programma's" },
    { value: 'praktisch', label: 'Praktische zaken' }
  ];

  const filteredFaqs = selectedCategory === 'alle' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="faq-title">
              Veelgestelde Vragen
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Vind snel antwoorden op uw vragen over de Gecombineerde Leefstijlinterventie 
              in Zeist. Staat uw vraag er niet bij? Neem gerust contact met ons op.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Filter */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4" data-testid="category-filter-title">
                  Categorieën
                </h2>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-emerald-50'
                      }`}
                      data-testid={`category-${category.value}`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>

                {/* User Role Info */}
                {user && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Uw rol</h3>
                    <p className="text-blue-700 text-sm">
                      Ingelogd als: <span className="font-medium">{user.role}</span>
                    </p>
                    <p className="text-blue-600 text-xs mt-1">
                      Sommige vragen zijn specifiek voor uw rol.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {categories.find(cat => cat.value === selectedCategory)?.label}
                </h2>
                <p className="text-gray-600">
                  {filteredFaqs.length} {filteredFaqs.length === 1 ? 'vraag' : 'vragen'} gevonden
                </p>
              </div>

              {filteredFaqs.length > 0 ? (
                <div className="space-y-4" data-testid="faq-list">
                  {filteredFaqs.map((faq, index) => (
                    <FAQItem 
                      key={faq.id} 
                      faq={faq} 
                      index={index}
                      isExpanded={expandedFaq === faq.id}
                      onToggle={() => toggleFaq(faq.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" data-testid="no-faqs-message">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Geen vragen gevonden
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Er zijn geen vragen beschikbaar in deze categorie.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('alle')}
                    className="btn btn-primary"
                  >
                    Bekijk alle vragen
                  </button>
                </div>
              )}

              {/* Contact Section */}
              <div className="mt-12 bg-emerald-50 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-4" data-testid="contact-section-title">
                  Staat uw vraag er niet bij?
                </h3>
                <p className="text-gray-700 mb-6">
                  Onze leefstijlcoaches en medewerkers staan klaar om u te helpen. 
                  Neem gerust contact met ons op voor persoonlijke begeleiding.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact" 
                    className="btn btn-primary"
                    data-testid="contact-form-btn"
                  >
                    Contactformulier
                  </a>
                  <a 
                    href="tel:+31302345678" 
                    className="btn btn-secondary"
                    data-testid="call-btn"
                  >
                    Bel: 030-234 5678
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FAQItem = ({ faq, index, isExpanded, onToggle }) => {
  return (
    <div className="card" data-testid={`faq-item-${index}`}>
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        data-testid={`faq-toggle-${index}`}
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">
          {faq.question}
        </h3>
        <div className="flex-shrink-0">
          <svg
            className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line" data-testid={`faq-answer-${index}`}>
              {faq.answer}
            </p>
            
            {/* Role badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {faq.target_role.map((role, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-full ${
                    role === 'inwoner' ? 'bg-emerald-100 text-emerald-800' :
                    role === 'deelnemer' ? 'bg-blue-100 text-blue-800' :
                    role === 'verwijzer' ? 'bg-indigo-100 text-indigo-800' :
                    role === 'professional' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;