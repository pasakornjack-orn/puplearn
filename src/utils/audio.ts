import { audioManifest } from '../config/audio/manifest';

let currentAudio: HTMLAudioElement | null = null;

export const playSpeech = (text: string, lang: 'th-TH' | 'en-US' = 'th-TH', rate: number = 1.0) => {
  if (typeof window === 'undefined') return;

  // Stop any currently playing audio
  stopSpeech();

  const mp3Path = audioManifest[text];

  if (mp3Path) {
    // Play static MP3
    currentAudio = new Audio(mp3Path);
    // Playback rate only for English usually, but ElevenLabs sets pace, so we might ignore rate or apply it
    if (rate !== 1.0 && currentAudio.playbackRate !== undefined) {
      currentAudio.playbackRate = rate;
    }
    currentAudio.play().catch(e => console.error('Failed to play MP3:', e));
  } else {
    // Fallback to SpeechSynthesis
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && (v.name.includes('Female') || v.name.includes('Siri') || v.name.includes('Google')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.pitch = 1.2;
    utterance.rate = rate;

    window.speechSynthesis.speak(utterance);
  }
};

export const stopSpeech = () => {
  if (typeof window === 'undefined') return;
  
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
