import React, { useState } from 'react';
import { questions } from '@/components/test/questionsData';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, BookOpen, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const LETTERS = ['a', 'b', 'c', 'd'];

// Regroupement par type de compétence (sans mention du niveau CECRL)
const SECTIONS_CANDIDAT = [
  {
    key: 'oral',
    title: 'PARTIE 1 — Compréhension Orale',
    subtitle: 'Le formateur lit chaque texte à voix haute, une seule fois.',
    icon: '🔊',
    illustration: 'https://media.base44.com/images/public/6940a01cdb0d5c582a8e789a/79b164113_generated_image.png',
    filter: q => q.category === 'Compréhension Orale',
  },
  {
    key: 'ecrite_comp',
    title: 'PARTIE 2 — Compréhension Écrite',
    subtitle: 'Lisez attentivement chaque texte encadré, puis répondez aux questions.',
    icon: '📖',
    illustration: 'https://media.base44.com/images/public/6940a01cdb0d5c582a8e789a/c07796924_generated_image.png',
    filter: q => q.category === 'Compréhension Écrite',
  },
  {
    key: 'grammaire',
    title: 'PARTIE 3 — Grammaire',
    subtitle: 'Lisez la phrase ou le dialogue, puis choisissez ou écrivez la bonne réponse.',
    icon: '📝',
    illustration: 'https://media.base44.com/images/public/6940a01cdb0d5c582a8e789a/e3aa81291_generated_image.png',
    filter: q => q.category === 'Grammaire',
  },
  {
    key: 'vocabulaire',
    title: 'PARTIE 4 — Vocabulaire & Situations Professionnelles',
    subtitle: 'Choisissez la bonne réponse.',
    icon: '🗣️',
    illustration: 'https://media.base44.com/images/public/6940a01cdb0d5c582a8e789a/92c82a9c8_generated_image.png',
    filter: q => (q.category === 'Vocabulaire' || q.category === 'Vocabulaire Professionnel' || q.category === 'Situations Professionnelles') && !q.type && q.options,
  },
  {
    key: 'expression_ecrite',
    title: 'PARTIE 5 — Production Écrite & Reformulation',
    subtitle: 'Rédigez votre réponse dans l\'espace prévu. Écrivez le plus complètement possible.',
    icon: '✍️',
    illustration: 'https://media.base44.com/images/public/6940a01cdb0d5c582a8e789a/52205a40b_generated_image.png',
    filter: q => q.type === 'written' || q.type === 'reformulate',
  },
];

// Pour la fiche formateur : toutes les questions (y compris orales)
const SECTIONS_FORMATEUR = [
  {
    key: 'oral_prod',
    title: 'Production Orale',
    filter: q => q.type === 'oral',
  },
  {
    key: 'oral_comp',
    title: 'Compréhension Orale',
    filter: q => q.category === 'Compréhension Orale',
  },
  {
    key: 'ecrit_comp',
    title: 'Compréhension Écrite',
    filter: q => q.category === 'Compréhension Écrite',
  },
  {
    key: 'grammaire',
    title: 'Grammaire',
    filter: q => q.category === 'Grammaire',
  },
  {
    key: 'vocabulaire',
    title: 'Vocabulaire & Situations Professionnelles',
    filter: q => (q.category === 'Vocabulaire' || q.category === 'Vocabulaire Professionnel' || q.category === 'Situations Professionnelles') && !q.type,
  },
  {
    key: 'expression_ecrite',
    title: 'Production Écrite',
    filter: q => q.type === 'written',
  },
];

const levelBadgeStyle = {
  A1: { bg: '#e6faf4', color: '#14532d', border: '#32cf8a' },
  A2: { bg: '#e0f7f5', color: '#134e4a', border: '#17c3b2' },
  B1: { bg: '#e0f2fe', color: '#0c4a6e', border: '#00b4d8' },
  B2: { bg: '#dbeafe', color: '#1e3a8a', border: '#0077b6' },
  C1: { bg: '#ede9fe', color: '#4c1d95', border: '#7c3aed' },
  C2: { bg: '#fce7f3', color: '#831843', border: '#9d174d' },
};

