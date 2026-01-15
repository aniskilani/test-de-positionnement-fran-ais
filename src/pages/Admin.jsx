import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Loader2, ExternalLink, Users, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Admin() {
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  const [error, setError] = useState('');

  const { data: results = [] } = useQuery({
    queryKey: ['testResults'],
    queryFn: () => base44.entities.TestResult.list('-created_date')
  });

  const handleExport = async () => {
    setExporting(true);
    setError('');
    setExportResult(null);

    try {
      const response = await base44.functions.invoke('exportToSheets');
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setExportResult(response.data);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
          <p className="text-gray-600">Gestion et export des résultats de tests</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total des tests</CardTitle>
              <Users className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#00504e]">{results.length}</div>
              <p className="text-xs text-gray-500 mt-1">Tests complétés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
              <CheckCircle className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#00504e]">
                {results.length > 0 
                  ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length)
                  : 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Sur tous les tests</p>
            </CardContent>
          </Card>
        </div>

        {/* Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#00504e]" />
              Export Google Sheets
            </CardTitle>
            <CardDescription>
              Exportez tous les résultats de tests vers une nouvelle feuille Google Sheets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-900">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {exportResult && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>Export réussi !</strong>
                      <p className="text-sm mt-1">{exportResult.recordsExported} résultats exportés</p>
                    </div>
                    <a 
                      href={exportResult.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-4"
                    >
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Ouvrir
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleExport}
              disabled={exporting || results.length === 0}
              className="w-full h-12 bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exporter vers Google Sheets
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Une nouvelle feuille sera créée dans votre Google Drive
            </p>
          </CardContent>
        </Card>

        {/* Recent Results with Prospect Tracking */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Prospects récents</CardTitle>
            <CardDescription>
              🔥 = Test complété il y a moins de 7 jours (offre active)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.slice(0, 10).map((result) => {
                const daysSinceTest = Math.floor((new Date() - new Date(result.created_date)) / (1000 * 60 * 60 * 24));
                const isHot = daysSinceTest <= 7;
                
                return (
                  <div key={result.id} className={`flex items-center justify-between p-3 rounded-lg ${isHot ? 'bg-orange-50 border-2 border-orange-200' : 'bg-gray-50'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {isHot && <span className="text-xl">🔥</span>}
                        <div>
                          <p className="font-medium text-gray-900">{result.candidate_name}</p>
                          <p className="text-sm text-gray-500">{result.candidate_email}</p>
                          {result.candidate_phone && (
                            <a href={`tel:${result.candidate_phone}`} className="text-sm text-[#17c3b2] hover:underline">
                              {result.candidate_phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#00504e]">{result.score}%</p>
                      <p className="text-sm text-gray-500">Niveau {result.level}</p>
                      <p className="text-xs text-gray-400">Il y a {daysSinceTest}j</p>
                      {isHot && (
                        <span className="inline-block mt-1 text-xs bg-orange-500 text-white px-2 py-1 rounded">
                          Offre -10% active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {results.length === 0 && (
                <p className="text-center text-gray-500 py-8">Aucun résultat pour le moment</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}