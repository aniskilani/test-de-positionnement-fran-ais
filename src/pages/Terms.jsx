import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Terms() {
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
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-[#17c3b2]" />
            <h1 className="text-3xl font-bold text-gray-900">
              Conditions Générales d'Utilisation
            </h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : 15 janvier 2026
            </p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Objet
              </h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site web 
                et de l'application de test de positionnement en français langue étrangère (FLE) proposés par ParlerEmploi Formation.
              </p>
              <p className="mt-2">
                En utilisant notre service, vous acceptez sans réserve les présentes CGU.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Services proposés
              </h2>
              <p>
                ParlerEmploi Formation propose :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Un test de positionnement gratuit en français langue étrangère (FLE)</li>
                <li>Une évaluation du niveau selon le Cadre Européen Commun de Référence pour les Langues (CECRL)</li>
                <li>L'envoi d'un rapport de résultats par email au format PDF</li>
                <li>Des propositions de formations personnalisées adaptées au niveau détecté</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Accès au service
              </h2>
              <p>
                Le test de positionnement est accessible gratuitement à toute personne disposant d'une connexion internet.
              </p>
              <p className="mt-2">
                L'accès nécessite la fourniture d'informations personnelles (nom, email, téléphone) et le consentement 
                explicite au traitement de ces données conformément au RGPD.
              </p>
              <p className="mt-2">
                Nous nous réservons le droit de suspendre ou limiter l'accès au service en cas d'utilisation abusive 
                ou frauduleuse.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Test de positionnement
              </h2>
              <p>
                Le test comprend environ 50 questions adaptatives couvrant différentes compétences linguistiques 
                (compréhension orale, grammaire, vocabulaire, expression écrite et orale).
              </p>
              <p className="mt-2">
                <strong>Durée estimée :</strong> 30 à 45 minutes
              </p>
              <p className="mt-2">
                <strong>Évaluation :</strong> Les questions d'expression écrite et orale sont évaluées automatiquement 
                par intelligence artificielle selon des critères pédagogiques adaptés au niveau CECRL.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                <p className="text-sm">
                  ⚠️ <strong>Important :</strong> Le test est à titre indicatif. Les résultats ne constituent pas 
                  une certification officielle mais une évaluation pédagogique de votre niveau.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Résultats et rapport PDF
              </h2>
              <p>
                À l'issue du test, vous recevez par email :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Votre niveau CECRL (A1, A2, B1 ou B2)</li>
                <li>Votre score global sur 100</li>
                <li>Vos performances détaillées par catégorie</li>
                <li>Un rapport PDF téléchargeable</li>
              </ul>
              <p className="mt-2">
                Les résultats sont conservés pendant 2 ans à compter de la date du test.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Formations payantes
              </h2>
              <p>
                Le test de positionnement peut donner lieu à une proposition de formation payante adaptée à votre niveau.
              </p>
              <p className="mt-2">
                <strong>Modalités :</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Les formations sont proposées sur devis personnalisé</li>
                <li>Aucune formation n'est facturée sans validation explicite du devis par le bénéficiaire ou le financeur</li>
                <li>Les tarifs et conditions sont précisés dans chaque devis</li>
              </ul>
              <p className="mt-2">
                <strong>Remboursement :</strong> Aucun remboursement n'est possible une fois la formation commencée, 
                sauf cas de force majeure ou annulation imputable à ParlerEmploi Formation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Obligations de l'utilisateur
              </h2>
              <p>L'utilisateur s'engage à :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fournir des informations exactes et à jour</li>
                <li>Réaliser le test de manière individuelle et autonome</li>
                <li>Ne pas utiliser de moyens frauduleux (triche, aide extérieure)</li>
                <li>Ne pas tenter d'accéder à des zones restreintes du site</li>
                <li>Respecter les droits de propriété intellectuelle</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Responsabilité
              </h2>
              <p>
                ParlerEmploi Formation met tout en œuvre pour assurer la disponibilité et la fiabilité de son service.
              </p>
              <p className="mt-2">
                Toutefois, nous ne saurions être tenus responsables :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Des interruptions de service pour maintenance ou raisons techniques</li>
                <li>De l'inexactitude des résultats due à un dysfonctionnement technique</li>
                <li>Des décisions prises par l'utilisateur sur la base des résultats du test</li>
                <li>De la non-réception des emails (spam, erreur d'adresse)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                9. Données personnelles
              </h2>
              <p>
                Le traitement de vos données personnelles est détaillé dans notre 
                <Link to={createPageUrl('Privacy')} className="text-[#17c3b2] hover:underline ml-1">
                  Politique de confidentialité
                </Link>.
              </p>
              <p className="mt-2">
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition 
                sur vos données personnelles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                10. Propriété intellectuelle
              </h2>
              <p>
                Tous les contenus du site (textes, questions, images, logos) sont protégés par le droit d'auteur 
                et appartiennent à ParlerEmploi Formation.
              </p>
              <p className="mt-2">
                Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                11. Modification des CGU
              </h2>
              <p>
                ParlerEmploi Formation se réserve le droit de modifier les présentes CGU à tout moment.
              </p>
              <p className="mt-2">
                Les utilisateurs seront informés de toute modification substantielle par email ou notification sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                12. Droit applicable et juridiction
              </h2>
              <p>
                Les présentes CGU sont régies par le droit français.
              </p>
              <p className="mt-2">
                En cas de litige, et à défaut de solution amiable, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <div className="bg-gray-100 rounded-lg p-6 mt-8">
              <p className="text-center font-medium text-gray-900 mb-2">
                Des questions sur nos conditions d'utilisation ?
              </p>
              <p className="text-center text-gray-600">
                Contactez-nous : <a href="mailto:contact@parleremploi.com" className="text-[#17c3b2] hover:underline">contact@parleremploi.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}