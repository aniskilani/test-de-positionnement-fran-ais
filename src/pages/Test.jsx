import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Loader2, Clock } from 'lucide-react';
import ProgressBar from '@/components/test/ProgressBar';
import QuestionCard from '@/components/test/QuestionCard';

import { questions } from '@/components/test/questionsData';

// Types qui nécessitent une réponse libre (texte ou oral) — pas de timer automatique
const FREE_RESPONSE_TYPES = ['written', 'oral', 'reformulate'];
// Types sans timer (réponse interactive complexe)
const UNTIMED_TYPES = ['written', 'oral', 'reformulate', 'match_pairs', 'sentence_builder', 'categorize', 'order_sentences', 'word_choice_text', 'complete_form', 'true_false_justify'];

export default function Test() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState('');
  const [timeLeft, setTimeLeft] = useState(12);
  const [timerPaused, setTimerPaused] = useState(false);
  const [canTakeTest, setCanTakeTest] = useState(true);
  const [lastTestDate, setLastTestDate] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(true);


  const urlParams = new URLSearchParams(window.location.search);
  const candidateName = urlParams.get('name') || localStorage.getItem('test_candidate_name') || '';
  const candidateEmail = urlParams.get('email') || localStorage.getItem('test_candidate_email') || '';
  const candidatePhone = urlParams.get('phone') || localStorage.getItem('test_candidate_phone') || '';
  const hasPaid = urlParams.get('paid') === 'true';
  const isTrainer = urlParams.get('trainer') === 'true';
  const trainerName = urlParams.get('trainerName') || localStorage.getItem('trainer_name') || '';

  // Vérifier si le candidat peut passer le test (pas plus d'une fois tous les 3 mois)
  useEffect(() => {
    const checkTestEligibility = async () => {
      if (!candidateEmail || isTrainer) {
        setCheckingEligibility(false);
        return;
      }

      try {
        const results = await base44.entities.TestResult.filter({ 
          candidate_email: candidateEmail 
        });

        if (results.length > 0) {
          // Trier par date décroissante
          const sortedResults = results.sort((a, b) => 
            new Date(b.created_date) - new Date(a.created_date)
          );
          
          const lastTest = sortedResults[0];
          const lastTestDate = new Date(lastTest.created_date);
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

          if (lastTestDate > threeMonthsAgo) {
            setCanTakeTest(false);
            setLastTestDate(lastTestDate);
          }
        }
      } catch (error) {
        console.error('Erreur vérification éligibilité:', error);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkTestEligibility();
  }, [candidateEmail, isTrainer]);



  const handleSelect = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const getTimeForQuestion = (q) => q.timeLimit ?? null;

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(getTimeForQuestion(questions[currentQuestion + 1]));
    }
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(getTimeForQuestion(questions[currentQuestion + 1]));
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(getTimeForQuestion(questions[currentQuestion - 1]));
    }
  };

  const calculateResults = async () => {
    let correctCount = 0;
    const answerDetails = [];
    const categoryScores = {};

    // Évaluer les questions avec IA pour l'expression écrite et orale
    for (let index = 0; index < questions.length; index++) {
      const q = questions[index];
      const userAnswer = answers[index];
      let isCorrect;

      if (FREE_RESPONSE_TYPES.includes(q.type)) {
        // Évaluation par IA pour les questions d'expression écrite, orale et reformulation
        if (userAnswer && userAnswer.trim()) {
          try {
            const evaluation = await base44.integrations.Core.InvokeLLM({
              prompt: `Tu es un évaluateur de français langue étrangère niveau ${q.level}. 
Évalue cette réponse selon les critères suivants :
${(q.criteria || ['Réponse cohérente', 'Français correct']).map(c => `- ${c}`).join('\n')}

Question: ${q.question}
${q.originalText ? `Phrase originale à reformuler : "${q.originalText}"` : ''}
Réponse de l'étudiant: "${userAnswer}"

Évalue si la réponse respecte MAJORITAIREMENT les critères pour le niveau ${q.level}.
${q.type === 'oral' ? "Note: Il peut y avoir des erreurs de transcription, sois indulgent sur l'orthographe." : ''}
Réponds uniquement par "correct" ou "incorrect" suivi d'une brève explication (1 phrase).`,
              response_json_schema: {
                type: "object",
                properties: {
                  evaluation: { type: "string", enum: ["correct", "incorrect"] },
                  explanation: { type: "string" }
                }
              }
            });
            isCorrect = evaluation.evaluation === "correct";
          } catch (err) {
            const wordCount = userAnswer.split(/\s+/).filter(w => w.length > 0).length;
            isCorrect = wordCount >= (q.minWords || 3);
          }
        } else {
          isCorrect = false;
        }
      } else if (q.type === 'match_pairs') {
        // Toutes les paires correctement associées
        if (userAnswer) {
          const matched = JSON.parse(userAnswer);
          isCorrect = q.pairs.every(p => matched[p.left] === p.right);
        } else isCorrect = false;
      } else if (q.type === 'categorize') {
        if (userAnswer) {
          const assigned = JSON.parse(userAnswer);
          isCorrect = q.items.every(item => assigned[item.text] === item.category);
        } else isCorrect = false;
      } else if (q.type === 'order_sentences') {
        if (userAnswer) {
          const ordered = JSON.parse(userAnswer);
          isCorrect = ordered.length === q.sentences.length &&
            ordered.every((item, i) => item.origIdx === q.correctOrder[i]);
        } else isCorrect = false;
      } else if (q.type === 'sentence_builder') {
        if (userAnswer) {
          const built = userAnswer.split('|').join(' ').trim().toLowerCase().replace(/\.$/, '');
          const correct = q.correctSentence.toLowerCase().replace(/\.$/, '');
          isCorrect = built === correct;
        } else isCorrect = false;
      } else if (q.type === 'fill_keyboard') {
        if (userAnswer) {
          const ans = userAnswer.trim().toLowerCase();
          isCorrect = q.acceptedAnswers.some(a => a.toLowerCase() === ans);
        } else isCorrect = false;
      } else if (q.type === 'word_choice_text') {
        if (userAnswer) {
          const choices = JSON.parse(userAnswer);
          isCorrect = q.correctBlanks.every((ans, i) => choices[i] === ans);
        } else isCorrect = false;
      } else if (q.type === 'complete_form') {
        if (userAnswer) {
          const fields = JSON.parse(userAnswer);
          const filled = Object.keys(fields).length;
          isCorrect = filled >= Math.ceil(q.formFields.length * 0.6);
        } else isCorrect = false;
      } else if (q.type === 'true_false_justify') {
        if (userAnswer) {
          const { tf, justif } = JSON.parse(userAnswer);
          isCorrect = tf === q.correct && justif && justif.trim().length > 3;
        } else isCorrect = false;
      } else {
        // QCM standard (listen_choose, fill_in_blank, scenario_tree, safety_instruction,
        //               complete_dialogue, odd_one_out, email_response, read_comprehension)
        isCorrect = userAnswer === q.correct;
      }

      // S'assurer que isCorrect est toujours un boolean strict
      isCorrect = isCorrect === true;

      if (isCorrect) correctCount++;
      
      answerDetails.push({
        questionId: q.id,
        answer: typeof userAnswer === 'string' ? userAnswer : JSON.stringify(userAnswer ?? ""),
        correct: isCorrect
      });

      // Calcul par catégorie
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { correct: 0, total: 0 };
      }
      categoryScores[q.category].total++;
      if (isCorrect) categoryScores[q.category].correct++;
    }

    const score = Math.round((correctCount / questions.length) * 100);
    
    // Évaluation CECRL plus précise
    let level;
    if (score >= 80) level = "B2";
    else if (score >= 65) level = "B1";
    else if (score >= 45) level = "A2";
    else level = "A1";

    return { score, level, answers: answerDetails };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmittingStep('Analyse de vos réponses…');
    const duration = Math.round((Date.now() - startTime) / 1000);
    setSubmittingStep('Évaluation par intelligence artificielle…');
    const results = await calculateResults();
    setSubmittingStep('Calcul de votre niveau CECRL…');

    const resultData = {
      ...results,
      duration_seconds: duration,
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      candidate_phone: candidatePhone,
      gdpr_consent: true,
      gdpr_consent_date: new Date().toISOString()
    };

    let savedResult;
    
    if (isTrainer) {
      // Sauvegarder comme session formateur
      savedResult = await base44.entities.TrainerSession.create({
        trainer_name: trainerName,
        candidate_name: candidateName,
        candidate_email: candidateEmail,
        candidate_phone: candidatePhone,
        score: results.score,
        level: results.level,
        duration_seconds: duration
      });
    } else {
      // Sauvegarder comme test payé normal
      savedResult = await base44.entities.TestResult.create(resultData);
    }

    // Envoyer le PDF par email si ce n'est pas un formateur
    if (!isTrainer) {
      try {
        await base44.functions.invoke('sendResultsPDF', { resultId: savedResult.id });
      } catch (error) {
        console.error('Erreur envoi PDF:', error);
      }
    }

    navigate(createPageUrl('Results') + `?resultId=${savedResult.id}&trainer=${isTrainer}`);
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const hasAnswered = (() => {
    const ans = answers[currentQuestion];
    if (ans === undefined || ans === null || ans === '') return false;
    if (currentQ.type === 'written' || currentQ.type === 'reformulate')
      return ans.split(/\s+/).filter(w => w.length > 0).length >= (currentQ.minWords || 3);
    if (currentQ.type === 'oral') return ans.length > 10;
    if (currentQ.type === 'match_pairs') { try { return Object.keys(JSON.parse(ans)).length > 0; } catch { return false; } }
    if (currentQ.type === 'categorize') { try { return Object.keys(JSON.parse(ans)).length > 0; } catch { return false; } }
    if (currentQ.type === 'order_sentences') { try { return JSON.parse(ans).length > 0; } catch { return false; } }
    if (currentQ.type === 'sentence_builder') return ans.includes('|') || ans.length > 0;
    if (currentQ.type === 'fill_keyboard') return ans.trim().length > 0;
    if (currentQ.type === 'word_choice_text') { try { return Object.keys(JSON.parse(ans)).length > 0; } catch { return false; } }
    if (currentQ.type === 'complete_form') { try { return Object.keys(JSON.parse(ans)).length > 0; } catch { return false; } }
    if (currentQ.type === 'true_false_justify') { try { const { tf } = JSON.parse(ans); return !!tf; } catch { return false; } }
    return true; // QCM — toute valeur non vide
  })();

  useEffect(() => {
    const currentQ = questions[currentQuestion];
    setTimeLeft(getTimeForQuestion(currentQ));
    // Mettre le timer en pause pour les types sans limite
    if (UNTIMED_TYPES.includes(currentQ.type) || currentQ.timeLimit === null) {
      setTimerPaused(true);
    } else {
      setTimerPaused(false);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft === null || timerPaused) return;
    if (UNTIMED_TYPES.includes(currentQ.type)) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!isLastQuestion) {
      handleNext();
    }
  }, [timeLeft, currentQ.type, isLastQuestion, timerPaused]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && hasAnswered && !isSubmitting) {
        if (isLastQuestion) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasAnswered, isLastQuestion, isSubmitting]);



  if (checkingEligibility) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#17c3b2]" />
      </div>
    );
  }

  if (!canTakeTest) {
    const nextAvailableDate = new Date(lastTestDate);
    nextAvailableDate.setMonth(nextAvailableDate.getMonth() + 3);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5">
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png" 
              alt="ParlerEmploi Formation" 
              className="h-16 object-contain"
            />
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="pt-32 pb-20 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 text-center"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Test déjà effectué
              </h1>
              
              <p className="text-gray-600 mb-6">
                Vous avez déjà passé le test de positionnement le{' '}
                <strong>{new Date(lastTestDate).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</strong>.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <p className="text-blue-900 font-medium mb-2">
                  📅 Prochaine disponibilité
                </p>
                <p className="text-blue-800">
                  {nextAvailableDate.toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Pour garantir la fiabilité de l'évaluation, le test ne peut être passé qu'une fois tous les 3 mois.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700 font-medium">
                  Vous n'avez pas reçu vos résultats ?
                </p>
                <Link to={createPageUrl('MyAccount')}>
                  <Button variant="outline" className="w-full h-12">
                    Accéder à mes résultats
                  </Button>
                </Link>
                <Link to={createPageUrl('Contact')}>
                  <Button className="w-full h-12 bg-gradient-to-r from-[#00504e] to-[#17c3b2]">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Écran de chargement pendant la soumission
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00504e] via-[#17c3b2] to-[#32cf8a] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#17c3b2] to-[#32cf8a] rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Analyse en cours…</h2>
          <p className="text-[#17c3b2] font-semibold mb-6 text-lg">{submittingStep}</p>
          <div className="space-y-3 text-left">
            {[
              { label: 'Vérification des réponses', done: true },
              { label: 'Évaluation par IA (expression écrite & orale)', done: submittingStep.includes('Calcul') },
              { label: 'Calcul de votre niveau CECRL', done: false },
            ].map((step, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-2 rounded-lg ${step.done ? 'bg-green-50' : 'bg-gray-50'}`}>
                <span className={`text-lg ${step.done ? 'text-green-500' : 'text-gray-300'}`}>
                  {step.done ? '✓' : '○'}
                </span>
                <span className={`text-sm font-medium ${step.done ? 'text-green-700' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">
            L'évaluation IA peut prendre 15 à 30 secondes…
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png" 
            alt="ParlerEmploi Formation" 
            className="h-16 object-contain"
          />
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-10">
            <ProgressBar current={currentQuestion + 1} total={questions.length} />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
            <QuestionCard
              question={currentQ}
              selectedAnswer={answers[currentQuestion]}
              onSelect={handleSelect}
              questionNumber={currentQuestion}
              timeLeft={timeLeft}
              onStartTimer={() => setTimerPaused(false)}
            />
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-4 pb-safe">
        <div className="max-w-2xl mx-auto px-6 flex items-center justify-between gap-3">
          {/* Précédent */}
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="h-12 px-4 rounded-xl border-gray-200 text-gray-600 hover:text-gray-900 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>

          {/* Passer (masqué sur la dernière question) */}
          {!isLastQuestion ? (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="h-12 px-4 rounded-xl text-gray-500 hover:text-gray-900 text-sm shrink-0"
            >
              Passer
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          {/* Suivant / Soumettre */}
          {isLastQuestion ? (
            <Button
              onClick={() => {
                const unanswered = questions.filter((_, i) => {
                  const ans = answers[i];
                  return ans === undefined || ans === null || ans === '';
                }).length;
                if (unanswered > 0) {
                  if (!window.confirm(`Vous avez ${unanswered} question(s) sans réponse. Voulez-vous quand même soumettre le test ?`)) return;
                }
                handleSubmit();
              }}
              disabled={isSubmitting}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 shadow-lg ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Calcul...
                </>
              ) : (
                <>
                  Voir mes résultats
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 shadow-lg ml-auto"
            >
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}