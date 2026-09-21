import { useState, useEffect, useRef } from 'react';
import type { Mission, Product } from './data/missions';
import { 
  mission07, 
  getMissionProducts,
  productsDB,
  type MissionChoice 
} from './data/missions';
import { levelARegistry, levelAMissionCatalog } from './data/levelARegistry';
import { gameRegistry } from './data/gameRegistry';
import { getGameStatus, type AdventureState } from './utils/gameProgress';
import ProductDisplayV2 from './components/ProductDisplayV2';
import VocabularyTeaching from './components/VocabularyTeaching';
import { MascotBubble } from './components/MascotBubble';
import { MissionEngine } from './engine/MissionEngine';
import { ProductCard } from './components/ProductCard';
import { Basket } from './components/Basket';
import type { MascotType, MascotEmotion } from './config/mascots';
import { getMascotAsset } from './config/mascots';
import { stopSpeech, playSpeech, setMasterVolume, playAudioSequence, initBgm } from './utils/audio';
import { getPillowSequence, audioIdMap } from './config/audio/manifest';

type GameState = 'home' | 'game_select' | 'mission_select' | 'intro' | 'shopping' | 'english_interaction' | 'completed';



function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [activeGameId, setActiveGameId] = useState<string>('game_supermarket');

  const activeGame = gameRegistry.find(g => g.id === activeGameId) || gameRegistry[0];
  const gameMissionsResolved = activeGame.missionIds
    .map(id => levelARegistry.find(r => r.mission.id === id))
    .filter((entry): entry is typeof levelARegistry[0] => entry !== undefined);
  const levelASession = gameMissionsResolved.map(r => r.mission);
  const [activeMission, setActiveMission] = useState<Mission>(mission07);
  const [basket, setBasket] = useState<Product[]>([]);
  const [hintMessage, setHintMessage] = useState<{ mascot: MascotType; emotion?: MascotEmotion; text: string; timestamp?: number; audioId?: string } | null>(null);
  const [englishHint, setEnglishHint] = useState<string | null>(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [englishPhase, setEnglishPhase] = useState<'listen1' | 'listen2' | 'repeat1' | 'repeat2' | null>(null);
  const [englishItemIndex, setEnglishItemIndex] = useState(0);
  const [flyingItem, setFlyingItem] = useState<{ product: Product; x: number; y: number; targetX?: number; targetY?: number; isFlying: boolean } | null>(null);
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);
  const [missionProducts, setMissionProducts] = useState<Product[]>([]);
  const [choiceMap, setChoiceMap] = useState<Map<string, MissionChoice>>(new Map());
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkProgress = () => {
      const completed: Record<string, boolean> = {};
      [...levelARegistry.map(r => r.mission), mission07].forEach(m => {
        try {
          const data = localStorage.getItem(`puplearn_${m.id}_progress`);
          if (data && JSON.parse(data).status === 'completed') {
            completed[m.id] = true;
          }
        } catch (e) {}
      });
      setCompletedMissions(completed);
    };
    checkProgress();
  }, [gameState]); // Re-check when we return to home/mission_select

  // Session Flow State
  const [isSessionMode, setIsSessionMode] = useState(false);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [replayCount, setReplayCount] = useState(0);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>('level-a');
  const [isDraftPreview, setIsDraftPreview] = useState(false);

  const hasPlayedSuccessRef = useRef(false);

  const isChildFacingMission = levelASession.some(m => m.id === activeMission.id);
  const isMissionEngineAuthorized = isChildFacingMission || Boolean(import.meta.env.DEV && isDraftPreview);

  // DEV DRAFT PREVIEW
  useEffect(() => {
    const handleHash = () => {
      if (import.meta.env.DEV && window.location.hash.startsWith('#draft=')) {
        const draftId = window.location.hash.replace('#draft=', '');
        const entry = levelAMissionCatalog.find(e => e.mission.id === draftId);
        if (entry) {
          setIsDraftPreview(true);
          setActiveMission(entry.mission);
          setGameState('shopping'); // Start engine
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isAudioMuted && gameState === 'home') {
        initBgm();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isAudioMuted, gameState]);

  useEffect(() => {
    if (gameState === 'completed') {
      if (!hasPlayedSuccessRef.current) {
        hasPlayedSuccessRef.current = true;
        if (!isAudioMuted) {
          playSpeech('', 'th-TH', 1.0, 'sfx.success');
        }
      }
    } else {
      hasPlayedSuccessRef.current = false;
    }
  }, [gameState, isAudioMuted]);

  const isLevelA = activeMission.level === 'A';

  const handleAddToCart = (product: Product, event?: React.MouseEvent) => {
    if (isLevelA) {
      if (basket.some(p => p.id === product.id)) return;

      const isTarget = activeMission.targetColor 
        ? product.colorName === activeMission.targetColor 
        : activeMission.targetIds?.includes(product.id);

      if (isTarget) {
        const newBasket = [...basket, product];
        const isComplete = activeMission.targetCount 
          ? newBasket.length >= activeMission.targetCount
          : (activeMission.targetIds?.every(id => newBasket.some(p => p.id === id)));
        
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
            const isPickTwoLayout = activeMission.layoutTemplate === 'pick-two';
            const correctText = activeMission.dialogue?.complete?.text || activeMission.dialogue?.correct?.text || 'เก่งมาก!';
            const correctAudioId = activeMission.dialogue?.complete?.audioId || activeMission.dialogue?.correct?.audioId || `${activeMission.id}.correct`;
            const firstCorrectText = activeMission.dialogue?.first_correct?.text || 'เยี่ยมเลย! หาอีกชิ้นนึงนะ';
            const firstCorrectAudioId = activeMission.dialogue?.first_correct?.audioId || `${activeMission.id}.first_correct`;

            if (isComplete) {
              setHintMessage({ mascot: 'Bingo', emotion: 'happy', text: correctText, timestamp: Date.now(), audioId: correctAudioId });
              const delayToEnglish = isPickTwoLayout ? 4500 : 2500;
              setTimeout(() => {
                setEnglishItemIndex(0);
                setEnglishPhase('listen1');
                setGameState('english_interaction');
              }, delayToEnglish);
            } else {
              setHintMessage({ mascot: 'Bingo', emotion: 'happy', text: firstCorrectText, timestamp: Date.now(), audioId: firstCorrectAudioId });
            }
          }, 800);
        } else {
          setBasket(newBasket);
          const isPickTwoLayout = activeMission.layoutTemplate === 'pick-two';
          const correctText = activeMission.dialogue?.complete?.text || activeMission.dialogue?.correct?.text || 'เก่งมาก!';
          const correctAudioId = activeMission.dialogue?.complete?.audioId || activeMission.dialogue?.correct?.audioId || `${activeMission.id}.correct`;
          const firstCorrectText = activeMission.dialogue?.first_correct?.text || 'เยี่ยมเลย! หาอีกชิ้นนึงนะ';
          const firstCorrectAudioId = activeMission.dialogue?.first_correct?.audioId || `${activeMission.id}.first_correct`;

          if (isComplete) {
            setHintMessage({ mascot: 'Bingo', emotion: 'happy', text: correctText, timestamp: Date.now(), audioId: correctAudioId });
            const delayToEnglish = isPickTwoLayout ? 4500 : 2500;
            setTimeout(() => {
              setEnglishItemIndex(0);
              setEnglishPhase('listen1');
              setGameState('english_interaction');
            }, delayToEnglish);
          } else {
            setHintMessage({ mascot: 'Bingo', emotion: 'happy', text: firstCorrectText, timestamp: Date.now(), audioId: firstCorrectAudioId });
          }
        }
      } else {
        setWrongTaps(prev => prev + 1);
        const choice = choiceMap.get(product.id);
        if (choice?.wrongFeedback?.text) {
          setHintMessage({ mascot: 'Bingo', emotion: 'guide', text: choice.wrongFeedback.text, timestamp: Date.now(), audioId: choice.wrongAudioId });
        } else if (activeMission.targetColor && product.colorName) {
          const thaiColorNames: Record<string, string> = {
            red: 'สีแดง',
            blue: 'สีฟ้า',
            yellow: 'สีเหลือง',
            green: 'สีเขียว'
          };
          const tappedColor = thaiColorNames[product.colorName] || 'สีนี้';
          const targetColor = thaiColorNames[activeMission.targetColor] || 'สีเป้าหมาย';
          setHintMessage({ mascot: 'Bingo', emotion: 'guide', text: `นี่คือ${tappedColor} ลองหา${targetColor}ดูนะ`, timestamp: Date.now(), audioId: choice?.wrongAudioId });
        } else if (activeMission.layoutTemplate === 'pick-two') {
          setHintMessage({ mascot: 'Bingo', emotion: 'guide', text: `นี่คือ${product.name} อันนี้ไม่ใช่ผลไม้นะ`, timestamp: Date.now(), audioId: choice?.wrongAudioId });
        } else {
          setHintMessage({ mascot: 'Bingo', emotion: 'guide', text: `นี่คือ${product.name} ลองหาชิ้นอื่นดูนะ`, timestamp: Date.now(), audioId: choice?.wrongAudioId });
        }
      }
      return;
    }

    setBasket([...basket, product]);
    setHintMessage(null);
  };

  const handleRemoveFromCart = (index: number) => {
    const newBasket = [...basket];
    newBasket.splice(index, 1);
    setBasket(newBasket);
    setHintMessage(null);
  };

  const handleCheckout = () => {
    if (activeMission.level === 'A') return;

    const total = basket.reduce((sum, item) => sum + item.price, 0);
    const budget = activeMission.budget || 0;
    
    if (total > budget) {
      setHintMessage({ mascot: 'A-Chi', emotion: 'money', text: 'เงินของเราไม่พอนะ ลองเอาของบางชิ้นออกดูสิ' });
      setIncorrectAttempts(prev => prev + 1);
      return;
    }

    const categories = basket.map(p => p.category);
    const isValid = activeMission.requiredCategories.every(
      req => categories.filter(c => c === req.category).length === req.quantity
    ) && basket.length === activeMission.requiredCategories.reduce((sum, req) => sum + req.quantity, 0);

    if (!isValid) {
      if (incorrectAttempts === 0) {
        setHintMessage({ mascot: 'Peter', emotion: 'thinking', text: 'ยังได้ของไม่ครบเลย ลองดูรายการของเราอีกครั้งนะ' });
      } else if (incorrectAttempts === 1) {
        setHintMessage({ mascot: 'Peter', emotion: 'hint', text: 'เราต้องใช้ของพวกนี้ในการดูแลฟันของเราให้สะอาดนะ ลองหาดูสิ' });
      } else {
        setHintMessage({ mascot: 'Peter', emotion: 'hint', text: 'เราต้องซื้อแปรงสีฟัน 1 อัน และยาสีฟัน 1 หลอด นะ' });
      }
      setIncorrectAttempts(prev => prev + 1);
      return;
    }

    setEnglishItemIndex(0);
    setGameState('english_interaction');
    setEnglishHint(null);
  };

  const startSession = () => {
    setIsSessionMode(true);
    setSessionIndex(0);
    setReplayCount(0);
    setWrongTaps(0);
    startMission(levelASession[0]);
  };

  const nextSessionMission = () => {
    const nextIdx = sessionIndex + 1;
    setSessionIndex(nextIdx);
    setReplayCount(0);
    setWrongTaps(0);
    startMission(levelASession[nextIdx]);
  };

  const startMission = (mission: Mission) => {
    if (!isDraftPreview || activeMission.id !== mission.id) {
      setIsDraftPreview(false);
    }
    setActiveMission(mission);
    setBasket([]);
    setHintMessage(null);
    const missionProducts = getMissionProducts(mission);
    setShuffledProducts([...missionProducts].sort(() => Math.random() - 0.5));
    setMissionProducts(missionProducts);
    // Build a map from productId to MissionChoice for quick lookup of wrongAudioId
    const newChoiceMap = new Map<string, MissionChoice>();
    mission.choices?.forEach(c => newChoiceMap.set(c.productId, c));
    setChoiceMap(newChoiceMap);

    if (import.meta.env.DEV) {
      mission.choices?.forEach(c => {
        if (!productsDB[c.productId]) {
          console.warn(`[Mission Validation] ${mission.id} unknown productId: ${c.productId}`);
        }
        if (c.wrongAudioId && !audioIdMap[c.wrongAudioId]) {
          console.warn(`[Mission Validation] ${mission.id} missing audio mapping: ${c.wrongAudioId}`);
        }
      });
    }

    if (!isSessionMode) {
       // Just resetting if it was played standalone
       setReplayCount(0);
       setWrongTaps(0);
    }
    
    if (!isAudioMuted) {
      stopSpeech();
      playSpeech(
        mission.dialogue?.instruction?.text || mission.instructionThai, 
        'th-TH', 1.0, 
        mission.dialogue?.instruction?.audioId || `${mission.id}.instruction`
      );
    }
    setGameState('shopping');
  };

  useEffect(() => {
    if (gameState === 'english_interaction' && isLevelA) {
      if (!isAudioMuted) {
        const currentItem = basket[englishItemIndex];
        if (!currentItem) return;
        
        const isPickTwo = activeMission.layoutTemplate === 'pick-two';
        const teachingText = isPickTwo ? currentItem.englishName : (activeMission.englishTeachingText || currentItem.englishName);
        
        const sequence = getPillowSequence({ text: teachingText });
        playAudioSequence(sequence, (phaseId) => {
          setEnglishPhase(phaseId as any);
        });
      } else {
        setEnglishPhase('repeat2');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, isLevelA, englishItemIndex]); // Exclude isAudioMuted to prevent auto-restart on unmute

  const targetProducts = gameState === 'english_interaction' ? basket : [];
  const isPickTwo = activeMission.layoutTemplate === 'pick-two';
  const currentEnglishItem = targetProducts[englishItemIndex];
  

  const handleEnglishAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      if (isPickTwo && englishItemIndex < basket.length - 1) {
        setEnglishItemIndex(prev => prev + 1);
        setEnglishPhase('listen1');
      } else {
        stopSpeech();
        setGameState('completed');
        const progressData = {
          missionId: activeMission.id,
          status: 'completed',
          hintsUsed: incorrectAttempts,
          wrongTaps,
          replayAudioTaps: replayCount,
          isSessionMode,
          completedAt: new Date().toISOString()
        };
        localStorage.setItem(`puplearn_${activeMission.id}_progress`, JSON.stringify(progressData));
        
        if (isSessionMode && sessionIndex === levelASession.length - 1) {
          
        }
      }
    } else {
      setEnglishHint('ลองอีกครั้งนะ! What did you buy?');
    }
  };

  return (
    <div className="h-[100dvh] font-sans max-w-md mx-auto relative overflow-hidden flex flex-col bg-sky-50">
      
      {/* Global Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {gameState !== 'home' && gameState !== 'mission_select' && gameState !== 'game_select' ? (
          activeMission.layoutTemplate === 'match-context' ? (
            <>
              <img src="/environments/daily-life-bg.png" alt="Daily Life Background" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px]"></div>
            </>
          ) : (
            <>
              <img src="/environments/supermarket-interior-bg.png" alt="Supermarket Interior" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
            </>
          )
        ) : (
          <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-200 via-sky-100 to-transparent" />
        )}
      </div>

      {/* SHARED V2 HEADER (Hidden on Home & Mission Select) */}
      {gameState !== 'home' && gameState !== 'mission_select' && gameState !== 'game_select' && (
        <div className="px-6 py-4 flex flex-shrink-0 items-center justify-between z-30 relative">
          <button 
            onClick={() => {
              setIsSessionMode(false);
              setGameState('mission_select');
            }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-sky-500 shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none transition-all"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
          </button>
          
          {isSessionMode && (
            <div className="flex gap-2 items-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/60">
              {levelASession.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= sessionIndex ? 'bg-yellow-400 shadow-[0_2px_0_rgba(202,138,4,0.5)]' : 'bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'} transition-all`} />
              ))}
            </div>
          )}
          
          <button 
            onClick={() => {
              stopSpeech();
              setIsAudioMuted(prev => {
                const next = !prev;
                setMasterVolume(next);
                return next;
              });
            }}
            className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none transition-all ${isAudioMuted ? 'text-gray-400' : 'text-sky-500'}`}
          >
            {isAudioMuted ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
            )}
          </button>
        </div>
      )}

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden flex flex-col relative">

        {/* STATE: HOME (V2 World) */}
        {gameState === 'home' && (
          <div className="absolute inset-0 flex flex-col z-20">
            {/* Top Controls */}
            <div className="px-6 py-4 flex flex-shrink-0 items-center justify-between z-30 relative">
              <button 
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sky-500 shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none transition-all"
                aria-label="Settings"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
              </button>
              
              <button 
                onClick={() => {
                  stopSpeech();
                  setIsAudioMuted(prev => {
                const next = !prev;
                setMasterVolume(next);
                return next;
              });
                }}
                className={`w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none transition-all ${isAudioMuted ? 'text-gray-400' : 'text-sky-500'}`}
              >
                {isAudioMuted ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
                )}
              </button>
            </div>

            {/* Background: Supermarket Exterior */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex flex-col justify-end">
               <img src="/environments/supermarket-home-bg.png" alt="Supermarket Background" className="w-full h-full object-cover object-bottom scale-[1.35] md:scale-[1.15] origin-bottom" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-end flex-1 pb-6 md:pb-8 px-6 overflow-hidden">
              
              {/* Large Hero Mascot */}
              <div className="w-full max-w-sm relative flex justify-center -mb-2 md:-mb-3 pointer-events-none">
                 <div className="relative w-[70%] md:w-[65%] flex flex-col items-center">
                   <img src="/mascots/bingo-happy.png" alt="Bingo" className="w-full max-w-none h-auto object-contain drop-shadow-xl origin-bottom animate-breath relative z-10" />
                 </div>
              </div>

              {/* CTA */}
              <div className="w-full max-w-sm relative z-20 pb-safe">
                <button 
                  onClick={() => {
                    initBgm();
                    setGameState('game_select');
                  }}
                  className="w-full bg-yellow-400 text-yellow-900 font-bold text-3xl md:text-4xl py-6 rounded-[3rem] shadow-[0_8px_0_rgb(202,138,4),_0_20px_30px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] active:translate-y-2 active:shadow-[0_0_0_rgb(202,138,4)] transition-all border-[6px] border-yellow-300 tracking-wide flex justify-center items-center gap-2 animate-pulse-occasional"
                >
                  <span className="text-2xl md:text-3xl leading-none">▶</span> เริ่มเล่น
                </button>
              </div>
            </div>
          </div>
        )}

                {/* STATE: GAME SELECT */}
        {gameState === 'game_select' && (
          <div className="absolute inset-0 flex flex-col z-20">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
               <img src="/environments/mission-select-bg.png" alt="Game Select Background" className="w-full h-full object-cover object-top" />
               <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
            </div>

            {/* Header */}
            <div className="px-6 py-4 flex items-center gap-4 relative z-10">
              <button 
                onClick={() => setGameState('home')}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-sky-500 shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none transition-all flex-shrink-0"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              </button>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white drop-shadow-md tracking-wide flex-1 text-center" style={{ WebkitTextStroke: '1px #0ea5e9' }}>
                เลือกการผจญภัย
              </h2>
                            <button 
                onClick={() => {
                  stopSpeech();
                  setIsAudioMuted(prev => {
                    const next = !prev;
                    setMasterVolume(next);
                    return next;
                  });
                }}
                className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none transition-all flex-shrink-0 ${isAudioMuted ? 'text-gray-400' : 'text-sky-500'}`}
              >
                {isAudioMuted ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293-1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
                )}
              </button>
            </div>

            {/* Game Cards */}
            <div className="flex-1 overflow-y-auto px-6 pb-12 pt-4 flex flex-col gap-6 relative z-10">
              {(() => {
                let previousStatus: AdventureState | null = null;
                return gameRegistry.map((game, index) => {
                  const status = getGameStatus(game, index, completedMissions, previousStatus);
                  previousStatus = status;
                  
                  const isPlayable = status === 'available' || status === 'completed';
                  
                  return (
                    <button
                      key={game.id}
                      disabled={!isPlayable}
                      onClick={() => {
                        if (isPlayable) {
                          setActiveGameId(game.id);
                          setGameState('mission_select');
                        }
                      }}
                      className={`w-full relative rounded-[3rem] p-4 transition-all flex flex-col items-center border-[6px] ${
                        isPlayable 
                          ? 'bg-white border-sky-300 shadow-[0_15px_30px_rgba(2,132,199,0.15)] active:translate-y-2 active:shadow-none hover:scale-[1.02]' 
                          : 'bg-gray-100 border-gray-200 opacity-90 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-full aspect-[2/1] rounded-[2rem] overflow-hidden relative mb-4 ${isPlayable ? 'bg-sky-100' : 'bg-gray-200 grayscale'}`}>
                        {game.coverImage && (
                          <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                        )}
                        
                        {/* Mascot Decoration */}
                        {isPlayable && game.mascot && (
                          <img 
                            src={getMascotAsset(game.mascot, 'happy')} 
                            alt={game.mascot} 
                            className="absolute -bottom-2 -right-2 w-32 h-32 object-contain drop-shadow-md" 
                          />
                        )}

                        {status === 'coming_soon' && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
                             <div className="bg-gray-800/80 text-white font-bold font-display px-6 py-3 rounded-full text-2xl tracking-wide backdrop-blur-sm border-2 border-gray-600/50 shadow-lg">
                               Coming Soon
                             </div>
                          </div>
                        )}

                        {status === 'locked' && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
                             <div className="bg-gray-800/80 text-white font-bold font-display px-6 py-3 rounded-full text-2xl tracking-wide backdrop-blur-sm border-2 border-gray-600/50 shadow-lg flex items-center gap-2">
                               <span className="text-3xl">🔒</span> Locked
                             </div>
                          </div>
                        )}

                        {status === 'completed' && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white font-bold font-display px-4 py-2 rounded-full text-xl tracking-wide border-4 border-green-300 shadow-[0_4px_15px_rgba(34,197,94,0.3)] flex items-center gap-2 z-10 animate-bounce-twice">
                            🌟 ทำครบแล้ว
                          </div>
                        )}
                      </div>
                      <h3 className={`text-3xl font-display font-bold ${isPlayable ? 'text-sky-600' : 'text-gray-500'} mb-2 text-center`}>
                        {game.title}
                      </h3>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* STATE: MISSION SELECT (V2) */}
        {gameState === 'mission_select' && (
          <div className="absolute inset-0 flex flex-col z-20">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
               <img src="/environments/mission-select-bg.png" alt="Mission Select Background" className="w-full h-full object-cover object-top" />
               <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
            </div>

            {/* Header */}
            <div className="px-6 py-4 flex items-center gap-4 relative z-10">
              <button 
                onClick={() => setGameState('game_select')}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-sky-500 shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white active:translate-y-1 transition-all flex-shrink-0"
              >
                <span className="text-2xl leading-none -mt-1">⬅️</span>
              </button>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white drop-shadow-md tracking-wide flex-1 text-center" style={{ WebkitTextStroke: '1px #0ea5e9' }}>
                {activeGame?.title || 'เลือกภารกิจ'}
              </h2>
              <button
                onClick={() => {
                  Object.keys(localStorage).forEach(key => {
      if (key.startsWith('puplearn_')) {
        localStorage.removeItem(key);
      }
    });
                  setCompletedMissions({});
                }}
                className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-rose-500 shadow-sm border-2 border-white active:translate-y-1 transition-all flex-shrink-0"
                aria-label="Reset Progress"
                title="Reset Progress"
              >
                <span className="text-xl">🔄</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-12 flex flex-col gap-3 relative z-10">
              
              {/* Level A Group */}
              <div className="w-full bg-white/70 backdrop-blur-md rounded-[2.5rem] p-2 border-2 border-white shadow-sm">
                <button 
                  onClick={() => setExpandedGroup(expandedGroup === 'level-a' ? null : 'level-a')}
                  className="w-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-[2rem] p-3 shadow-[0_8px_20px_rgba(2,132,199,0.2)] active:scale-[0.98] transition-all flex items-center justify-between"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center p-2 backdrop-blur-sm">
                    <img src={productsDB.apple.image} alt="Apple" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 text-left px-4">
                    <div className="text-xl font-bold text-white drop-shadow-sm">บทเรียนระดับ A</div>
                    <div className="text-sm font-semibold text-sky-100">พื้นฐาน ({gameMissionsResolved.length} ภารกิจ)</div>
                  </div>
                  <div className="text-white text-2xl mr-2 font-bold">
                    {expandedGroup === 'level-a' ? '▲' : '▼'}
                  </div>
                </button>

                {expandedGroup === 'level-a' && (
                  <div className="flex flex-col gap-2 mt-3 px-2 pb-2 animate-fade-in-up">
                    <button onClick={startSession} className="w-full bg-green-500 rounded-[1.5rem] p-3 flex items-center justify-center gap-2 text-white font-bold text-xl shadow-[0_4px_0_rgb(22,163,74)] active:translate-y-1 active:shadow-none mb-2 transition-all">
                      ▶ เล่นต่อเนื่องทั้งหมด
                    </button>
                    
                    {gameMissionsResolved.map((entry, idx, arr) => {
                      const m = entry.mission;
                      const img = entry.cardImage;
                      const isCompleted = completedMissions[m.id] === true;
                      const prevCompleted = idx === 0 || completedMissions[arr[idx-1].mission.id] === true;
                      const isCurrent = !isCompleted && prevCompleted;
                      const isLocked = !isCompleted && !prevCompleted;
                      
                      return (
                        <button 
                          key={m.id}
                          onClick={() => {
                            if (!isLocked) startMission(m);
                          }}
                          className={`w-full rounded-[1.5rem] p-3 transition-all flex items-center gap-3 border-2 ${
                            isCompleted ? 'bg-sky-50 border-sky-100 opacity-80' : 
                            isCurrent ? 'bg-white border-yellow-300 shadow-[0_4px_10px_rgba(250,204,21,0.2)] hover:border-yellow-400 active:translate-y-1 active:shadow-none' : 
                            'bg-gray-50/80 border-transparent opacity-60 grayscale cursor-not-allowed'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl p-2 flex-shrink-0 relative ${isCompleted ? 'bg-green-100' : isCurrent ? 'bg-yellow-100 animate-pulse-occasional' : 'bg-gray-200'}`}>
                            <img src={img} alt="item" className="w-full h-full object-contain drop-shadow-sm" />
                            {isCompleted && <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs border border-white">✓</div>}
                            {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl"><span className="text-xl">🔒</span></div>}
                          </div>
                          <div className="flex-1 text-left">
                            <div className={`text-lg font-bold font-display ${isCompleted ? 'text-green-600' : isCurrent ? 'text-gray-800' : 'text-gray-400'}`}>
                              {m.id.replace('mission_', 'ด่าน ').toUpperCase()}
                            </div>
                            <div className={`text-xs font-semibold ${isCompleted ? 'text-green-500' : isCurrent ? 'text-gray-500' : 'text-gray-400'}`}>{m.instructionThai}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
        

        {/* MISSION ENGINE SHELL */}
        {(gameState === 'shopping' || gameState === 'english_interaction') && isMissionEngineAuthorized && (
          <div className="absolute inset-0 flex flex-col z-10 animate-fade-in">
            <MissionEngine 
              mission={activeMission} 
              isAudioMuted={isAudioMuted} 
              onComplete={(wrong, replay) => {
                setWrongTaps(wrong);
                setReplayCount(replay);
                setGameState('completed');
                const progressData = {
                  missionId: activeMission.id,
                  status: 'completed',
                  hintsUsed: 0,
                  wrongTaps: wrong,
                  replayAudioTaps: replay,
                  isSessionMode,
                  completedAt: new Date().toISOString()
                };
                localStorage.setItem(`puplearn_${activeMission.id}_progress`, JSON.stringify(progressData));
                
                if (isSessionMode && sessionIndex === levelASession.length - 1) {
                  
                }
              }}
            />
          </div>
        )}

        {/* STATE: SHOPPING (LEGACY FALLBACK) */}
        {gameState === 'shopping' && !isMissionEngineAuthorized && activeMission.id === 'mission07' && (
          ['find-one', 'color-hunt', 'pick-two'].includes(activeMission.layoutTemplate || '') ? (
            <div className="absolute inset-0 flex flex-col z-10 animate-fade-in">
              <ProductDisplayV2 
                mission={{ ...activeMission, products: shuffledProducts.length > 0 ? shuffledProducts : (activeMission.products || missionProducts) }}
                isAudioMuted={isAudioMuted}
                onTargetFound={handleAddToCart}
                onWrongTap={handleAddToCart}
                hintMessage={hintMessage}
                replayCount={replayCount}
                setReplayCount={setReplayCount}
                basketItems={basket}
              />
              {/* FLYING ITEM ANIMATION OVERLAY */}
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
                  <img src={flyingItem.product.image} alt="flying" className="w-24 h-24 object-contain drop-shadow-xl" />
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col h-full overflow-hidden z-10">
              <div className="z-10 px-5 pt-8 flex-shrink-0 relative h-[160px] pointer-events-none">
                {hintMessage ? (
                  <div className="absolute inset-0 px-5 pt-6 z-40 animate-fade-in-up">
                    <div className="pointer-events-auto">
                      <MascotBubble 
                        mascot={hintMessage.mascot} 
                        emotion={hintMessage.emotion} 
                        message={hintMessage.text}
                        audioEnabled={activeMission.level === 'A' && !isAudioMuted}
                        playTrigger={hintMessage.timestamp}
                        audioId={hintMessage.audioId}
                        onReplay={() => {
                          setReplayCount(r => r + 1);
                          if (!isAudioMuted && hintMessage.audioId) {
                            playSpeech(hintMessage.text, 'th-TH', 1.0, hintMessage.audioId);
                          } else if (!isAudioMuted) {
                            playSpeech(hintMessage.text, 'th-TH', 1.0);
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 px-5 pt-6">
                    <div className="pointer-events-auto">
                      <MascotBubble 
                        mascot="Bingo" 
                        emotion="guide" 
                        message={activeMission.dialogue?.instruction?.text || activeMission.instructionThai} 
                        audioEnabled={activeMission.level === 'A' && !isAudioMuted} 
                        audioId={activeMission.dialogue?.instruction?.audioId || `${activeMission.id}.instruction`}
                        disableAutoPlay={true}
                        onReplay={() => {
                          setReplayCount(r => r + 1);
                          if (!isAudioMuted) {
                            playSpeech(
                              activeMission.dialogue?.instruction?.text || activeMission.instructionThai, 
                              'th-TH', 1.0, 
                              activeMission.dialogue?.instruction?.audioId || `${activeMission.id}.instruction`
                            );
                          }
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SUPERMARKET SHELF AREA - SCROLLABLE */}
              <div className="flex-1 overflow-y-auto px-5 pb-5 mt-2">
                <div className="bg-[#FFF4E6] rounded-[3.5rem] border-[10px] border-[#FFE4C4] shadow-[inset_0_15px_30px_rgba(0,0,0,0.06)] p-6 pt-10 min-h-full">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-12 pb-12">
                    {(activeMission.products || missionProducts).map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onSelect={handleAddToCart} 
                        hidePrice={activeMission.level === 'A'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Basket 
                items={basket} 
                budget={activeMission.budget}
                level={activeMission.level}
                targetCount={activeMission.targetCount}
                onRemove={handleRemoveFromCart}
                onCheckout={handleCheckout} 
              />

              {/* FLYING ITEM ANIMATION OVERLAY */}
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
            </div>
          )
        )}

        {/* STATE: ENGLISH INTERACTION */}
        {gameState === 'english_interaction' && !levelASession.some(m => m.id === activeMission.id) && (
          activeMission.level === 'A' ? (
            <VocabularyTeaching 
              targetImage={isPickTwo && currentEnglishItem ? currentEnglishItem.image : targetProducts[0].image}
              targetEnglishName={isPickTwo && currentEnglishItem ? currentEnglishItem.englishName : (activeMission.englishTeachingText || targetProducts[0].englishName)}
              englishPhase={englishPhase || 'listen1'}
              isAudioMuted={isAudioMuted}
              onReplay={() => {
                setReplayCount(r => r + 1);
                if (!isAudioMuted) {
                  const currentItem = isPickTwo && currentEnglishItem ? currentEnglishItem : targetProducts[0];
                  const teachingText = isPickTwo ? currentItem.englishName : (activeMission.englishTeachingText || currentItem.englishName);
                  const sequence = getPillowSequence({ text: teachingText });
                  playAudioSequence(sequence, (phaseId) => setEnglishPhase(phaseId as any));
                }
              }}
              onComplete={() => handleEnglishAnswer(true)}
            />
          ) : (
            <div className="animate-fade-in-up flex-1 flex flex-col justify-center items-center px-6 relative z-10">
              <>
                <MascotBubble mascot="Pillow" emotion="asking" message={englishHint || "Great job! What did you buy?"} layout="vertical" />
                  
                  <div className="w-full max-w-sm flex flex-col gap-6 mt-14">
                    <button 
                      onClick={() => handleEnglishAnswer(true)}
                      className="w-full flex items-center p-6 rounded-[3rem] bg-white border-b-[8px] border-sky-200 shadow-[0_15px_30px_rgba(0,0,0,0.08)] active:border-b-0 active:translate-y-2 transition-all hover:scale-[1.02]"
                    >
                      <div className="flex gap-3 mr-6 bg-sky-50 p-4 rounded-[2rem] shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)] border-[3px] border-sky-100 items-center">
                        <img src={productsDB.toothbrushB.image} alt="Toothbrush" className="w-12 h-12 object-contain drop-shadow-md" />
                        <img src={productsDB.toothpasteB.image} alt="Toothpaste" className="w-12 h-12 object-contain drop-shadow-md" />
                      </div>
                      <span className="text-2xl font-display font-semibold text-sky-900 text-left leading-tight">Toothbrush &<br/>Toothpaste</span>
                    </button>
                    
                    <button 
                      onClick={() => handleEnglishAnswer(false)}
                      className="w-full flex items-center p-6 rounded-[3rem] bg-white border-b-[8px] border-rose-200 shadow-[0_15px_30px_rgba(0,0,0,0.08)] active:border-b-0 active:translate-y-2 transition-all hover:scale-[1.02]"
                    >
                      <div className="flex gap-3 mr-6 bg-rose-50 p-4 rounded-[2rem] shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)] border-[3px] border-rose-100 items-center">
                        <img src={productsDB.apple.image} alt="Apple" className="w-12 h-12 object-contain drop-shadow-md" />
                        <img src={productsDB.soap.image} alt="Soap" className="w-12 h-12 object-contain drop-shadow-md" />
                      </div>
                      <span className="text-2xl font-display font-semibold text-rose-900 text-left leading-tight">Apple &<br/>Soap</span>
                    </button>
                  </div>
                </>
            </div>
          )
        )}

        {/* STATE: COMPLETED */}
        {gameState === 'completed' && (() => {
          const isLastSessionMission = isSessionMode && sessionIndex === levelASession.length - 1;
          const completedMascot: MascotType = isLastSessionMission
            ? ((activeGame.mascot as MascotType) || (activeMission.guideMascot as MascotType) || 'Bingo')
            : (activeMission.guideMascot === 'Peter' ? 'Peter' : 'Pillow');

          return (
            <div className="animate-fade-in-up flex-1 flex flex-col items-center justify-between text-center px-4 relative z-10 pt-2 sm:pt-4 pb-6 sm:pb-8 overflow-y-auto w-full">
              {/* Top Area: Excellent & Star */}
              <div className="relative z-20 w-full flex flex-col items-center flex-shrink-0 pt-1 sm:pt-2">
                <div className="w-full bg-white rounded-[2.5rem] sm:rounded-[3rem] border-b-[8px] border-yellow-100 shadow-[0_12px_28px_rgba(0,0,0,0.08)] px-5 py-3 sm:py-4 flex flex-col items-center max-w-[280px] sm:max-w-[310px]">
                  <div className="text-[48px] sm:text-[60px] animate-bounce drop-shadow-[0_15px_15px_rgba(250,204,21,0.4)] leading-none mb-1">🌟</div>
                  <p className="text-3xl sm:text-4xl font-display font-bold uppercase text-green-500 tracking-wide drop-shadow-sm mb-1.5">Excellent!</p>
                  <p className="text-base sm:text-lg font-bold text-gray-700 bg-gray-50/80 px-4 py-1 rounded-full border-2 border-gray-100 shadow-sm">เก่งมากเลย!</p>
                </div>
              </div>

              {/* Center Area: Mascot (Matched to Gameplay Size) */}
              <div className="w-full flex justify-center my-auto py-2 relative z-20 pointer-events-none flex-shrink-0">
                <div className="relative w-40 sm:w-48 h-40 sm:h-48 flex items-center justify-center">
                  <img 
                    src={getMascotAsset(completedMascot, 'happy')} 
                    alt={completedMascot} 
                    className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] animate-bounce-twice relative z-10" 
                  />
                </div>
              </div>

              {/* Bottom Area: CTA Buttons */}
              <div className="relative z-10 w-full max-w-sm flex flex-col items-center flex-shrink-0 mb-1 sm:mb-2">
                {isLastSessionMission ? (
                  <>
                    <h2 className="text-base sm:text-lg font-bold text-green-700 mb-3 drop-shadow-sm tracking-wide bg-white/95 px-5 py-2 rounded-full border-2 border-green-200 relative z-30 shadow-sm">
                      ทำภารกิจในการผจญภัยนี้ครบแล้ว!
                    </h2>
                    <div className="w-full flex flex-col gap-3 relative z-30">
                      <button 
                        onClick={startSession}
                        className="w-full bg-green-500 text-white font-bold text-2xl sm:text-3xl py-4 sm:py-4.5 rounded-[2.2rem] shadow-[0_7px_0_rgb(22,163,74),_0_15px_20px_rgba(0,0,0,0.15)] active:translate-y-1.5 active:shadow-[0_0_0_rgb(22,163,74)] hover:scale-[1.02] transition-all border-[5px] border-green-300 tracking-wide cursor-pointer"
                      >
                        เล่นอีกครั้ง
                      </button>
                      <button 
                        onClick={() => {
                          setIsSessionMode(false);
                          setIsDraftPreview(false);
                          setGameState('game_select');
                        }}
                        className="w-full bg-white text-sky-500 font-bold text-lg sm:text-xl py-3 sm:py-3.5 rounded-[1.8rem] shadow-[0_5px_0_rgba(0,0,0,0.05)] active:translate-y-1.5 active:shadow-none hover:scale-[1.02] transition-all border-3 border-sky-100 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                        กลับไปเลือกเกม
                      </button>
                    </div>
                  </>
                ) : isSessionMode ? (
                  <div className="w-full flex flex-col gap-3 relative z-30">
                    <button 
                      onClick={nextSessionMission}
                      className="w-full bg-sky-500 text-white font-bold text-2xl sm:text-3xl py-4 sm:py-4.5 rounded-[2.2rem] shadow-[0_7px_0_rgb(2,132,199),_0_15px_20px_rgba(0,0,0,0.15)] active:translate-y-1.5 active:shadow-[0_0_0_rgb(2,132,199)] hover:scale-[1.02] transition-all border-[5px] border-sky-300 tracking-wide animate-[pulse_2s_infinite] cursor-pointer"
                    >
                      ภารกิจถัดไป
                    </button>
                    <button 
                      onClick={() => startMission(activeMission)}
                      className="w-full bg-white text-sky-500 font-bold text-lg sm:text-xl py-3 sm:py-3.5 rounded-[1.8rem] shadow-[0_5px_0_rgba(0,0,0,0.05)] active:translate-y-1.5 active:shadow-none hover:scale-[1.02] transition-all border-3 border-sky-100 cursor-pointer"
                    >
                      เล่นอีกครั้ง
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex flex-col gap-3 relative z-30">
                    <button 
                      onClick={() => startMission(activeMission)}
                      className="w-full bg-green-500 text-white font-bold text-2xl sm:text-3xl py-4 sm:py-4.5 rounded-[2.2rem] shadow-[0_7px_0_rgb(22,163,74),_0_15px_20px_rgba(0,0,0,0.15)] active:translate-y-1.5 active:shadow-[0_0_0_rgb(22,163,74)] hover:scale-[1.02] transition-all border-[5px] border-green-300 tracking-wide cursor-pointer"
                    >
                      เล่นอีกครั้ง
                    </button>
                    <button 
                      onClick={() => {
                        setIsSessionMode(false);
                        setIsDraftPreview(false);
                        setGameState('mission_select');
                        setBasket([]);
                        setHintMessage(null);
                      }}
                      className="w-full bg-white text-sky-500 font-bold text-lg sm:text-xl py-3 sm:py-3.5 rounded-[1.8rem] shadow-[0_5px_0_rgba(0,0,0,0.05)] active:translate-y-1.5 active:shadow-none transition-all border-3 border-sky-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                      กลับหน้าเลือกด่าน
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default App;
