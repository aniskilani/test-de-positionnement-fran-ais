import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Clock, Users, Award, MessageCircle, Calendar } from 'lucide-react';

export default function Formations() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const level = urlParams.get('level');
  const score = urlParams.get('score');
  const name = urlParams.get('name');

  const formations = {
    A1: {
      title: "Formation Débutant A1",
      subtitle: "Premiers pas en français",
      description: "Idéale pour les débutants complets. Apprenez les bases de la communication en français.",
      duration: "60 heures",
      price: "1 200€",
      color: "from-blue-500 to-blue-600",
      objectives: [
        "Se présenter et présenter quelqu'un",
        "Poser des questions simples et y répondre",
        "Comprendre des instructions basiques",
        "Écrire des messages courts"
      ]
    },
    A2: {
      title: "Formation Élémentaire A2",
      subtitle: "Développez votre autonomie",
      description: "Perfectionnez vos bases et gagnez en confiance dans les situations quotidiennes.",
      duration: "80 heures",
      price: "1 600€",
      color: "from-green-500 to-green-600",
      objectives: [
        "Échanger sur des sujets familiers",
        "Décrire son environnement",
        "Raconter des événements passés",
        "Exprimer ses besoins et opinions simples"
      ]
    },
    B1: {
      title: "Formation Intermédiaire B1",
      subtitle: "Vers l'indépendance linguistique",
      description: "Devenez autonome dans la plupart des situations professionnelles et personnelles.",
      duration: "100 heures",
      price: "2 000€",
      color: "from-orange-500 to-orange-600",
      objectives: [
        "Comprendre des textes complexes",
        "Participer à une conversation sans préparation",
        "Argumenter et justifier ses opinions",
        "Rédiger des textes clairs et détaillés"
      ]
    },
    B2: {
      title: "Formation Avancée B2",
      subtitle: "Excellence professionnelle",
      description: "Maîtrisez le français pour des usages professionnels exigeants et académiques.",
      duration: "120 heures",
      price: "2 400€",
      color: "from-purple-500 to-purple-600",
      objectives: [
        "Comprendre des conférences et discours longs",
        "Communiquer avec aisance et spontanéité",
        "Rédiger des rapports et articles détaillés",
        "Interagir avec des locuteurs natifs sans effort"
      ]
    }
  };

  const allLevels = ['A1', 'A2', 'B1', 'B2'];
  const targetLevel = level || 'A1';
  const formation = formations[targetLevel];

  const avantages = [
    { icon: Award, text: "Certification Qualiopi", desc: "Organisme certifié qualité" },
    { icon: Users, text: "Petits groupes", desc: "Max 8 participants" },
    { icon: Calendar, text: "Horaires flexibles", desc: "Cours en journée ou soir" },
    { icon: Clock, text: "Suivi personnalisé", desc: "Formateurs dédiés" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69409edef41e4f2a833c897b/ac7782ec6_logopefpetit.png" 
            alt="ParlerEmploi" 
            className="h-16 object-contain"
          />
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#00504e] to-[#17c3b2] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          {name && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <p className="text-xl">Bonjour {name} ! 👋</p>
              <p className="text-white/90 mt-2">
                Votre niveau {targetLevel} {score && `(${score}/100)`} vous ouvre les portes de nos formations adaptées.
              </p>
            </motion.div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos Formations FLE
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Des programmes certifiés Qualiopi adaptés à votre niveau pour progresser efficacement.
          </p>
        </div>
      </div>

      {/* Offre spéciale */}
      {name && (
        <div className="max-w-6xl mx-auto px-6 -mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-2xl font-bold mb-2">🎁 Offre spéciale test de positionnement</p>
                <p className="text-white/90">
                  Réservez votre place dans les 7 jours et bénéficiez de <strong>10% de réduction</strong> !
                </p>
              </div>
              <a href="https://wa.me/33652675393?text=Bonjour%2C%20je%20souhaite%20profiter%20de%20l'offre%20formation%20suite%20à%20mon%20test" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  En profiter maintenant
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {/* Formation recommandée */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {level ? "Formation recommandée pour vous" : "Choisissez votre formation"}
            </h2>
            <p className="text-gray-600">
              {level ? `Basée sur votre niveau ${targetLevel}` : "Sélectionnez le niveau correspondant à vos besoins"}
            </p>
          </div>

          <Card className="mb-12 border-2 border-[#17c3b2] shadow-xl">
            <CardHeader className={`bg-gradient-to-r ${formation.color} text-white rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{formation.title}</CardTitle>
                  <CardDescription className="text-white/90 text-lg">{formation.subtitle}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{formation.price}</div>
                  <div className="text-sm text-white/80">TTC</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 mb-6">{formation.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#17c3b2]" />
                    Objectifs de la formation
                  </h3>
                  <ul className="space-y-3">
                    {formation.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#17c3b2]" />
                    Détails pratiques
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span><strong>Durée :</strong> {formation.duration} de formation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span><strong>Format :</strong> Présentiel ou distanciel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span><strong>Financement :</strong> CPF, Pôle Emploi, OPCO</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <span><strong>Certification :</strong> Attestation de fin de formation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <a href="https://wa.me/33652675393?text=Bonjour%2C%20je%20suis%20intéressé(e)%20par%20la%20formation%20niveau%20" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-gradient-to-r from-[#00504e] to-[#17c3b2] h-14 px-8 text-lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Demander un devis
                  </Button>
                </a>
                <a href="tel:0652675393">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Prendre RDV
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Autres niveaux */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Autres formations disponibles
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allLevels.filter(l => l !== targetLevel).map((lvl) => {
              const form = formations[lvl];
              return (
                <Card key={lvl} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className={`bg-gradient-to-br ${form.color} text-white`}>
                    <CardTitle className="text-xl">{form.title}</CardTitle>
                    <div className="text-2xl font-bold mt-2">{form.price}</div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">{form.description}</p>
                    <Link to={createPageUrl('Formations') + `?level=${lvl}`}>
                      <Button variant="outline" className="w-full">
                        En savoir plus
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Avantages */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Pourquoi choisir ParlerEmploi ?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantages.map((avantage, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#17c3b2]/10 flex items-center justify-center mx-auto mb-4">
                  <avantage.icon className="w-8 h-8 text-[#17c3b2]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{avantage.text}</h4>
                <p className="text-sm text-gray-600">{avantage.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-12 bg-gradient-to-r from-[#00504e] to-[#17c3b2] rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Prêt à vous lancer ?</h3>
          <p className="text-xl text-white/90 mb-6">
            Contactez-nous dès maintenant pour un accompagnement personnalisé
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://wa.me/33652675393?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20les%20formations" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-[#00504e] hover:bg-gray-100 h-14 px-8">
                <MessageCircle className="w-5 h-5 mr-2" />
                Discuter sur WhatsApp
              </Button>
            </a>
            <a href="mailto:contact@parleremploi.com">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-14 px-8">
                Envoyer un email
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}