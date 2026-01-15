import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "Le test de positionnement est-il vraiment gratuit ?",
      answer: "Oui, le test de positionnement est 100% gratuit, sans engagement. Vous recevrez vos résultats complets par email sans aucun frais."
    },
    {
      question: "Combien de temps dure le test ?",
      answer: "Le test dure environ 30 à 45 minutes. Il comprend 50 questions adaptatives qui s'ajustent à votre niveau au fur et à mesure."
    },
    {
      question: "Quels niveaux peuvent être détectés ?",
      answer: "Le test évalue votre niveau selon le CECRL (Cadre Européen Commun de Référence pour les Langues) : A1, A2, B1 ou B2."
    },
    {
      question: "Puis-je refaire le test ?",
      answer: "Oui, vous pouvez refaire le test après un délai de 3 mois minimum pour mesurer votre progression."
    },
    {
      question: "Le résultat est-il une certification officielle ?",
      answer: "Non, il s'agit d'une évaluation pédagogique de votre niveau, pas d'une certification officielle. Le test vous donne une indication fiable pour orienter votre parcours de formation."
    },
    {
      question: "Comment sont évaluées les questions d'expression écrite et orale ?",
      answer: "Vos productions sont évaluées automatiquement par intelligence artificielle selon des critères pédagogiques alignés sur le CECRL (grammaire, vocabulaire, cohérence, etc.)."
    },
    {
      question: "Que faire si je n'ai pas reçu mes résultats par email ?",
      answer: "Vérifiez d'abord vos spams. Si vous ne trouvez pas l'email, vous pouvez demander un renvoi depuis la page de résultats ou nous contacter à contact@parleremploi.com."
    },
    {
      question: "La reconnaissance vocale ne fonctionne pas, que faire ?",
      answer: "La reconnaissance vocale nécessite Chrome ou Edge et une autorisation d'accès au microphone. Si cela ne fonctionne pas, vous pouvez saisir votre réponse manuellement dans le champ texte prévu."
    },
    {
      question: "Mes données personnelles sont-elles sécurisées ?",
      answer: "Oui, nous sommes conformes au RGPD. Vos données sont chiffrées, hébergées en Europe et conservées 2 ans maximum. Consultez notre politique de confidentialité pour plus de détails."
    },
    {
      question: "Comment supprimer mes données personnelles ?",
      answer: "Vous pouvez à tout moment demander la suppression de vos données en nous contactant à dpo@parleremploi.com ou via la page 'Mon compte'."
    },
    {
      question: "Proposez-vous des formations après le test ?",
      answer: "Oui, nous proposons des formations personnalisées adaptées à votre niveau détecté. Nous vous contacterons pour vous présenter nos offres, sans aucune obligation d'achat."
    },
    {
      question: "Les formations sont-elles finançables par le CPF ?",
      answer: "Oui, ParlerEmploi Formation est certifié Qualiopi. Nos formations peuvent être financées par le CPF, Pôle Emploi ou d'autres organismes."
    },
    {
      question: "Qu'est-ce que la certification Qualiopi ?",
      answer: "Qualiopi est une certification qualité des organismes de formation en France. Elle garantit la qualité de nos formations et permet leur financement par les fonds publics et mutualisés."
    },
    {
      question: "Puis-je passer le test pour quelqu'un d'autre ?",
      answer: "Non, le test doit être réalisé individuellement par la personne concernée pour garantir l'exactitude de l'évaluation."
    },
    {
      question: "Le test fonctionne-t-il sur mobile/tablette ?",
      answer: "Oui, le test est optimisé pour tous les appareils (ordinateur, tablette, smartphone). Nous recommandons toutefois un ordinateur pour une meilleure expérience, notamment pour les questions orales."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-10 h-10 text-[#17c3b2]" />
            <h1 className="text-4xl font-bold text-gray-900">
              Questions Fréquentes
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 bg-gradient-to-r from-[#17c3b2]/10 to-[#32cf8a]/10 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-gray-600 mb-4">
            Notre équipe est là pour vous aider
          </p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90">
              Contactez-nous
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}