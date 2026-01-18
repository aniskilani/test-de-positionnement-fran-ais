import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Volume2, PlayCircle, AlertCircle, Mic, Square, Loader2, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function QuestionCard({ question, selectedAnswer, onSelect, questionNumber, timeLeft, onStartTimer }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [error, setError] = React.useState('');
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const playAudio = () => {
    if (question.audioText) {
      setIsPlaying(true);
      
      let textToSpeak = question.audioText.replace(/^Audio\s*:\s*['"]?|['"]?$/g, '');
      
      textToSpeak = textToSpeak
        .replace(/\?/g, ' ?')
        .replace(/!/g, ' !')
        .replace(/,/g, ', ')
        .replace(/\./g, '. ');
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.pitch = 1.15;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') && (
          voice.name.includes('Amélie') ||
          voice.name.includes('Thomas') ||
          voice.name.includes('Enhanced') ||
          voice.name.includes('Premium') ||
          voice.name.includes('Neural') ||
          voice.name.includes('Google')
        )
      ) || voices.find(voice => voice.lang.startsWith('fr-FR')) 
        || voices.find(voice => voice.lang.startsWith('fr'));
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
      
      utterance.onend = () => {
        setIsPlaying(false);
        // Démarrer le timer après la lecture audio pour les questions orales
        if (question.type === 'oral' && onStartTimer) {
          onStartTimer();
        }
      };
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    setError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Votre navigateur ne supporte pas l'enregistrement audio. Utilisez Chrome ou Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = true;
      recognition.interimResults = true;

      let finalTranscript = '';

      recognition.onresult = (event) => {
        setError('');
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        onSelect(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Erreur reconnaissance:', event.error);
        if (event.error === 'not-allowed') {
          setError("Permission micro refusée. Autorisez l'accès au micro dans votre navigateur.");
        } else if (event.error === 'no-speech') {
          setError('Aucune parole détectée. Parlez plus fort.');
        } else if (event.error === 'network') {
          setError("La reconnaissance vocale nécessite une connexion internet stable. Veuillez saisir votre réponse manuellement ci-dessous.");
        } else if (event.error === 'service-not-allowed') {
          setError("Reconnaissance vocale non disponible. Veuillez saisir votre réponse manuellement ci-dessous.");
        } else {
          setError(`Erreur: ${event.error}. Veuillez saisir votre réponse manuellement ci-dessous.`);
        }
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      recognition.onend = () => {
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError("Impossible de démarrer l'enregistrement. Vérifiez les permissions du micro.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#17c3b2]/10 text-[#00504e]">
              Niveau {question.level}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
              {question.category}
            </span>
          </div>
          
          {question.type !== 'written' && timeLeft !== undefined && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              timeLeft <= 3 ? 'bg-red-100 text-red-700' : 
              timeLeft <= 6 ? 'bg-orange-100 text-orange-700' : 
              'bg-blue-100 text-blue-700'
            }`}>
              <Clock className={`w-4 h-4 ${timeLeft <= 3 ? 'animate-pulse' : ''}`} />
              <span className="font-semibold text-sm">{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Audio Player for Oral Comprehension */}
        {question.audioText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="bg-gradient-to-r from-[#17c3b2]/10 to-[#32cf8a]/10 border-[#17c3b2]/30">
              <Volume2 className="h-5 w-5 text-[#00504e]" />
              <AlertDescription className="ml-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-[#00504e] mb-1">Question audio</p>
                    <p className="text-sm text-gray-600">
                      Cliquez sur le bouton pour écouter l'extrait audio
                    </p>
                  </div>
                  <Button
                    onClick={playAudio}
                    disabled={isPlaying}
                    className="bg-[#00504e] hover:bg-[#17c3b2] flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <PlayCircle className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                    {isPlaying ? 'En lecture...' : 'Écouter'}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
          {question.question}
        </h2>

        {/* Answer Options, Text Area, or Voice Recording */}
        {question.type === 'oral' ? (
          <div className="space-y-4">
            <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <Mic className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-900 text-sm">
                Enregistrez votre réponse vocale (minimum <strong>{question.minDuration} secondes</strong>) ou saisissez-la manuellement. 
                Votre production sera évaluée par IA.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-900 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-gray-50 rounded-xl p-6 text-center space-y-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="h-16 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                  size="lg"
                >
                  <Mic className="w-6 h-6 mr-2" />
                  Commencer l'enregistrement
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-2xl font-bold text-gray-900">
                      {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Button
                    onClick={stopRecording}
                    className="h-14 px-8 bg-red-600 hover:bg-red-700"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Arrêter l'enregistrement
                  </Button>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou saisir manuellement</span>
              </div>
            </div>

            <Textarea
              value={selectedAnswer || ''}
              onChange={(e) => onSelect(e.target.value)}
              placeholder="Tapez votre réponse ici si l'enregistrement ne fonctionne pas..."
              className="min-h-[120px] text-base leading-relaxed resize-none"
            />

            {selectedAnswer && (
              <div className="text-right text-sm text-gray-600">
                {selectedAnswer.length} caractères
              </div>
            )}
          </div>
        ) : question.type === 'written' ? (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 text-sm">
                Rédigez votre réponse en au moins <strong>{question.minWords} mots</strong>. 
                Votre texte sera évalué automatiquement par IA.
              </AlertDescription>
            </Alert>
            <Textarea
              value={selectedAnswer || ''}
              onChange={(e) => onSelect(e.target.value)}
              placeholder={question.placeholder}
              className="min-h-[200px] text-base leading-relaxed resize-none"
            />
            <div className="text-right text-sm text-gray-600">
              {(selectedAnswer || '').split(/\s+/).filter(w => w.length > 0).length} / {question.minWords} mots
            </div>
          </div>
        ) : (
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
        )}
      </motion.div>
    </AnimatePresence>
  );
}