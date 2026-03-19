import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { resultId } = await req.json();

    // Récupérer le résultat du test
    const results = await base44.asServiceRole.entities.TestResult.filter({ id: resultId });
    if (results.length === 0) {
      return Response.json({ error: 'Résultat non trouvé' }, { status: 404 });
    }

    const testResult = results[0];
    const level = testResult.level;
    const name = testResult.candidate_name;
    const email = testResult.candidate_email;
    const score = testResult.score;

    // Calcul de l'expiration de l'offre (7 jours après le test)
    const testDate = new Date(testResult.created_date);
    const expirationDate = new Date(testDate);
    expirationDate.setDate(expirationDate.getDate() + 7);
    const daysLeft = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));

    // Personnalisation selon le niveau
    const levelContent = {
      A1: {
        emoji: "🌱",
        title: "Démarrez votre aventure en français",
        message: "Nos formations débutant A1 sont parfaites pour construire des bases solides."
      },
      A2: {
        emoji: "🚀",
        title: "Développez votre confiance en français",
        message: "Passez au niveau supérieur avec nos formations A2 conçues pour l'autonomie."
      },
      B1: {
        emoji: "💼",
        title: "Professionnalisez votre français",
        message: "Nos formations B1 vous préparent pour le monde professionnel."
      },
      B2: {
        emoji: "🎯",
        title: "Excellez en français professionnel",
        message: "Atteignez l'excellence avec nos formations avancées B2."
      }
    };

    const content = levelContent[level] || levelContent.A1;

    // Envoyer l'email de relance
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'ParlerEmploi Formation',
      to: email,
      subject: `${content.emoji} ${name}, votre offre formation expire dans ${daysLeft} jours !`,
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #00504e 0%, #17c3b2 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
    .urgency-box { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0; color: white; }
    .urgency-box .timer { font-size: 48px; font-weight: bold; margin: 10px 0; }
    .urgency-box p { margin: 5px 0; font-size: 16px; }
    .level-box { background: linear-gradient(135deg, #17c3b2 0%, #32cf8a 100%); border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0; color: white; }
    .level-box .level { font-size: 64px; font-weight: bold; margin: 10px 0; }
    .cta-button { display: inline-block; background: #00504e; color: white; padding: 18px 50px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,80,78,0.3); }
    .cta-button:hover { background: #003d3b; }
    .benefits { background: #f9f9f9; border-radius: 8px; padding: 25px; margin: 20px 0; }
    .benefits h3 { color: #00504e; margin-top: 0; }
    .benefits ul { list-style: none; padding: 0; margin: 15px 0; }
    .benefits li { padding: 10px 0; padding-left: 30px; position: relative; font-size: 16px; }
    .benefits li:before { content: "✓"; position: absolute; left: 0; color: #32cf8a; font-weight: bold; font-size: 20px; }
    .testimonial { background: #fff4e6; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px; font-style: italic; }
    .guarantee { background: #e6f7f5; border: 2px dashed #17c3b2; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .guarantee strong { color: #00504e; font-size: 18px; }
    .footer { background: #f5f5f5; padding: 30px; text-align: center; color: #666; font-size: 12px; }
    .footer a { color: #17c3b2; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${content.emoji} ${content.title}</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Bonjour <strong>${name}</strong>,</p>
      
      <p>Il y a 3 jours, vous avez complété notre test de positionnement FLE et obtenu un excellent résultat au niveau <strong>${level}</strong> avec ${score}/100 points ! 🎉</p>
      
      <div class="urgency-box">
        <p style="margin: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">⏰ Offre limitée</p>
        <div class="timer">${daysLeft} jours</div>
        <p style="font-size: 18px; font-weight: bold; margin: 10px 0;">pour profiter de -10% sur votre formation</p>
        <p style="font-size: 14px; opacity: 0.9;">Expire le ${expirationDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      
      <p style="font-size: 18px; color: #00504e; font-weight: bold;">${content.message}</p>
      
      <div class="level-box">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Votre niveau actuel</p>
        <div class="level">${level}</div>
        <p style="font-size: 16px;">Prêt pour la suite de votre parcours</p>
      </div>
      
      <div class="benefits">
        <h3>🎓 Ce qui vous attend dans votre formation :</h3>
        <ul>
          <li>Programme adapté à votre niveau ${level}</li>
          <li>Formateurs certifiés et expérimentés</li>
          <li>Groupes de 8 personnes maximum</li>
          <li>Horaires flexibles (jour/soir)</li>
          <li>Financement CPF, Pôle Emploi, OPCO acceptés</li>
          <li>Attestation de fin de formation certifiée</li>
        </ul>
      </div>
      
      <div class="testimonial">
        <p>"J'ai débuté au niveau A1 et grâce à ParlerEmploi, j'ai progressé jusqu'au B1 en 6 mois. Aujourd'hui je travaille en français tous les jours !"</p>
        <p style="margin-top: 10px;"><strong>- Marie L., ancienne apprenante</strong></p>
      </div>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://wa.me/33652675393?text=Bonjour%2C%20je%20souhaite%20profiter%20de%20l'offre%20-10%%20suite%20à%20mon%20test%20niveau%20${level}" class="cta-button">
          💬 Réserver ma place maintenant
        </a>
        <p style="margin-top: 15px; color: #f59e0b; font-weight: bold;">
          Encore ${daysLeft} jours pour économiser 10% !
        </p>
      </div>
      
      <div class="guarantee">
        <strong>🛡️ Garantie satisfait ou remboursé</strong>
        <p style="margin-top: 10px;">Si après 2 séances vous n'êtes pas satisfait, nous vous remboursons intégralement.</p>
      </div>
      
      <p style="margin-top: 30px;">Vous avez des questions ? Notre équipe est disponible :</p>
      <p style="text-align: center; margin: 20px 0;">
        <strong>📱 WhatsApp :</strong> <a href="https://wa.me/33652675393" style="color: #17c3b2;">06 52 67 53 93</a><br>
        <strong>📧 Email :</strong> <a href="mailto:contact@parleremploi.com" style="color: #17c3b2;">contact@parleremploi.com</a><br>
        <strong>📞 Téléphone :</strong> <a href="tel:0652675393" style="color: #17c3b2;">06 52 67 53 93</a>
      </p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        <em>P.S. : Les places sont limitées pour le prochain groupe. Ne laissez pas passer cette opportunité de progresser avec une réduction de 10% !</em>
      </p>
    </div>
    
    <div class="footer">
      <p><strong>ParlerEmploi Formation</strong></p>
      <p>Organisme certifié Qualiopi • NDA : 11931070593</p>
      <p>Accueil : Médiathèque Persepolis, 4 avenue Gabriel-Péri, 93400 Saint-Ouen-sur-Seine (mardi et jeudi 14h-16h)</p>
      <p style="margin-top: 15px; font-size: 10px; color: #999;">
        Vous recevez cet email car vous avez passé notre test de positionnement FLE.<br>
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
      message: 'Email de relance envoyé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});