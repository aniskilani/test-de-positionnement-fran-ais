// ============================================================
// TEST DE POSITIONNEMENT FLE — ParlerEmploi Formation
// Durée estimée : 1h15-1h30 | ~35 questions variées A1→C1
// Types de questions :
//   listen_choose  — Écouter et choisir (audio TTS + QCM)
//   listen_repeat  — Écouter et répéter (audio TTS + saisie)
//   fill_in_blank  — Compléter les blancs (champ texte inline)
//   complete_dialogue — Compléter un dialogue (QCM contextuel)
//   safety_instruction — Consignes de sécurité (QCM + icône)
//   drag_match     — Associer (paires) → rendu comme QCM
//   reformulate    — Reformuler une phrase (écrit libre)
//   scenario_tree  — Scénario décisionnel (QCM narratif)
//   oral           — Production orale libre (enregistrement)
//   written        — Production écrite libre
// ============================================================

export const questions = [

  // ─── BLOC 1 : COMPRÉHENSION ORALE (A1) ──────────────────
  {
    id: 1,
    level: "A1",
    category: "Compréhension Orale",
    type: "listen_choose",
    question: "Écoutez. Quel jour est mentionné ?",
    audioText: "On se voit lundi prochain.",
    options: ["Mardi", "Mercredi", "Lundi", "Jeudi"],
    correct: "Lundi",
    explanation: "La phrase mentionne 'lundi prochain'."
  },
  {
    id: 2,
    level: "A1",
    category: "Compréhension Orale",
    type: "listen_choose",
    question: "Écoutez la consigne du responsable. Que demande-t-il ?",
    audioText: "Rangez votre poste de travail avant de partir, s'il vous plaît.",
    options: ["Appeler un collègue", "Ranger son poste de travail avant de partir", "Fermer la porte", "Vérifier l'heure de départ"],
    correct: "Ranger son poste de travail avant de partir",
    explanation: "La consigne est clairement de ranger son poste de travail avant de partir."
  },
  {
    id: 3,
    level: "A2",
    category: "Compréhension Orale",
    type: "listen_choose",
    question: "Écoutez. Que demande le responsable ?",
    audioText: "Pouvez-vous envoyer ce document avant seize heures s'il vous plaît ?",
    options: ["D'imprimer un document", "D'envoyer un document avant 16h", "De rester après 16h", "D'appeler un client"],
    correct: "D'envoyer un document avant 16h",
    explanation: "Le responsable demande d'envoyer le document avant 16h."
  },
  {
    id: 4,
    level: "B1",
    category: "Compréhension Orale",
    type: "listen_choose",
    question: "Écoutez l'annonce. À quelle heure part le train ?",
    audioText: "Le train en provenance de Paris partira à quinze heures trente du quai numéro trois.",
    options: ["14h30", "15h30", "16h30", "17h30"],
    correct: "15h30",
    explanation: "L'annonce indique clairement que le train partira à 15h30."
  },
  {
    id: 5,
    level: "B1",
    category: "Compréhension Orale",
    type: "listen_choose",
    question: "Écoutez. Que doit faire l'employé ?",
    audioText: "Merci de remplir le formulaire de demande de congé au moins deux semaines à l'avance et de le remettre à votre responsable.",
    options: ["Partir en congé sans prévenir", "Remplir un formulaire de congé deux semaines à l'avance", "Envoyer un email à la direction", "Appeler le service RH le jour même"],
    correct: "Remplir un formulaire de congé deux semaines à l'avance",
    explanation: "La consigne précise : formulaire à remplir et à remettre deux semaines avant le départ."
  },

  // ─── BLOC 2 : GRAMMAIRE — FILL IN BLANK ─────────────────
  {
    id: 6,
    level: "A1",
    category: "Grammaire",
    type: "fill_in_blank",
    question: "Complétez la phrase avec le bon mot.",
    template: "Je ___ français.",
    blank_answer: "suis",
    options: ["suis", "ai", "est", "as"],
    correct: "suis",
    explanation: "On utilise 'suis' avec 'je' : Je suis français."
  },
  {
    id: 7,
    level: "A1",
    category: "Grammaire",
    type: "fill_in_blank",
    question: "Choisissez la bonne forme pour compléter.",
    template: "Elle ___ à Paris.",
    blank_answer: "habite",
    options: ["habite", "habiter", "habitez", "habitent"],
    correct: "habite",
    explanation: "Avec 'elle', on conjugue : elle habite."
  },
  {
    id: 8,
    level: "A2",
    category: "Grammaire",
    type: "fill_in_blank",
    question: "Complétez avec la forme correcte.",
    template: "Hier, nous ___ au cinéma.",
    blank_answer: "sommes allés",
    options: ["allons", "sommes allés", "irons", "allions"],
    correct: "sommes allés",
    explanation: "Le passé composé de 'aller' avec 'nous' : nous sommes allés."
  },
  {
    id: 9,
    level: "B1",
    category: "Grammaire",
    type: "fill_in_blank",
    question: "Complétez avec la forme qui convient.",
    template: "Si j'avais le temps, je ___ ce livre.",
    blank_answer: "lirais",
    options: ["lis", "lirais", "lirai", "lisais"],
    correct: "lirais",
    explanation: "Si + imparfait → conditionnel présent : je lirais."
  },
  {
    id: 10,
    level: "B2",
    category: "Grammaire",
    type: "fill_in_blank",
    question: "Choisissez la forme correcte.",
    template: "Bien qu'il ___ fatigué, il a continué à travailler.",
    blank_answer: "soit",
    options: ["est", "soit", "était", "serait"],
    correct: "soit",
    explanation: "Après 'bien que', on utilise le subjonctif : bien qu'il soit."
  },

  // ─── BLOC 3 : SITUATIONS PROFESSIONNELLES — SCÉNARIOS ───
  {
    id: 11,
    level: "A1",
    category: "Situations Professionnelles",
    type: "scenario_tree",
    question: "Vous arrivez au travail. Votre responsable vous donne une consigne que vous n'avez pas comprise. Que faites-vous ?",
    context: "🏢 Votre premier jour dans l'entreprise.",
    options: ["Vous faites semblant de comprendre", "Vous demandez poliment de répéter", "Vous ignorez la consigne", "Vous rentrez chez vous"],
    correct: "Vous demandez poliment de répéter",
    explanation: "Il est toujours préférable de demander des clarifications plutôt que de mal exécuter une tâche."
  },
  {
    id: 12,
    level: "A1",
    category: "Situations Professionnelles",
    type: "scenario_tree",
    question: "Vous êtes malade et ne pouvez pas venir travailler. Que devez-vous faire ?",
    context: "📱 Il est 7h du matin.",
    options: ["Ne rien dire", "Envoyer un message à votre responsable le plus tôt possible", "Venir quand même", "Demander à un collègue de travailler à votre place"],
    correct: "Envoyer un message à votre responsable le plus tôt possible",
    explanation: "Il faut toujours prévenir son employeur en cas d'absence."
  },
  {
    id: 13,
    level: "A2",
    category: "Situations Professionnelles",
    type: "scenario_tree",
    question: "Vous arrivez en retard à une réunion. Que dites-vous ?",
    context: "⏰ Vous avez 10 minutes de retard.",
    options: ["Rien, vous vous asseyez.", "Excusez-moi pour le retard.", "C'est de votre faute.", "Je suis fatigué."],
    correct: "Excusez-moi pour le retard.",
    explanation: "Il est important de s'excuser lorsqu'on arrive en retard."
  },
  {
    id: 14,
    level: "B1",
    category: "Situations Professionnelles",
    type: "scenario_tree",
    question: "Votre responsable vous demande de réaliser une tâche que vous ne savez pas faire. Que dites-vous ?",
    context: "💼 Nouvelle mission en réunion.",
    options: ["Vous dites que vous la ferez sans demander d'aide", "Vous expliquez honnêtement et demandez un accompagnement", "Vous refusez catégoriquement", "Vous demandez à un collègue de le faire en secret"],
    correct: "Vous expliquez honnêtement et demandez un accompagnement",
    explanation: "L'honnêteté et la demande de soutien sont des signes de professionnalisme."
  },
  {
    id: 15,
    level: "B2",
    category: "Situations Professionnelles",
    type: "scenario_tree",
    question: "Un client se plaint d'un service rendu par votre entreprise. Comment gérez-vous la situation ?",
    context: "📞 Appel entrant d'un client mécontent.",
    options: ["Vous niez les faits", "Vous écoutez, reformulez, vous excusez et proposez une solution", "Vous renvoyez le client vers un autre service sans explication", "Vous raccrochez"],
    correct: "Vous écoutez, reformulez, vous excusez et proposez une solution",
    explanation: "La gestion d'une réclamation repose sur l'écoute, la reformulation et la solution."
  },

  // ─── BLOC 4 : CONSIGNES DE SÉCURITÉ ─────────────────────
  {
    id: 16,
    level: "A1",
    category: "Situations Professionnelles",
    type: "safety_instruction",
    question: "Vous voyez ce panneau dans l'atelier. Que signifie-t-il ?",
    safetyIcon: "🚫🔥",
    safetyLabel: "INTERDICTION DE FUMER",
    options: ["Fumer est autorisé ici", "Il est interdit de fumer dans cette zone", "Fumer est obligatoire", "Allumer un feu est conseillé"],
    correct: "Il est interdit de fumer dans cette zone",
    explanation: "Le panneau d'interdiction de fumer signifie que toute cigarette est prohibée dans la zone."
  },
  {
    id: 17,
    level: "A2",
    category: "Situations Professionnelles",
    type: "safety_instruction",
    question: "Vous lisez cette instruction de sécurité. Que devez-vous faire ?",
    safetyIcon: "⚠️",
    safetyLabel: "En cas d'incendie, ne prenez pas l'ascenseur. Utilisez les escaliers de secours.",
    options: ["Prendre l'ascenseur pour aller plus vite", "Utiliser les escaliers de secours", "Rester dans son bureau", "Appeler ses collègues"],
    correct: "Utiliser les escaliers de secours",
    explanation: "En cas d'incendie, l'ascenseur est dangereux. Il faut toujours utiliser les escaliers de secours."
  },
  {
    id: 18,
    level: "B1",
    category: "Situations Professionnelles",
    type: "safety_instruction",
    question: "Lisez cette règle de sécurité. Que signifie-t-elle ?",
    safetyIcon: "🦺",
    safetyLabel: "Le port d'équipements de protection individuelle (EPI) est obligatoire dans cette zone.",
    options: ["Les équipements de protection sont facultatifs", "Il faut obligatoirement porter des équipements de protection", "Les équipements sont fournis à la sortie", "Cette règle ne s'applique qu'aux chefs d'équipe"],
    correct: "Il faut obligatoirement porter des équipements de protection",
    explanation: "EPI = Équipements de Protection Individuelle (casque, gants, lunettes...). Leur port est obligatoire dans les zones indiquées."
  },

  // ─── BLOC 5 : COMPLÉTER UN DIALOGUE ─────────────────────
  {
    id: 19,
    level: "A1",
    category: "Grammaire",
    type: "complete_dialogue",
    question: "Complétez ce dialogue entre un employé et un client.",
    dialogue: [
      { speaker: "Client", text: "Bonjour, je voudrais parler à M. Dupont." },
      { speaker: "Employé", text: "___" },
    ],
    options: [
      "Oui c'est moi, quoi ?",
      "Bonjour ! Un instant s'il vous plaît, je vous le passe.",
      "Il n'est pas là, au revoir.",
      "Appelez plus tard."
    ],
    correct: "Bonjour ! Un instant s'il vous plaît, je vous le passe.",
    explanation: "Une réponse professionnelle au téléphone est toujours polie et propose une aide concrète."
  },
  {
    id: 20,
    level: "A2",
    category: "Grammaire",
    type: "complete_dialogue",
    question: "Complétez ce dialogue en entreprise.",
    dialogue: [
      { speaker: "Responsable", text: "Pouvez-vous finir ce rapport pour demain matin ?" },
      { speaker: "Employé", text: "___" },
    ],
    options: [
      "Non, c'est trop de travail.",
      "Oui, je ferai de mon mieux. Y a-t-il des points prioritaires ?",
      "Pourquoi moi ?",
      "Je ne sais pas faire les rapports."
    ],
    correct: "Oui, je ferai de mon mieux. Y a-t-il des points prioritaires ?",
    explanation: "Accepter une mission en demandant des précisions montre du professionnalisme."
  },
  {
    id: 21,
    level: "B1",
    category: "Grammaire",
    type: "complete_dialogue",
    question: "Complétez cet échange lors d'un entretien d'embauche.",
    dialogue: [
      { speaker: "Recruteur", text: "Quels sont vos points forts ?" },
      { speaker: "Candidat", text: "___" },
    ],
    options: [
      "Je suis toujours en retard mais je travaille bien.",
      "Je suis rigoureux, je m'adapte facilement et j'aime travailler en équipe.",
      "Je ne sais pas vraiment.",
      "Je suis le meilleur dans mon domaine."
    ],
    correct: "Je suis rigoureux, je m'adapte facilement et j'aime travailler en équipe.",
    explanation: "Il faut présenter ses qualités de façon concrète et positive lors d'un entretien."
  },

  // ─── BLOC 6 : VOCABULAIRE PROFESSIONNEL ─────────────────
  {
    id: 22,
    level: "A1",
    category: "Vocabulaire Professionnel",
    type: "listen_choose",
    question: "Qu'est-ce qu'une « tenue de travail » ?",
    audioText: "Qu'est-ce qu'une tenue de travail ?",
    options: ["Des vêtements portés pour faire du sport", "Des vêtements appropriés et propres pour travailler", "La décoration du bureau", "L'heure d'arrivée"],
    correct: "Des vêtements appropriés et propres pour travailler",
    explanation: "La tenue de travail désigne les vêtements adaptés au poste."
  },
  {
    id: 23,
    level: "A2",
    category: "Vocabulaire Professionnel",
    type: "listen_choose",
    question: "Qu'est-ce qu'un CV ?",
    audioText: "Comment s'appelle le document qui résume votre parcours professionnel ?",
    options: ["Une lettre", "Un contrat", "Un CV", "Une facture"],
    correct: "Un CV",
    explanation: "Le CV (Curriculum Vitae) résume vos expériences, formations et compétences."
  },
  {
    id: 24,
    level: "A2",
    category: "Vocabulaire Professionnel",
    type: "fill_in_blank",
    question: "Complétez la phrase.",
    template: "Votre ___ de salaire détaille vos revenus et vos cotisations sociales.",
    blank_answer: "bulletin",
    options: ["bulletin", "planning", "contrat", "dossier"],
    correct: "bulletin",
    explanation: "Le bulletin (ou fiche) de salaire détaille la rémunération et les cotisations."
  },
  {
    id: 25,
    level: "B1",
    category: "Vocabulaire Professionnel",
    type: "listen_choose",
    question: "Que signifie « être polyvalent » au travail ?",
    audioText: "Que signifie être polyvalent au travail ?",
    options: ["Être spécialisé dans un seul domaine", "Savoir effectuer plusieurs types de tâches différentes", "Travailler à temps partiel", "Refuser certaines missions"],
    correct: "Savoir effectuer plusieurs types de tâches différentes",
    explanation: "La polyvalence permet d'intervenir sur des postes variés."
  },
  {
    id: 26,
    level: "B1",
    category: "Vocabulaire Professionnel",
    type: "fill_in_blank",
    question: "Complétez avec le bon terme.",
    template: "Un ___ à durée indéterminée (CDI) n'a pas de date de fin.",
    blank_answer: "contrat",
    options: ["contrat", "planning", "bulletin", "formulaire"],
    correct: "contrat",
    explanation: "Un CDI = Contrat à Durée Indéterminée, sans date de fin."
  },
  {
    id: 27,
    level: "B2",
    category: "Vocabulaire Professionnel",
    type: "listen_choose",
    question: "Que désigne la « confidentialité professionnelle » ?",
    audioText: "Que désigne la notion de confidentialité professionnelle ?",
    options: [
      "Le droit de partager toutes les informations de l'entreprise",
      "L'obligation de ne pas divulguer des informations sensibles liées au travail",
      "Un type de contrat de travail",
      "Une réunion à huis clos"
    ],
    correct: "L'obligation de ne pas divulguer des informations sensibles liées au travail",
    explanation: "La confidentialité professionnelle protège les données de l'entreprise et des clients."
  },

  // ─── BLOC 7 : COMPRÉHENSION ÉCRITE ──────────────────────
  {
    id: 28,
    level: "A2",
    category: "Compréhension Écrite",
    type: "listen_choose",
    question: "Lisez ce panneau. Que signifie-t-il ?",
    audioText: "Interdiction de fumer dans les locaux.",
    options: ["Fumer est autorisé partout", "Il est interdit de fumer à l'intérieur", "Fumer est obligatoire", "Fumer est possible dans certaines pièces"],
    correct: "Il est interdit de fumer à l'intérieur",
    explanation: "'Interdiction de' signifie que quelque chose n'est pas permis."
  },
  {
    id: 29,
    level: "B1",
    category: "Compréhension Écrite",
    type: "listen_choose",
    question: "Lisez : « Malgré la pluie, nous avons continué notre promenade. » Qu'est-ce qui est vrai ?",
    audioText: "Malgré la pluie, nous avons continué notre promenade.",
    options: ["Ils ont arrêté à cause de la pluie", "Ils ont continué malgré la pluie", "Il ne pleuvait pas", "Ils sont rentrés"],
    correct: "Ils ont continué malgré la pluie",
    explanation: "'Malgré' indique qu'ils ont continué en dépit de la pluie."
  },
  {
    id: 30,
    level: "B2",
    category: "Compréhension Écrite",
    type: "listen_choose",
    question: "Lisez : « Tout accident du travail doit être déclaré dans les 24 heures. » Que signifie cette règle ?",
    audioText: "Tout accident du travail doit être déclaré dans les vingt-quatre heures suivant sa survenance.",
    options: ["On peut attendre plusieurs jours", "L'accident doit être signalé au plus tard le lendemain", "L'accident n'a pas besoin d'être déclaré", "La déclaration est facultative"],
    correct: "L'accident doit être signalé au plus tard le lendemain",
    explanation: "'Dans les 24 heures' signifie au plus tard le lendemain de l'accident."
  },

  // ─── BLOC 8 : REFORMULER ────────────────────────────────
  {
    id: 31,
    level: "A2",
    category: "Grammaire",
    type: "reformulate",
    question: "Reformulez cette phrase de manière plus polie pour un contexte professionnel.",
    originalText: "Donnez-moi le dossier.",
    placeholder: "Pourriez-vous me donner le dossier, s'il vous plaît ?",
    minWords: 5,
    criteria: ["Utilise une formule de politesse", "Garde le même sens", "Ton professionnel"]
  },
  {
    id: 32,
    level: "B1",
    category: "Grammaire",
    type: "reformulate",
    question: "Réécrivez cette phrase en utilisant le conditionnel pour la rendre plus courtoise.",
    originalText: "Je veux prendre rendez-vous.",
    placeholder: "Je voudrais prendre rendez-vous, s'il vous plaît.",
    minWords: 5,
    criteria: ["Utilise le conditionnel", "Ton poli et professionnel", "Sens conservé"]
  },

  // ─── BLOC 9 : PRODUCTION ORALE ──────────────────────────
  {
    id: 33,
    level: "A1",
    category: "Production Orale",
    type: "oral",
    question: "Présentez-vous : dites votre prénom, votre pays d'origine et votre métier (ou métier souhaité).",
    minDuration: 10,
    criteria: ["Prononciation compréhensible", "Donne au moins 2 informations personnelles", "Phrases simples et claires"]
  },
  {
    id: 34,
    level: "B1",
    category: "Production Orale",
    type: "oral",
    question: "Décrivez votre dernière expérience professionnelle ou de bénévolat. Quelles tâches faisiez-vous ? Qu'avez-vous appris ?",
    minDuration: 20,
    criteria: ["Utilise le passé", "Décrit des tâches concrètes", "S'exprime avec aisance", "Vocabulaire professionnel"]
  },

  // ─── BLOC 10 : PRODUCTION ÉCRITE ────────────────────────
  {
    id: 35,
    level: "A2",
    category: "Expression Écrite",
    type: "written",
    question: "Écrivez un message court à votre responsable pour lui expliquer que vous serez absent(e) demain et pourquoi. (3-4 phrases)",
    placeholder: "Exemple : Bonjour M. Martin, Je vous informe que je serai absent(e) demain car je suis malade. Je vous transmettrai un certificat médical dès que possible. Cordialement,",
    minWords: 25,
    criteria: ["Formule de politesse en début et fin", "Explique la raison de l'absence", "Ton professionnel", "Phrases simples et correctes"]
  },
  {
    id: 36,
    level: "B1",
    category: "Expression Écrite",
    type: "written",
    question: "Rédigez un email à un client pour confirmer un rendez-vous. Précisez le jour, l'heure et le lieu. (4-5 phrases)",
    placeholder: "Exemple : Madame, Monsieur, Je me permets de vous confirmer notre rendez-vous du...",
    minWords: 35,
    criteria: ["Formule d'appel professionnelle", "Confirme clairement les détails (jour, heure, lieu)", "Formule de politesse finale", "Texte cohérent et bien structuré"]
  },
];