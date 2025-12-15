import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, MessageCircle, Briefcase, GraduationCap, Star } from 'lucide-react';

const levelData = {
  A1: {
    title: "Découverte",
    description: "Vous pouvez comprendre et utiliser des expressions familières et quotidiennes.",
    icon: BookOpen,
    color: "#32cf8a",
    skills: [
      "Vous présentez simplement",
      "Poser des questions basiques",
      "Comprendre des mots familiers"
    ]
  },
  A2: {
    title: "Intermédiaire",
    description: "Vous pouvez communiquer lors de tâches simples et habituelles.",
    icon: MessageCircle,
    color: "#17c3b2",
    skills: [
      "Décrire votre environnement",
      "Parler de tâches quotidiennes",
      "Comprendre des phrases simples"
    ]
  },
  B1: {
    title: "Seuil",
    description: "Vous pouvez vous débrouiller dans la plupart des situations de la vie quotidienne.",
    icon: Briefcase,
    color: "#00504e",
    skills: [
      "Raconter des expériences",
      "Exprimer des opinions simples",
      "Comprendre les points essentiels"
    ]
  },
  B2: {
    title: "Avancé",
    description: "Vous pouvez communiquer avec spontanéité et aisance avec des locuteurs natifs.",
    icon: GraduationCap,
    color: "#00504e",
    skills: [
      "Argumenter efficacement",
      "Comprendre des textes complexes",
      "S'exprimer de façon claire"
    ]
  },
  C1: {
    title: "Autonome",
    description: "Vous pouvez utiliser la langue de façon efficace et souple dans la vie sociale et professionnelle.",
    icon: Star,
    color: "#00504e",
    skills: [
      "Expression fluide et spontanée",
      "Textes complexes et implicites",
      "Usage flexible du français"
    ]
  },
  C2: {
    title: "Maîtrise",
    description: "Vous comprenez sans effort pratiquement tout ce que vous lisez ou entendez.",
    icon: Award,
    color: "#00504e",
    skills: [
      "Maîtrise quasi-native",
      "Nuances fines du langage",
      "Expression précise et élaborée"
    ]
  }
};

export default function LevelResult({ level, score }) {
  const data = levelData[level];
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Level Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
        style={{ backgroundColor: `${data.color}15` }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: data.color }}
        >
          <span className="text-4xl font-bold text-white">{level}</span>
        </div>
      </motion.div>

      {/* Level Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Icon className="w-5 h-5" style={{ color: data.color }} />
          <span className="text-lg font-semibold" style={{ color: data.color }}>
            {data.title}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Niveau {level} - {data.title}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          {data.description}
        </p>
      </motion.div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-[#00504e] to-[#17c3b2] rounded-2xl p-6 mb-6 text-white"
      >
        <p className="text-sm opacity-90 mb-1">Votre score</p>
        <p className="text-4xl font-bold">{score}%</p>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 rounded-2xl p-6 text-left"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Vos compétences à ce niveau :</h3>
        <ul className="space-y-3">
          {data.skills.map((skill, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
              <span className="text-gray-700">{skill}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}