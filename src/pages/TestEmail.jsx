import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestEmail() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sendEmail = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await base44.functions.invoke('sendFollowUpEmail', {
        resultId: '69695956928c439873f517a6'
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Email de Relance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={sendEmail}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer l\'email à anis.kilani@parleremploi.fr'}
            </Button>

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✓ Succès</p>
                <pre className="mt-2 text-sm text-green-700 whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">✗ Erreur</p>
                <p className="mt-2 text-sm text-red-700">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}