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

const originalQuestions = [
  // A1 Level - Compréhension Orale
  {
    id: 1,
    level: "A1",
    category: "Compréhension Orale",
    question: "Écoutez l'audio. Quelle est la question posée ?",
    audioUrl: "https://example.com/audio/question-a1-1.mp3",
    audioText: "Audio : 'Comment tu t'appelles ?'",
    options: ["Quel âge as-tu ?", "Comment tu t'appelles ?", "Où habites-tu ?", "Quelle heure est-il ?"],
    correct: "Comment tu t'appelles ?"
  },
  // A1 Level - Grammaire
  {
    id: 2,
    level: "A1",
    category: "Grammaire",
    question: "Complétez : « Je ___ français. »",
    options: ["suis", "ai", "est", "as"],
    correct: "suis"
  },
  {
    id: 3,
    level: "A1",
    category: "Vocabulaire",
    question: "Comment dit-on « Hello » en français ?",
    options: ["Au revoir", "Bonjour", "Merci", "S'il vous plaît"],
    correct: "Bonjour"
  },
  {
    id: 4,
    level: "A1",
    category: "Grammaire",
    question: "Quel est le pluriel de « un livre » ?",
    options: ["des livre", "des livres", "les livre", "un livres"],
    correct: "des livres"
  },
  // A2 Level - Compréhension Orale
  {
    id: 5,
    level: "A2",
    category: "Compréhension Orale",
    question: "Écoutez le dialogue. Où vont les deux personnes ?",
    audioUrl: "https://example.com/audio/question-a2-1.mp3",
    audioText: "Audio : 'On va au restaurant ce soir ?' - 'Oui, bonne idée !'",
    options: ["Au cinéma", "Au restaurant", "À la plage", "Au musée"],
    correct: "Au restaurant"
  },
  {
    id: 6,
    level: "A2",
    category: "Grammaire",
    question: "Complétez : « Hier, nous ___ au cinéma. »",
    options: ["allons", "sommes allés", "irons", "allions"],
    correct: "sommes allés"
  },
  {
    id: 7,
    level: "A2",
    category: "Vocabulaire",
    question: "Quel mot signifie l'inverse de « grand » ?",
    options: ["haut", "petit", "large", "long"],
    correct: "petit"
  },
  {
    id: 8,
    level: "A2",
    category: "Compréhension",
    question: "« Il fait beau aujourd'hui. » Cette phrase parle de :",
    options: ["la nourriture", "la météo", "le travail", "la santé"],
    correct: "la météo"
  },
  // B1 Level - Compréhension Orale
  {
    id: 9,
    level: "B1",
    category: "Compréhension Orale",
    question: "Écoutez l'annonce. À quelle heure part le train ?",
    audioUrl: "https://example.com/audio/question-b1-1.mp3",
    audioText: "Audio : 'Le train en provenance de Paris partira à 15h30 du quai numéro 3.'",
    options: ["14h30", "15h30", "16h30", "17h30"],
    correct: "15h30"
  },
  {
    id: 10,
    level: "B1",
    category: "Grammaire",
    question: "Complétez : « Si j'avais le temps, je ___ ce livre. »",
    options: ["lis", "lirais", "lirai", "lisais"],
    correct: "lirais"
  },
  {
    id: 11,
    level: "B1",
    category: "Vocabulaire",
    question: "Que signifie « être débordé » ?",
    options: ["Être fatigué", "Avoir trop de travail", "Être malade", "Être en retard"],
    correct: "Avoir trop de travail"
  },
  {
    id: 12,
    level: "B1",
    category: "Grammaire",
    question: "Choisissez la forme correcte : « C'est le livre ___ je t'ai parlé. »",
    options: ["que", "dont", "qui", "où"],
    correct: "dont"
  },
  // B2 Level - Compréhension Orale
  {
    id: 13,
    level: "B2",
    category: "Compréhension Orale",
    question: "Écoutez l'interview. Quel est le principal défi mentionné ?",
    audioUrl: "https://example.com/audio/question-b2-1.mp3",
    audioText: "Audio : 'Notre principal défi reste la gestion du changement climatique et ses impacts sur notre économie.'",
    options: ["Le développement technologique", "Le changement climatique", "Les relations internationales", "La croissance démographique"],
    correct: "Le changement climatique"
  },
  {
    id: 14,
    level: "B2",
    category: "Grammaire",
    question: "Complétez : « Bien qu'il ___ fatigué, il a continué à travailler. »",
    options: ["est", "soit", "était", "serait"],
    correct: "soit"
  },
  {
    id: 15,
    level: "B2",
    category: "Vocabulaire",
    question: "Quel est le synonyme de « néanmoins » ?",
    options: ["Également", "Cependant", "Ensuite", "Par conséquent"],
    correct: "Cependant"
  },
  {
    id: 16,
    level: "B2",
    category: "Grammaire",
    question: "« Il m'a demandé si je ___ venir. »",
    options: ["peux", "pouvais", "pourrai", "pourrais"],
    correct: "pouvais"
  },
  // B1 Level - Compréhension Orale
  {
    id: 17,
    level: "B1",
    category: "Compréhension Orale",
    question: "Écoutez le message. Pourquoi la personne appelle-t-elle ?",
    audioUrl: "https://example.com/audio/question-b1-2.mp3",
    audioText: "Audio : 'Bonjour, je vous appelle pour confirmer notre rendez-vous de demain à 14h. Pourriez-vous me rappeler ?'",
    options: ["Pour annuler un rendez-vous", "Pour confirmer un rendez-vous", "Pour prendre un rendez-vous", "Pour modifier l'heure"],
    correct: "Pour confirmer un rendez-vous"
  },
  {
    id: 18,
    level: "B1",
    category: "Compréhension",
    question: "« Il a pris ses jambes à son cou. » signifie :",
    options: ["Il est tombé", "Il a couru très vite", "Il a mal aux jambes", "Il s'est assis"],
    correct: "Il a couru très vite"
  },
  {
    id: 19,
    level: "A2",
    category: "Grammaire",
    question: "Complétez : « Elle ___ au marché tous les samedis. »",
    options: ["va", "aller", "allé", "allait"],
    correct: "va"
  },
  {
    id: 20,
    level: "A1",
    category: "Vocabulaire",
    question: "Quel article utilise-t-on : « ___ pomme » ?",
    options: ["Un", "Une", "Des", "Le"],
    correct: "Une"
  }
];

