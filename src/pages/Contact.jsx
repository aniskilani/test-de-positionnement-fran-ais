import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from '@/api/base44Client';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await base44.integrations.Core.SendEmail({
        from_name: name,
        to: 'contact@parleremploi.com',
        subject: `[Contact Site] ${subject}`,
        body: `
Nouveau message reçu depuis le formulaire de contact :

Nom : ${name}
Email : ${email}
Sujet : ${subject}

Message :
${message}

---
Envoyé depuis parleremploi.com
        `
      });

      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error('Erreur envoi:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg text-gray-600">
            Une question ? Un projet de formation ? Nous sommes là pour vous accompagner.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire de contact */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Envoyez-nous un message
            </h2>

            {sent && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Message envoyé avec succès !</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Votre nom</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Votre email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean.dupont@email.com"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Demande de formation, question sur le test..."
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre demande..."
                  required
                  className="min-h-[150px]"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full h-12 bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90"
              >
                {sending ? (
                  <>Envoi en cours...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Nos coordonnées
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#17c3b2]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#17c3b2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Accueil</h3>
                    <p className="text-gray-600">
                      Médiathèque Persepolis<br />
                      4, avenue Gabriel-Péri<br />
                      93400 Saint-Ouen-sur-Seine
                    </p>
                    <p className="text-sm text-[#17c3b2] font-medium mt-2">
                      Mardi et jeudi : 14h - 16h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#17c3b2]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#17c3b2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                    <a href="tel:0652675393" className="text-[#17c3b2] hover:underline">
                      06 52 67 53 93
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#17c3b2]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#17c3b2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:contact@parleremploi.com" className="text-[#17c3b2] hover:underline">
                      contact@parleremploi.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-gradient-to-br from-[#25D366]/10 to-[#25D366]/5 border-2 border-[#25D366]/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-8 h-8 text-[#25D366]" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Discutez avec nous
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Besoin d'une réponse rapide ? Contactez-nous sur WhatsApp !
              </p>
              <a 
                href="https://wa.me/33652675393?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20formations%20FLE" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button
                  className="w-full h-12 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ouvrir WhatsApp
                </Button>
              </a>
            </div>

            {/* Certification */}
            <div className="bg-gradient-to-br from-[#17c3b2]/10 to-[#32cf8a]/10 border-2 border-[#17c3b2]/20 rounded-2xl p-6">
              <p className="text-center font-semibold text-gray-900 mb-2">
                Organisme certifié Qualiopi
              </p>
              <p className="text-center text-sm text-gray-600">
                Certificat n° QUA008756<br />
                NDA : 11931070593
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}