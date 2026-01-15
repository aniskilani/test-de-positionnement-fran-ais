import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@2.5.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { resultId } = await req.json();

    // Récupérer les résultats du test
    const results = await base44.asServiceRole.entities.TestResult.filter({ id: resultId });
    if (results.length === 0) {
      return Response.json({ error: 'Résultat non trouvé' }, { status: 404 });
    }

    const testResult = results[0];

    // Créer le PDF
    const doc = new jsPDF();

    // Header avec logo (texte pour simuler)
    doc.setFontSize(20);
    doc.setTextColor(0, 80, 78); // #00504e
    doc.text('ParlerEmploi Formation', 105, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Test de Positionnement FLE', 105, 30, { align: 'center' });

    // Ligne de séparation
    doc.setDrawColor(23, 195, 178); // #17c3b2
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Informations candidat
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Candidat :', 20, 45);
    doc.setFont(undefined, 'normal');
    doc.text(testResult.candidate_name || 'N/A', 50, 45);

    doc.setFont(undefined, 'bold');
    doc.text('Email :', 20, 52);
    doc.setFont(undefined, 'normal');
    doc.text(testResult.candidate_email || 'N/A', 50, 52);

    doc.setFont(undefined, 'bold');
    doc.text('Date :', 20, 59);
    doc.setFont(undefined, 'normal');
    doc.text(new Date(testResult.created_date).toLocaleDateString('fr-FR'), 50, 59);

    // Résultat principal - Encadré
    doc.setFillColor(23, 195, 178, 0.1);
    doc.roundedRect(20, 70, 170, 40, 3, 3, 'F');

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 80, 78);
    doc.text('Niveau CECRL :', 30, 82);
    
    doc.setFontSize(24);
    doc.setTextColor(23, 195, 178);
    doc.text(testResult.level || 'N/A', 30, 95);

    doc.setFontSize(14);
    doc.setTextColor(0, 80, 78);
    doc.text('Score :', 120, 82);
    
    doc.setFontSize(24);
    doc.text(`${testResult.score || 0}/100`, 120, 95);

    // Statistiques
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('Statistiques du test :', 20, 125);
    doc.setFont(undefined, 'normal');

    const correctAnswers = testResult.answers?.filter(a => a.correct).length || 0;
    const totalQuestions = testResult.answers?.length || 0;
    const duration = Math.floor((testResult.duration_seconds || 0) / 60);

    doc.text(`✓ Questions réussies : ${correctAnswers} / ${totalQuestions}`, 30, 135);
    doc.text(`✗ Questions manquées : ${totalQuestions - correctAnswers}`, 30, 142);
    doc.text(`⏱ Durée du test : ${duration} minutes`, 30, 149);

    // Catégories (si disponible)
    doc.setFont(undefined, 'bold');
    doc.text('Performance par catégorie :', 20, 165);
    doc.setFont(undefined, 'normal');

    let yPos = 175;
    const categoryStats = {};
    
    // Calculer les stats par catégorie (simplifié)
    testResult.answers?.forEach((answer) => {
      // Les catégories sont stockées dans les réponses
      const category = answer.category || 'Général';
      if (!categoryStats[category]) {
        categoryStats[category] = { correct: 0, total: 0 };
      }
      categoryStats[category].total++;
      if (answer.correct) {
        categoryStats[category].correct++;
      }
    });

    Object.entries(categoryStats).forEach(([category, stats]) => {
      const percentage = Math.round((stats.correct / stats.total) * 100);
      doc.text(`${category} : ${percentage}% (${stats.correct}/${stats.total})`, 30, yPos);
      yPos += 7;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('ParlerEmploi Formation - Test de positionnement FLE', 105, 285, { align: 'center' });

    // Convertir en buffer
    const pdfBytes = doc.output('arraybuffer');
    const pdfBlob = new Uint8Array(pdfBytes);

    // Upload le PDF
    const fileName = `resultats_${testResult.candidate_name?.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
    
    const { file_url } = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    // Envoyer l'email avec le lien vers le PDF (HTML formaté)
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'ParlerEmploi Formation',
      to: testResult.candidate_email,
      subject: '🎓 Vos résultats au test de positionnement FLE',
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #00504e 0%, #17c3b2 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
    .result-box { background: linear-gradient(135deg, #17c3b2 0%, #32cf8a 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
    .result-box .level { font-size: 48px; font-weight: bold; color: white; margin: 10px 0; }
    .result-box .score { font-size: 24px; color: rgba(255,255,255,0.95); }
    .result-box p { color: rgba(255,255,255,0.9); margin: 5px 0; }
    .download-btn { display: inline-block; background: #00504e; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .download-btn:hover { background: #003d3b; }
    .features { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .features h3 { color: #00504e; margin-top: 0; }
    .features ul { list-style: none; padding: 0; }
    .features li { padding: 8px 0; padding-left: 25px; position: relative; }
    .features li:before { content: "✓"; position: absolute; left: 0; color: #32cf8a; font-weight: bold; }
    .cta { background: #fff4e6; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .cta h3 { color: #f59e0b; margin-top: 0; }
    .contact { text-align: center; padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0; }
    .contact a { color: #17c3b2; text-decoration: none; font-weight: bold; }
    .footer { background: #f5f5f5; padding: 30px; text-align: center; color: #666; font-size: 12px; }
    .footer a { color: #17c3b2; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 ParlerEmploi Formation</h1>
      <p>Test de Positionnement FLE</p>
    </div>
    
    <div class="content">
      <p class="greeting">Bonjour <strong>${testResult.candidate_name}</strong>,</p>
      
      <p>Félicitations pour avoir complété le test de positionnement en français langue étrangère ! 🎉</p>
      
      <div class="result-box">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Votre niveau CECRL</p>
        <div class="level">${testResult.level}</div>
        <div class="score">${testResult.score}/100 points</div>
      </div>
      
      <p style="text-align: center;">
        <a href="${file_url}" class="download-btn">📄 Télécharger mes résultats détaillés</a>
      </p>
      
      <div class="features">
        <h3>📊 Votre fiche de résultats contient :</h3>
        <ul>
          <li>Votre niveau CECRL officiel (${testResult.level})</li>
          <li>Votre score global (${testResult.score}/100)</li>
          <li>Vos performances détaillées par catégorie</li>
          <li>Analyse de vos points forts et axes d'amélioration</li>
        </ul>
      </div>
      
      <div class="cta">
        <h3>🚀 Progressez dans votre apprentissage</h3>
        <p>Nos formations personnalisées sont adaptées à votre niveau <strong>${testResult.level}</strong> et vous permettent de progresser rapidement vers vos objectifs.</p>
        <p style="margin: 0;">Contactez-nous pour découvrir nos programmes certifiés Qualiopi.</p>
      </div>
      
      <div class="contact">
        <p><strong>Restons en contact</strong></p>
        <p>📧 <a href="mailto:contact@parleremploi.com">contact@parleremploi.com</a></p>
        <p>📱 <a href="tel:+33652675393">06 52 67 53 93</a></p>
        <p>🌐 <a href="https://parleremploi.com">parleremploi.com</a></p>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>ParlerEmploi Formation</strong></p>
      <p>Organisme certifié Qualiopi • NDA : 11931070593</p>
      <p>23 avenue Gabriel Péri, 93400 Saint-Ouen</p>
      <p style="margin-top: 15px;">
        <a href="#">Politique de confidentialité</a> • 
        <a href="#">Se désabonner</a>
      </p>
    </div>
  </div>
</body>
</html>
      `
    });

    return Response.json({ 
      success: true, 
      message: 'PDF envoyé avec succès',
      file_url 
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du PDF:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});