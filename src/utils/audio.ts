import { audioFallbackMap, resolveAudioPath } from '../config/audio/manifest';

let globalAudioElement: HTMLAudioElement | null = null;
let currentSequenceId: number = 0;

let isMasterMuted = false;

// BGM State
let bgmAudioElement: HTMLAudioElement | null = null;
let bgmGainNode: GainNode | null = null;
let audioCtx: AudioContext | null = null;
const BGM_NORMAL_VOL = 0.12;
const BGM_DUCK_VOL = 0.04;
const DUCK_TIME = 0.2; 
const RESTORE_TIME = 0.4;

export const initBgm = () => {
  if (typeof window === 'undefined' || isMasterMuted || bgmAudioElement) return;

  bgmAudioElement = new Audio('/audio/bgm/supermarket-loop.mp3');
  bgmAudioElement.crossOrigin = 'anonymous'; // Prevent CORS silence in some environments
  bgmAudioElement.loop = true;
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      const source = audioCtx.createMediaElementSource(bgmAudioElement);
      bgmGainNode = audioCtx.createGain();
      bgmGainNode.gain.value = BGM_NORMAL_VOL;
      
      source.connect(bgmGainNode);
      bgmGainNode.connect(audioCtx.destination);
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } else {
      bgmAudioElement.volume = BGM_NORMAL_VOL;
    }
  } catch (e) {
    bgmAudioElement.volume = BGM_NORMAL_VOL;
  }

  bgmAudioElement.play().catch(e => console.warn('BGM play blocked', e));
};

const duckBgm = () => {
  if (!bgmGainNode || !audioCtx) {
    if (bgmAudioElement) bgmAudioElement.volume = BGM_DUCK_VOL;
    return;
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  bgmGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
  bgmGainNode.gain.setValueAtTime(bgmGainNode.gain.value, audioCtx.currentTime);
  bgmGainNode.gain.linearRampToValueAtTime(BGM_DUCK_VOL, audioCtx.currentTime + DUCK_TIME);
};

const restoreBgm = () => {
  if (!bgmGainNode || !audioCtx) {
    if (bgmAudioElement) bgmAudioElement.volume = BGM_NORMAL_VOL;
    return;
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  bgmGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
  bgmGainNode.gain.setValueAtTime(bgmGainNode.gain.value, audioCtx.currentTime);
  bgmGainNode.gain.linearRampToValueAtTime(BGM_NORMAL_VOL, audioCtx.currentTime + RESTORE_TIME);
};

export const setMasterVolume = (muted: boolean) => {
  isMasterMuted = muted;
  if (muted) {
    stopSpeech();
    if (bgmAudioElement) bgmAudioElement.pause();
  } else {
    if (!bgmAudioElement) initBgm();
    else bgmAudioElement.play().catch(() => {});
  }
};

export const playSpeech = (text: string, lang: 'th-TH' | 'en-US' = 'th-TH', rate: number = 1.0, audioId?: string) => {
  if (typeof window === 'undefined' || isMasterMuted) return;

  stopSpeech();
  duckBgm();

  const mp3Path = resolveAudioPath(audioId, text);
  
  if ((import.meta as any).env?.DEV) {
    console.log(`[AudioTrace] event: ${audioId || text}`);
    console.log(`[AudioTrace] audioId: ${audioId || 'none'}`);
    console.log(`[AudioTrace] path: ${mp3Path || 'none'}`);
    console.log(`[AudioTrace] fallback: ${!mp3Path}`);
  }
  
  if (mp3Path) {
    playMp3(mp3Path, text, lang, rate, false);
  } else {
    playFallbackTTS(text, lang, rate, false);
  }
};

const playMp3 = (path: string, fallbackText: string, lang: 'th-TH' | 'en-US', rate: number, isPartOfSequence: boolean): Promise<void> => {
  return new Promise((resolve) => {
    if (isMasterMuted) {
      if (!isPartOfSequence) restoreBgm();
      resolve();
      return;
    }
    
    if (!globalAudioElement) {
      globalAudioElement = new Audio();
    }
    
    const mySequenceId = currentSequenceId;

    globalAudioElement.onended = () => {
      if (!isPartOfSequence && currentSequenceId === mySequenceId) {
        restoreBgm();
      }
      resolve();
    };

    globalAudioElement.onerror = () => {
      console.warn(`[PupLearn Audio] Local asset missing or failed: ${path} — using TTS fallback`);
      playFallbackTTS(fallbackText, lang, rate, isPartOfSequence);
      resolve(); 
    };

    globalAudioElement.src = path;
    globalAudioElement.play().catch(e => {
      if (e.name === 'AbortError') {
        // Ignored. The play request was aborted by a subsequent play or pause (e.g., fast tapping).
        resolve();
        return;
      }
      console.warn(`[PupLearn Audio] Playback blocked or failed: ${path}`, e);
      playFallbackTTS(fallbackText, lang, rate, isPartOfSequence);
      resolve();
    });
  });
};

const playFallbackTTS = (text: string, lang: 'th-TH' | 'en-US', rate: number, isPartOfSequence: boolean) => {
  if (!text || !window.speechSynthesis || isMasterMuted) {
    if (!isPartOfSequence) restoreBgm();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && (v.name.includes('Female') || v.name.includes('Siri') || v.name.includes('Google')));
  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.pitch = 1.2;
  utterance.rate = rate;

  const mySequenceId = currentSequenceId;
  utterance.onend = () => {
    if (!isPartOfSequence && currentSequenceId === mySequenceId) restoreBgm();
  };
  utterance.onerror = () => {
    if (!isPartOfSequence && currentSequenceId === mySequenceId) restoreBgm();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window === 'undefined') return;
  
  currentSequenceId++; 

  if (globalAudioElement) {
    globalAudioElement.pause();
    globalAudioElement.currentTime = 0;
    globalAudioElement.onended = null;
    globalAudioElement.onerror = null;
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  
  restoreBgm(); // If we forcefully stop, always restore BGM
};

export type AudioSequenceItem = {
  phaseId: string;
  audioPath: string;
  fallbackText?: string;
  lang?: 'th-TH' | 'en-US';
  pauseAfterMs: number;
};

export const playAudioSequence = async (
  sequence: AudioSequenceItem[],
  onPhaseStart: (phaseId: string) => void
) => {
  if (isMasterMuted) return;
  
  stopSpeech();
  const sequenceId = currentSequenceId;
  duckBgm();

  for (let i = 0; i < sequence.length; i++) {
    const item = sequence[i];
    if (currentSequenceId !== sequenceId || isMasterMuted) break;

    onPhaseStart(item.phaseId);

    const fallbackText = item.fallbackText || audioFallbackMap[item.audioPath] || '';
    
    // Pass true for isPartOfSequence so individual clips don't restore BGM
    await playMp3(item.audioPath, fallbackText, item.lang || 'th-TH', 1.0, true);

    if (currentSequenceId !== sequenceId || isMasterMuted) break;

    if (item.pauseAfterMs > 0) {
      await new Promise(r => setTimeout(r, item.pauseAfterMs));
    }
  }

  if (currentSequenceId === sequenceId) {
    restoreBgm();
  }
};
