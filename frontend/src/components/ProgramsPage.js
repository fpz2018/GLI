import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [gliGroepen, setGliGroepen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
    fetchGliGroepen();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API}/programs`);
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
    setLoading(false);
  };

  const fetchGliGroepen = async () => {
    try {
      const response = await axios.get(`${API}/gli-groepen/`);
      setGliGroepen(response.data);
    } catch (error) {
      console.error('Error fetching GLI groepen:', error);
    }
  };

  const getGroepenForProgram = (programName) => {
    const typeMapping = {
      'BeweegKuur': 'Beweegkuur',
      'COOL': 'Cool',
      'SLIMMER': 'Slimmer'
    };
    
    const mappedType = typeMapping[programName];
    return gliGroepen.filter(groep => groep.type_gli === mappedType);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="programs-title">
              GLI Programma's in Zeist
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Ontdek welk leefstijlprogramma het beste bij u past. Alle programma's zijn 
              wetenschappelijk onderbouwd en volledig vergoed vanuit de basisverzekering.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section">
        <div className="container">
          {programs.length > 0 ? (
            <>
              <div className="grid lg:grid-cols-3 gap-8">
                {programs.map((program, index) => (
                  <ProgramCard 
                    key={program.id} 
                    program={program} 
                    index={index}
                    groepen={getGroepenForProgram(program.name)}
                  />
                ))}
              </div>

              {/* Beschikbare Groepen Link */}
              <div className="mt-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Beschikbare GLI Groepen</h2>
                <p className="text-gray-600 mb-6">
                  Bekijk live beschikbaarheid en planning van alle GLI groepen in Zeist
                </p>
                <a 
                  href="/gli-groepen" 
                  className="btn btn-primary"
                  data-testid="view-all-groups-btn"
                >
                  Bekijk alle groepen en planning
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Programma's worden geladen...</p>
            </div>
          )}

          {/* How to Apply Section */}
          <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="how-to-apply-title">
              Hoe kunt u zich aanmelden?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center" data-testid="step-1">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">Verwijzing Huisarts</h3>
                <p className="text-gray-600">
                  Neem contact op met uw huisarts of praktijkondersteuner voor een verwijzing naar de GLI.
                </p>
              </div>

              <div className="text-center" data-testid="step-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">Programma Kiezen</h3>
                <p className="text-gray-600">
                  Samen met uw huisarts bepaalt u welk programma het beste bij uw situatie past.
                </p>
              </div>

              <div className="text-center" data-testid="step-3">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">Traject Starten</h3>
                <p className="text-gray-600">
                  U wordt uitgenodigd voor een intakegesprek en start uw persoonlijke leefstijltraject.
                </p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mt-16 bg-emerald-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="locations-title">
              Locaties in Zeist
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg text-center" data-testid="location-centrum">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Zeist Centrum</h3>
                <p className="text-gray-600 text-sm">Hoofdlocatie voor BeweegKuur en SLIMMER programma's</p>
              </div>

              <div className="bg-white p-6 rounded-lg text-center" data-testid="location-west">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Zeist West</h3>
                <p className="text-gray-600 text-sm">COOL programma en groepsbijeenkomsten</p>
              </div>

              <div className="bg-white p-6 rounded-lg text-center" data-testid="location-vollenhove">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Vollenhove</h3>
                <p className="text-gray-600 text-sm">Gezondheidscafé en informatiebijeenkomsten</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProgramCard = ({ program, index, groepen = [] }) => {
  const colors = [
    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'bg-emerald-600' },
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'bg-blue-600' },
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', accent: 'bg-purple-600' }
  ];
  
  const color = colors[index % colors.length];

  return (
    <div className={`card ${color.bg} ${color.border} border-2`} data-testid={`program-card-${program.name.toLowerCase()}`}>
      <div className="p-6">
        <div className={`w-12 h-12 ${color.accent} rounded-lg flex items-center justify-center mb-4`}>
          <span className="text-white font-bold text-xl">{program.name[0]}</span>
        </div>
        
        <h3 className="text-2xl font-bold mb-3">{program.name}</h3>
        <p className="text-gray-700 mb-4">{program.description}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Duur:</span>
            <span className="ml-1">{program.duration}</span>
          </div>
          
          <div className="flex items-start text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <span className="font-medium">Doelgroep:</span>
              <p className="ml-0 mt-1 text-gray-600">{program.target_group}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Focusgebieden:</h4>
          <div className="flex flex-wrap gap-2">
            {program.focus_areas.map((area, idx) => (
              <span
                key={idx}
                className={`text-xs px-3 py-1 rounded-full ${color.bg} ${color.text} border ${color.border}`}
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {groepen && groepen.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Beschikbare groepen:</h4>
            <div className="space-y-2">
              {groepen.slice(0, 3).map((groep, idx) => (
                <div key={idx} className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{groep.dag} {groep.tijd}</span>
                  {groep.locatie && <span className="ml-2 text-gray-500">• {groep.locatie}</span>}
                </div>
              ))}
              {groepen.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{groepen.length - 3} meer beschikbaar
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`${color.bg} ${color.border} border rounded-lg p-4 mb-4`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Volledig vergoed vanuit basisverzekering</span>
          </div>
        </div>

        <button className={`w-full btn ${color.accent} text-white`}>
          Meer informatie
        </button>
      </div>
    </div>
  );
};

export default ProgramsPage;