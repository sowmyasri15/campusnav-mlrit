import { useState, useCallback } from 'react';

export function useVoiceSearch() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  const supported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback((onResult) => {
    if (!supported) { setError('Voice search not supported in this browser.'); return; }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart  = () => { setIsListening(true); setError(''); };
    recognition.onend    = () => setIsListening(false);
    recognition.onerror  = (e) => { setIsListening(false); setError(e.error); };
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      onResult?.(text);
    };

    recognition.start();
  }, [supported]);

  return { startListening, transcript, isListening, error, supported };
}
