export const questions = [
  // A1 Level - Compréhension Orale
  {
    id: 1,
    level: "A1",
    category: "Compréhension Orale",
    question: "Écoutez l'audio. Quelle est la question posée ?",
    audioUrl: "https://example.com/audio/question-a1-1.mp3",
    audioText: "Audio : 'Comment tu t'appelles ?'",
    options: ["Quel âge as-tu ?", "Comment tu t'appelles ?", "Où habites-tu ?", "Quelle heure est-il ?"],
    correct: "Comment tu t'appelles ?",
    explanation: "Dans l'audio, la personne demande 'Comment tu t'appelles ?' qui est une question pour connaître le nom de quelqu'un."
  },
  // A1 Level - Grammaire
  {
    id: 2,
    level: "A1",
    category: "Grammaire",
    question: "Complétez : « Je ___ français. »",
    options: ["suis", "ai", "est", "as"],
    correct: "suis",
    explanation: "On utilise 'suis' avec 'je' pour exprimer la nationalité : Je suis français."
  },
  {
    id: 3,
    level: "A1",
    category: "Vocabulaire",
    question: "Comment dit-on « Hello » en français ?",
    options: ["Au revoir", "Bonjour", "Merci", "S'il vous plaît"],
    correct: "Bonjour",
    explanation: "'Bonjour' est la traduction française de 'Hello' et est utilisé pour saluer quelqu'un."
  },
  {
    id: 4,
    level: "A1",
    category: "Grammaire",
    question: "Quel est le pluriel de « un livre » ?",
    options: ["des livre", "des livres", "les livre", "un livres"],
    correct: "des livres",
    explanation: "Au pluriel, on ajoute un 's' au nom et on utilise 'des' : des livres."
  },
  // A2 Level - Compréhension Orale
  {
    id: 5,
    level: "A2",
    category: "Compréhension Orale",
    question: "Écoutez le dialogue. Où vont les deux personnes ?",
    audioUrl: "https://example.com/audio/question-a2-1.mp3",
    audioText: "Audio : 'On va au restaurant ce soir ?' - 'Oui, bonne idée !'",
    options: ["Au cinéma", "Au restaurant", "À la plage", "Au musée"],
    correct: "Au restaurant",
    explanation: "Dans le dialogue, la personne demande 'On va au restaurant ce soir ?' et l'autre répond positivement."
  },
  {
    id: 6,
    level: "A2",
    category: "Grammaire",
    question: "Complétez : « Hier, nous ___ au cinéma. »",
    options: ["allons", "sommes allés", "irons", "allions"],
    correct: "sommes allés",
    explanation: "Le verbe 'aller' au passé composé avec 'nous' se conjugue : nous sommes allés."
  },
  {
    id: 7,
    level: "A2",
    category: "Vocabulaire",
    question: "Quel mot signifie l'inverse de « grand » ?",
    options: ["haut", "petit", "large", "long"],
    correct: "petit",
    explanation: "'Petit' est l'antonyme de 'grand' pour parler de la taille."
  },
  {
    id: 8,
    level: "A2",
    category: "Compréhension",
    question: "« Il fait beau aujourd'hui. » Cette phrase parle de :",
    options: ["la nourriture", "la météo", "le travail", "la santé"],
    correct: "la météo",
    explanation: "'Il fait beau' est une expression qui décrit le temps qu'il fait, donc la météo."
  },
  // B1 Level - Compréhension Orale
  {
    id: 9,
    level: "B1",
    category: "Compréhension Orale",
    question: "Écoutez l'annonce. À quelle heure part le train ?",
    audioUrl: "https://example.com/audio/question-b1-1.mp3",
    audioText: "Audio : 'Le train en provenance de Paris partira à 15h30 du quai numéro 3.'",
    options: ["14h30", "15h30", "16h30", "17h30"],
    correct: "15h30",
    explanation: "L'annonce indique clairement que le train partira à 15h30."
  },
  {
    id: 10,
    level: "B1",
    category: "Grammaire",
    question: "Complétez : « Si j'avais le temps, je ___ ce livre. »",
    options: ["lis", "lirais", "lirai", "lisais"],
    correct: "lirais",
    explanation: "Dans une phrase hypothétique avec 'si + imparfait', on utilise le conditionnel présent : je lirais."
  },
  {
    id: 11,
    level: "B1",
    category: "Vocabulaire",
    question: "Que signifie « être débordé » ?",
    options: ["Être fatigué", "Avoir trop de travail", "Être malade", "Être en retard"],
    correct: "Avoir trop de travail",
    explanation: "'Être débordé' signifie avoir une quantité de travail excessive à gérer."
  },
  {
    id: 12,
    level: "B1",
    category: "Grammaire",
    question: "Choisissez la forme correcte : « C'est le livre ___ je t'ai parlé. »",
    options: ["que", "dont", "qui", "où"],
    correct: "dont",
    explanation: "On utilise 'dont' pour remplacer un complément introduit par 'de' : parler DE quelque chose."
  },
  // B2 Level - Compréhension Orale
  {
    id: 13,
    level: "B2",
    category: "Compréhension Orale",
    question: "Écoutez l'interview. Quel est le principal défi mentionné ?",
    audioUrl: "https://example.com/audio/question-b2-1.mp3",
    audioText: "Audio : 'Notre principal défi reste la gestion du changement climatique et ses impacts sur notre économie.'",
    options: ["Le développement technologique", "Le changement climatique", "Les relations internationales", "La croissance démographique"],
    correct: "Le changement climatique",
    explanation: "L'interviewé mentionne explicitement que le principal défi est la gestion du changement climatique."
  },
  {
    id: 14,
    level: "B2",
    category: "Grammaire",
    question: "Complétez : « Bien qu'il ___ fatigué, il a continué à travailler. »",
    options: ["est", "soit", "était", "serait"],
    correct: "soit",
    explanation: "Après 'bien que', on utilise le subjonctif : bien qu'il soit fatigué."
  },
  {
    id: 15,
    level: "B2",
    category: "Vocabulaire",
    question: "Quel est le synonyme de « néanmoins » ?",
    options: ["Également", "Cependant", "Ensuite", "Par conséquent"],
    correct: "Cependant",
    explanation: "'Néanmoins' et 'cependant' sont tous deux des connecteurs d'opposition synonymes."
  },
  {
    id: 16,
    level: "B2",
    category: "Grammaire",
    question: "« Il m'a demandé si je ___ venir. »",
    options: ["peux", "pouvais", "pourrai", "pourrais"],
    correct: "pouvais",
    explanation: "Dans le discours indirect au passé, on utilise l'imparfait : si je pouvais venir."
  },
  // B1 Level - Compréhension Orale
  {
    id: 17,
    level: "B1",
    category: "Compréhension Orale",
    question: "Écoutez le message. Pourquoi la personne appelle-t-elle ?",
    audioUrl: "https://example.com/audio/question-b1-2.mp3",
    audioText: "Audio : 'Bonjour, je vous appelle pour confirmer notre rendez-vous de demain à 14h. Pourriez-vous me rappeler ?'",
    options: ["Pour annuler un rendez-vous", "Pour confirmer un rendez-vous", "Pour prendre un rendez-vous", "Pour modifier l'heure"],
    correct: "Pour confirmer un rendez-vous",
    explanation: "La personne dit explicitement qu'elle appelle 'pour confirmer notre rendez-vous'."
  },
  {
    id: 18,
    level: "B1",
    category: "Compréhension",
    question: "« Il a pris ses jambes à son cou. » signifie :",
    options: ["Il est tombé", "Il a couru très vite", "Il a mal aux jambes", "Il s'est assis"],
    correct: "Il a couru très vite",
    explanation: "Cette expression idiomatique signifie s'enfuir rapidement ou courir très vite."
  },
  {
    id: 19,
    level: "A2",
    category: "Grammaire",
    question: "Complétez : « Elle ___ au marché tous les samedis. »",
    options: ["va", "aller", "allé", "allait"],
    correct: "va",
    explanation: "Pour exprimer une habitude au présent, on utilise le présent simple : elle va."
  },
  {
    id: 20,
    level: "A1",
    category: "Vocabulaire",
    question: "Quel article utilise-t-on : « ___ pomme » ?",
    options: ["Un", "Une", "Des", "Le"],
    correct: "Une",
    explanation: "'Pomme' est un nom féminin, donc on utilise l'article 'une'."
  }
];