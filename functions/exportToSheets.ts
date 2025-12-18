import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Vérifier l'authentification
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer tous les résultats de test
    const results = await base44.asServiceRole.entities.TestResult.list();

    if (!results || results.length === 0) {
      return Response.json({ error: 'Aucune donnée à exporter' }, { status: 400 });
    }

    // Obtenir le token d'accès Google Sheets
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlesheets');

    // Créer une nouvelle feuille
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: `Résultats Tests FLE - ${new Date().toLocaleDateString('fr-FR')}`
        },
        sheets: [{
          properties: {
            title: 'Résultats'
          }
        }]
      })
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      return Response.json({ error: 'Erreur création feuille: ' + error }, { status: 500 });
    }

    const spreadsheet = await createResponse.json();
    const spreadsheetId = spreadsheet.spreadsheetId;

    // Préparer les données
    const headers = [
      'Date',
      'Nom',
      'Email',
      'Téléphone',
      'Score (%)',
      'Niveau CECRL',
      'Durée (min)',
      'Questions répondues',
      'Questions correctes'
    ];

    const rows = results.map(result => [
      new Date(result.created_date).toLocaleDateString('fr-FR'),
      result.candidate_name || '',
      result.candidate_email || '',
      result.candidate_phone || '',
      result.score || 0,
      result.level || '',
      result.duration_seconds ? Math.round(result.duration_seconds / 60) : 0,
      result.answers?.length || 0,
      result.answers?.filter(a => a.correct).length || 0
    ]);

    const values = [headers, ...rows];

    // Insérer les données
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Résultats!A1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      return Response.json({ error: 'Erreur insertion données: ' + error }, { status: 500 });
    }

    // Formater la feuille (en-têtes en gras)
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true
                    },
                    backgroundColor: {
                      red: 0.0,
                      green: 0.31,
                      blue: 0.31
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 1.0,
                        green: 1.0,
                        blue: 1.0
                      },
                      bold: true
                    }
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)'
              }
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: 0,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: 9
                }
              }
            }
          ]
        })
      }
    );

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    return Response.json({
      success: true,
      url: sheetUrl,
      spreadsheetId: spreadsheetId,
      recordsExported: results.length
    });

  } catch (error) {
    console.error('Export error:', error);
    return Response.json({ 
      error: error.message || 'Erreur lors de l\'export' 
    }, { status: 500 });
  }
});