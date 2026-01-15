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

    // Envoyer l'email avec le lien vers le PDF
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'ParlerEmploi Formation',
      to: testResult.candidate_email,
      subject: 'Vos résultats au test de positionnement FLE',
      body: `
Bonjour ${testResult.candidate_name},

Félicitations pour avoir complété le test de positionnement en français langue étrangère !

📊 Votre niveau : ${testResult.level}
🎯 Votre score : ${testResult.score}/100

Vous pouvez télécharger votre fiche de résultats détaillée en cliquant sur ce lien :
${file_url}

Cette fiche contient :
- Votre niveau CECRL officiel
- Votre score global
- Vos performances par catégorie
- Vos statistiques détaillées

Pour aller plus loin et améliorer votre français, n'hésitez pas à nous contacter pour découvrir nos formations personnalisées adaptées à votre niveau.

📧 Email : contact@parleremploi.com
🌐 Site web : https://parleremploi.com

Cordialement,
L'équipe ParlerEmploi Formation
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