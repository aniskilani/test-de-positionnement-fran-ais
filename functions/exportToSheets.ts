import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Vérifier l'authentification
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Récupérer tous les résultats de test
        const results = await base44.asServiceRole.entities.TestResult.list();

        // Récupérer le token Google Sheets
        const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlesheets');

        // Créer un nouveau spreadsheet
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

        const spreadsheet = await createResponse.json();
        const spreadsheetId = spreadsheet.spreadsheetId;

        // Préparer les données
        const headers = [
            'Date',
            'Nom',
            'Email',
            'Téléphone',
            'Score',
            'Niveau',
            'Durée (min)'
        ];

        const rows = results.map(result => [
            new Date(result.created_date).toLocaleDateString('fr-FR'),
            result.candidate_name || '',
            result.candidate_email || '',
            result.candidate_phone || '',
            result.score || 0,
            result.level || '',
            Math.round((result.duration_seconds || 0) / 60)
        ]);

        // Insérer les données
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Résultats!A1:append?valueInputOption=RAW`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [headers, ...rows]
            })
        });

        // Formater le header
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
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
                                    backgroundColor: { red: 0.0, green: 0.31, blue: 0.29 },
                                    textFormat: {
                                        foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
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
                                endIndex: 7
                            }
                        }
                    }
                ]
            })
        });

        return Response.json({
            success: true,
            spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
            count: results.length
        });

    } catch (error) {
        console.error('Export error:', error);
        return Response.json({ 
            error: error.message || 'Erreur lors de l\'export' 
        }, { status: 500 });
    }
});