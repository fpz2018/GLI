import React, { useState } from 'react';

const VerwijzersToolPage = () => {
  const [currentStep, setCurrentStep] = useState('criteria');
  const [triageData, setTriageData] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  // Inclusiecriteria per programma
  const inclusiecriteria = {
    beweegkuur: {
      titel: "BeweegKuur",
      color: "emerald",
      inclusie: [
        "Diabetes mellitus type 2 (HbA1c ≥ 7,0% of 53 mmol/mol)",
        "Hart- en vaatziekten (CVD)",
        "BMI ≥ 25 kg/m² met co-morbiditeit",
        "BMI ≥ 30 kg/m² zonder co-morbiditeit",
        "Leeftijd 18-70 jaar",
        "Gemotiveerd voor leefstijlverandering"
      ],
      exclusie: [
        "Ernstige psychiatrische aandoeningen",
        "Actieve verslavingsproblematiek",
        "Onvoldoende mobiliteit voor groepsactiviteiten",
        "Terminale ziekte met levensverwachting < 1 jaar"
      ],
      duur: "24 maanden",
      intensiteit: "Hoog - wekelijkse begeleiding"
    },
    cool: {
      titel: "COOL (Coaching op Leefstijl)",
      color: "blue",
      inclusie: [
        "BMI ≥ 23 kg/m²",
        "Leeftijd 18+ jaar",
        "Intrinsieke motivatie voor gedragsverandering",
        "Geen intensieve medische begeleiding nodig",
        "Voorkeur voor zelfstandig beweegplan"
      ],
      exclusie: [
        "Ernstige eetstoornis",
        "Actieve verslavingsproblematiek",
        "Onvoldoende Nederlands voor groepssessies",
        "Geen eigen verantwoordelijkheid willen nemen"
      ],
      duur: "24 maanden",
      intensiteit: "Gemiddeld - tweewekelijkse coaching"
    },
    slimmer: {
      titel: "SLIMMER (Diabetes Preventie)",
      color: "purple",
      inclusie: [
        "Verhoogd risico diabetes type 2 (pre-diabetes)",
        "BMI ≥ 25 kg/m²",
        "Leeftijd 40-70 jaar",
        "Nuchtere glucose 6,1-6,9 mmol/L OF HbA1c 5,7-6,4%",
        "Familiegeschiedenis diabetes type 2"
      ],
      exclusie: [
        "Reeds gediagnosticeerde diabetes",
        "Ernstige nierinsufficiëntie",
        "Zwangerschap",
        "Gebruik van glucose-beïnvloedende medicatie"
      ],
      duur: "24 maanden",
      intensiteit: "Gemiddeld - maandelijkse monitoring"
    }
  };

  // Triagefragen
  const triageVragen = [
    {
      id: 'medische_conditie',
      vraag: 'Wat is de primaire medische conditie van de patiënt?',
      type: 'single',
      opties: [
        { value: 'diabetes2', label: 'Diabetes type 2 (HbA1c ≥ 7,0%)', score: { beweegkuur: 3, slimmer: 1, cool: 1 } },
        { value: 'cvd', label: 'Hart- en vaatziekten', score: { beweegkuur: 3, slimmer: 1, cool: 1 } },
        { value: 'prediabetes', label: 'Pre-diabetes/verhoogd risico', score: { slimmer: 3, beweegkuur: 2, cool: 1 } },
        { value: 'overgewicht', label: 'Overgewicht zonder co-morbiditeit', score: { cool: 2, beweegkuur: 2, slimmer: 1 } },
        { value: 'preventie', label: 'Preventie/algemene gezondheid', score: { cool: 3, slimmer: 2, beweegkuur: 1 } }
      ]
    },
    {
      id: 'bmi',
      vraag: 'Wat is de BMI van de patiënt?',
      type: 'single',
      opties: [
        { value: 'bmi_23_25', label: '23-25 kg/m²', score: { cool: 2, slimmer: 1, beweegkuur: 0 } },
        { value: 'bmi_25_30', label: '25-30 kg/m²', score: { beweegkuur: 2, slimmer: 2, cool: 2 } },
        { value: 'bmi_30_plus', label: '≥ 30 kg/m²', score: { beweegkuur: 3, cool: 2, slimmer: 2 } }
      ]
    },
    {
      id: 'leeftijd',
      vraag: 'Wat is de leeftijd van de patiënt?',
      type: 'single',
      opties: [
        { value: 'jong', label: '18-40 jaar', score: { cool: 2, beweegkuur: 1, slimmer: 1 } },
        { value: 'middelbaar', label: '40-60 jaar', score: { slimmer: 3, beweegkuur: 2, cool: 2 } },
        { value: 'ouder', label: '60+ jaar', score: { beweegkuur: 3, slimmer: 2, cool: 1 } }
      ]
    },
    {
      id: 'motivatie',
      vraag: 'Hoe is de motivatie van de patiënt?',
      type: 'single',
      opties: [
        { value: 'hoog', label: 'Zeer gemotiveerd, wil intensieve begeleiding', score: { beweegkuur: 3, slimmer: 2, cool: 1 } },
        { value: 'gemiddeld', label: 'Gemotiveerd, voorkeur voor begeleiding', score: { slimmer: 3, cool: 2, beweegkuur: 2 } },
        { value: 'zelfstandig', label: 'Gemotiveerd, wil zelfstandig werken', score: { cool: 3, slimmer: 1, beweegkuur: 1 } }
      ]
    },
    {
      id: 'beweging',
      vraag: 'Wat is de huidige bewegingsactiviteit?',
      type: 'single',
      opties: [
        { value: 'inactief', label: 'Nauwelijks actief, heeft structuur nodig', score: { beweegkuur: 3, slimmer: 2, cool: 1 } },
        { value: 'licht_actief', label: 'Licht actief, wil meer bewegen', score: { beweegkuur: 2, slimmer: 2, cool: 2 } },
        { value: 'actief', label: 'Redelijk actief, wil optimaliseren', score: { cool: 3, slimmer: 2, beweegkuur: 1 } }
      ]
    },
    {
      id: 'begeleidingsbehoefte',
      vraag: 'Wat voor begeleiding heeft de patiënt nodig?',
      type: 'single',
      opties: [
        { value: 'intensief', label: 'Intensieve medische begeleiding', score: { beweegkuur: 3, slimmer: 1, cool: 0 } },
        { value: 'regelmatig', label: 'Regelmatige coaching en monitoring', score: { slimmer: 3, beweegkuur: 2, cool: 2 } },
        { value: 'beperkt', label: 'Beperkte begeleiding, meer zelfstandigheid', score: { cool: 3, slimmer: 1, beweegkuur: 1 } }
      ]
    }
  ];

  const calculateRecommendation = (answers) => {
    const scores = { beweegkuur: 0, cool: 0, slimmer: 0 };
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const vraag = triageVragen.find(q => q.id === questionId);
      if (vraag && answer) {
        const optie = vraag.opties.find(o => o.value === answer);
        if (optie) {
          Object.entries(optie.score).forEach(([program, score]) => {
            scores[program] += score;
          });
        }
      }
    });

    // Sorteer programma's op score
    const sorted = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .map(([program, score]) => ({ program, score }));

    return {
      primary: sorted[0],
      secondary: sorted[1],
      scores: scores,
      allAnswered: Object.keys(answers).length === triageVragen.length
    };
  };

  const handleTriageAnswer = (questionId, answer) => {
    const newData = { ...triageData, [questionId]: answer };
    setTriageData(newData);
    
    if (Object.keys(newData).length === triageVragen.length) {
      const rec = calculateRecommendation(newData);
      setRecommendation(rec);
    }
  };

  const resetTriage = () => {
    setTriageData({});
    setRecommendation(null);
    setCurrentStep('triage');
  };

  const getProgramColor = (program) => {
    switch(program) {
      case 'beweegkuur': return 'emerald';
      case 'cool': return 'blue';
      case 'slimmer': return 'purple';
      default: return 'gray';
    }
  };

  const getProgramNaam = (program) => {
    switch(program) {
      case 'beweegkuur': return 'BeweegKuur';
      case 'cool': return 'COOL';
      case 'slimmer': return 'SLIMMER';
      default: return program;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="verwijzers-title">
              GLI Verwijzerstool
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Hulpmiddel voor huisartsen en verwijzers om patiënten naar het juiste 
              GLI programma te verwijzen. Inclusiecriteria, triagetool en doorverwijsinstructies.
            </p>
            
            {/* Dikke Disclaimer */}
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-2xl font-bold text-yellow-800">⚕️ ALLEEN VOOR ZORGVERLENERS</h3>
              </div>
              <div className="text-yellow-800 text-lg space-y-2">
                <p className="font-semibold">
                  Deze tool is uitsluitend bedoeld voor huisartsen, praktijkondersteuners en andere zorgverleners
                </p>
                <p className="text-base">
                  • Gebruik deze tool alleen voor professionele medische besluitvorming<br/>
                  • Niet bedoeld voor patiënten of algemene informatiedoeleinden<br/>
                  • Altijd eigen medische expertise gebruiken bij verwijsbeslissingen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Steps */}
      <section className="bg-white border-b">
        <div className="container py-6">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => setCurrentStep('criteria')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 'criteria' 
                  ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
              data-testid="step-criteria"
            >
              <span className="w-6 h-6 rounded-full bg-current text-white text-sm flex items-center justify-center">1</span>
              <span>Inclusiecriteria</span>
            </button>
            
            <button
              onClick={() => setCurrentStep('triage')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 'triage' 
                  ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
              data-testid="step-triage"
            >
              <span className="w-6 h-6 rounded-full bg-current text-white text-sm flex items-center justify-center">2</span>
              <span>Triagetool</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          {currentStep === 'criteria' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Inclusiecriteria GLI Programma's</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                  Overzicht van de inclusie- en exclusiecriteria per GLI programma. 
                  Controleer eerst of uw patiënt geschikt is voordat u de triagetool gebruikt.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                  <p className="text-blue-800 text-sm">
                    <strong>🩺 Voor zorgverleners:</strong> Deze criteria zijn richtlijnen. 
                    Gebruik uw medische expertise bij twijfelgevallen en overleg indien nodig met GLI coördinatoren.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {Object.entries(inclusiecriteria).map(([key, criteria]) => (
                  <div key={key} className={`card bg-${criteria.color}-50 border-${criteria.color}-200 border-2`} data-testid={`criteria-${key}`}>
                    <div className="p-6">
                      <div className={`w-12 h-12 bg-${criteria.color}-600 rounded-lg flex items-center justify-center mb-4`}>
                        <span className="text-white font-bold text-xl">{criteria.titel[0]}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4">{criteria.titel}</h3>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Duur:</strong> {criteria.duur} | <strong>Intensiteit:</strong> {criteria.intensiteit}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Inclusiecriteria
                        </h4>
                        <ul className="space-y-2">
                          {criteria.inclusie.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Exclusiecriteria
                        </h4>
                        <ul className="space-y-2">
                          {criteria.exclusie.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setCurrentStep('triage')}
                  className="btn btn-primary text-lg px-8 py-4"
                  data-testid="go-to-triage-btn"
                >
                  Start Triagetool →
                </button>
              </div>
            </div>
          )}

          {currentStep === 'triage' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">GLI Triagetool</h2>
                <p className="text-lg text-gray-600">
                  Beantwoord de vragen over uw patiënt om een gepersonaliseerde programma-aanbeveling te krijgen.
                </p>
              </div>

              {/* Extra Disclaimer voor Triagetool */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-8">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-red-800 mb-2">⚕️ Professionele Verantwoordelijkheid</h3>
                    <p className="text-red-700 text-sm">
                      <strong>Deze tool geeft alleen een indicatie.</strong> Als zorgverlener blijft u volledig verantwoordelijk 
                      voor de medische beoordeling en verwijsbeslissing. Gebruik altijd uw eigen professionele expertise 
                      en houd rekening met de individuele situatie van de patiënt.
                    </p>
                  </div>
                </div>
              </div>

              {!recommendation ? (
                <div className="space-y-8">
                  {triageVragen.map((vraag, index) => (
                    <div key={vraag.id} className="card p-6" data-testid={`question-${vraag.id}`}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          triageData[vraag.id] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-4">{vraag.vraag}</h3>
                          
                          <div className="space-y-3">
                            {vraag.opties.map((optie) => (
                              <label key={optie.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                <input
                                  type="radio"
                                  name={vraag.id}
                                  value={optie.value}
                                  checked={triageData[vraag.id] === optie.value}
                                  onChange={(e) => handleTriageAnswer(vraag.id, e.target.value)}
                                  className="w-4 h-4 text-indigo-600"
                                />
                                <span className="text-gray-800">{optie.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-4">
                      Vraag {Object.keys(triageData).length} van {triageVragen.length} beantwoord
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(Object.keys(triageData).length / triageVragen.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Aanbeveling Gereed</h3>
                    <p className="text-gray-600">Gebaseerd op de gegeven antwoorden hebben we het beste programma bepaald.</p>
                  </div>

                  {/* Primary Recommendation */}
                  <div className={`card bg-${getProgramColor(recommendation.primary.program)}-50 border-${getProgramColor(recommendation.primary.program)}-200 border-2`} data-testid="primary-recommendation">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">🎯 Primaire Aanbeveling</h3>
                        <div className={`px-3 py-1 bg-${getProgramColor(recommendation.primary.program)}-600 text-white rounded-full text-sm font-semibold`}>
                          Score: {recommendation.primary.score}
                        </div>
                      </div>
                      
                      <div className={`w-12 h-12 bg-${getProgramColor(recommendation.primary.program)}-600 rounded-lg flex items-center justify-center mb-4`}>
                        <span className="text-white font-bold text-xl">{getProgramNaam(recommendation.primary.program)[0]}</span>
                      </div>
                      
                      <h4 className="text-2xl font-bold mb-4">{getProgramNaam(recommendation.primary.program)}</h4>
                      
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <h5 className="font-semibold mb-2">Waarom dit programma?</h5>
                        <p className="text-sm text-gray-700">
                          {recommendation.primary.program === 'beweegkuur' && 
                            "De patiënt heeft medische aandoeningen die intensieve begeleiding vereisen met focus op beweging en medische monitoring."
                          }
                          {recommendation.primary.program === 'cool' && 
                            "De patiënt is gemotiveerd voor gedragsverandering en heeft behoefte aan coaching op leefstijl met meer zelfstandigheid."
                          }
                          {recommendation.primary.program === 'slimmer' && 
                            "De patiënt heeft verhoogd risico op diabetes type 2 en zou baat hebben bij diabetes preventie programma."
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Option */}
                  {recommendation.secondary.score > 0 && (
                    <div className={`card bg-${getProgramColor(recommendation.secondary.program)}-50 border-${getProgramColor(recommendation.secondary.program)}-200 border`} data-testid="secondary-recommendation">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">💡 Alternatieve Optie</h3>
                          <div className={`px-3 py-1 bg-${getProgramColor(recommendation.secondary.program)}-500 text-white rounded-full text-sm`}>
                            Score: {recommendation.secondary.score}
                          </div>
                        </div>
                        <h4 className="text-xl font-bold">{getProgramNaam(recommendation.secondary.program)}</h4>
                        <p className="text-sm text-gray-600 mt-2">
                          Ook geschikt als alternatief, bespreek met de patiënt welke voorkeur heeft.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="card p-6" data-testid="next-steps">
                    <h3 className="text-xl font-bold mb-4">📋 Volgende Stappen</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                        <div>
                          <h4 className="font-semibold">Bespreek met patiënt</h4>
                          <p className="text-sm text-gray-600">Leg de aanbeveling uit en controleer motivatie en verwachtingen.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                        <div>
                          <h4 className="font-semibold">Verwijs via VIP Live</h4>
                          <p className="text-sm text-gray-600">Selecteer 'GLI-verwijzing' en het aanbevolen programma. Vermeld BMI en co-morbiditeiten.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                        <div>
                          <h4 className="font-semibold">Follow-up plannen</h4>
                          <p className="text-sm text-gray-600">Maak een afspraak na 3 maanden om voortgang te evalueren.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={resetTriage}
                      className="btn btn-outline"
                      data-testid="reset-triage-btn"
                    >
                      Nieuwe Patiënt
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="btn btn-primary"
                      data-testid="print-recommendation-btn"
                    >
                      Print Aanbeveling
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Info voor Verwijzers */}
      <section className="section bg-indigo-50">
        <div className="container">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Vragen over GLI Verwijzingen?</h3>
            <p className="text-gray-700 mb-6">
              Voor vragen over de GLI programma's of verwijzingsprocedures kunt u contact opnemen met onze GLI coördinatoren.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:gli-coordinatie@zorg4zeist.nl" 
                className="btn btn-primary"
                data-testid="contact-coordinators-btn"
              >
                E-mail GLI Coördinatoren
              </a>
              <a 
                href="tel:+31302345678" 
                className="btn btn-secondary"
                data-testid="call-coordinators-btn"
              >
                Bel: 030-234 5678
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VerwijzersToolPage;