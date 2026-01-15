import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Download, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { base44 } from '@/api/base44Client';

export default function MyAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myResults, setMyResults] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExportData = async () => {
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const results = await base44.entities.TestResult.filter({ candidate_email: email });
      
      if (results.length === 0) {
        setError('Aucune donnée trouvée pour cet email');
        setLoading(false);
        return;
      }

      setMyResults(results);

      // Créer un fichier JSON avec toutes les données
      const exportData = {
        email: email,
        export_date: new Date().toISOString(),
        results: results.map(r => ({
          id: r.id,
          candidate_name: r.candidate_name,
          candidate_email: r.candidate_email,
          candidate_phone: r.candidate_phone,
          score: r.score,
          level: r.level,
          test_date: r.created_date,
          duration_seconds: r.duration_seconds,
          gdpr_consent_date: r.gdpr_consent_date
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mes_donnees_parleremploi_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      setError('Erreur lors de l\'export des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);

    try {
      // Supprimer tous les résultats associés à cet email
      for (const result of myResults) {
        await base44.entities.TestResult.delete(result.id);
      }

      setShowDeleteDialog(false);
      alert('Vos données ont été supprimées avec succès');
      navigate(createPageUrl('Home'));
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Mes données personnelles
        </h1>

        <div className="space-y-6">
          {/* Export des données */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Exporter mes données
            </h2>
            <p className="text-gray-600 mb-6">
              Conformément au RGPD, vous pouvez télécharger toutes vos données personnelles au format JSON.
            </p>

            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Votre adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="h-12"
                />
              </div>

              <Button
                onClick={handleExportData}
                disabled={loading || !email}
                className="w-full h-12 bg-[#17c3b2] hover:bg-[#00504e]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Recherche en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger mes données
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Suppression du compte */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-red-600">
              Supprimer mes données
            </h2>
            <p className="text-gray-600 mb-6">
              Vous pouvez demander la suppression définitive de toutes vos données personnelles. 
              Cette action est <strong>irréversible</strong>.
            </p>

            <Button
              onClick={() => {
                if (myResults.length === 0) {
                  setError('Veuillez d\'abord exporter vos données pour vérifier votre email');
                  return;
                }
                setShowDeleteDialog(true);
              }}
              disabled={myResults.length === 0}
              variant="destructive"
              className="w-full h-12"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer toutes mes données
            </Button>
          </div>

          {/* Informations RGPD */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Vos droits RGPD
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Droit d'accès : téléchargez vos données</li>
              <li>• Droit à l'effacement : supprimez vos données</li>
              <li>• Droit de rectification : contactez-nous à contact@parleremploi.com</li>
              <li>• Droit d'opposition : contactez-nous</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr(e) de vouloir supprimer définitivement toutes vos données ?
              Cette action est irréversible et supprimera :
              <ul className="mt-2 list-disc pl-6">
                <li>Tous vos résultats de test</li>
                <li>Vos informations personnelles</li>
                <li>Votre historique</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Confirmer la suppression'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}