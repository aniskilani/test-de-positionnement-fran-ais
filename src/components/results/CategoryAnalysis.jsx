import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageSquare, Volume2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const categoryIcons = {
  "Grammaire": BookOpen,
  "Vocabulaire": MessageSquare,
  "Compréhension Orale": Volume2,
  "Compréhension": MessageSquare
};

export default function CategoryAnalysis({ categoryStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#00504e]" />
          Analyse par catégorie
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(categoryStats).map(([category, stats]) => {
          const percentage = Math.round((stats.correct / stats.total) * 100);
          const Icon = categoryIcons[category] || MessageSquare;
          
          let performanceIcon;
          let performanceColor;
          let performanceText;
          
          if (percentage >= 75) {
            performanceIcon = TrendingUp;
            performanceColor = "text-green-600";
            performanceText = "Point fort";
          } else if (percentage >= 50) {
            performanceIcon = Minus;
            performanceColor = "text-yellow-600";
            performanceText = "À améliorer";
          } else {
            performanceIcon = TrendingDown;
            performanceColor = "text-red-600";
            performanceText = "Point faible";
          }
          
          const PerformanceIcon = performanceIcon;
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#17c3b2]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#00504e]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category}</p>
                    <p className="text-sm text-gray-500">
                      {stats.correct} / {stats.total} correctes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PerformanceIcon className={`w-4 h-4 ${performanceColor}`} />
                  <span className={`text-sm font-medium ${performanceColor}`}>
                    {performanceText}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    percentage >= 75 ? 'bg-green-500' : 
                    percentage >= 50 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <p className="text-right text-sm font-semibold text-gray-700">
                {percentage}%
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}