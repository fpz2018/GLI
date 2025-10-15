import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GLIGroepenPage = () => {
  const { user } = useAuth();
  const [groepen, setGroepen] = useState([]);
  const [filteredGroepen, setFilteredGroepen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('alle');
  const [selectedStatus, setSelectedStatus] = useState('alle');
  const [selectedAanbieder, setSelectedAanbieder] = useState('alle');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchGroepen();
    fetchStatistics();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [groepen, selectedType, selectedStatus, selectedAanbieder]);

  const fetchGroepen = async () => {
    try {
      const response = await axios.get(`${API}/gli-groepen/`);
      setGroepen(response.data);
    } catch (error) {
      console.error('Error fetching GLI groepen:', error);
    }
    setLoading(false);
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API}/gli-groepen/statistieken`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const applyFilters = () => {
    let filtered = groepen;
    
    if (selectedType !== 'alle') {
      filtered = filtered.filter(groep => groep.type_gli === selectedType);
    }
    
    if (selectedStatus !== 'alle') {
      filtered = filtered.filter(groep => groep.status === selectedStatus);
    }
    
    if (selectedAanbieder !== 'alle') {
      filtered = filtered.filter(groep => groep.gli_aanbieder === selectedAanbieder);
    }
    
    setFilteredGroepen(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Beschikbaar': return 'bg-green-100 text-green-800';
      case 'In planning': return 'bg-blue-100 text-blue-800';
      case 'Vol': return 'bg-red-100 text-red-800';
      case 'Gestart': return 'bg-yellow-100 text-yellow-800';
      case 'Afgerond': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Beweegkuur': return 'bg-emerald-100 text-emerald-800';
      case 'Cool': return 'bg-blue-100 text-blue-800';
      case 'Slimmer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Niet opgegeven';
    return new Date(dateString).toLocaleDateString('nl-NL');
  };

  const uniqueAanbieders = [...new Set(groepen.map(g => g.gli_aanbieder))];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="groepen-title">
              GLI Groepen in Zeist
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Overzicht van alle beschikbare GLI groepen en hun planning. 
              Vind de juiste groep voor uw leefstijlinterventie.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {statistics && (
        <section className="section bg-white">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-8">Overzicht GLI Groepen</h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6 bg-emerald-50 rounded-xl" data-testid="stat-totaal">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{statistics.total_groepen}</div>
                <div className="text-emerald-700 font-medium">Totaal Groepen</div>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-xl" data-testid="stat-actief">
                <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.actieve_groepen}</div>
                <div className="text-blue-700 font-medium">Actieve Groepen</div>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-xl" data-testid="stat-planning">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{statistics.geplande_groepen}</div>
                <div className="text-yellow-700 font-medium">In Planning</div>
              </div>
              
              <div className="text-center p-6 bg-red-50 rounded-xl" data-testid="stat-vol">
                <div className="text-3xl font-bold text-red-600 mb-2">{statistics.volle_groepen}</div>
                <div className="text-red-700 font-medium">Volle Groepen</div>
              </div>
            </div>

            {/* Program type breakdown */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Verdeling per Programma Type</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(statistics.per_type).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className={`px-3 py-1 rounded-full text-sm ${getTypeColor(type)}`}>
                      {type}
                    </span>
                    <span className="font-semibold">{count} groepen</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters and Groups Section */}
      <section className="section">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-1/4">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4" data-testid="filters-title">
                  Filters
                </h2>
                
                {/* GLI Type Filter */}
                <div className="mb-6">
                  <label className="form-label">GLI Type</label>
                  <select 
                    className="form-input"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    data-testid="type-filter"
                  >
                    <option value="alle">Alle types</option>
                    <option value="Beweegkuur">Beweegkuur</option>
                    <option value="Cool">Cool</option>
                    <option value="Slimmer">Slimmer</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    data-testid="status-filter"
                  >
                    <option value="alle">Alle statussen</option>
                    <option value="Beschikbaar">Beschikbaar</option>
                    <option value="In planning">In planning</option>
                    <option value="Vol">Vol</option>
                    <option value="Gestart">Gestart</option>
                    <option value="Afgerond">Afgerond</option>
                  </select>
                </div>

                {/* Aanbieder Filter */}
                <div className="mb-6">
                  <label className="form-label">Aanbieder</label>
                  <select 
                    className="form-input"
                    value={selectedAanbieder}
                    onChange={(e) => setSelectedAanbieder(e.target.value)}
                    data-testid="aanbieder-filter"
                  >
                    <option value="alle">Alle aanbieders</option>
                    {uniqueAanbieders.map(aanbieder => (
                      <option key={aanbieder} value={aanbieder}>{aanbieder}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSelectedType('alle');
                    setSelectedStatus('alle'); 
                    setSelectedAanbieder('alle');
                  }}
                  className="w-full btn btn-outline text-sm"
                  data-testid="clear-filters-btn"
                >
                  Wis Filters
                </button>

                {/* Add group button for professionals */}
                {user && (user.role === 'professional' || user.role === 'admin') && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="w-full btn btn-primary text-sm"
                      data-testid="add-group-btn"
                    >
                      + Nieuwe Groep
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Groups List */}
            <div className="lg:w-3/4">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  GLI Groepen ({filteredGroepen.length})
                </h2>
                <button
                  onClick={fetchGroepen}
                  className="btn btn-outline text-sm"
                  data-testid="refresh-btn"
                >
                  Ververs
                </button>
              </div>

              {filteredGroepen.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6" data-testid="groepen-list">
                  {filteredGroepen.map((groep) => (
                    <GroepCard key={groep.id} groep={groep} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" data-testid="no-groups-message">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Geen groepen gevonden
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Er zijn geen groepen die voldoen aan de geselecteerde filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedType('alle');
                      setSelectedStatus('alle');
                      setSelectedAanbieder('alle');
                    }}
                    className="btn btn-primary"
                  >
                    Toon alle groepen
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const GroepCard = ({ groep }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Beschikbaar': return 'bg-green-100 text-green-800 border-green-200';
      case 'In planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Vol': return 'bg-red-100 text-red-800 border-red-200';
      case 'Gestart': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Afgerond': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Beweegkuur': return 'bg-emerald-50 border-emerald-200';
      case 'Cool': return 'bg-blue-50 border-blue-200';
      case 'Slimmer': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Niet opgegeven';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`card card-hover ${getTypeColor(groep.type_gli)} border-2`} data-testid={`groep-card-${groep.id}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">
              {groep.type_gli} - Groep {groep.groepnummer}
            </h3>
            <p className="text-gray-600 font-medium">{groep.gli_aanbieder}</p>
          </div>
          <span className={`status-badge ${getStatusColor(groep.status)} border`}>
            {groep.status}
          </span>
        </div>

        {/* Dates */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Start:</span>
            <span className="ml-2">{formatDate(groep.startdatum_groep)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Eind:</span>
            <span className="ml-2">{formatDate(groep.einddatum_groep)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {groep.status === 'Beschikbaar' && (
            <button className="btn btn-primary text-sm flex-1">
              Meer info
            </button>
          )}
          {groep.status === 'In planning' && (
            <button className="btn btn-outline text-sm flex-1">
              Binnenkort beschikbaar
            </button>
          )}
          {groep.status === 'Vol' && (
            <button className="btn btn-outline text-sm flex-1" disabled>
              Volzet
            </button>
          )}
        </div>

        {/* Footer with creation date */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Toegevoegd: {new Date(groep.created_time).toLocaleDateString('nl-NL')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GLIGroepenPage;