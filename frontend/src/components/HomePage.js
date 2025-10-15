import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const HomePage = () => {
  const { user } = useAuth();

  const heroImages = [
    'https://images.unsplash.com/photo-1758798468567-dae59f52d365?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHByb2dyYW18ZW58MHx8fHwxNzU5MzU0OTQwfDA&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1556911073-a517e752729c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbGlmZXN0eWxlfGVufDB8fHx8MTc1OTM1NDkzNXww&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1758875568756-37a9c5c1a4f2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHx3ZWxsbmVzcyUyMHByb2dyYW18ZW58MHx8fHwxNzU5MzU0OTQwfDA&ixlib=rb-4.1.0&q=85'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container">
          <div className="py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="fade-in">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Gecombineerde Leefstijlinterventie 
                  <span className="text-emerald-600"> Zeist</span>
                </h1>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Ontdek een gezondere leefstijl met wetenschappelijk onderbouwde programma's. 
                  Professionele begeleiding op het gebied van voeding, beweging, gedrag en stress.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {!user ? (
                    <>
                      <Link 
                        to="/register" 
                        className="btn btn-primary text-lg px-8 py-4"
                        data-testid="hero-register-btn"
                      >
                        Meld je aan
                      </Link>
                      <Link 
                        to="/programs" 
                        className="btn btn-secondary text-lg px-8 py-4"
                        data-testid="hero-programs-btn"
                      >
                        Bekijk programma's
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="btn btn-primary text-lg px-8 py-4"
                        data-testid="hero-dashboard-btn"
                      >
                        Ga naar Dashboard
                      </Link>
                      <Link 
                        to="/programs" 
                        className="btn btn-secondary text-lg px-8 py-4"
                        data-testid="hero-programs-btn"
                      >
                        Bekijk programma's
                      </Link>
                    </>
                  )}
                </div>
              </div>
              
              {/* Hero Images */}
              <div className="slide-up grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src={heroImages[0]}
                    alt="Wellness programma"
                    className="w-full h-48 object-cover rounded-xl shadow-lg"
                    data-testid="hero-image-1"
                  />
                  <img 
                    src={heroImages[1]}
                    alt="Gezond koken"
                    className="w-full h-32 object-cover rounded-xl shadow-lg"
                    data-testid="hero-image-2"
                  />
                </div>
                <div className="mt-8">
                  <img 
                    src={heroImages[2]}
                    alt="Professionele begeleiding"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                    data-testid="hero-image-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">Voor wie is de GLI?</h2>
            <p className="section-subtitle mx-auto">
              Onze programma's zijn ontworpen voor verschillende doelgroepen met specifieke behoeften
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Inwoners */}
            <div className="card card-hover p-6 text-center" data-testid="audience-inwoners">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Inwoners</h3>
              <p className="text-gray-600 mb-4">
                Geïnteresseerd in een gezondere leefstijl? Ontdek wat GLI voor u kan betekenen.
              </p>
              <Link to="/programs" className="btn btn-outline text-sm w-full">
                Meer informatie
              </Link>
            </div>

            {/* Deelnemers */}
            <div className="card card-hover p-6 text-center" data-testid="audience-deelnemers">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Deelnemers</h3>
              <p className="text-gray-600 mb-4">
                Al begonnen met een GLI programma? Vind hier handige tips en resources.
              </p>
              {user && (user.role === 'deelnemer' || user.role === 'admin') ? (
                <Link to="/dashboard" className="btn btn-outline text-sm w-full">
                  Naar Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn btn-outline text-sm w-full">
                  Registreer
                </Link>
              )}
            </div>

            {/* Verwijzers */}
            <div className="card card-hover p-6 text-center" data-testid="audience-verwijzers">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Verwijzers</h3>
              <p className="text-gray-600 mb-4">
                Huisarts of zorgverlener? Leer hoe u patiënten kunt doorverwijzen naar GLI.
              </p>
              {user && (user.role === 'verwijzer' || user.role === 'admin') ? (
                <div className="space-y-2">
                  <Link to="/dashboard" className="btn btn-outline text-sm w-full">
                    Naar Dashboard
                  </Link>
                  <Link to="/verwijzerstool" className="btn btn-primary text-sm w-full">
                    Verwijzerstool
                  </Link>
                </div>
              ) : (
                <Link to="/verwijzerstool" className="btn btn-outline text-sm w-full">
                  Verwijzerstool
                </Link>
              )}
            </div>

            {/* Professionals */}
            <div className="card card-hover p-6 text-center" data-testid="audience-professionals">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a1 1 0 011-1h4a1 1 0 011 1v12m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Professionals</h3>
              <p className="text-gray-600 mb-4">
                Leefstijlcoach of zorgprofessional? Toegang tot professionele tools en resources.
              </p>
              {user && (user.role === 'professional' || user.role === 'admin') ? (
                <Link to="/dashboard" className="btn btn-outline text-sm w-full">
                  Naar Dashboard
                </Link>
              ) : (
                <Link to="/contact" className="btn btn-outline text-sm w-full">
                  Contact opnemen
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">Waarom GLI?</h2>
            <p className="section-subtitle mx-auto">
              Wetenschappelijk onderbouwd, volledig vergoed en persoonlijk begeleid
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center" data-testid="feature-scientific">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Wetenschappelijk onderbouwd</h3>
              <p className="text-gray-600">
                Bewezen effectieve methoden gebaseerd op de nieuwste wetenschappelijke inzichten 
                voor duurzame gedragsverandering.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center" data-testid="feature-coverage">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Volledig vergoed</h3>
              <p className="text-gray-600">
                GLI is volledig vergoed vanuit de basisverzekering en valt buiten uw eigen risico. 
                Geen financiële drempels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center" data-testid="feature-personal">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Persoonlijke begeleiding</h3>
              <p className="text-gray-600">
                Individuele coaching door gecertificeerde leefstijlprofessionals die u stap voor stap begeleiden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-emerald-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Klaar om te beginnen?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Neem contact op met uw huisarts voor een verwijzing naar de GLI, 
            of neem direct contact met ons op voor meer informatie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="btn bg-white text-emerald-600 hover:bg-gray-50 text-lg px-8 py-4"
              data-testid="cta-contact-btn"
            >
              Contact opnemen
            </Link>
            <Link 
              to="/faq" 
              className="btn bg-transparent text-white border-2 border-white hover:bg-white hover:text-emerald-600 text-lg px-8 py-4"
              data-testid="cta-faq-btn"
            >
              Veelgestelde vragen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;