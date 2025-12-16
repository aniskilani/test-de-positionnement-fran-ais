import React from 'react';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function QuestionReview({ question, userAnswer, isCorrect }) {
  const isWritten = question.type === 'written';

  return (
    <Card className={`border-l-4 ${isCorrect ? 'border-l-green-500 bg-green-50/30' : 'border-l-red-500 bg-red-50/30'}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-1">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          
          <div className="flex-1 space-y-3">
            {/* Question Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#17c3b2]/10 text-[#00504e]">
                {question.level}
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {question.category}
              </span>
              {question.audioUrl && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  Audio
                </span>
              )}
              {isWritten && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                  Expression Écrite
                </span>
              )}
            </div>

            {/* Question Text */}
            <p className="font-medium text-gray-900">
              {question.question}
            </p>

            {/* User Answer */}
            <div>
              <span className="text-sm text-gray-600">Votre réponse : </span>
              {isWritten ? (
                <div className={`mt-2 p-3 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className={`text-sm whitespace-pre-wrap ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                    {userAnswer || "Non répondu"}
                  </p>
                </div>
              ) : (
                <span className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {userAnswer || "Non répondu"}
                </span>
              )}
            </div>

            {/* Correct Answer or Criteria */}
            {!isCorrect && (
              isWritten ? (
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Critères d'évaluation :</p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc ml-5">
                    {question.criteria.map((criterion, idx) => (
                      <li key={idx}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <span className="text-sm text-gray-600">Bonne réponse : </span>
                    <span className="text-sm font-semibold text-green-700">
                      {question.correct}
                    </span>
                  </div>
                  {question.explanation && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-blue-900">
                        <span className="font-semibold">💡 Explication : </span>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}