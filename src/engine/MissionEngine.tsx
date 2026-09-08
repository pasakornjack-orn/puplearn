import React, { useState, useEffect } from 'react';
import type { Mission, Product } from '../data/missions';
import { productsDB } from '../data/missions';
import ProductDisplayV2 from '../components/ProductDisplayV2';
import VocabularyTeaching from '../components/VocabularyTeaching';
import { playSpeech, playAudioSequence, stopSpeech } from '../utils/audio';
import { getPillowSequence, audioIdMap } from '../config/audio/manifest';

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
  const [englishItemIndex, setEnglishItemIndex] = useState(0);
  
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);
  const [replayCount, setReplayCount] = useState(0);
  const [wrongTaps, setWrongTaps] = useState(0);

  useEffect(() => {
    if (import.meta.env.DEV) {
      if (!mission.choices?.length) console.warn(`[Mission Validation] ${mission.id} missing choices`);
      if (!mission.dialogue?.instruction) console.warn(`[Mission Validation] ${mission.id} missing instruction dialogue`);
      if (!mission.dialogue?.correct && !mission.dialogue?.complete) console.warn(`[Mission Validation] ${mission.id} missing correct/complete dialogue`);
      if (!mission.vocabularyConfigs?.length) console.warn(`[Mission Validation] ${mission.id} missing vocabularyConfigs`);
      
      if (mission.validation?.kind === 'attribute') {
        if (!mission.validation.field) console.warn(`[Mission Validation] ${mission.id} attribute validation missing field`);
        if (!mission.validation.equals) console.warn(`[Mission Validation] ${mission.id} attribute validation missing equals value`);
      }

      mission.choices?.forEach(c => {
        if (!productsDB[c.productId]) {
          console.warn(`[Mission Validation] ${mission.id} unknown productId: ${c.productId}`);
        }
        if (c.wrongAudioId && !audioIdMap[c.wrongAudioId]) {
          console.warn(`[Mission Validation] ${mission.id} missing audio mapping: ${c.wrongAudioId}`);
        }
      });
    }

    const products = mission.choices?.map(c => productsDB[c.productId]).filter(Boolean) || [];
    setShuffledProducts([...products].sort(() => Math.random() - 0.5));
    setBasket([]);
    setHintMessage(null);
    setPhase('shopping');
    setEnglishPhase(null);
    setEnglishItemIndex(0);
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
        const currentItem = basket[englishItemIndex];
        const vocabConfig = mission.vocabularyConfigs?.find(v => v.productId === currentItem?.id) || mission.vocabularyConfigs?.[0];
        const teachingText = vocabConfig?.text || '';
        const sequence = getPillowSequence(teachingText);
        playAudioSequence(sequence, (phaseId) => {
          setEnglishPhase(phaseId as any);
        });
      } else {
        setEnglishPhase('repeat2');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, englishItemIndex]); 

  const validateChoice = (mission: Mission, product: Product) => {
    if (mission.validation?.kind === 'attribute') {
      return product[mission.validation.field] === mission.validation.equals;
    }
    return mission.targetIds?.includes(product.id) || false;
  };

  const handleTargetFound = (product: Product, event: React.MouseEvent) => {
    if (basket.some(p => p.id === product.id)) return;
    
    const isTarget = validateChoice(mission, product);
    if (!isTarget) {
      handleWrongTap(product);
      return; 
    }
    
    const newBasket = [...basket, product];
    const isComplete = newBasket.length >= (mission.targetCount || 1);
    
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
        if (isComplete) {
          triggerSuccess();
        } else {
          triggerIntermediateSuccess();
        }
      }, 800);
    } else {
      setBasket(newBasket);
      if (isComplete) {
        triggerSuccess();
      } else {
        triggerIntermediateSuccess();
      }
    }
  };

  const triggerSuccess = () => {
    const isPickN = (mission.targetCount || 1) > 1;
    const correctText = isPickN ? (mission.dialogue?.complete?.text || 'เก่งมาก!') : (mission.dialogue?.correct?.text || 'เก่งมาก!');
    const correctAudioId = isPickN ? (mission.dialogue?.complete?.audioId || `${mission.id}.complete`) : (mission.dialogue?.correct?.audioId || `${mission.id}.correct`);
    
    setHintMessage({ mascot: 'Bingo', emotion: 'happy', text: correctText, timestamp: Date.now(), audioId: correctAudioId });
    
    setTimeout(() => {
      setEnglishItemIndex(0);
      setEnglishPhase('listen1');
      setPhase('english_interaction');
    }, isPickN ? 4500 : 2500);
  };

  const triggerIntermediateSuccess = () => {
    const firstCorrectText = mission.dialogue?.first_correct?.text || 'เยี่ยมเลย! หาอีกชิ้นนึงนะ';
    const firstCorrectAudioId = mission.dialogue?.first_correct?.audioId || `${mission.id}.first_correct`;
    setHintMessage({ mascot: 'Bingo', emotion: 'happy', text: firstCorrectText, timestamp: Date.now(), audioId: firstCorrectAudioId });
  };

  const handleWrongTap = (product: Product) => {
    setWrongTaps(prev => prev + 1);
    const choice = mission.choices?.find(c => c.productId === product.id);
    if (choice?.wrongFeedback?.text) {
      setHintMessage({ mascot: 'Bingo', emotion: 'guide', text: choice.wrongFeedback.text, timestamp: Date.now(), audioId: choice.wrongAudioId });
    }
  };

  const handleEnglishAnswer = () => {
    if (englishItemIndex < basket.length - 1) {
      setEnglishItemIndex(prev => prev + 1);
      setEnglishPhase('listen1');
    } else {
      stopSpeech();
      onComplete(wrongTaps, replayCount);
    }
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
          targetImage={basket[englishItemIndex]?.image}
          targetEnglishName={mission.vocabularyConfigs?.find(v => v.productId === basket[englishItemIndex]?.id)?.text || mission.vocabularyConfigs?.[0]?.text || 'Word'}
          englishPhase={englishPhase || 'listen1'}
          isAudioMuted={isAudioMuted}
          onReplay={() => {
            setReplayCount(r => r + 1);
            if (!isAudioMuted) {
              const vocabConfig = mission.vocabularyConfigs?.find(v => v.productId === basket[englishItemIndex]?.id) || mission.vocabularyConfigs?.[0];
              const teachingText = vocabConfig?.text || '';
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