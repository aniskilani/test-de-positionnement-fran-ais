import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function QuestionCard({ question, selectedAnswer, onSelect, questionNumber }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionNumber}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        {/* Question Level Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#17c3b2]/10 text-[#00504e]">
            Niveau {question.level}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            {question.category}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
          {question.question}
        </h2>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <motion.button
                key={index}
                onClick={() => onSelect(option)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 text-left group ${
                  isSelected
                    ? 'border-[#17c3b2] bg-[#17c3b2]/5 shadow-md'
                    : 'border-gray-200 hover:border-[#32cf8a] hover:bg-gray-50'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all ${
                    isSelected
                      ? 'bg-[#17c3b2] text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-[#32cf8a]/20 group-hover:text-[#00504e]'
                  }`}
                >
                  {isSelected ? <CheckCircle2 className="w-5 h-5" /> : letters[index]}
                </span>
                <span className={`flex-1 font-medium ${isSelected ? 'text-[#00504e]' : 'text-gray-700'}`}>
                  {option}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}