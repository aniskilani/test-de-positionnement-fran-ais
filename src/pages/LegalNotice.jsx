import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Building2, Phone, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function LegalNotice() {
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
            <Building2 className="w-8 h-8 text-[#17c3b2]" />
            <h1 className="text-3xl font-bold text-gray-900">
              Mentions Légales
            </h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Éditeur du site
              </h2>
              <div className="space-y-2">
                <p><strong>Raison sociale :</strong> ParlerEmploi Formation (PEF)</p>
                <p><strong>Forme juridique :</strong> Association loi 1901</p>
                <p><strong>SIRET :</strong> 924 182 546 00011</p>
                <p><strong>Code NAF :</strong> 8559B – Autres enseignements</p>
                <p><strong>Adresse du siège social :</strong> 23 avenue Gabriel Péri, 93400 Saint-Ouen</p>
                <p><strong>Directeur de la publication :</strong> Anis Kilani, Président</p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#17c3b2]" />
                  <strong>Téléphone :</strong> 06 52 67 53 93
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#17c3b2]" />
                  <strong>Email :</strong> contact@parleremploi.com
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Déclaration d'activité
              </h2>
              <p>
                <strong>Numéro de déclaration d'activité :</strong> 11931070593
              </p>
              <p className="text-sm italic">
                Attribué le 03/04/2024 par la DRIEETS Île-de-France
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Cet enregistrement ne vaut pas agrément de l'État.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Certification Qualiopi
              </h2>
              <div className="bg-gradient-to-r from-[#17c3b2]/10 to-[#32cf8a]/10 border-l-4 border-[#17c3b2] p-4">
                <p><strong>Organisme certifié Qualiopi</strong></p>
                <p>Certificat n° QUA008756</p>
                <p>Valable du 11/08/2025 au 10/08/2028</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                La certification qualité a été délivrée au titre de la catégorie d'action suivante : 
                ACTIONS DE FORMATION
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Hébergement du site
              </h2>
              <p><strong>Hébergeur :</strong> Base44</p>
              <p><strong>Localisation :</strong> Union Européenne</p>
              <p><strong>Site web :</strong> <a href="https://base44.com" target="_blank" rel="noopener noreferrer" className="text-[#17c3b2] hover:underline">base44.com</a></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Propriété intellectuelle
              </h2>
              <p>
                L'ensemble des contenus présents sur ce site (textes, images, graphismes, logo, icônes, sons, logiciels) 
                sont la propriété exclusive de ParlerEmploi Formation, à l'exception des marques, logos ou contenus 
                appartenant à d'autres sociétés partenaires ou auteurs.
              </p>
              <p className="mt-2">
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments 
                du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Données personnelles
              </h2>
              <p>
                Le traitement des données personnelles collectées sur ce site est régi par notre 
                <Link to={createPageUrl('Privacy')} className="text-[#17c3b2] hover:underline ml-1">
                  Politique de confidentialité
                </Link>.
              </p>
              <p className="mt-2">
                <strong>Délégué à la Protection des Données (DPO) :</strong> contact@parleremploi.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Cookies
              </h2>
              <p>
                Le site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du test de positionnement 
                (stockage local). Aucun cookie publicitaire ou de traçage n'est utilisé.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Droit applicable
              </h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. 
                En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <div className="bg-gray-100 rounded-lg p-6 mt-8">
              <p className="text-center font-medium text-gray-900 mb-2">
                Une question sur nos mentions légales ?
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