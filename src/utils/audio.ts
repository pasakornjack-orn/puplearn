import { textToAudioMap, audioFallbackMap } from '../config/audio/manifest';

let globalAudioElement: HTMLAudioElement | null = null;
let currentSequenceId: number = 0; // To track and cancel sequences

// Used to check global muting. We must track it or expect the caller to.
// The caller usually guards with `!isAudioMuted`, but having it centralized helps.
let isMasterMuted = false;

export const setMasterVolume = (muted: boolean) => {
  isMasterMuted = muted;
  if (muted) {
    stopSpeech();
  }
};

export const playSpeech = (text: string, lang: 'th-TH' | 'en-US' = 'th-TH', rate: number = 1.0) => {
  if (typeof window === 'undefined' || isMasterMuted) return;

  // Stop any currently playing audio and cancel active sequences
  stopSpeech();

  const mp3Path = textToAudioMap[text];
  
  if (mp3Path) {
    playMp3(mp3Path, text, lang, rate);
  } else {
    // If not in text map (e.g. A2, A3), fallback immediately
    playFallbackTTS(text, lang, rate);
  }
};

const playMp3 = (path: string, fallbackText: string, lang: 'th-TH' | 'en-US', rate: number): Promise<void> => {
  return new Promise((resolve) => {
    if (isMasterMuted) {
      resolve();
      return;
    }
    
    if (!globalAudioElement) {
      globalAudioElement = new Audio();
    }
    
    globalAudioElement.onended = () => {
      resolve();
    };

    globalAudioElement.onerror = () => {
      console.warn(`[PupLearn Audio] Local asset missing or failed: ${path} — using TTS fallback`);
      playFallbackTTS(fallbackText, lang, rate);
      resolve(); 
    };

    globalAudioElement.src = path;
    globalAudioElement.play().catch(e => {
      console.warn(`[PupLearn Audio] Playback blocked or failed: ${path}`, e);
      playFallbackTTS(fallbackText, lang, rate);
      resolve();
    });
  });
};

const playFallbackTTS = (text: string, lang: 'th-TH' | 'en-US', rate: number) => {
  if (!window.speechSynthesis || isMasterMuted) return;

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
};

export const stopSpeech = () => {
  if (typeof window === 'undefined') return;
  
  currentSequenceId++; // Incrementing cancels any active sequence

  if (globalAudioElement) {
    globalAudioElement.pause();
    globalAudioElement.currentTime = 0;
    globalAudioElement.onended = null;
    globalAudioElement.onerror = null;
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export type AudioSequenceItem = {
  phaseId: string;
  audioPath: string;
  fallbackText?: string;
  lang?: 'th-TH' | 'en-US';
  pauseAfterMs: number;
};

// Play a sequence of files, notifying caller on each phase change
export const playAudioSequence = async (
  sequence: AudioSequenceItem[],
  onPhaseStart: (phaseId: string) => void
) => {
  if (isMasterMuted) return;
  
  stopSpeech();
  const sequenceId = currentSequenceId;

  for (const item of sequence) {
    if (currentSequenceId !== sequenceId || isMasterMuted) break;

    onPhaseStart(item.phaseId);

    const fallbackText = item.fallbackText || audioFallbackMap[item.audioPath] || '';
    
    await playMp3(item.audioPath, fallbackText, item.lang || 'th-TH', 1.0);

    if (currentSequenceId !== sequenceId || isMasterMuted) break;

    if (item.pauseAfterMs > 0) {
      await new Promise(r => setTimeout(r, item.pauseAfterMs));
    }
  }
};
