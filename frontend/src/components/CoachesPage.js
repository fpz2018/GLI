import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CoachesPage = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await axios.get(`${API}/coaches`);
      setCoaches(response.data);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    }
    setLoading(false);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="coaches-title">
              Onze Leefstijlcoaches
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Ontmoet ons team van gecertificeerde leefstijlprofessionals die u persoonlijk 
              begeleiden tijdens uw GLI traject in Zeist.
            </p>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="section">
        <div className="container">
          {coaches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coaches.map((coach, index) => (
                <CoachCard key={coach.id} coach={coach} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Coaches worden geladen...</p>
            </div>
          )}

          {/* Team Expertise Section */}
          <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="expertise-title">
              Onze Expertise
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center" data-testid="expertise-medical">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Leefstijlgeneeskunde</h3>
                <p className="text-gray-600 text-sm">Medische begeleiding bij chronische aandoeningen</p>
              </div>

              <div className="text-center" data-testid="expertise-psychology">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Gedragspsychologie</h3>
                <p className="text-gray-600 text-sm">Duurzame gedragsverandering en motivatie</p>
              </div>

              <div className="text-center" data-testid="expertise-nutrition">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Voeding & Beweging</h3>
                <p className="text-gray-600 text-sm">Praktische begeleiding in leefstijlaanpassingen</p>
              </div>

              <div className="text-center" data-testid="expertise-coaching">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Persoonlijke Coaching</h3>
                <p className="text-gray-600 text-sm">Individuele begeleiding en groepssessies</p>
              </div>
            </div>
          </div>

          {/* Approach Section */}
          <div className="mt-16 bg-emerald-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="approach-title">
              Onze Aanpak
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-4">Persoonlijk & Wetenschappelijk Onderbouwd</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-600 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Individuele Intake</h4>
                      <p className="text-gray-600 text-sm">Uitgebreide analyse van uw huidige leefstijl en doelen</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-600 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Persoonlijk Plan</h4>
                      <p className="text-gray-600 text-sm">Op maat gemaakt programma aangepast aan uw behoeften</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-600 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Continue Begeleiding</h4>
                      <p className="text-gray-600 text-sm">Regelmatige evaluatie en bijstelling van uw traject</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-center">Vier Pijlers van GLI</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl mb-2">🥗</div>
                    <div className="font-medium text-sm">Voeding</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-2">🏃‍♀️</div>
                    <div className="font-medium text-sm">Beweging</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">🧠</div>
                    <div className="font-medium text-sm">Gedrag</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl mb-2">😴</div>
                    <div className="font-medium text-sm">Slaap & Stress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const CoachCard = ({ coach, index }) => {
  const colors = [
    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'bg-emerald-600' },
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'bg-blue-600' },
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', accent: 'bg-purple-600' }
  ];
  
  const color = colors[index % colors.length];

  return (
    <div className={`card card-hover ${color.bg} ${color.border} border`} data-testid={`coach-card-${index}`}>
      <div className="p-6">
        {/* Avatar */}
        <div className={`w-20 h-20 ${color.accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <span className="text-white font-bold text-2xl">
            {coach.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold mb-1">{coach.name}</h3>
          <p className={`text-sm font-medium ${color.text}`}>{coach.specialization}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{coach.location}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{coach.phone}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="break-all">{coach.email}</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-sm">Programma's:</h4>
          <div className="flex flex-wrap gap-2">
            {coach.programs.map((program, idx) => (
              <span
                key={idx}
                className={`text-xs px-3 py-1 rounded-full ${color.bg} ${color.text} border ${color.border}`}
              >
                {program}
              </span>
            ))}
          </div>
        </div>

        <button className={`w-full btn ${color.accent} text-white text-sm`}>
          Contact opnemen
        </button>
      </div>
    </div>
  );
};

export default CoachesPage;