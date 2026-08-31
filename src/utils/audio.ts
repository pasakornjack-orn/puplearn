export const playSpeech = (text: string, lang: 'th-TH' | 'en-US' = 'th-TH', rate: number = 1.0) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  
  // Try to find a friendly native voice if available, fallback to default
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && (v.name.includes('Female') || v.name.includes('Siri') || v.name.includes('Google')));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  // Adjust pitch slightly higher for a more child-friendly/mascot tone
  utterance.pitch = 1.2;
  utterance.rate = rate;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
};
