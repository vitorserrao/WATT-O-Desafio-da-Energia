/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User,
  MousePointer2,
  Zap, 
  Cpu, 
  Factory, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw,
  BookOpen,
  GraduationCap,
  MapPin,
  Settings,
  Activity,
  Lightbulb,
  Sun,
  ShieldCheck,
  Gamepad2
} from 'lucide-react';
import { challenges, Challenge, Choice } from './data/challenges';

type GameState = 'START' | 'CHARACTER_SELECT' | 'MAP' | 'PERIOD_INTRO' | 'CHALLENGE' | 'FEEDBACK' | 'GAME_OVER';

interface Character {
  id: string;
  name: string;
  gender: 'M' | 'F';
  hasHelmet: boolean;
  color: string;
}

const CHARACTERS: Character[] = [
  { id: 'm_no_h', name: 'Técnico (Sem Capacete)', gender: 'M', hasHelmet: false, color: '#10b981' },
  { id: 'm_h', name: 'Engenheiro (Com Capacete)', gender: 'M', hasHelmet: true, color: '#f59e0b' },
  { id: 'f_no_h', name: 'Técnica (Sem Capacete)', gender: 'F', hasHelmet: false, color: '#3b82f6' },
  { id: 'f_h', name: 'Engenheira (Com Capacete)', gender: 'F', hasHelmet: true, color: '#ef4444' },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);
  const [isGameWon, setIsGameWon] = useState(false);
  
  // Simulation States
  const [multimeterScale, setMultimeterScale] = useState<'OFF' | 'ACV' | 'DCA' | 'OHM'>('OFF');
  const [wiringConnections, setWiringConnections] = useState<{N: boolean, PE: boolean, L: boolean, R?: boolean}>({N: false, PE: false, L: false});
  const [selectedBreaker, setSelectedBreaker] = useState<string | null>(null);
  const [autocadActiveElement, setAutocadActiveElement] = useState<string | null>(null);
  const [economyAction, setEconomyAction] = useState<string | null>(null);
  const [isProbeConnected, setIsProbeConnected] = useState({ red: false, black: false });

  const currentChallenge = challenges[currentPeriodIndex];

  const startGame = () => {
    setGameState('CHARACTER_SELECT');
    setCurrentPeriodIndex(0);
    setScore(0);
    setLastChoice(null);
    setIsGameWon(false);
    resetSimulation();
  };

  const startJourney = () => {
    setGameState('MAP');
  };

  const resetSimulation = () => {
    setMultimeterScale('OFF');
    setWiringConnections({N: false, PE: false, L: false});
    setSelectedBreaker(null);
    setAutocadActiveElement(null);
    setEconomyAction(null);
    setIsProbeConnected({ red: false, black: false });
  };

  const handleChoice = (choice: Choice) => {
    setLastChoice(choice);
    if (choice.isCorrect) {
      setScore(prev => prev + 100);
    }
    setGameState('FEEDBACK');
  };

  const validateSimulation = () => {
    let isCorrect = false;
    let explanation = "";
    let subject = currentChallenge.subject;

    switch (currentChallenge.type) {
      case 'SIMULATION_MULTIMETER':
        isCorrect = multimeterScale === 'ACV' && isProbeConnected.red && isProbeConnected.black;
        explanation = isCorrect 
          ? "Excelente! Você configurou a escala de Tensão Alternada e conectou as pontas corretamente." 
          : "Incorreto. Para medir a fonte, você precisava da escala ACV e ambas as pontas conectadas.";
        break;
      case 'SIMULATION_WIRING_SOCKET':
        isCorrect = wiringConnections.N && wiringConnections.PE && wiringConnections.L;
        explanation = isCorrect 
          ? "Perfeito! Todos os fios foram conectados nos bornes padrão NBR 5410." 
          : "Conexão incompleta ou incorreta. Verifique se todos os fios (N, PE, L) foram instalados.";
        break;
      case 'SIMULATION_WIRING_LAMP':
        isCorrect = wiringConnections.L;
        explanation = isCorrect 
          ? "Correto! O interruptor agora secciona a fase, permitindo o controle seguro da lâmpada." 
          : "O circuito ainda está aberto. Você precisa levar a fase até o interruptor.";
        break;
      case 'SIMULATION_AUTOCAD':
        isCorrect = autocadActiveElement === 'TUG_MID';
        explanation = isCorrect 
          ? "Símbolo correto! O triângulo preenchido pela metade indica tomada média." 
          : "Símbolo incorreto para uma tomada de 1,10m.";
        break;
      case 'SIMULATION_SHOWER':
        isCorrect = selectedBreaker === 'CONECTOR_PORCELANA';
        explanation = isCorrect 
          ? "Escolha segura! O conector de porcelana suporta a alta corrente do chuveiro sem derreter." 
          : "Este material não é adequado para a potência de um chuveiro elétrico.";
        break;
      case 'SIMULATION_ECONOMY':
        isCorrect = economyAction === 'DESPACHAR';
        explanation = isCorrect 
          ? "Decisão acertada! Despachar térmicas garante a estabilidade do sistema em picos de demanda." 
          : "O sistema entraria em colapso sem o despacho de energia complementar.";
        break;
      case 'SIMULATION_BREAKER':
        isCorrect = selectedBreaker === 'C32';
        explanation = isCorrect 
          ? "Dimensionamento correto para a carga solicitada." 
          : "Disjuntor inadequado para a corrente nominal do circuito.";
        break;
    }

    const mockChoice: Choice = {
      id: 'sim',
      text: 'Simulação Concluída',
      isCorrect,
      explanation,
      subject
    };

    handleChoice(mockChoice);
  };

  const nextStep = () => {
    resetSimulation();
    if (currentPeriodIndex < challenges.length - 1) {
      setCurrentPeriodIndex(prev => prev + 1);
      setGameState('MAP');
    } else {
      setIsGameWon(score >= 800);
      setGameState('GAME_OVER');
    }
  };

  const renderStart = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center space-y-8 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl shadow-2xl"
    >
      <div className="flex justify-center">
        <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <Zap className="w-16 h-16 text-emerald-400 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tighter text-white uppercase italic">
          Mestre da Energia
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Simulador narrativo de carreira para o curso de Tecnologia em Sistemas de Energia do <span className="text-emerald-400 font-semibold">IFSC</span>.
          Guie um calouro através dos 6 períodos e salve uma indústria em Florianópolis da falência energética.
        </p>
      </div>
      <button 
        onClick={startGame}
        className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
      >
        INICIAR CARREIRA
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      <div className="pt-8 border-t border-zinc-800 flex justify-center gap-8 text-xs text-zinc-500 uppercase tracking-widest font-mono">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Florianópolis, SC
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> IFSC - Campus Florianópolis
        </div>
      </div>
    </motion.div>
  );

  const TopDownCharacter = ({ character, size = 40 }: { character: Character, size?: number }) => (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Shoulders */}
        <ellipse cx="50" cy="55" rx="35" ry="20" fill={character.color} stroke="#000" strokeWidth="2" />
        {/* Arms */}
        <rect x="15" y="45" width="15" height="25" rx="4" fill={character.color} stroke="#000" strokeWidth="2" />
        <rect x="70" y="45" width="15" height="25" rx="4" fill={character.color} stroke="#000" strokeWidth="2" />
        {/* Head */}
        <circle cx="50" cy="45" r="18" fill="#fcd34d" stroke="#000" strokeWidth="2" />
        {/* Hair/Details based on gender */}
        {character.gender === 'F' && !character.hasHelmet && (
          <path d="M 32 45 Q 32 25 50 25 Q 68 25 68 45" fill="#4b2c20" />
        )}
        {/* Helmet */}
        {character.hasHelmet && (
          <g>
            <path d="M 32 45 Q 32 20 50 20 Q 68 20 68 45" fill="#ffffff" stroke="#000" strokeWidth="2" />
            <rect x="35" y="38" width="30" height="4" rx="2" fill="#e5e7eb" />
          </g>
        )}
      </svg>
    </div>
  );

  const renderCharacterSelection = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8 p-12 bg-zinc-900 border border-zinc-800 rounded-[3rem] shadow-2xl"
    >
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-white uppercase tracking-tighter italic">Escolha seu Avatar</h2>
        <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Selecione o perfil do seu tecnólogo</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {CHARACTERS.map((char) => (
          <motion.div
            key={char.id}
            whileHover={{ y: -10 }}
            onClick={() => setSelectedCharacter(char)}
            className={`cursor-pointer p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-6 ${
              selectedCharacter.id === char.id 
                ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                : 'bg-zinc-800/50 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-zinc-700">
              <TopDownCharacter character={char} size={80} />
            </div>
            <div className="text-center">
              <div className={`text-xs font-bold uppercase tracking-widest ${selectedCharacter.id === char.id ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {char.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={startJourney}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
      >
        CONFIRMAR E COMEÇAR
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );

  const renderMap = () => {
    // Calculate path points for the SVG line
    const getTileCenter = (idx: number) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      return {
        x: (col * 25 + 12.5) + '%',
        y: (row * 33.33 + 16.66) + '%'
      };
    };

    const pathPoints = challenges.map((_, i) => {
      const center = getTileCenter(i);
      return `${center.x} ${center.y}`;
    }).join(' L ');

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto w-full space-y-8 relative"
      >
        {/* Decorative background elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="flex items-center justify-center gap-3">
            <Gamepad2 className="w-8 h-8 text-emerald-400" />
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic drop-shadow-lg">Trilha do Tecnólogo</h2>
          </div>
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">A jornada rumo à eficiência energética</p>
        </div>

        {/* The Board Container */}
        <div className="relative p-4 bg-[#3d2b1f] rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border-b-[12px] border-r-[12px] border-[#2a1d15]">
          {/* Inner Frame (Metal) */}
          <div className="relative aspect-[16/10] bg-zinc-900 border-[12px] border-zinc-800 rounded-[3rem] overflow-hidden p-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]">
            {/* Board Texture */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 via-transparent to-zinc-900/30" />
            
            {/* Blueprint Grid Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            {/* Connection Path */}
            <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d={`M ${pathPoints}`} 
                fill="none" 
                stroke="rgba(16, 185, 129, 0.15)" 
                strokeWidth="20" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d={`M ${pathPoints}`} 
                fill="none" 
                stroke="rgba(16, 185, 129, 0.3)" 
                strokeWidth="4" 
                strokeDasharray="15 15"
                strokeLinecap="round"
              />
            </svg>
            
            <div className="relative h-full grid grid-cols-4 grid-rows-3 gap-8">
            {/* Character / Player Pawn */}
            <motion.div
              animate={{ 
                left: (currentPeriodIndex % 4) * 25 + 12.5 + '%',
                top: Math.floor(currentPeriodIndex / 4) * 33.33 + 16.66 + '%'
              }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="absolute z-30 w-16 h-16 -ml-8 -mt-8 pointer-events-none"
            >
              <div className="relative w-full h-full flex flex-col items-center">
                {/* Pawn Shadow */}
                <div className="absolute bottom-0 w-10 h-10 bg-black/60 rounded-full blur-md" />
                
                {/* Top-Down Character */}
                <motion.div 
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <TopDownCharacter character={selectedCharacter} size={64} />
                </motion.div>

                {/* Glow */}
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl -z-10"
                />
              </div>
            </motion.div>

            {challenges.map((challenge, idx) => {
              const isCompleted = idx < currentPeriodIndex;
              const isCurrent = idx === currentPeriodIndex;
              const isLocked = idx > currentPeriodIndex;

              return (
                <motion.div
                  key={challenge.id}
                  whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
                  className={`relative p-4 rounded-3xl border-4 transition-all flex flex-col justify-between group overflow-hidden ${
                    isCurrent 
                      ? 'bg-zinc-800 border-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] z-10' 
                      : isCompleted 
                      ? 'bg-zinc-800/80 border-emerald-900/50 opacity-90' 
                      : 'bg-zinc-900 border-zinc-800 opacity-60 grayscale'
                  }`}
                  style={{
                    boxShadow: isCurrent 
                      ? '0 20px 40px -10px rgba(16,185,129,0.4), inset 0 2px 10px rgba(255,255,255,0.1)' 
                      : '0 10px 20px -5px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.05)'
                  }}
                >
                  {/* Tile Number Background */}
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-8xl font-black italic">{idx + 1}</span>
                  </div>

                  <div className="flex justify-between items-start relative z-10">
                    <div className={`px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-widest ${isCurrent ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-700 text-zinc-400'}`}>
                      P{challenge.period}
                    </div>
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-lg" />}
                    {isCurrent && <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />}
                  </div>
                  
                  <div className="space-y-1 relative z-10">
                    <h3 className={`font-bold text-xs leading-tight ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>
                      {challenge.title}
                    </h3>
                    <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-tighter">{challenge.subject}</p>
                  </div>

                  {isCurrent && (
                    <button 
                      onClick={() => setGameState('PERIOD_INTRO')}
                      className="mt-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg transition-colors relative z-10"
                    >
                      JOGAR
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

  const renderPeriodIntro = () => (
    <motion.div 
      key={`intro-${currentPeriodIndex}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto space-y-8 p-10 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <BookOpen className="w-48 h-48" />
      </div>
      <div className="space-y-2">
        <span className="text-emerald-400 font-mono text-sm tracking-widest uppercase">
          Fase {currentChallenge.period} de 6 | Desafio {currentPeriodIndex + 1} de {challenges.length}
        </span>
        <h2 className="text-4xl font-bold text-white tracking-tight">
          {currentChallenge.title}
        </h2>
      </div>
      <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 italic text-zinc-300 leading-relaxed">
        "Você está no setor de {currentChallenge.subject}. O problema aqui exige aplicação prática imediata..."
      </div>
      <button 
        onClick={() => setGameState('CHALLENGE')}
        className="w-full py-4 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
      >
        INICIAR SIMULAÇÃO
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );

  const renderSimulationVisual = () => {
    switch (currentChallenge.type) {
      case 'SIMULATION_MULTIMETER':
        return (
          <div className="relative h-96 bg-zinc-900/80 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center overflow-hidden p-8 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            {/* Realistic Multimeter Device */}
            <div className="relative w-56 h-80 bg-yellow-500 rounded-[2.5rem] p-4 shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_-10px_20px_rgba(0,0,0,0.2)] border-4 border-yellow-600 z-10">
              {/* LCD Screen */}
              <div className="bg-[#94a38e] h-20 rounded-xl border-4 border-zinc-800 p-2 flex flex-col justify-end items-end shadow-inner overflow-hidden">
                <div className="text-zinc-800 font-mono text-3xl font-bold tracking-tighter">
                  {multimeterScale === 'ACV' && isProbeConnected.red && isProbeConnected.black ? '127.4' : '000.0'}
                </div>
                <div className="text-zinc-700 font-mono text-[8px] font-black uppercase tracking-widest">
                  {multimeterScale || 'OFF'}
                </div>
              </div>

              {/* Rotary Dial */}
              <div className="mt-8 flex justify-center">
                <div 
                  className="relative w-28 h-28 rounded-full bg-zinc-800 border-4 border-zinc-700 shadow-lg flex items-center justify-center cursor-pointer group"
                  onClick={() => {
                    const scales: ('OFF' | 'ACV' | 'DCA' | 'OHM')[] = ['OFF', 'ACV', 'DCA', 'OHM'];
                    const next = scales[(scales.indexOf(multimeterScale) + 1) % scales.length];
                    setMultimeterScale(next);
                  }}
                >
                  <motion.div 
                    animate={{ rotate: multimeterScale === 'ACV' ? 45 : multimeterScale === 'DCA' ? 135 : multimeterScale === 'OHM' ? 225 : 0 }}
                    className="w-1 h-12 bg-red-500 rounded-full origin-bottom -translate-y-6 relative transition-transform duration-300"
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-400 rounded-full shadow-sm" />
                  </motion.div>
                  
                  {/* Dial Labels */}
                  <div className="absolute inset-0 pointer-events-none p-2">
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-white font-black">OFF</span>
                    <span className="absolute top-1/2 right-1 -translate-y-1/2 text-[8px] text-white font-black rotate-90">ACV</span>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-white font-black rotate-180">OHM</span>
                    <span className="absolute top-1/2 left-1 -translate-y-1/2 text-[8px] text-white font-black -rotate-90">DCA</span>
                  </div>
                  
                  {/* Center Cap */}
                  <div className="absolute w-6 h-6 bg-zinc-700 rounded-full border-2 border-zinc-600 shadow-inner" />
                </div>
              </div>

              {/* Probe Ports */}
              <div className="mt-8 flex justify-around px-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-zinc-950 border-2 border-zinc-800 shadow-inner flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full bg-red-500 ${isProbeConnected.red ? 'opacity-100 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'opacity-20'}`} />
                  </div>
                  <span className="text-[6px] text-zinc-800 font-black">VΩmA</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-zinc-950 border-2 border-zinc-800 shadow-inner flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full bg-zinc-400 ${isProbeConnected.black ? 'opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'opacity-20'}`} />
                  </div>
                  <span className="text-[6px] text-zinc-800 font-black">COM</span>
                </div>
              </div>
            </div>

            {/* Draggable Probes */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <motion.div 
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  // Check if dropped near the top terminals
                  const isNearRed = info.point.y < 450;
                  setIsProbeConnected(prev => ({ ...prev, red: isNearRed }));
                }}
                className="pointer-events-auto absolute bottom-10 left-10 w-8 h-32 bg-red-600 rounded-full cursor-grab active:cursor-grabbing flex flex-col items-center p-1 shadow-2xl border-2 border-red-700"
              >
                <div className="w-1.5 h-16 bg-zinc-400 rounded-full mb-1 border-x border-zinc-500" />
                <div className="w-3 h-3 bg-red-400 rounded-full shadow-inner" />
                <div className="mt-auto mb-2 text-[6px] text-white font-black rotate-90">RED</div>
              </motion.div>

              <motion.div 
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  const isNearBlack = info.point.y < 450;
                  setIsProbeConnected(prev => ({ ...prev, black: isNearBlack }));
                }}
                className="pointer-events-auto absolute bottom-10 right-10 w-8 h-32 bg-zinc-900 rounded-full cursor-grab active:cursor-grabbing flex flex-col items-center p-1 shadow-2xl border-2 border-zinc-800"
              >
                <div className="w-1.5 h-16 bg-zinc-400 rounded-full mb-1 border-x border-zinc-500" />
                <div className="w-3 h-3 bg-zinc-600 rounded-full shadow-inner" />
                <div className="mt-auto mb-2 text-[6px] text-zinc-500 font-black rotate-90">BLACK</div>
              </motion.div>
            </div>

            {/* Target Terminals (Battery/Outlet) */}
            <div className="absolute top-10 flex gap-32">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center shadow-lg relative">
                  <div className={`absolute inset-0 bg-red-500/10 rounded-xl transition-opacity ${isProbeConnected.red ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="w-6 h-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                    <span className="text-red-500 font-black text-xs">+</span>
                  </div>
                </div>
                <span className="text-[8px] text-zinc-500 font-black uppercase">Fase</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center shadow-lg relative">
                  <div className={`absolute inset-0 bg-blue-500/10 rounded-xl transition-opacity ${isProbeConnected.black ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                    <span className="text-blue-500 font-black text-xs">-</span>
                  </div>
                </div>
                <span className="text-[8px] text-zinc-500 font-black uppercase">Neutro</span>
              </div>
            </div>

            <div className="absolute bottom-4 text-[9px] font-mono text-emerald-500/50 uppercase tracking-[0.3em] animate-pulse">
              Sistema de Medição Ativo
            </div>
          </div>
        );
      case 'SIMULATION_WIRING_SOCKET':
      case 'SIMULATION_WIRING_LAMP':
        const isSocket = currentChallenge.type === 'SIMULATION_WIRING_SOCKET';
        return (
          <div className="h-96 bg-zinc-900/80 rounded-[3rem] border border-white/10 flex flex-col items-center justify-between p-10 relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
            
            {/* Electrical Box Terminals */}
            <div className="flex gap-12 z-10">
              {(['N', 'PE', 'L'] as const).map((type) => {
                if (type === 'PE' && !isSocket) return null;
                const color = type === 'N' ? 'blue' : type === 'PE' ? 'emerald' : 'red';
                const label = type === 'N' ? 'Neutro' : type === 'PE' ? 'Terra' : 'Fase';
                
                return (
                  <div key={type} className="flex flex-col items-center gap-3">
                    <div className={`w-20 h-20 rounded-2xl border-4 flex items-center justify-center transition-all shadow-xl relative overflow-hidden ${
                      wiringConnections[type] 
                        ? `bg-${color}-500/20 border-${color}-500 shadow-[0_0_20px_rgba(var(--${color}-500-rgb),0.3)]` 
                        : 'bg-zinc-800 border-zinc-700'
                    }`}>
                      {wiringConnections[type] && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className={`absolute inset-0 bg-gradient-to-t from-${color}-500/20 to-transparent`} 
                        />
                      )}
                      <span className={`text-xl font-black ${wiringConnections[type] ? `text-${color}-400` : 'text-zinc-600'}`}>{type}</span>
                    </div>
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Draggable Wires */}
            <div className="flex gap-10 w-full justify-center z-20">
              {(['N', 'PE', 'L'] as const).map((type) => {
                if (type === 'PE' && !isSocket) return null;
                const colorClass = type === 'N' ? 'bg-blue-600 border-blue-700' : type === 'PE' ? 'bg-emerald-600 border-emerald-700' : 'bg-red-600 border-red-700';
                
                return (
                  <motion.div
                    key={`wire-${type}`}
                    drag
                    dragSnapToOrigin
                    onDragEnd={(_, info) => {
                      if (Math.abs(info.offset.y) < -100 || info.point.y < 400) {
                        setWiringConnections(prev => ({ ...prev, [type]: true }));
                      }
                    }}
                    className={`w-6 h-32 rounded-full cursor-grab active:cursor-grabbing shadow-2xl relative border-2 ${colorClass} ${
                      wiringConnections[type] ? 'opacity-20 grayscale scale-90' : 'opacity-100'
                    } transition-all duration-300`}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-6 bg-zinc-400 rounded-full border-x border-zinc-500 shadow-inner" />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                      <MousePointer2 className="w-4 h-4 text-zinc-600" />
                      <span className="text-[7px] font-black text-zinc-500 uppercase">{type}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-zinc-950/50 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">Conexão Segura</span>
            </div>
          </div>
        );
      case 'SIMULATION_BREAKER':
        return (
          <div className="h-96 bg-zinc-900/80 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center p-10 relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            <div className="text-center mb-8 z-10">
              <h4 className="text-white font-black uppercase tracking-widest text-sm">Quadro de Distribuição</h4>
              <p className="text-zinc-500 text-[10px] uppercase font-mono">Selecione o disjuntor correto para o circuito</p>
            </div>

            <div className="grid grid-cols-3 gap-6 z-10">
              {['C16', 'C32', 'C50'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedBreaker(type)}
                  className={`group relative w-24 h-40 rounded-xl border-4 transition-all flex flex-col items-center p-3 ${
                    selectedBreaker === type 
                      ? 'bg-zinc-100 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105' 
                      : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <div className={`w-full h-12 rounded-lg mb-4 flex items-center justify-center font-black text-xl ${
                    selectedBreaker === type ? 'text-zinc-900' : 'text-zinc-500'
                  }`}>
                    {type}
                  </div>
                  
                  {/* Toggle Switch Visual */}
                  <div className={`w-8 h-16 rounded-full relative transition-colors ${
                    selectedBreaker === type ? 'bg-emerald-500' : 'bg-zinc-900'
                  }`}>
                    <motion.div 
                      animate={{ y: selectedBreaker === type ? 0 : 32 }}
                      className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </div>

                  <div className="mt-auto text-[8px] font-black text-zinc-500 uppercase">DIN Rail</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'SIMULATION_WIRING_LAMP':
        return (
          <div className="h-96 bg-zinc-900/80 rounded-[3rem] border border-white/10 flex flex-col items-center justify-between p-10 relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
            
            <div className="flex items-center gap-16 z-10">
              <div className="flex flex-col items-center gap-4">
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all ${wiringConnections.L ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_50px_rgba(250,204,21,0.6)]' : 'bg-zinc-800 border-zinc-700'}`}>
                  <Lightbulb className={`w-12 h-12 ${wiringConnections.L ? 'text-yellow-900' : 'text-zinc-700'}`} />
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Lâmpada LED</span>
              </div>
              
              <div className="w-32 h-40 bg-zinc-900 border-4 border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-6 shadow-2xl">
                <div className="w-16 h-20 bg-zinc-800 border-2 border-zinc-700 rounded-xl flex items-center justify-center relative shadow-inner">
                  <motion.div 
                    animate={{ rotateX: wiringConnections.L ? 45 : -45 }}
                    className="w-10 h-12 bg-zinc-700 rounded-lg shadow-lg border border-white/5"
                  />
                </div>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Interruptor</span>
              </div>
            </div>

            {/* Draggable Phase Wire */}
            <div className="flex flex-col items-center gap-4 z-20">
              <motion.div
                drag
                dragSnapToOrigin
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.y) > 100 || info.point.y < 400) {
                    setWiringConnections(prev => ({ ...prev, L: !prev.L }));
                  }
                }}
                className={`w-8 h-32 bg-red-600 rounded-full cursor-grab active:cursor-grabbing shadow-2xl flex flex-col items-center p-2 border-2 border-red-700 ${
                  wiringConnections.L ? 'opacity-20 grayscale scale-90' : 'opacity-100'
                } transition-all duration-300`}
              >
                <div className="w-2 h-8 bg-zinc-400 rounded-full mb-2 border-x border-zinc-500 shadow-inner" />
                <div className="mt-auto mb-2 text-[7px] text-white font-black rotate-90">FASE</div>
              </motion.div>
              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest animate-pulse">Arraste para o interruptor</div>
            </div>
          </div>
        );
      case 'SIMULATION_AUTOCAD':
        return (
          <div className="h-96 bg-zinc-950 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-2xl">
            {/* CAD Grid */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <div className="absolute top-4 left-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-black text-xs">A</div>
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">AutoCAD - Planta Baixa</span>
            </div>

            {/* Blueprint Visual */}
            <div className="relative w-full h-64 border-2 border-zinc-800 rounded-xl bg-zinc-900/50 p-4 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-40 border-2 border-emerald-500/30 relative">
                  {/* Outer Walls */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500/40" />
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-emerald-500/40" />
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/40" />
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500/40" />
                  
                  {/* Internal Walls */}
                  <div className="absolute top-0 left-1/2 w-1 h-24 bg-emerald-500/30" />
                  <div className="absolute top-24 left-1/2 w-16 h-1 bg-emerald-500/30" />
                  
                  {/* Dimension Lines */}
                  <div className="absolute -top-6 left-0 w-full flex items-center justify-between px-1">
                    <div className="w-px h-2 bg-emerald-500/20" />
                    <div className="flex-1 h-px bg-emerald-500/20 mx-1" />
                    <span className="text-[7px] text-emerald-500/40 font-mono">4.50m</span>
                    <div className="flex-1 h-px bg-emerald-500/20 mx-1" />
                    <div className="w-px h-2 bg-emerald-500/20" />
                  </div>

                  {/* Placed Element */}
                  {autocadActiveElement && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 text-emerald-400"
                    >
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-emerald-400 rounded-full" />
                        {autocadActiveElement === 'TUG_MID' && (
                          <div className="absolute inset-0 bg-emerald-400/50 rounded-full clip-path-half" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
                        )}
                        {autocadActiveElement === 'TUG_HIGH' && (
                          <div className="absolute inset-0 bg-emerald-400 rounded-full" />
                        )}
                        <span className="text-[6px] font-black z-10 text-white drop-shadow-md">
                          {autocadActiveElement === 'TUG_LOW' ? '0.30' : autocadActiveElement === 'TUG_MID' ? '1.10' : '2.10'}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Labels */}
                  <div className="absolute top-2 left-2 text-[8px] text-emerald-500/20 font-mono italic">COZINHA</div>
                  <div className="absolute top-2 right-2 text-[8px] text-emerald-500/20 font-mono italic">SALA</div>
                </div>
              </div>
            </div>

            {/* Tool Palette */}
            <div className="mt-6 flex gap-4 z-10">
              {[
                { id: 'TUG_LOW', label: 'TUG Baixa' },
                { id: 'TUG_MID', label: 'TUG Média' },
                { id: 'TUG_HIGH', label: 'TUG Alta' }
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setAutocadActiveElement(tool.id)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                    autocadActiveElement === tool.id 
                      ? 'bg-emerald-500 text-black shadow-lg' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800">
              Selecione o símbolo da Tomada Média
            </div>
          </div>
        );
      case 'SIMULATION_SHOWER':
        return (
          <div className="h-96 bg-zinc-900 rounded-[3rem] border border-white/10 flex flex-col items-center justify-between p-8 relative overflow-hidden shadow-2xl">
            {/* Wall and Pipes */}
            <div className="absolute top-0 w-full h-32 bg-zinc-800/50 border-b border-white/5" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-40 bg-zinc-700 shadow-inner" />
            
            {/* Exposed Wires from Wall */}
            <div className="absolute top-20 left-[calc(50%+10px)] flex gap-1">
              <div className="w-1 h-12 bg-red-500 rounded-full" />
              <div className="w-1 h-12 bg-blue-500 rounded-full" />
              <div className="w-1 h-12 bg-emerald-500 rounded-full" />
            </div>

            <div className="w-full flex justify-center mb-4 relative z-10">
              <div className="w-48 h-24 bg-zinc-100 rounded-b-[3rem] shadow-2xl flex flex-col items-center justify-center relative border-x-4 border-b-4 border-zinc-300">
                <div className="absolute -top-8 w-6 h-12 bg-zinc-400 rounded-t-lg" />
                
                {/* Wires from Shower */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-0.5 h-6 bg-zinc-400" />
                  <div className="w-0.5 h-6 bg-zinc-400" />
                  <div className="w-0.5 h-6 bg-zinc-400" />
                </div>

                {/* Connection Point */}
                <div className={`w-14 h-14 rounded-full border-4 border-dashed transition-all flex items-center justify-center ${selectedBreaker ? 'bg-emerald-500/20 border-emerald-500 scale-110' : 'border-zinc-400 bg-zinc-200/50'}`}>
                  {selectedBreaker && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={`w-10 h-8 rounded-sm shadow-lg flex items-center justify-center ${selectedBreaker === 'FITA_ISOLANTE' ? 'bg-zinc-950' : selectedBreaker === 'CONECTOR_PLASTICO' ? 'bg-zinc-200' : 'bg-stone-100'}`}
                    >
                      {selectedBreaker === 'CONECTOR_PORCELANA' && (
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-zinc-400 rounded-full" />
                          <div className="w-1 h-4 bg-zinc-400 rounded-full" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-6 z-10">
              {[
                { id: 'FITA_ISOLANTE', label: 'Fita Isolante', color: 'bg-zinc-950' },
                { id: 'CONECTOR_PLASTICO', label: 'Conector Plástico', color: 'bg-zinc-200' },
                { id: 'CONECTOR_PORCELANA', label: 'Conector Porcelana', color: 'bg-stone-100' }
              ].map((item) => (
                <motion.div 
                  key={item.id}
                  drag
                  dragSnapToOrigin
                  onDragEnd={(_, info) => {
                    if (info.offset.y < -150) {
                      setSelectedBreaker(item.id);
                    }
                  }}
                  className={`cursor-grab active:cursor-grabbing p-4 border-2 rounded-2xl transition-all flex flex-col items-center gap-3 shadow-xl ${selectedBreaker === item.id ? 'border-emerald-500 bg-emerald-500/10 opacity-30 scale-90' : 'border-white/10 bg-zinc-800 hover:border-white/20'}`}
                >
                  <div className={`w-16 h-10 rounded-lg shadow-inner flex items-center justify-center ${item.color}`}>
                    {item.id === 'CONECTOR_PORCELANA' && (
                      <div className="flex gap-2">
                        <div className="w-2 h-4 bg-zinc-400 rounded-sm shadow-sm" />
                        <div className="w-2 h-4 bg-zinc-400 rounded-sm shadow-sm" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-zinc-400 text-center uppercase tracking-tighter">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950/80 px-4 py-2 rounded-full border border-white/5 shadow-2xl">
              Arraste o conector ideal para o chuveiro
            </div>
          </div>
        );
      case 'SIMULATION_ECONOMY':
        return (
          <div className="h-96 bg-zinc-950 rounded-[3rem] border border-white/10 flex flex-col p-8 relative overflow-hidden shadow-2xl">
            {/* Dashboard Header */}
            <div className="flex justify-between items-start mb-8 z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Sistema Interligado Nacional</span>
                </div>
                <h3 className="text-xl font-bold text-white italic uppercase tracking-tighter">Operação em Tempo Real</h3>
              </div>
              <div className="px-4 py-2 bg-zinc-900 rounded-xl border border-white/5 flex flex-col items-end">
                <span className="text-[8px] text-zinc-500 font-black uppercase">Frequência</span>
                <span className="text-lg font-mono text-emerald-400">60.02 Hz</span>
              </div>
            </div>

            {/* Energy Grid Visualization */}
            <div className="flex-1 flex items-end gap-4 mb-8 z-10">
              {/* Hídrica */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="h-48 bg-zinc-900 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                  <motion.div 
                    initial={{ height: '70%' }}
                    animate={{ height: economyAction === 'CORTE' ? '60%' : '70%' }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600/40 to-blue-400/20 border-t-2 border-blue-400"
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-300 drop-shadow-md">70%</div>
                  </motion.div>
                </div>
                <span className="text-[9px] font-black text-zinc-500 text-center uppercase">Hídrica (Base)</span>
              </div>

              {/* Térmica */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="h-48 bg-zinc-900 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-500/5" />
                  <motion.div 
                    animate={{ height: economyAction === 'DESPACHAR' ? '90%' : '20%' }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-red-600/40 to-red-400/20 border-t-2 border-red-400"
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-red-300 drop-shadow-md">
                      {economyAction === 'DESPACHAR' ? '90%' : '20%'}
                    </div>
                  </motion.div>
                </div>
                <span className="text-[9px] font-black text-zinc-500 text-center uppercase">Térmica (Pico)</span>
              </div>

              {/* Mercado */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="h-48 bg-zinc-900 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-amber-500/5" />
                  <motion.div 
                    animate={{ height: economyAction === 'COMPRAR' ? '80%' : '40%' }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-amber-600/40 to-amber-400/20 border-t-2 border-amber-400"
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-amber-300 drop-shadow-md">
                      {economyAction === 'COMPRAR' ? '80%' : '40%'}
                    </div>
                  </motion.div>
                </div>
                <span className="text-[9px] font-black text-zinc-500 text-center uppercase">Mercado (Spot)</span>
              </div>

              {/* Demanda */}
              <div className="w-24 flex flex-col gap-3">
                <div className="h-48 bg-emerald-500/5 rounded-2xl border-2 border-dashed border-emerald-500/20 flex flex-col items-center justify-center relative">
                  <TrendingUp className="w-8 h-8 text-emerald-500/40 animate-bounce" />
                  <div className="absolute top-4 text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Demanda</div>
                  <div className="text-xl font-mono text-emerald-400 font-bold">100%</div>
                </div>
                <span className="text-[9px] font-black text-zinc-500 text-center uppercase">Carga Total</span>
              </div>
            </div>

            {/* Action Panel */}
            <div className="grid grid-cols-2 gap-3 z-10">
              {[
                { id: 'DESPACHAR', label: 'Despachar Térmicas', color: 'hover:bg-red-500/20 border-red-500/30 text-red-400' },
                { id: 'COMPRAR', label: 'Comprar no Mercado', color: 'hover:bg-amber-500/20 border-amber-500/30 text-amber-400' },
                { id: 'CORTE', label: 'Corte Seletivo', color: 'hover:bg-zinc-500/20 border-zinc-500/30 text-zinc-400' },
                { id: 'MANTER', label: 'Operação Normal', color: 'hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400' }
              ].map((action) => (
                <button
                  key={action.id}
                  onClick={() => setEconomyAction(action.id)}
                  className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    economyAction === action.id 
                      ? action.color.replace('hover:', '').replace('/20', '/40') + ' bg-zinc-900 shadow-lg scale-[0.98]' 
                      : 'bg-zinc-900/50 border-white/5 text-zinc-500 ' + action.color.split(' ')[0]
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 'SIMULATION_BREAKER':
        return (
          <div className="h-96 bg-zinc-950 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-2xl">
            {/* DIN Rail Background */}
            <div className="absolute w-full h-24 bg-zinc-900 border-y border-white/5 flex items-center px-4 gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-4 h-full border-x border-white/5 opacity-10" />
              ))}
            </div>

            <div className="flex gap-8 z-10">
              {['C10', 'C32', 'C50'].map((rating) => (
                <motion.div 
                  key={rating}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedBreaker(rating)}
                  className={`relative w-28 h-56 rounded-lg border-2 transition-all cursor-pointer flex flex-col ${
                    selectedBreaker === rating 
                      ? 'bg-white border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]' 
                      : 'bg-zinc-100 border-zinc-300 grayscale opacity-80'
                  }`}
                >
                  {/* Breaker Top Detail */}
                  <div className="h-12 border-b border-zinc-200 flex flex-col items-center justify-center p-2">
                    <div className="w-full h-1 bg-zinc-200 rounded-full mb-1" />
                    <span className="text-[8px] font-black text-zinc-400 uppercase">DIN-60898</span>
                  </div>

                  {/* Breaker Body */}
                  <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
                    <div className="text-xl font-black text-zinc-900 italic tracking-tighter">{rating}</div>
                    
                    {/* Toggle Switch */}
                    <div className="w-12 h-20 bg-zinc-200 rounded-xl border-2 border-zinc-300 p-1 relative shadow-inner">
                      <motion.div 
                        animate={{ y: selectedBreaker === rating ? 0 : 32 }}
                        className={`w-full h-10 rounded-lg shadow-lg flex items-center justify-center ${
                          selectedBreaker === rating ? 'bg-emerald-500' : 'bg-zinc-400'
                        }`}
                      >
                        <div className="w-6 h-1 bg-white/30 rounded-full" />
                      </motion.div>
                    </div>

                    <div className="text-[7px] font-black text-zinc-400 uppercase tracking-widest text-center">
                      230/400V~<br/>6000A
                    </div>
                  </div>

                  {/* Breaker Bottom Detail */}
                  <div className="h-8 border-t border-zinc-200 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                  </div>

                  {/* Selection Indicator */}
                  {selectedBreaker === rating && (
                    <motion.div 
                      layoutId="breaker-select"
                      className="absolute -bottom-12 left-1/2 -translate-x-1/2"
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] animate-pulse">
              Selecione o disjuntor para o circuito
            </div>
          </div>
        );
      default:
        return (
          <div className="h-64 bg-zinc-800 rounded-3xl border border-zinc-700 flex items-center justify-center">
            <Activity className="w-20 h-20 text-zinc-700 animate-pulse" />
          </div>
        );
    }
  };

  const renderChallenge = () => (
    <motion.div 
      key={`challenge-${currentPeriodIndex}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-4 text-zinc-500 font-mono text-xs uppercase tracking-widest">
          <Factory className="w-4 h-4" />
          <span>Indústria Metalúrgica - Itacorubi</span>
        </div>
        
        {renderSimulationVisual()}

        <div className="flex justify-between items-center">
          <p className="text-2xl text-white leading-snug font-medium max-w-xl">
            {currentChallenge.description}
          </p>
          <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 min-w-[160px] text-center">
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Status</div>
            <div className="text-sm font-bold text-emerald-400 uppercase">
              {currentChallenge.type === 'SIMULATION_MULTIMETER' ? `Escala: ${multimeterScale}` :
               currentChallenge.type === 'SIMULATION_WIRING_SOCKET' ? `Conexões: ${Object.values(wiringConnections).filter(Boolean).length}/3` :
               currentChallenge.type === 'SIMULATION_WIRING_LAMP' ? `Luz: ${wiringConnections.L ? 'ON' : 'OFF'}` :
               currentChallenge.type === 'SIMULATION_AUTOCAD' ? `Símbolo: ${autocadActiveElement || '---'}` :
               currentChallenge.type === 'SIMULATION_SHOWER' ? `Conector: ${selectedBreaker || '---'}` :
               currentChallenge.type === 'SIMULATION_ECONOMY' ? `Ação: ${economyAction || '---'}` :
               'Teórico'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {currentChallenge.type === 'QUIZ' ? (
          currentChallenge.choices.map((choice, idx) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              className="group p-6 bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl text-left transition-all hover:translate-x-2 flex items-start gap-4"
            >
              <div className="mt-1 w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-emerald-500/20 flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 font-bold font-mono transition-colors">
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-zinc-300 group-hover:text-white text-lg transition-colors">
                {choice.text}
              </span>
            </button>
          ))
        ) : (
          <button
            onClick={validateSimulation}
            className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 text-xl uppercase tracking-widest"
          >
            <ShieldCheck className="w-6 h-6" />
            FINALIZAR OPERAÇÃO
          </button>
        )}
      </div>
    </motion.div>
  );

  const renderFeedback = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-10 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl space-y-8"
    >
      <div className="flex items-center gap-4">
        {lastChoice?.isCorrect ? (
          <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
        ) : (
          <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/30">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
        )}
        <div>
          <h3 className={`text-2xl font-bold ${lastChoice?.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
            {lastChoice?.isCorrect ? 'Excelente Decisão!' : 'Erro de Engenharia!'}
          </h3>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Disciplina: {lastChoice?.subject}
          </p>
        </div>
      </div>

      <div className="p-6 bg-zinc-800/30 rounded-2xl border border-zinc-800 text-zinc-300 text-lg leading-relaxed">
        {lastChoice?.explanation}
      </div>

      <button 
        onClick={nextStep}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {currentPeriodIndex < challenges.length - 1 ? 'VOLTAR AO MAPA' : 'VER RESULTADO FINAL'}
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );

  const renderGameOver = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center space-y-8 p-12 bg-zinc-900 border border-zinc-800 rounded-[3rem] shadow-2xl relative overflow-hidden"
    >
      {isGameWon && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/5 blur-[120px]" />
        </div>
      )}

      <div className="flex justify-center">
        {isGameWon ? (
          <div className="p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Award className="w-20 h-20 text-emerald-400" />
          </div>
        ) : (
          <div className="p-6 bg-red-500/10 rounded-full border border-red-500/20">
            <AlertTriangle className="w-20 h-20 text-red-400" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-5xl font-bold text-white tracking-tighter uppercase italic">
          {isGameWon ? 'TCC APROVADO!' : 'REPROVADO NO TCC'}
        </h2>
        <p className="text-zinc-400 text-xl">
          {isGameWon 
            ? "Parabéns, Tecnólogo! Você salvou a indústria da falência energética e se formou com honras no IFSC."
            : "Infelizmente, suas decisões técnicas levaram a indústria a prejuízos insustentáveis. Hora de revisar a base!"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
          <div className="text-zinc-500 text-xs uppercase font-mono mb-1">Pontuação</div>
          <div className="text-3xl font-bold text-white">{score}</div>
        </div>
        <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
          <div className="text-zinc-500 text-xs uppercase font-mono mb-1">Status</div>
          <div className="text-3xl font-bold text-emerald-400">{isGameWon ? '10.0' : '4.5'}</div>
        </div>
      </div>

      <button 
        onClick={startGame}
        className="px-8 py-4 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-xl transition-all flex items-center gap-2 mx-auto"
      >
        RECOMEÇAR CURSO
        <RotateCcw className="w-5 h-5" />
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-zinc-950" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-white uppercase italic text-sm">Mestre da Energia</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">IFSC - Sistemas de Energia</p>
          </div>
        </div>

        {gameState !== 'START' && gameState !== 'GAME_OVER' && (
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Score</div>
              <div className="text-lg font-bold text-emerald-400 tabular-nums">{score}</div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Fase</div>
              <div className="text-lg font-bold text-white">{currentChallenge.period}ª</div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12 min-h-[calc(100vh-160px)] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {gameState === 'START' && renderStart()}
          {gameState === 'CHARACTER_SELECT' && renderCharacterSelection()}
          {gameState === 'MAP' && renderMap()}
          {gameState === 'PERIOD_INTRO' && renderPeriodIntro()}
          {gameState === 'CHALLENGE' && renderChallenge()}
          {gameState === 'FEEDBACK' && renderFeedback()}
          {gameState === 'GAME_OVER' && renderGameOver()}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <footer className="relative z-10 p-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
          <Cpu className="w-3 h-3" />
          Simulação de Carreira Técnica v2.0
        </div>
      </footer>
    </div>
  );
}
