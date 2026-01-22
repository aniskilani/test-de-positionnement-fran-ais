import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Mail, ChevronDown, ChevronUp, Loader2, FileText, Award } from 'lucide-react';
import { toast } from 'sonner';
import LevelResult from '@/components/test/LevelResult';
import QuestionReview from '@/components/results/QuestionReview';
import CategoryAnalysis from '@/components/results/CategoryAnalysis';
import { questions } from '@/components/test/questionsData';

export default function Results() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [sendingPDF, setSendingPDF] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const resultId = urlParams.get('resultId');

  useEffect(() => {
    const fetchResult = async () => {
      if (resultId) {
        const result = await base44.entities.TestResult.filter({ id: resultId });
        if (result.length > 0) {
          setTestResult(result[0]);
        }
      }
      setLoading(false);
    };
    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00504e]" />
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Résultat non trouvé</p>
          <Link to={createPageUrl('Home')}>
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate category stats
  const categoryStats = {};
  testResult.answers?.forEach((answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      if (!categoryStats[question.category]) {
        categoryStats[question.category] = { correct: 0, total: 0 };
      }
      categoryStats[question.category].total++;
      if (answer.correct) {
        categoryStats[question.category].correct++;
      }
    }
  });

  // Prepare question reviews
  const questionReviews = testResult.answers?.map((answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    return {
      question,
      userAnswer: answer.answer,
      isCorrect: answer.correct
    };
  }).filter(review => review.question);

  const incorrectQuestions = questionReviews.filter(r => !r.isCorrect);
  const displayedQuestions = showAllQuestions ? questionReviews : incorrectQuestions;

  const handleResendPDF = async () => {
    setSendingPDF(true);
    try {
      await base44.functions.invoke('sendResultsPDF', { resultId: testResult.id });
      toast.success('PDF envoyé par email !');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du PDF');
      console.error(error);
    } finally {
      setSendingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png" 
            alt="ParlerEmploi Formation" 
            className="h-16 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600 mb-1">Félicitations {testResult.candidate_name} !</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Vos résultats détaillés
            </h1>
          </motion.div>

          {/* Tabs for different views */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="categories">Par catégorie</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
                <LevelResult level={testResult.level} score={testResult.score} />
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                  <p className="text-sm text-gray-600 mb-1">Questions réussies</p>
                  <p className="text-3xl font-bold text-green-600">
                    {testResult.answers?.filter(a => a.correct).length || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    sur {testResult.answers?.length || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                  <p className="text-sm text-gray-600 mb-1">Questions manquées</p>
                  <p className="text-3xl font-bold text-red-600">
                    {testResult.answers?.filter(a => !a.correct).length || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    à revoir
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                  <p className="text-sm text-gray-600 mb-1">Durée du test</p>
                  <p className="text-3xl font-bold text-[#00504e]">
                    {Math.floor((testResult.duration_seconds || 0) / 60)}
                  </p>
                  <p className="text-sm text-gray-500">
                    minutes
                  </p>
                </div>
              </div>

              {/* CTA Principal - Formations */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="relative"
              >
                {/* Effet de halo animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00504e] to-[#17c3b2] rounded-2xl blur-xl opacity-30 animate-pulse" />
                
                <div className="relative bg-gradient-to-br from-[#00504e] via-[#17c3b2] to-[#32cf8a] rounded-2xl p-8 shadow-2xl">
                  <div className="text-center text-white space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold">
                      Passez à l'action !
                    </h3>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                      Découvrez nos formations personnalisées pour atteindre le niveau supérieur et réussir vos objectifs professionnels
                    </p>
                    <Link to={createPageUrl('Formations') + `?level=${testResult.level}&score=${testResult.score}&name=${encodeURIComponent(testResult.candidate_name)}`}>
                      <Button
                        size="lg"
                        className="h-16 px-10 text-lg font-bold bg-white text-[#00504e] hover:bg-gray-50 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 mt-4"
                      >
                        🎯 Découvrir mes formations adaptées
                      </Button>
                    </Link>
                    <p className="text-sm opacity-75 pt-2">
                      ✨ Offre spéciale candidat • Conseiller disponible immédiatement
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Bouton secondaire PDF */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={handleResendPDF}
                  disabled={sendingPDF}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {sendingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Recevoir le PDF par email
                    </>
                  )}
                </Button>
              </motion.div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <CategoryAnalysis categoryStats={categoryStats} />
              
              {/* CTA Section */}
              <div className="mt-6 bg-gradient-to-r from-[#00504e] to-[#17c3b2] rounded-3xl p-8 text-center text-white">
                <h3 className="text-xl font-bold mb-3">
                  Progressez dans vos points faibles
                </h3>
                <p className="opacity-90 mb-6">
                  Nos formations personnalisées vous aident à améliorer vos compétences ciblées.
                </p>
                <a href="https://parleremploi.com" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-[#00504e] hover:bg-gray-100 font-semibold px-8 h-12 rounded-xl">
                    Découvrir nos formations
                  </Button>
                </a>
              </div>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions" className="space-y-4">
              {/* Toggle Button */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {showAllQuestions ? 
                    `Affichage de toutes les questions (${questionReviews.length})` : 
                    `Affichage des erreurs uniquement (${incorrectQuestions.length})`
                  }
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className="rounded-xl"
                >
                  {showAllQuestions ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Masquer les réussites
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Afficher tout
                    </>
                  )}
                </Button>
              </div>

              {/* Question Reviews */}
              <div className="space-y-4">
                {displayedQuestions.length > 0 ? (
                  displayedQuestions.map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <QuestionReview
                        question={review.question}
                        userAnswer={review.userAnswer}
                        isCorrect={review.isCorrect}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium mb-2">Parfait ! 🎉</p>
                    <p>Vous avez répondu correctement à toutes les questions.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ParlerEmploi Formation. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}