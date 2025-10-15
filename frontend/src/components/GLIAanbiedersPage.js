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

  // GLI aanbieders informatie gebaseerd op echte Zorg4Zeist data en Airtable
  const gliAanbieders = [
    {
      naam: "Fysiopraktijk Zeist",
      specialisatie: "BeweegKuur en algemene fysiotherapie",
      beschrijving: "Moderne fysiotherapiepraktijk aan de Laan van Vollenhove. Biedt zowel reguliere fysiotherapie als GLI programma's met persoonlijke begeleiding.",
      diensten: ["BeweegKuur", "Manuele therapie", "Fysiotherapie", "Preventieve zorg"],
      contactInfo: {
        adres: "Laan van Vollenhove 20B, 3706 AA Zeist",
        telefoon: "030 721 0771",
        email: "administratie@fysiopraktijkzeist.nl",
        website: "www.fysiopraktijkzeist.nl"
      },
      erkenningen: ["GLI gecertificeerd", "KNGF geregistreerd"],
      groepen: statistics?.per_aanbieder["Fysiopraktijk Zeist"] || 0
    },
    {
      naam: "van Tongeren Fysiotherapeuten",
      specialisatie: "SLIMMER diabetes preventie",
      beschrijving: "Ervaren fysiotherapeuten aan de Utrechtseweg met specialisatie in diabetes preventie en metabole gezondheid. Gecertificeerd voor SLIMMER programma's.",
      diensten: ["SLIMMER programma", "Diabetes preventie", "Fysiotherapie", "Voedingsadvies"],
      contactInfo: {
        adres: "Utrechtseweg 88, 3702 AD Zeist",
        telefoon: "030 691 8945",
        email: "info@vantongerenfysiotherapeuten.nl",
        website: "www.vantongerenfysiotherapeuten.nl"
      },
      erkenningen: ["SLIMMER gecertificeerd", "Diabetes preventie specialist"],
      groepen: statistics?.per_aanbieder["van Tongeren Fysiotherapeuten"] || 0
    },
    {
      naam: "Widar Fysiotherapie",
      specialisatie: "BeweegKuur binnen gezondheidscentrum",
      beschrijving: "Onderdeel van het WIDAR Gezondheidscentrum aan de Laan van Beek en Royen. Multidisciplinaire aanpak voor GLI programma's.",
      diensten: ["BeweegKuur", "Fysiotherapie", "Multidisciplinaire zorg", "Revalidatie"],
      contactInfo: {
        adres: "Laan van Beek en Royen 39, 3701 AK Zeist",
        telefoon: "030 693 2846",
        email: "ine.hofman@widar.nl",
        website: "www.widar.nl"
      },
      erkenningen: ["WIDAR Gezondheidscentrum", "GLI gecertificeerd"],
      groepen: statistics?.per_aanbieder["Widar Fysiotherapie"] || 0
    },
    {
      naam: "Diëtistenpraktijk Zeist",
      specialisatie: "Voedingsadvies als onderdeel van BeweegKuur teams",
      beschrijving: "Gespecialiseerde diëtistenpraktijk die voedingsadvies biedt als onderdeel van BeweegKuur leefstijlteams. Draait geen zelfstandige groepen maar ondersteunt andere GLI aanbieders.",
      diensten: ["Voedingsadvies (BeweegKuur)", "Dieettherapie", "Team ondersteuning", "Diabetes coaching"],
      contactInfo: {
        adres: "Woudenbergseweg 9, 3701 BA Zeist",
        telefoon: "030 692 5717",
        email: "info@dietistenpraktijkzeist.nl",
        website: "www.dietistenpraktijkzeist.nl"
      },
      erkenningen: ["BIG geregistreerd diëtist", "BeweegKuur team partner"],
      groepen: "Teamlid" // Onderdeel van BeweegKuur teams
    },
    {
      naam: "Fysio Sport & Training Dijnselburg",
      specialisatie: "BeweegKuur en sportrevalidatie",
      beschrijving: "Fysiotherapie praktijk gespecialiseerd in sport en training. Onderdeel van BeweegKuur teams met focus op bewegingstherapie en sportrevalidatie.",
      diensten: ["BeweegKuur", "Fysiotherapie", "Sportrevalidatie", "Bewegingstherapie"],
      contactInfo: {
        adres: "Badmeester Schenkpad 14, 3705 GK Zeist",
        telefoon: "030 699 0093",
        email: "zeist@fysiosportentraining.nl",
        website: "www.fysiosportentraining.nl"
      },
      erkenningen: ["BeweegKuur aanbieder", "KNGF geregistreerd"],
      groepen: statistics?.per_aanbieder["Fysio Sport & Training Dijnselburg"] || 0
    },
    {
      naam: "RondOm Leefstijl",
      specialisatie: "COOL leefstijlcoaching",
      beschrijving: "Gespecialiseerde leefstijlpraktijk met focus op gedragsverandering en leefstijlcoaching. Biedt COOL programma's voor duurzame leefstijlverandering.",
      diensten: ["COOL programma", "Leefstijlcoaching", "Gedragsverandering", "Motivational coaching"],
      contactInfo: {
        adres: "Hoog Kanje 186E, 3708 DL Zeist",
        telefoon: "088 118 0523",
        email: "fleur.schouten@rondomleefstijl.nl",
        website: "www.rondomleefstijl.nl"
      },
      erkenningen: ["COOL gecertificeerd", "Leefstijl specialisten"],
      groepen: statistics?.per_aanbieder["Rondom Leefstijl"] || 0
    },
    {
      naam: "Coach Marlies Hensen",
      specialisatie: "Individuele leefstijlcoaching",
      beschrijving: "Persoonlijke leefstijlcoach voor individuele begeleiding bij gedragsverandering. Ondersteunt bij verschillende GLI programma's.",
      diensten: ["Individuele coaching", "Gedragstraining", "Leefstijladvies", "Motivatietraining"],
      contactInfo: {
        adres: "Zeist (locatie op afspraak)",
        telefoon: "06 1735 4085",
        email: "info@coachmarlies.nl",
        website: "www.coachmarlies.nl"
      },
      erkenningen: ["Gecertificeerde leefstijlcoach", "Individuele coaching specialist"],
      groepen: 0  // Individuele coaching, geen groepen
    },
    {
      naam: "Miguide (Cool-Miguide)",
      specialisatie: "Online GLI begeleiding",
      beschrijving: "Digitaal platform voor online GLI begeleiding vanuit Rotterdam. Biedt Cool-programma voor inwoners van Zeist via digitale coaching. Informatie aanbieder.",
      diensten: ["COOL online programma", "Digitale coaching", "App-based begeleiding", "E-health"],
      contactInfo: {
        adres: "Parklaan 8, 3016 BB Rotterdam",
        telefoon: "085 006 6872",
        email: "info@miguide.nl",
        website: "www.miguide.nl"
      },
      erkenningen: ["COOL gecertificeerd", "E-health provider"],
      groepen: "Info" // Onbekend aantal groepen
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
                {gliAanbieders.filter(a => 
                  a.diensten.some(d => d.toLowerCase().includes('cool')) ||
                  a.naam.toLowerCase().includes('cool')
                ).length}
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

          {/* Informatie over Aanbieder Types */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">Soorten GLI Aanbieders</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <h4 className="font-semibold text-emerald-800 mb-2">Groepen Aanbieders</h4>
                <p className="text-sm text-gray-700">
                  Draaien zelfstandig GLI groepen voor deelnemers. Hebben eigen programma's en planning.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h4 className="font-semibold text-purple-800 mb-2">Team Partners</h4>
                <p className="text-sm text-gray-700">
                  Onderdeel van BeweegKuur teams. Bieden specialistische ondersteuning zoals voedingsadvies.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-sm">I</span>
                </div>
                <h4 className="font-semibold text-blue-800 mb-2">Info Aanbieders</h4>
                <p className="text-sm text-gray-700">
                  Aanbieders ter informatie. Online platforms of aanbieders buiten Zeist regio.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info voor Verwijzers */}
          <div className="mt-8 bg-emerald-50 rounded-xl p-8 text-center">
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
    { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-600' },
    { bg: 'bg-pink-50', border: 'border-pink-200', accent: 'bg-pink-600' }
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
            <span className={`text-lg font-bold ${
              aanbieder.groepen === "Info" ? "text-blue-600" :
              aanbieder.groepen === "Teamlid" ? "text-purple-600" :
              "text-emerald-600"
            }`}>
              {aanbieder.groepen === "Info" ? "Info alleen" :
               aanbieder.groepen === "Teamlid" ? "Team partner" :
               aanbieder.groepen}
            </span>
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