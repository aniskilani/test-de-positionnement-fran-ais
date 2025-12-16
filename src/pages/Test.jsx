import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Loader2 } from 'lucide-react';
import ProgressBar from '@/components/test/ProgressBar';
import QuestionCard from '@/components/test/QuestionCard';

const questions = [
  // A1 Level
  {
    id: 1,
    level: "A1",
    category: "Grammaire",
    question: "Complétez : « Je ___ français. »",
    options: ["suis", "ai", "est", "as"],
    correct: "suis"
  },
  {
    id: 2,
    level: "A1",
    category: "Vocabulaire",
    question: "Comment dit-on « Hello » en français ?",
    options: ["Au revoir", "Bonjour", "Merci", "S'il vous plaît"],
    correct: "Bonjour"
  },
  {
    id: 3,
    level: "A1",
    category: "Grammaire",
    question: "Quel est le pluriel de « un livre » ?",
    options: ["des livre", "des livres", "les livre", "un livres"],
    correct: "des livres"
  },
  {
    id: 4,
    level: "A1",
    category: "Vocabulaire",
    question: "Quel article utilise-t-on : « ___ pomme » ?",
    options: ["Un", "Une", "Des", "Le"],
    correct: "Une"
  },
  // A2 Level
  {
    id: 5,
    level: "A2",
    category: "Grammaire",
    question: "Complétez : « Hier, nous ___ au cinéma. »",
    options: ["allons", "sommes allés", "irons", "allions"],
    correct: "sommes allés"
  },
  {
    id: 6,
    level: "A2",
    category: "Vocabulaire",
    question: "Quel mot signifie l'inverse de « grand » ?",
    options: ["haut", "petit", "large", "long"],
    correct: "petit"
  },
  {
    id: 7,
    level: "A2",
    category: "Compréhension",
    question: "« Il fait beau aujourd'hui. » Cette phrase parle de :",
    options: ["la nourriture", "la météo", "le travail", "la santé"],
    correct: "la météo"
  },
  {
    id: 8,
    level: "A2",
    category: "Grammaire",
    question: "Complétez : « Elle ___ au marché tous les samedis. »",
    options: ["va", "aller", "allé", "allait"],
    correct: "va"
  },
  // B1 Level
  {
    id: 9,
    level: "B1",
    category: "Grammaire",
    question: "Complétez : « Si j'avais le temps, je ___ ce livre. »",
    options: ["lis", "lirais", "lirai", "lisais"],
    correct: "lirais"
  },
  {
    id: 10,
    level: "B1",
    category: "Vocabulaire",
    question: "Que signifie « être débordé » ?",
    options: ["Être fatigué", "Avoir trop de travail", "Être malade", "Être en retard"],
    correct: "Avoir trop de travail"
  },
  {
    id: 11,
    level: "B1",
    category: "Grammaire",
    question: "Choisissez la forme correcte : « C'est le livre ___ je t'ai parlé. »",
    options: ["que", "dont", "qui", "où"],
    correct: "dont"
  },
  {
    id: 12,
    level: "B1",
    category: "Compréhension",
    question: "« Il a pris ses jambes à son cou. » signifie :",
    options: ["Il est tombé", "Il a couru très vite", "Il a mal aux jambes", "Il s'est assis"],
    correct: "Il a couru très vite"
  },
  // B2 Level
  {
    id: 13,
    level: "B2",
    category: "Grammaire",
    question: "Complétez : « Bien qu'il ___ fatigué, il a continué à travailler. »",
    options: ["est", "soit", "était", "serait"],
    correct: "soit"
  },
  {
    id: 14,
    level: "B2",
    category: "Vocabulaire",
    question: "Quel est le synonyme de « néanmoins » ?",
    options: ["Également", "Cependant", "Ensuite", "Par conséquent"],
    correct: "Cependant"
  },
  {
    id: 15,
    level: "B2",
    category: "Grammaire",
    question: "« Il m'a demandé si je ___ venir. »",
    options: ["peux", "pouvais", "pourrai", "pourrais"],
    correct: "pouvais"
  }
];

export default function Test() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const candidateName = urlParams.get('name') || '';
  const candidateEmail = urlParams.get('email') || '';
  const candidatePhone = urlParams.get('phone') || '';

  const handleSelect = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    const answerDetails = [];

    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) correctCount++;
      answerDetails.push({
        questionId: q.id,
        answer: userAnswer || "",
        correct: isCorrect
      });
    });

    const score = Math.round((correctCount / questions.length) * 100);
    
    let level;
    if (score >= 75) level = "B2";
    else if (score >= 55) level = "B1";
    else if (score >= 35) level = "A2";
    else level = "A1";

    return { score, level, answers: answerDetails };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const duration = Math.round((Date.now() - startTime) / 1000);
    const results = calculateResults();

    const resultData = {
      ...results,
      duration_seconds: duration,
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      candidate_phone: candidatePhone
    };

    await base44.entities.TestResult.create(resultData);

    navigate(createPageUrl('Results') + `?score=${results.score}&level=${results.level}&name=${encodeURIComponent(candidateName)}`);
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const hasAnswered = answers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png" 
            alt="ParlerEmploi Formation" 
            className="h-10 object-contain"
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

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!hasAnswered || isSubmitting}
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