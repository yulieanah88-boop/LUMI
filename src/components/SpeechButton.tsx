import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { speech } from '../utils/speech';
import { sound } from '../utils/audio';

interface SpeechButtonProps {
  id: string;
  textToSpeak: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber';
  className?: string;
  showIconOnly?: boolean;
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({
  id,
  textToSpeak,
  label = 'Dengarkan Suara',
  size = 'md',
  variant = 'secondary',
  className = '',
  showIconOnly = false,
}) => {
  const [isSpeakingThis, setIsSpeakingThis] = useState(false);
  const isSupported = speech.isSupported();

  useEffect(() => {
    const unsubscribe = speech.subscribe((speakingId) => {
      setIsSpeakingThis(speakingId === id);
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  if (!isSupported) {
    return null; // Gracefully degrade if browser doesn't support Web Speech API
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    if (isSpeakingThis) {
      speech.stop();
    } else {
      speech.speak(textToSpeak, id);
    }
  };

  // Base styling
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg',
    md: 'text-xs sm:text-sm px-3 py-1.5 gap-2 rounded-xl',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2.5 rounded-2xl font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  const variantClasses = isSpeakingThis
    ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400 ring-offset-1 animate-pulse'
    : {
        primary: 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs',
        secondary: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80',
        amber: 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-800',
      }[variant];

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isSpeakingThis ? 'Klik untuk menghentikan suara narator' : 'Klik untuk mendengarkan teks ini dibacakan'}
      aria-label={isSpeakingThis ? 'Hentikan pembacaan suara' : `Dengarkan: ${label}`}
      className={`inline-flex items-center justify-center font-bold transition-all cursor-pointer select-none shrink-0 ${sizeClasses} ${variantClasses} ${className}`}
    >
      {isSpeakingThis ? (
        <>
          <span className="flex items-center gap-0.5">
            <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <VolumeX className={`${iconSizes} ml-0.5`} />
          {!showIconOnly && <span>Hentikan</span>}
        </>
      ) : (
        <>
          <Volume2 className={iconSizes} />
          {!showIconOnly && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
