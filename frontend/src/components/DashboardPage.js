import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DashboardPage = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resourcesRes, eventsRes] = await Promise.all([
        axios.get(`${API}/resources`),
        axios.get(`${API}/events`)
      ]);
      
      setResources(resourcesRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="dashboard-title">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welkom terug, {user.name}! Dit is uw persoonlijke GLI dashboard.
          </p>
          <div className="mt-4">
            <span className={`status-badge ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
              user.role === 'professional' ? 'bg-blue-100 text-blue-800' :
              user.role === 'verwijzer' ? 'bg-indigo-100 text-indigo-800' :
              user.role === 'deelnemer' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>

        {/* Role-specific content */}
        {user.role === 'inwoner' && <InwonerDashboard />}
        {user.role === 'deelnemer' && <DeelnemerDashboard resources={resources} events={events} />}
        {user.role === 'verwijzer' && <VerwijzerDashboard />}
        {user.role === 'professional' && <ProfessionalDashboard resources={resources} events={events} />}
        {user.role === 'admin' && <AdminDashboard resources={resources} events={events} />}
      </div>
    </div>
  );
};

const InwonerDashboard = () => (
  <div className="grid md:grid-cols-2 gap-8">
    <div className="card p-6" data-testid="inwoner-info-card">
      <h2 className="text-xl font-semibold mb-4">Volgende stappen</h2>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-emerald-600 text-sm font-bold">1</span>
          </div>
          <div>
            <h3 className="font-medium">Bezoek uw huisarts</h3>
            <p className="text-gray-600 text-sm">Vraag een verwijzing naar de GLI aan bij uw huisarts of praktijkondersteuner.</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-emerald-600 text-sm font-bold">2</span>
          </div>
          <div>
            <h3 className="font-medium">Kies een programma</h3>
            <p className="text-gray-600 text-sm">Bekijk welk GLI programma het beste bij u past: BeweegKuur, COOL of SLIMMER.</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-emerald-600 text-sm font-bold">3</span>
          </div>
          <div>
            <h3 className="font-medium">Start uw traject</h3>
            <p className="text-gray-600 text-sm">Begin met persoonlijke begeleiding door onze gecertificeerde coaches.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="card p-6" data-testid="inwoner-programs-card">
      <h2 className="text-xl font-semibold mb-4">Programma's in Zeist</h2>
      <div className="space-y-3">
        <div className="p-3 bg-emerald-50 rounded-lg">
          <h3 className="font-medium text-emerald-800">BeweegKuur</h3>
          <p className="text-emerald-700 text-sm">Intensieve medische begeleiding</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800">COOL</h3>
          <p className="text-blue-700 text-sm">Focus op mindset en motivatie</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <h3 className="font-medium text-purple-800">SLIMMER</h3>
          <p className="text-purple-700 text-sm">Diabetespreventie programma</p>
        </div>
      </div>
    </div>
  </div>
);

const DeelnemerDashboard = ({ resources, events }) => (
  <div className="space-y-8">
    <div className="grid md:grid-cols-3 gap-6">
      <div className="card p-6 text-center" data-testid="deelnemer-progress-card">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-semibold mb-2">Mijn Voortgang</h3>
        <p className="text-gray-600 text-sm">Bekijk uw persoonlijke ontwikkeling</p>
      </div>

      <div className="card p-6 text-center" data-testid="deelnemer-coaching-card">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="font-semibold mb-2">Mijn Coach</h3>
        <p className="text-gray-600 text-sm">Contact met uw persoonlijke coach</p>
      </div>

      <div className="card p-6 text-center" data-testid="deelnemer-group-card">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="font-semibold mb-2">Groepsbijeenkomsten</h3>
        <p className="text-gray-600 text-sm">Deel ervaringen met anderen</p>
      </div>
    </div>

    <ResourcesSection resources={resources} title="Handige Resources" />
    <EventsSection events={events} title="Aankomende Bijeenkomsten" />
  </div>
);

const VerwijzerDashboard = () => (
  <div className="space-y-8">
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card p-6" data-testid="verwijzer-referral-card">
        <h2 className="text-xl font-semibold mb-4">Verwijzen via VIP Live</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Stappen voor verwijzing:</h3>
            <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
              <li>Ga naar VIP Live platform</li>
              <li>Selecteer 'GLI-verwijzing'</li>
              <li>Kies het juiste programma</li>
              <li>Vermeld BMI, co-morbiditeiten en motivatie</li>
            </ol>
          </div>
          <button className="btn btn-primary w-full">
            Open VIP Live (Mock)
          </button>
        </div>
      </div>

      <div className="card p-6" data-testid="verwijzer-criteria-card">
        <h2 className="text-xl font-semibold mb-4">Inclusie Criteria</h2>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-emerald-600">BeweegKuur</h4>
            <p className="text-sm text-gray-600">Diabetes type 2, hart- en vaatziekten, BMI > 25</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-600">COOL</h4>
            <p className="text-sm text-gray-600">Motivatie voor gedragsverandering, BMI > 23</p>
          </div>
          <div>
            <h4 className="font-medium text-purple-600">SLIMMER</h4>
            <p className="text-sm text-gray-600">Verhoogd risico diabetes type 2</p>
          </div>
        </div>
      </div>
    </div>

    <div className="card p-6" data-testid="verwijzer-contacts-card">
      <h2 className="text-xl font-semibold mb-4">Contactpersonen GLI Zeist</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium">Dr. Sarah van der Berg</h3>
          <p className="text-sm text-gray-600">Leefstijlgeneeskunde</p>
          <p className="text-sm text-emerald-600">s.vandenberg@zorg4zeist.nl</p>
          <p className="text-sm text-gray-600">+31 30 123 4567</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium">Mark Jansen</h3>
          <p className="text-sm text-gray-600">Gedragspsychologie</p>
          <p className="text-sm text-emerald-600">m.jansen@zorg4zeist.nl</p>
          <p className="text-sm text-gray-600">+31 30 234 5678</p>
        </div>
      </div>
    </div>
  </div>
);

const ProfessionalDashboard = ({ resources, events }) => (
  <div className="space-y-8">
    <div className="grid md:grid-cols-4 gap-6">
      <div className="card p-6 text-center" data-testid="professional-clients-card">
        <div className="text-2xl font-bold text-emerald-600 mb-2">24</div>
        <p className="text-gray-600 text-sm">Actieve Cliënten</p>
      </div>
      <div className="card p-6 text-center" data-testid="professional-sessions-card">
        <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
        <p className="text-gray-600 text-sm">Sessies Deze Week</p>
      </div>
      <div className="card p-6 text-center" data-testid="professional-programs-card">
        <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
        <p className="text-gray-600 text-sm">Actieve Programma's</p>
      </div>
      <div className="card p-6 text-center" data-testid="professional-completion-card">
        <div className="text-2xl font-bold text-orange-600 mb-2">87%</div>
        <p className="text-gray-600 text-sm">Completion Rate</p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="card p-6" data-testid="professional-tools-card">
        <h2 className="text-xl font-semibold mb-4">Professionele Tools</h2>
        <div className="space-y-3">
          <button className="w-full btn btn-outline text-left">
            📋 Intake Formulieren
          </button>
          <button className="w-full btn btn-outline text-left">
            📊 Voortgangsrapportage
          </button>
          <button className="w-full btn btn-outline text-left">
            📚 Richtlijnen & Protocollen
          </button>
          <button className="w-full btn btn-outline text-left">
            💬 Interne Communicatie
          </button>
        </div>
      </div>

      <div className="card p-6" data-testid="professional-training-card">
        <h2 className="text-xl font-semibold mb-4">Scholing & Ontwikkeling</h2>
        <div className="space-y-3">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <h3 className="font-medium text-emerald-800">Nieuwe Richtlijnen 2025</h3>
            <p className="text-emerald-700 text-sm">Update over GLI methodiek</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">Motivational Interviewing</h3>
            <p className="text-blue-700 text-sm">Verdiepingstraining beschikbaar</p>
          </div>
        </div>
      </div>
    </div>

    <ResourcesSection resources={resources} title="Professionele Resources" />
    <EventsSection events={events} title="Team Evenementen" />
  </div>
);

const AdminDashboard = ({ resources, events }) => (
  <div className="space-y-8">
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4" data-testid="admin-notice">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Administrator Dashboard
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>U heeft beheerdersrechten en kunt alle functies van het systeem gebruiken.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <DeelnemerDashboard resources={resources} events={events} />
      <div className="space-y-6">
        <ProfessionalDashboard resources={resources} events={events} />
      </div>
    </div>
  </div>
);

const ResourcesSection = ({ resources, title }) => (
  <div className="card p-6" data-testid="resources-section">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {resources.length > 0 ? (
      <div className="grid md:grid-cols-2 gap-4">
        {resources.slice(0, 6).map(resource => (
          <div key={resource.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-medium mb-1">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
            <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
              {resource.category}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-8">Geen resources beschikbaar voor uw rol.</p>
    )}
  </div>
);

const EventsSection = ({ events, title }) => (
  <div className="card p-6" data-testid="events-section">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {events.length > 0 ? (
      <div className="space-y-4">
        {events.slice(0, 3).map(event => (
          <div key={event.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-gray-600 text-sm">{event.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                📍 {event.location} • 📅 {new Date(event.date).toLocaleDateString('nl-NL')}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-8">Geen aankomende evenementen.</p>
    )}
  </div>
);

export default DashboardPage;