export default function PrintTest() {
  const [view, setView] = useState('candidat'); // 'candidat' | 'formateur'

  const handlePrint = () => window.print();

  // Construire les sections candidat avec numérotation globale continue (sans oral)
  let globalNum = 1;
  const candidatSections = SECTIONS_CANDIDAT.map(s => ({
    ...s,
    questions: questions.filter(s.filter).map(q => ({ ...q, num: globalNum++ })),
  })).filter(s => s.questions.length > 0);

  // Sections formateur
  const formateurSections = SECTIONS_FORMATEUR.map(s => ({
    ...s,
    questions: questions.filter(s.filter),
  })).filter(s => s.questions.length > 0);

  const totalQCM = questions.filter(q => q.options && !q.type).length;
  const totalEcrit = questions.filter(q => q.type === 'written').length;
  const totalOral = questions.filter(q => q.type === 'oral').length;

  return (
    <div>
      {/* Barre d'actions — masquée à l'impression */}
      <div className="no-print bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Version Papier — Test de Positionnement FLE</h1>
            <p className="text-sm text-gray-500">Choisissez le document à imprimer</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={view === 'candidat' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('candidat')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Cahier candidat
          </Button>
          <Button
            variant={view === 'formateur' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('formateur')}
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Fiche formateur
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 shadow"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* ===================== CAHIER CANDIDAT ===================== */}
      {view === 'candidat' && (
        <div className="print-area bg-white max-w-4xl mx-auto px-10 py-8">

          {/* En-tête */}
          <div className="flex items-center justify-between mb-6 border-b-2 border-gray-800 pb-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png"
              alt="ParlerEmploi Formation"
              style={{ height: '56px', objectFit: 'contain' }}
            />
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">TEST DE POSITIONNEMENT EN FRANÇAIS</div>
              <div className="text-sm text-gray-500 mt-1">Évaluation des compétences linguistiques</div>
            </div>
          </div>

          {/* Fiche candidat */}
          <div className="border border-gray-300 rounded p-4 mb-6 bg-gray-50">
            <div className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Vos informations</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[['Nom et prénom', ''], ['Date', ''], ['Email', ''], ['Téléphone', '']].map(([label]) => (
                <div key={label}>
                  <span className="text-sm text-gray-600">{label} :</span>
                  <div className="border-b border-gray-400 mt-1 h-6" />
                </div>
              ))}
            </div>
          </div>

          {/* Instructions candidat */}
          <div className="border border-gray-300 rounded p-4 mb-8 bg-white">
            <p className="text-sm font-bold text-gray-800 mb-2">📋 Comment répondre à ce test ?</p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc ml-5">
              <li>Ce test se fait <strong>en autonomie</strong>, sauf la Partie 1 (compréhension orale).</li>
              <li>Pour les <strong>QCM</strong> : cochez ou entourez la lettre de la réponse choisie.</li>
              <li><strong>Partie 1 — Compréhension Orale</strong> : le formateur lit le texte à voix haute, une seule fois.</li>
              <li><strong>Parties 2, 3, 4, 5</strong> : lisez les textes et consignes vous-même, répondez seul(e).</li>
              <li>Pour les <strong>phrases à compléter</strong> : choisissez parmi les options proposées.</li>
              <li>Pour la <strong>production écrite</strong> : écrivez dans l'espace prévu, le plus complètement possible.</li>
              <li>Il n'y a pas de limite de temps stricte, prenez le temps nécessaire.</li>
            </ul>
          </div>

          {/* Sections */}
          {candidatSections.map((section) => (
            <div key={section.key} className="mb-10">
              {/* Titre de section avec illustration */}
              <div className="rounded mb-4 overflow-hidden" style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                <div className="flex items-stretch">
                  <div className="flex-1 px-5 py-4">
                    <div className="font-bold text-xl text-gray-900 mb-1">{section.title}</div>
                    <div className="text-sm text-gray-600">{section.subtitle}</div>
                  </div>
                  {section.illustration && (
                    <div className="shrink-0" style={{ width: '140px' }}>
                      <img
                        src={section.illustration}
                        alt={section.title}
                        style={{ width: '140px', height: '110px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {section.questions.map((q) => {
                const isOral = q.category === 'Compréhension Orale';
                const isWritten = q.type === 'written';

                const isReformulate = q.type === 'reformulate';
                const isSafety = q.type === 'safety_instruction';
                const isScenario = q.type === 'scenario_tree';
                const isDialogue = q.type === 'complete_dialogue';

                const isFillBlank = q.type === 'fill_in_blank';
                const isEcrite = q.category === 'Compréhension Écrite';

                return (
                  <div key={q.id} className="mb-7 pl-1">
                    {/* Indicateur oral (formateur lit) */}
                    {isOral && (
                      <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded mb-2 inline-block">
                        🔊 Le formateur lit ce texte à voix haute : écoutez avant de répondre
                      </div>
                    )}

                    {/* Texte à lire en autonomie — Compréhension Écrite */}
                    {isEcrite && q.audioText && (
                      <div className="mb-3 ml-0">
                        <div className="bg-slate-50 border-l-4 border-[#17c3b2] rounded-r px-4 py-3">
                          <p className="text-xs font-bold text-[#00504e] uppercase tracking-wide mb-1">📖 Lisez attentivement :</p>
                          <p className="text-sm text-gray-900 italic leading-relaxed">« {q.audioText} »</p>
                        </div>
                      </div>
                    )}

                    {/* Fill in blank — affiche la phrase avec le blanc */}
                    {isFillBlank && q.template && (
                      <div className="mb-3 ml-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded px-4 py-2">
                          <p className="text-xs font-bold text-yellow-700 mb-1">Complétez :</p>
                          <p className="text-sm text-gray-900 font-medium">
                            {q.template.split('___').map((part, i, arr) => (
                              <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                  <span className="inline-block border-b-2 border-gray-700 w-16 mx-1 align-bottom" />
                                )}
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Safety icon */}
                    {isSafety && q.safetyLabel && (
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded px-3 py-2 mb-2 text-sm font-semibold text-amber-900">
                        <span className="text-2xl">{q.safetyIcon}</span>
                        <span>{q.safetyLabel}</span>
                      </div>
                    )}

                    {/* Scenario context */}
                    {isScenario && q.context && (
                      <div className="text-xs bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded mb-2 inline-block font-medium">
                        {q.context}
                      </div>
                    )}

                    {/* Dialogue complet */}
                    {isDialogue && q.dialogue && (
                      <div className="mb-3 ml-2 space-y-1.5 border-l-2 border-gray-300 pl-3">
                        {q.dialogue.map((line, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-bold text-gray-600">{line.speaker} :</span>{' '}
                            <span className="text-gray-800">
                              {line.text === '___'
                                ? <span className="inline-block border-b-2 border-gray-700 w-48 ml-1 align-bottom" />
                                : line.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reformulate original */}
                    {isReformulate && q.originalText && (
                      <div className="text-sm bg-orange-50 border border-orange-200 px-3 py-2 rounded mb-2 text-gray-800">
                        <span className="font-semibold text-orange-700">Phrase à reformuler : </span>
                        « {q.originalText} »
                      </div>
                    )}

                    {/* Question */}
                    <div className="flex items-start gap-2 mb-2">
                      <span className="font-bold text-gray-700 text-sm shrink-0 w-6">{q.num}.</span>
                      <p className="text-sm font-medium text-gray-900">{q.question}</p>
                    </div>

                    {/* Options QCM */}
                    {q.options && !isWritten && !isReformulate && (
                      <div className="ml-7 grid grid-cols-2 gap-x-6 gap-y-2">
                        {q.options.map((opt, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-800">
                            <span className="w-5 h-5 border border-gray-500 rounded shrink-0 mt-0.5" />
                            <span><span className="font-semibold text-gray-500">{LETTERS[i]})</span> {opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Production écrite ou reformulation */}
                    {(isWritten || isReformulate) && (
                      <div className="ml-7">
                        <div className="border border-gray-300 rounded mt-1" style={{ minHeight: isReformulate ? '60px' : '120px' }}>
                          {[...Array(isReformulate ? 3 : 6)].map((_, li) => (
                            <div key={li} className="border-b border-gray-200 h-7" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Pied de page */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
            ParlerEmploi Formation — Test de positionnement FLE — © {new Date().getFullYear()} —
            Médiathèque Persepolis, 4 av. Gabriel-Péri, 93400 Saint-Ouen-sur-Seine
          </div>
        </div>
      )}

      {/* ===================== FICHE FORMATEUR ===================== */}
      {view === 'formateur' && (
        <div className="print-area bg-white max-w-4xl mx-auto px-10 py-8">

          {/* En-tête formateur */}
          <div className="flex items-center justify-between mb-4 border-b-2 border-gray-800 pb-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png"
              alt="ParlerEmploi Formation"
              style={{ height: '48px', objectFit: 'contain' }}
            />
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">FICHE FORMATEUR — CORRIGÉ & GUIDE D'ÉVALUATION</div>
              <div className="text-xs text-red-600 font-semibold mt-1">⚠️ DOCUMENT CONFIDENTIEL — NE PAS DISTRIBUER AUX CANDIDATS</div>
            </div>
          </div>

          {/* Fiche session */}
          <div className="border border-gray-300 rounded p-4 mb-6 bg-gray-50">
            <div className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Informations de session</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[['Formateur', ''], ['Date', ''], ['Candidat', ''], ['Lieu', '']].map(([label]) => (
                <div key={label}>
                  <span className="text-sm text-gray-600">{label} :</span>
                  <div className="border-b border-gray-400 mt-1 h-6" />
                </div>
              ))}
            </div>
          </div>

          {/* Guide d'utilisation */}
          <div className="border border-[#17c3b2] rounded p-4 mb-6 bg-teal-50">
            <p className="text-sm font-bold text-gray-800 mb-2">📌 Guide d'utilisation de ce test</p>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
              <div>
                <p className="font-semibold mb-1">Déroulé recommandé :</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Accueillir le candidat, expliquer le cadre</li>
                  <li>Remettre le cahier candidat</li>
                  <li>Commencer par la <strong>Production Orale</strong> (hors feuille)</li>
                  <li>Passer aux parties écrites dans l'ordre du cahier</li>
                  <li>Compléter la grille d'observations en continu</li>
                  <li>Calculer le score et déterminer le niveau à la fin</li>
                </ol>
              </div>
              <div>
                <p className="font-semibold mb-1">Points d'attention :</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Ne pas souffler les réponses ni reformuler les questions</li>
                  <li>Pour la compréhension orale : lire lentement et distinctement, une seule fois</li>
                  <li>Observer l'aisance, pas seulement l'exactitude</li>
                  <li>Tenir compte du contexte migratoire / langue d'origine</li>
                  <li>Laisser le candidat aller au bout de ses réponses</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Barème */}
          <div className="border border-gray-300 rounded p-4 mb-6">
            <p className="text-sm font-bold text-gray-800 mb-3">Barème et correspondance CECRL</p>
            <div className="grid grid-cols-6 gap-2 text-xs text-center">
              {[
                { level: 'A1', range: '< 30%', bg: '#e6faf4', border: '#32cf8a', desc: 'Débutant' },
                { level: 'A2', range: '30–44%', bg: '#e0f7f5', border: '#17c3b2', desc: 'Élémentaire' },
                { level: 'B1', range: '45–64%', bg: '#e0f2fe', border: '#00b4d8', desc: 'Intermédiaire' },
                { level: 'B2', range: '65–79%', bg: '#dbeafe', border: '#0077b6', desc: 'Int. avancé' },
                { level: 'C1', range: '80–89%', bg: '#ede9fe', border: '#7c3aed', desc: 'Avancé' },
                { level: 'C2', range: '≥ 90%', bg: '#fce7f3', border: '#9d174d', desc: 'Maîtrise' },
              ].map(l => (
                <div key={l.level} className="rounded p-2" style={{ backgroundColor: l.bg, border: `2px solid ${l.border}` }}>
                  <div className="font-bold text-sm">{l.level}</div>
                  <div className="font-semibold">{l.range}</div>
                  <div className="text-gray-600">{l.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-gray-700 border-t border-gray-200 pt-3">
              <div>Score QCM : <span className="border-b border-gray-500 inline-block w-12" /> / {totalQCM}</div>
              <div>Score écrit : <span className="border-b border-gray-500 inline-block w-12" /> / {totalEcrit}</div>
              <div>Score oral : <span className="border-b border-gray-500 inline-block w-12" /> / {totalOral}</div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-gray-700">
              <div>Score total pondéré : <span className="border-b border-gray-500 inline-block w-16" /> / 100</div>
              <div>Niveau CECRL estimé : <span className="border-b border-gray-500 inline-block w-16" /></div>
            </div>
          </div>

          {/* ---- SECTION PRODUCTION ORALE ---- */}
          <div className="mb-8">
            <div className="bg-purple-700 text-white px-4 py-3 rounded mb-4">
              <div className="font-bold text-base">🎙️ Production Orale</div>
              <div className="text-xs text-purple-200 mt-0.5">À conduire en entretien direct avec le candidat, avant les épreuves écrites</div>
            </div>

            {questions.filter(q => q.type === 'oral').map((q, idx) => {
              const style = levelBadgeStyle[q.level] || levelBadgeStyle['A1'];
              return (
                <div key={q.id} className="mb-6 border border-gray-200 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                      {q.level}
                    </span>
                    <span className="text-xs text-gray-500">{q.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">🗣️ Consigne donnée au candidat : {q.question}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-700 mb-3">
                    <div>
                      <p className="font-semibold mb-1">Critères d'évaluation :</p>
                      <ul className="list-disc ml-4 space-y-0.5">
                        {q.criteria.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Grille d'observation :</p>
                      <div className="space-y-1">
                        {['Aisance & fluidité', 'Prononciation', 'Vocabulaire', 'Structures utilisées'].map(obs => (
                          <div key={obs} className="flex items-center gap-2">
                            <span className="w-28 shrink-0">{obs}</span>
                            <div className="flex gap-1">
                              {['1', '2', '3', '4', '5'].map(n => (
                                <span key={n} className="w-5 h-5 border border-gray-400 rounded-sm text-center text-xs flex items-center justify-center">{n}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mb-1">Observations :</div>
                  <div className="border border-gray-200 rounded" style={{ minHeight: '56px' }}>
                    {[...Array(3)].map((_, i) => <div key={i} className="border-b border-gray-100 h-6" />)}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs">
                    <span className="text-gray-600">Score : </span>
                    <span className="border-b border-gray-400 w-10 inline-block" /> / 5
                    <span className="text-gray-600 ml-4">Niveau estimé : </span>
                    <span className="border-b border-gray-400 w-10 inline-block" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---- CORRIGÉS AUTRES SECTIONS ---- */}
          {formateurSections.filter(s => s.key !== 'oral_prod').map((section) => (
            <div key={section.key} className="mb-8">
              <div className="bg-gray-700 text-white px-4 py-2 rounded mb-3 font-bold text-sm">
                ✅ Corrigé — {section.title}
              </div>

              {section.questions.map((q, idx) => {
                const style = levelBadgeStyle[q.level] || levelBadgeStyle['A1'];
                const isWritten = q.type === 'written';
                const isOral = q.category === 'Compréhension Orale';

                return (
                  <div key={q.id} className="mb-4 border-l-4 pl-3 py-1" style={{ borderColor: style.border }}>
                    <div className="flex items-start gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: style.bg, color: style.color }}>
                        {q.level}
                      </span>
                      <span className="text-xs text-gray-500">{q.category}</span>
                      {isOral && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">🔊 Texte à lire : « {q.audioText} »</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 mb-1">{q.question}</p>

                    {/* Réponse correcte pour QCM */}
                    {q.correct && (
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="font-semibold text-green-700">✓ Bonne réponse :</span>
                        <span className="bg-green-50 border border-green-200 text-green-800 px-2 py-0.5 rounded">{q.correct}</span>
                        {q.explanation && (
                          <span className="text-gray-500 italic">— {q.explanation}</span>
                        )}
                      </div>
                    )}

                    {/* Production écrite : critères + observations */}
                    {isWritten && (
                      <div className="mt-1">
                        <div className="text-xs text-gray-600 mb-1">
                          <span className="font-semibold">Critères :</span> {q.criteria?.join(' • ')}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="font-semibold text-gray-700 mb-1">Propositions d'observation :</p>
                            <div className="space-y-1">
                              {[
                                'Répond à la consigne',
                                'Vocabulaire adapté au niveau',
                                'Structures grammaticales correctes',
                                'Cohérence et organisation',
                                'Originalité / richesse du contenu',
                              ].map(obs => (
                                <div key={obs} className="flex items-center gap-2">
                                  <span className="w-5 h-5 border border-gray-400 rounded shrink-0" />
                                  <span>{obs}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700 mb-1">Commentaire :</p>
                            <div className="border border-gray-200 rounded" style={{ minHeight: '80px' }}>
                              {[...Array(4)].map((_, i) => <div key={i} className="border-b border-gray-100 h-6" />)}
                            </div>
                            <div className="mt-1 text-xs text-gray-600">
                              Score : <span className="border-b border-gray-400 w-10 inline-block" /> / 5
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Grille d'observations globales */}
          <div className="border-2 border-gray-800 rounded p-4 mb-6 mt-8">
            <div className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">🗒️ Observations globales du formateur</div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-700 mb-4">
              {[
                ['Communication Orale', ['Exprime des besoins simples', 'Compris sans effort', 'Interagit spontanément', 'Argumente et nuance', 'Maîtrise de registres variés']],
                ['Communication Écrite', ['Compréhension de textes simples', 'Repère les informations clés', 'Comprend des textes complexes', 'Analyse les implicites', 'Lecture critique et littéraire']],
                ['Production Orale', ['Phrases simples et courtes', 'Enchaîne les idées', 'S\'exprime avec aisance', 'Discours structuré', 'Maîtrise stylistique']],
                ['Production Écrite', ['Phrases simples correctes', 'Texte cohérent court', 'Rédaction structurée', 'Argumentation développée', 'Style soutenu et précis']],
              ].map(([domaine, items]) => (
                <div key={domaine} className="border border-gray-200 rounded p-3">
                  <p className="font-bold text-gray-800 mb-2">{domaine}</p>
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <span className="w-4 h-4 border border-gray-400 rounded shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">Points forts identifiés :</p>
              <div className="border border-gray-200 rounded" style={{ minHeight: '48px' }}>
                {[...Array(3)].map((_, i) => <div key={i} className="border-b border-gray-100 h-7" />)}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">Axes de progression prioritaires :</p>
              <div className="border border-gray-200 rounded" style={{ minHeight: '48px' }}>
                {[...Array(3)].map((_, i) => <div key={i} className="border-b border-gray-100 h-7" />)}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">Contexte / langue(s) d'origine / parcours migratoire :</p>
              <div className="border border-gray-200 rounded" style={{ minHeight: '36px' }}>
                {[...Array(2)].map((_, i) => <div key={i} className="border-b border-gray-100 h-7" />)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200 text-sm">
              <div>Score QCM : <span className="border-b border-gray-500 inline-block w-12" /> / {totalQCM}</div>
              <div>Score oral : <span className="border-b border-gray-500 inline-block w-12" /> / {totalOral * 5}</div>
              <div>Score écrit : <span className="border-b border-gray-500 inline-block w-12" /> / {totalEcrit * 5}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2 text-sm font-semibold">
              <div>Niveau CECRL estimé : <span className="border-b border-gray-500 inline-block w-16" /></div>
              <div>Formation recommandée : <span className="border-b border-gray-500 inline-block w-24" /></div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
              <span>Signature formateur :</span>
              <div className="border-b border-gray-400 flex-1" style={{ height: '24px' }} />
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
            ParlerEmploi Formation — Fiche formateur confidentielle — © {new Date().getFullYear()} —
            Médiathèque Persepolis, 4 av. Gabriel-Péri, 93400 Saint-Ouen-sur-Seine — contact@parleremploi.com
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { max-width: 100% !important; margin: 0 !important; padding: 20px !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}