export default function Test() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQ = questions[currentQuestion + 1];
      setTimeLeft(nextQ.level === 'C1' || nextQ.level === 'C2' ? 30 : 12);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQ = questions[currentQuestion + 1];
      setTimeLeft(nextQ.level === 'C1' || nextQ.level === 'C2' ? 30 : 12);
    }
  };



  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevQ = questions[currentQuestion - 1];
      setTimeLeft(prevQ.level === 'C1' || prevQ.level === 'C2' ? 30 : 12);
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

      if (q.type === 'written' || q.type === 'oral') {
        // Évaluation par IA pour les questions d'expression écrite et orale
        if (userAnswer && userAnswer.trim()) {
          try {
            const evaluation = await base44.integrations.Core.InvokeLLM({
              prompt: `Tu es un évaluateur de français langue étrangère niveau ${q.level}. 
Évalue cette réponse ${q.type === 'oral' ? 'orale (transcrite)' : 'écrite'} selon les critères suivants :
${q.criteria.map(c => `- ${c}`).join('\n')}

Question: ${q.question}
Réponse de l'étudiant: "${userAnswer}"

Évalue si la réponse respecte MAJORITAIREMENT les critères pour le niveau ${q.level}.
${q.type === 'oral' ? 'Note: Il peut y avoir des erreurs de transcription, sois indulgent sur l\'orthographe.' : ''}
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
            // En cas d'erreur, on compte comme correct si minimum atteint
            if (q.type === 'written') {
              const wordCount = userAnswer.split(/\s+/).filter(w => w.length > 0).length;
              isCorrect = wordCount >= q.minWords;
            } else {
              isCorrect = userAnswer.length > 10;
            }
          }
        } else {
          isCorrect = false;
        }
      } else {
        // Questions QCM classiques
        isCorrect = userAnswer === q.correct;
      }

      if (isCorrect) correctCount++;
      
      answerDetails.push({
        questionId: q.id,
        answer: userAnswer || "",
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
    const duration = Math.round((Date.now() - startTime) / 1000);
    const results = await calculateResults();

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
  const hasAnswered = answers[currentQuestion] !== undefined && 
    (currentQ.type === 'written' ? (answers[currentQuestion] || '').split(/\s+/).filter(w => w.length > 0).length >= (currentQ.minWords || 0) :
     currentQ.type === 'oral' ? (answers[currentQuestion] || '').length > 10 :
     true);

  useEffect(() => {
    const currentQ = questions[currentQuestion];
    const initialTime = currentQ.level === 'C1' || currentQ.level === 'C2' ? 30 : 12;
    setTimeLeft(initialTime);
    
    // Mettre le timer en pause pour les questions orales
    if (currentQ.type === 'oral') {
      setTimerPaused(true);
    } else {
      setTimerPaused(false);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (currentQ.type === 'written') return;
    if (timerPaused) return;

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
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-4">
        <div className="max-w-2xl mx-auto px-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="h-12 px-6 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isLastQuestion}
            className="h-12 px-6 rounded-xl text-gray-600 hover:text-gray-900"
          >
            Passer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 shadow-lg"
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
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 shadow-lg"
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