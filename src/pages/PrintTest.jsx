import React, { useRef } from 'react';
import { questions } from '@/components/test/questionsData';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const levelColors = {
  A1: '#32cf8a',
  A2: '#17c3b2',
  B1: '#00b4d8',
  B2: '#0077b6',
  C1: '#7c3aed',
  C2: '#9d174d',
};

const levelLabels = {
  A1: 'Niveau A1 — Débutant',
  A2: 'Niveau A2 — Élémentaire',
  B1: 'Niveau B1 — Intermédiaire',
  B2: 'Niveau B2 — Intermédiaire avancé',
  C1: 'Niveau C1 — Avancé',
  C2: 'Niveau C2 — Maîtrise',
};

const LETTERS = ['a', 'b', 'c', 'd'];

export default function PrintTest() {
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  // Regrouper par niveau, exclure les oraux (non adaptables papier)
  const questionsByLevel = {};
  LEVELS.forEach(lvl => {
    questionsByLevel[lvl] = questions.filter(
      q => q.level === lvl && q.type !== 'oral'
    );
  });

  let globalNumber = 1;

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
            <h1 className="text-lg font-bold text-gray-900">Test de Positionnement — Version Papier</h1>
            <p className="text-sm text-gray-500">Aperçu avant impression</p>
          </div>
        </div>
        <Button
          onClick={handlePrint}
          className="bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 shadow"
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimer / Enregistrer en PDF
        </Button>
      </div>

      {/* Document imprimable */}
      <div ref={printRef} className="print-area bg-white max-w-4xl mx-auto px-10 py-8">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-2 border-b-2 border-gray-800 pb-4">
          <div>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png"
              alt="ParlerEmploi Formation"
              style={{ height: '56px', objectFit: 'contain' }}
            />
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">TEST DE POSITIONNEMENT</div>
            <div className="text-sm text-gray-600">Français Langue Étrangère (FLE) — CECRL A1 à C2</div>
          </div>
        </div>

        {/* Fiche candidat */}
        <div className="border border-gray-300 rounded p-4 mb-6 bg-gray-50">
          <div className="font-semibold text-gray-800 mb-3">INFORMATIONS CANDIDAT</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Nom et prénom : </span>
              <div className="border-b border-gray-400 mt-1 h-6" />
            </div>
            <div>
              <span className="text-sm text-gray-600">Date : </span>
              <div className="border-b border-gray-400 mt-1 h-6" />
            </div>
            <div>
              <span className="text-sm text-gray-600">Email : </span>
              <div className="border-b border-gray-400 mt-1 h-6" />
            </div>
            <div>
              <span className="text-sm text-gray-600">Téléphone : </span>
              <div className="border-b border-gray-400 mt-1 h-6" />
            </div>
          </div>
        </div>

        {/* Instructions générales */}
        <div className="border-l-4 border-[#17c3b2] pl-4 mb-6 bg-teal-50 py-3 pr-3 rounded-r">
          <p className="text-sm font-semibold text-gray-800 mb-1">Instructions :</p>
          <ul className="text-sm text-gray-700 space-y-1 list-disc ml-4">
            <li>Pour les <strong>QCM</strong>, entourez ou cochez la lettre de la bonne réponse.</li>
            <li>Pour les questions de <strong>Compréhension Orale</strong>, le formateur lit le texte à voix haute une seule fois avant de poser la question.</li>
            <li>Pour les questions d'<strong>Expression Écrite</strong>, rédigez votre réponse dans l'espace prévu.</li>
            <li>Ne revenez pas sur une question une fois passée.</li>
            <li>Durée estimée : 45 minutes.</li>
          </ul>
        </div>

        {/* Questions par niveau */}
        {LEVELS.map(level => {
          const qs = questionsByLevel[level];
          if (!qs || qs.length === 0) return null;
          const color = levelColors[level];

          return (
            <div key={level} className="mb-8">
              {/* En-tête de section */}
              <div
                className="flex items-center gap-3 px-4 py-3 rounded mb-4"
                style={{ backgroundColor: color + '18', borderLeft: `5px solid ${color}` }}
              >
                <span
                  className="text-white text-sm font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: color }}
                >
                  {level}
                </span>
                <span className="font-bold text-gray-800">{levelLabels[level]}</span>
              </div>

              {qs.map((q) => {
                const num = globalNumber++;
                const isOral = q.category === 'Compréhension Orale';
                const isWritten = q.type === 'written';

                return (
                  <div key={q.id} className="mb-5 pl-2">
                    {/* Numéro + catégorie */}
                    <div className="flex items-start gap-2 mb-1">
                      <span
                        className="font-bold text-sm shrink-0 mt-0.5"
                        style={{ color }}
                      >
                        {num}.
                      </span>
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium mr-2">
                          [{q.category}]
                        </span>
                        {isOral && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium mr-2">
                            🔊 Le formateur lit à voix haute
                          </span>
                        )}
                        {/* Texte audio affiché uniquement pour le formateur */}
                        {isOral && q.audioText && (
                          <div className="mt-1 mb-2 text-xs italic text-gray-400 border border-dashed border-gray-300 rounded px-3 py-1 bg-gray-50 inline-block">
                            <span className="font-semibold not-italic text-gray-500">Formateur lit :</span> « {q.audioText} »
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Texte de la question */}
                    <p className="text-sm font-medium text-gray-900 mb-2 ml-5">{q.question}</p>

                    {/* Options QCM */}
                    {q.options && !isWritten && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 ml-5">
                        {q.options.map((opt, i) => (
                          <label key={i} className="flex items-start gap-2 text-sm text-gray-800 cursor-pointer">
                            <span className="w-5 h-5 border border-gray-400 rounded shrink-0 inline-block mt-0.5" />
                            <span>
                              <span className="font-semibold text-gray-600">{LETTERS[i]})</span> {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Expression écrite */}
                    {isWritten && (
                      <div className="ml-5">
                        {q.criteria && (
                          <div className="text-xs text-gray-500 mb-2">
                            <span className="font-semibold">Critères évalués :</span> {q.criteria.join(' • ')}
                          </div>
                        )}
                        <div className="border border-gray-300 rounded" style={{ minHeight: '100px' }}>
                          {[...Array(5)].map((_, li) => (
                            <div key={li} className="border-b border-gray-200 h-7" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Score formateur */}
        <div className="border-2 border-gray-800 rounded p-4 mt-8 bg-gray-50">
          <div className="font-bold text-gray-800 mb-3 uppercase text-sm tracking-wide">
            Grille de correction — Réservé au formateur
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-gray-700">
            <div>Score total : <span className="border-b border-gray-500 inline-block w-16" /> / {questions.filter(q => q.type !== 'oral').length}</div>
            <div>Pourcentage : <span className="border-b border-gray-500 inline-block w-16" /> %</div>
            <div>Niveau estimé : <span className="border-b border-gray-500 inline-block w-16" /></div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-semibold">Barème indicatif :</span>{' '}
            A1 &lt; 30% • A2 : 30–44% • B1 : 45–64% • B2 : 65–79% • C1 : 80–89% • C2 ≥ 90%
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-600 font-semibold mb-1">Observations :</div>
            <div className="border-b border-gray-400 h-6 mb-1" />
            <div className="border-b border-gray-400 h-6" />
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          ParlerEmploi Formation — Test de positionnement FLE — © {new Date().getFullYear()} —
          Médiathèque Persepolis, 4 avenue Gabriel-Péri, 93400 Saint-Ouen-sur-Seine — contact@parleremploi.com
        </div>
      </div>

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