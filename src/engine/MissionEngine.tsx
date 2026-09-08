import React, { useState, useEffect } from 'react';
import type { Mission, Product } from '../data/missions';
import { productsDB } from '../data/missions';
import ProductDisplayV2 from '../components/ProductDisplayV2';
import VocabularyTeaching from '../components/VocabularyTeaching';
import { playSpeech, playAudioSequence, stopSpeech } from '../utils/audio';
import { getPillowSequence } from '../config/audio/manifest';

interface MissionEngineProps {
  mission: Mission;
  isAudioMuted: boolean;
  onComplete: (wrongTaps: number, replayCount: number) => void;
}

type EnginePhase = 'shopping' | 'english_interaction';

export const MissionEngine: React.FC<MissionEngineProps> = ({ mission, isAudioMuted, onComplete }) => {
  const [phase, setPhase] = useState<EnginePhase>('shopping');
  const [basket, setBasket] = useState<Product[]>([]);
  const [hintMessage, setHintMessage] = useState<{ mascot: any; emotion?: any; text: string; timestamp?: number; audioId?: string } | null>(null);
  const [flyingItem, setFlyingItem] = useState<{ product: Product; x: number; y: number; targetX?: number; targetY?: number; isFlying: boolean } | null>(null);
  
  const [englishPhase, setEnglishPhase] = useState<'listen1' | 'listen2' | 'repeat1' | 'repeat2' | null>(null);
  
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);
  const [replayCount, setReplayCount] = useState(0);
  const [wrongTaps, setWrongTaps] = useState(0);

  useEffect(() => {
    const products = mission.choices?.map(c => productsDB[c.productId]).filter(Boolean) || [];
    setShuffledProducts([...products].sort(() => Math.random() - 0.5));
    setBasket([]);
    setHintMessage(null);
    setPhase('shopping');
    setEnglishPhase(null);
    setReplayCount(0);
    setWrongTaps(0);
    setFlyingItem(null);
    
    if (!isAudioMuted) {
      stopSpeech();
      playSpeech(
        mission.dialogue?.instruction?.text || mission.instructionThai, 
        'th-TH', 1.0, 
        mission.dialogue?.instruction?.audioId || `${mission.id}.instruction`
      );
    }
  }, [mission, isAudioMuted]);

  useEffect(() => {
    if (phase === 'english_interaction') {
      if (!isAudioMuted) {
        const teachingText = mission.vocabularyConfigs?.[0]?.text || '';
        const sequence = getPillowSequence(teachingText);
        playAudioSequence(sequence, (phaseId) => {
          setEnglishPhase(phaseId as any);
        });
      } else {
        setEnglishPhase('repeat2');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]); 

  const handleTargetFound = (product: Product, event: React.MouseEvent) => {
    if (basket.some(p => p.id === product.id)) return;
    
    const isTarget = mission.targetIds?.includes(product.id);
    if (!isTarget) {
      handleWrongTap(product);
      return; 
    }
    
    const newBasket = [...basket, product];
    
    if (event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      let tX = window.innerWidth / 2;
      let tY = window.innerHeight - 100;
      
      const basketEl = document.querySelector('.basket-target');
      if (basketEl) {
        const bRect = basketEl.getBoundingClientRect();
        tX = bRect.left + bRect.width / 2;
        tY = bRect.top + bRect.height / 2;
      }

      setFlyingItem({
        product,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        targetX: tX,
        targetY: tY,
        isFlying: false
      });
      
      setTimeout(() => {
        setFlyingItem(prev => prev ? { ...prev, isFlying: true } : null);
      }, 50);

      setTimeout(() => {
        setBasket(newBasket);
        setFlyingItem(null);
        triggerSuccess();
      }, 800);
    } else {
      setBasket(newBasket);
      triggerSuccess();
    }
  };

  const triggerSuccess = () => {
    const correctText = mission.dialogue?.correct?.text || 'เก่งมาก!';
    const correctAudioId = mission.dialogue?.correct?.audioId || `${mission.id}.correct`;
    
    setHintMessage({ mascot: 'Bingo', emotion: 'happy', text: correctText, timestamp: Date.now(), audioId: correctAudioId });
    
    setTimeout(() => {
      setEnglishPhase('listen1');
      setPhase('english_interaction');
    }, 2500);
  };

  const handleWrongTap = (product: Product) => {
    setWrongTaps(prev => prev + 1);
    const choice = mission.choices?.find(c => c.productId === product.id);
    if (choice?.wrongFeedback?.text) {
      setHintMessage({ mascot: 'Bingo', emotion: 'guide', text: choice.wrongFeedback.text, timestamp: Date.now(), audioId: choice.wrongAudioId });
    }
  };

  const handleEnglishAnswer = () => {
    stopSpeech();
    onComplete(wrongTaps, replayCount);
  };

  return (
    <>
      {phase === 'shopping' && (
        <ProductDisplayV2
          mission={{ ...mission, products: shuffledProducts }}
          isAudioMuted={isAudioMuted}
          onTargetFound={handleTargetFound}
          onWrongTap={handleWrongTap}
          hintMessage={hintMessage}
          replayCount={replayCount}
          setReplayCount={setReplayCount}
          basketItems={basket}
        />
      )}

      {flyingItem && (
        <div 
          className="fixed pointer-events-none z-50 flex items-center justify-center transition-all duration-[800ms] cubic-bezier(0.2, 0.8, 0.2, 1)"
          style={{
            left: flyingItem.isFlying ? (flyingItem.targetX || '50%') : flyingItem.x,
            top: flyingItem.isFlying ? (flyingItem.targetY || 'calc(100% - 100px)') : flyingItem.y,
            transform: `translate(-50%, -50%) scale(${flyingItem.isFlying ? 0.3 : 1})`,
            opacity: flyingItem.isFlying ? 0.8 : 1,
          }}
        >
          {flyingItem.product.image.startsWith('/') ? (
            <img src={flyingItem.product.image} alt="flying" className="w-24 h-24 object-contain drop-shadow-xl" />
          ) : (
            <span className="text-[5rem] drop-shadow-xl">{flyingItem.product.image}</span>
          )}
        </div>
      )}

      {phase === 'english_interaction' && (
        <VocabularyTeaching 
          targetImage={basket[0]?.image}
          targetEnglishName={mission.vocabularyConfigs?.[0]?.text || 'Word'}
          englishPhase={englishPhase || 'listen1'}
          isAudioMuted={isAudioMuted}
          onReplay={() => {
            setReplayCount(r => r + 1);
            if (!isAudioMuted) {
              const teachingText = mission.vocabularyConfigs?.[0]?.text || '';
              const sequence = getPillowSequence(teachingText);
              playAudioSequence(sequence, (phaseId) => setEnglishPhase(phaseId as any));
            }
          }}
          onComplete={handleEnglishAnswer}
        />
      )}
    </>
  );
};