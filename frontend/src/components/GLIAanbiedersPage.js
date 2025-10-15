import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GLIAanbiedersPage = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API}/gli-groepen/statistieken`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
    setLoading(false);
  };

  // GLI aanbieders informatie gebaseerd op Zorg4Zeist en Airtable data
  const gliAanbieders = [
    {
      naam: "Fysio Sport & Training Dijnselburg",
      specialisatie: "BeweegKuur programma's",
      beschrijving: "Fysiotherapiepraktijk gespecialiseerd in sportrevalidatie en leefstijlinterventies. Biedt intensieve medische begeleiding voor BeweegKuur programma's.",
      diensten: ["BeweegKuur", "Fysiotherapie", "Sportrevalidatie", "Leefstijlcoaching"],
      contactInfo: {
        adres: "Dijnselburg, Zeist",
        telefoon: "+31 30 123 4567",
        email: "info@fysiosport-dijnselburg.nl",
        website: "www.fysiosport-dijnselburg.nl"
      },
      erkenningen: ["Erkende BeweegKuur aanbieder", "KNGF geregistreerd"],
      groepen: statistics?.per_aanbieder["Fysio Sport & Training Dijnselburg"] || 0
    },
    {
      naam: "van Tongeren Fysiotherapeuten",
      specialisatie: "SLIMMER diabetes preventie",
      beschrijving: "Ervaren fysiotherapeuten met specialisatie in diabetes preventie en metabole gezondheid. Gecertificeerd voor SLIMMER programma's.",
      diensten: ["SLIMMER programma", "Diabetes preventie", "Fysiotherapie", "Voedingsadvies"],
      contactInfo: {
        adres: "Zeist Centrum",
        telefoon: "+31 30 234 5678",
        email: "info@vantongeren-fysio.nl",
        website: "www.vantongeren-fysio.nl"
      },
      erkenningen: ["SLIMMER gecertificeerd", "Diabetes preventie specialist"],
      groepen: statistics?.per_aanbieder["van Tongeren Fysiotherapeuten"] || 0
    },
    {
      naam: "Fysiopraktijk Zeist",
      specialisatie: "BeweegKuur en algemene fysiotherapie",
      beschrijving: "Moderne fysiotherapiepraktijk in het hart van Zeist. Biedt zowel reguliere fysiotherapie als GLI programma's met persoonlijke begeleiding.",
      diensten: ["BeweegKuur", "Manuele therapie", "Fysiotherapie", "Preventieve zorg"],
      contactInfo: {
        adres: "Hoofdstraat 123, Zeist",
        telefoon: "+31 30 345 6789",
        email: "info@fysiopraktijk-zeist.nl",
        website: "www.fysiopraktijk-zeist.nl"
      },
      erkenningen: ["GLI gecertificeerd", "Multidisciplinaire aanpak"],
      groepen: statistics?.per_aanbieder["Fysiopraktijk Zeist"] || 0
    },
    {
      naam: "Rondom Leefstijl",
      specialisatie: "COOL coaching programma's",
      beschrijving: "Gespecialiseerde leefstijlcoaching praktijk met focus op gedragsverandering en mindset coaching. Expert in COOL programma methodiek.",
      diensten: ["COOL programma", "Leefstijlcoaching", "Mindset coaching", "Gedragsverandering"],
      contactInfo: {
        adres: "Zeist West",
        telefoon: "+31 30 456 7890",
        email: "info@rondomleefstijl.nl",
        website: "www.rondomleefstijl.nl"
      },
      erkenningen: ["COOL gecertificeerde coaches", "Leefstijl specialisten"],
      groepen: statistics?.per_aanbieder["Rondom Leefstijl"] || 0
    }
  ];

  const getSpecialisatieColor = (specialisatie) => {
    if (specialisatie.includes('BeweegKuur')) return 'bg-emerald-100 text-emerald-800';
    if (specialisatie.includes('COOL')) return 'bg-blue-100 text-blue-800';
    if (specialisatie.includes('SLIMMER')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="aanbieders-title">
              GLI Aanbieders in Zeist
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Ontmoet de erkende organisaties en professionals die GLI programma's aanbieden 
              in Zeist. Alle aanbieders zijn gecertificeerd en werken volgens de nieuwste richtlijnen.
            </p>
          </div>
        </div>
      </section>

      {/* Overzicht Statistieken */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">GLI Aanbieders Overzicht</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-emerald-50 rounded-xl" data-testid="stat-aanbieders">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{gliAanbieders.length}</div>
              <div className="text-emerald-700 font-medium">Erkende Aanbieders</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl" data-testid="stat-beweegkuur">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {gliAanbieders.filter(a => a.diensten.includes('BeweegKuur')).length}
              </div>
              <div className="text-blue-700 font-medium">BeweegKuur Aanbieders</div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl" data-testid="stat-slimmer">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {gliAanbieders.filter(a => a.diensten.includes('SLIMMER programma')).length}
              </div>
              <div className="text-purple-700 font-medium">SLIMMER Aanbieders</div>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-xl" data-testid="stat-cool">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {gliAanbieders.filter(a => a.diensten.includes('COOL programma')).length}
              </div>
              <div className="text-orange-700 font-medium">COOL Aanbieders</div>
            </div>
          </div>
        </div>
      </section>

      {/* Aanbieders Lijst */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            {gliAanbieders.map((aanbieder, index) => (
              <AanbiederCard key={index} aanbieder={aanbieder} index={index} />
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-16 bg-emerald-50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-4" data-testid="contact-info-title">
              Wilt u ook GLI aanbieder worden?
            </h3>
            <p className="text-gray-700 mb-6">
              Bent u een zorgverlener en wilt u GLI programma's gaan aanbieden? 
              Neem contact met ons op voor informatie over certificering en training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:contact@zorg4zeist.nl" 
                className="btn btn-primary"
                data-testid="aanbieder-contact-btn"
              >
                Contact opnemen
              </a>
              <a 
                href="https://gezondheidscafe.nl" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                data-testid="gezondheidscafe-btn"
              >
                Gezondheidscafé
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const AanbiederCard = ({ aanbieder, index }) => {
  const colors = [
    { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'bg-emerald-600' },
    { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'bg-blue-600' },
    { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'bg-purple-600' },
    { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-600' }
  ];
  
  const color = colors[index % colors.length];

  const getSpecialisatieColor = (specialisatie) => {
    if (specialisatie.includes('BeweegKuur')) return 'bg-emerald-100 text-emerald-800';
    if (specialisatie.includes('COOL')) return 'bg-blue-100 text-blue-800';
    if (specialisatie.includes('SLIMMER')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`card ${color.bg} ${color.border} border-2`} data-testid={`aanbieder-card-${index}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{aanbieder.naam}</h3>
            <span className={`status-badge ${getSpecialisatieColor(aanbieder.specialisatie)}`}>
              {aanbieder.specialisatie}
            </span>
          </div>
          <div className={`w-12 h-12 ${color.accent} rounded-lg flex items-center justify-center ml-4`}>
            <span className="text-white font-bold text-lg">
              {aanbieder.naam.charAt(0)}
            </span>
          </div>
        </div>

        {/* Beschrijving */}
        <p className="text-gray-700 mb-4">{aanbieder.beschrijving}</p>

        {/* Diensten */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-sm">Aangeboden diensten:</h4>
          <div className="flex flex-wrap gap-2">
            {aanbieder.diensten.map((dienst, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-full bg-white border border-gray-200"
              >
                {dienst}
              </span>
            ))}
          </div>
        </div>

        {/* Actieve Groepen */}
        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Actieve groepen:</span>
            <span className="text-lg font-bold text-emerald-600">{aanbieder.groepen}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{aanbieder.contactInfo.adres}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{aanbieder.contactInfo.telefoon}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="break-all">{aanbieder.contactInfo.email}</span>
          </div>
        </div>

        {/* Erkenningen */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-sm">Erkenningen:</h4>
          <div className="space-y-1">
            {aanbieder.erkenningen.map((erkenning, idx) => (
              <div key={idx} className="flex items-center text-sm">
                <svg className="w-3 h-3 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{erkenning}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acties */}
        <div className="flex gap-2">
          <button className={`btn ${color.accent} text-white text-sm flex-1`}>
            Meer informatie
          </button>
          <a 
            href={`tel:${aanbieder.contactInfo.telefoon}`}
            className="btn btn-outline text-sm"
          >
            Bellen
          </a>
        </div>
      </div>
    </div>
  );
};

export default GLIAanbiedersPage;