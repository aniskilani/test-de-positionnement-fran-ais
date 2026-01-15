import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Shield, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-[#17c3b2]" />
            <h1 className="text-3xl font-bold text-gray-900">
              Politique de Confidentialité
            </h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : 15 janvier 2026
            </p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Responsable du traitement
              </h2>
              <p>
                ParlerEmploi Formation est responsable du traitement de vos données personnelles.
              </p>
              <p className="flex items-center gap-2 text-[#17c3b2]">
                <Mail className="w-4 h-4" />
                <strong>Contact DPO :</strong> contact@parleremploi.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Données collectées
              </h2>
              <p>Dans le cadre du test de positionnement FLE, nous collectons :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identité :</strong> Nom et prénom</li>
                <li><strong>Contact :</strong> Adresse email et numéro de téléphone</li>
                <li><strong>Résultats :</strong> Vos réponses au test, score et niveau CECRL</li>
                <li><strong>Technique :</strong> Date et durée du test</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Finalités du traitement
              </h2>
              <p>Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vous envoyer vos résultats par email (PDF)</li>
                <li>Vous contacter concernant nos formations adaptées à votre niveau</li>
                <li>Établir des statistiques anonymes pour améliorer notre service</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Base légale
              </h2>
              <p>
                Le traitement de vos données repose sur votre <strong>consentement explicite</strong> (case à cocher lors de l'inscription au test).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Durée de conservation
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Résultats de test :</strong> 2 ans à compter de la date du test</li>
                <li><strong>Données de contact :</strong> 2 ans en l'absence de nouvelle interaction</li>
              </ul>
              <p className="text-sm italic">
                Au-delà de cette période, vos données sont automatiquement supprimées ou anonymisées.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Vos droits
              </h2>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                <li><strong>Droit d'opposition :</strong> Vous opposer au traitement</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                <li><strong>Droit de retirer votre consentement :</strong> À tout moment</li>
              </ul>
              <div className="bg-[#17c3b2]/10 border-l-4 border-[#17c3b2] p-4 mt-4">
                <p className="text-sm">
                  Pour exercer ces droits, contactez-nous à : 
                  <strong className="text-[#00504e]"> contact@parleremploi.com</strong>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Sécurité des données
              </h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chiffrement des données en transit et au repos</li>
                <li>Accès restreint aux données (authentification formateur)</li>
                <li>Serveurs sécurisés hébergés dans l'Union Européenne</li>
                <li>Sauvegardes régulières</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Destinataires des données
              </h2>
              <p>Vos données ne sont partagées qu'avec :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Nos formateurs :</strong> Pour le suivi pédagogique</li>
                <li><strong>Notre prestataire d'hébergement :</strong> Base44 (Europe)</li>
                <li><strong>Notre service d'emailing :</strong> Pour l'envoi des résultats</li>
              </ul>
              <p className="text-sm italic">
                Nous ne vendons jamais vos données à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                9. Cookies
              </h2>
              <p>
                Notre site utilise uniquement des cookies techniques essentiels au fonctionnement du test (stockage local du navigateur). 
                Aucun cookie de suivi publicitaire n'est utilisé.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                10. Réclamation
              </h2>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : 
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#17c3b2] hover:underline ml-1">
                  www.cnil.fr
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                11. Modifications
              </h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité. 
                En cas de changement significatif, nous vous en informerons par email.
              </p>
            </section>

            <div className="bg-gray-100 rounded-lg p-6 mt-8">
              <p className="text-center font-medium text-gray-900 mb-2">
                Des questions sur vos données personnelles ?
              </p>
              <p className="text-center text-gray-600">
                Contactez notre DPO : <a href="mailto:contact@parleremploi.com" className="text-[#17c3b2] hover:underline">contact@parleremploi.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}