import React, { useState, useEffect, useRef } from 'react';

// Types for the 2D Emergency Drill Game
interface GameState {
  score: number;
  lives: number;
  timeLeft: number;
  level: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  completed: boolean;
}

interface EmergencyItem {
  id: string;
  type: 'fire' | 'smoke' | 'person' | 'exit' | 'fire_extinguisher' | 'alarm';
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'idle';
}

interface GameProps {
  drillType: 'fire' | 'earthquake' | 'flood' | 'general_emergency';
  onGameComplete: (score: number, timeSpent: number, responses: any[]) => void;
  onGameExit: () => void;
}

const EmergencyDrillGame: React.FC<GameProps> = ({ drillType, onGameComplete, onGameExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    timeLeft: 120, // 2 minutes
    level: 1,
    isPlaying: false,
    isPaused: false,
    gameOver: false,
    completed: false
  });

  const [player, setPlayer] = useState<Player>({
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    speed: 5,
    direction: 'idle'
  });

  const [emergencyItems, setEmergencyItems] = useState<EmergencyItem[]>([]);
  const [gameResponses, setGameResponses] = useState<any[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState(0);

  // Game configuration based on drill type
  const gameConfig = {
    fire: {
      title: "🔥 Fire Emergency Drill",
      instructions: [
        "🚨 Fire detected! Follow these steps:",
        "1. Pull the fire alarm",
        "2. Help people evacuate",
        "3. Use fire extinguisher if safe",
        "4. Exit through safe routes",
        "5. Call emergency services"
      ],
      items: [
        { type: 'fire', priority: 'high', points: 50 },
        { type: 'smoke', priority: 'high', points: 30 },
        { type: 'person', priority: 'high', points: 100 },
        { type: 'exit', priority: 'medium', points: 20 },
        { type: 'fire_extinguisher', priority: 'medium', points: 40 },
        { type: 'alarm', priority: 'high', points: 60 }
      ]
    },
    earthquake: {
      title: "🌍 Earthquake Drill",
      instructions: [
        "🌍 Earthquake detected! Follow these steps:",
        "1. Drop, Cover, and Hold On",
        "2. Stay away from windows",
        "3. Help injured people",
        "4. Evacuate to safe area",
        "5. Check for hazards"
      ],
      items: [
        { type: 'person', priority: 'high', points: 100 },
        { type: 'exit', priority: 'high', points: 50 },
        { type: 'alarm', priority: 'medium', points: 30 }
      ]
    },
    flood: {
      title: "🌊 Flood Emergency Drill",
      instructions: [
        "🌊 Flood warning! Follow these steps:",
        "1. Move to higher ground",
        "2. Help others evacuate",
        "3. Avoid flooded areas",
        "4. Call emergency services",
        "5. Stay informed"
      ],
      items: [
        { type: 'person', priority: 'high', points: 100 },
        { type: 'exit', priority: 'high', points: 50 },
        { type: 'alarm', priority: 'medium', points: 30 }
      ]
    },
    general_emergency: {
      title: "🚨 General Emergency Drill",
      instructions: [
        "🚨 Emergency situation! Follow these steps:",
        "1. Stay calm and assess situation",
        "2. Help others if safe to do so",
        "3. Follow evacuation routes",
        "4. Call emergency services",
        "5. Wait for further instructions"
      ],
      items: [
        { type: 'person', priority: 'high', points: 100 },
        { type: 'exit', priority: 'high', points: 50 },
        { type: 'alarm', priority: 'medium', points: 30 }
      ]
    }
  };

  const config = gameConfig[drillType];

  // Initialize game
  useEffect(() => {
    setInstructions(config.instructions);
    generateEmergencyItems();
    startGame();
  }, [drillType]);

  // Generate emergency items based on drill type
  const generateEmergencyItems = () => {
    const items: EmergencyItem[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    config.items.forEach((itemConfig, index) => {
      items.push({
        id: `item_${index}`,
        type: itemConfig.type as any,
        x: Math.random() * (canvasWidth - 40),
        y: Math.random() * (canvasHeight - 40),
        width: 40,
        height: 40,
        active: true,
        priority: itemConfig.priority
      });
    });

    setEmergencyItems(items);
  };

  // Start the game
  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Pause/Resume game
  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  // Game loop
  const gameLoop = () => {
    if (gameState.isPaused || gameState.gameOver || gameState.completed) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    updateGame();
    drawGame();
    
    // Update timer
    setGameState(prev => {
      if (prev.timeLeft <= 0) {
        return { ...prev, gameOver: true };
      }
      return { ...prev, timeLeft: prev.timeLeft - 0.016 }; // 60 FPS
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Update game state
  const updateGame = () => {
    // Move player based on direction
    setPlayer(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (prev.direction) {
        case 'up':
          newY = Math.max(0, prev.y - prev.speed);
          break;
        case 'down':
          newY = Math.min(400 - prev.height, prev.y + prev.speed);
          break;
        case 'left':
          newX = Math.max(0, prev.x - prev.speed);
          break;
        case 'right':
          newX = Math.min(600 - prev.width, prev.x + prev.speed);
          break;
      }

      return { ...prev, x: newX, y: newY };
    });

    // Check collisions with emergency items
    checkCollisions();
  };

  // Check collisions between player and emergency items
  const checkCollisions = () => {
    emergencyItems.forEach(item => {
      if (!item.active) return;

      const playerRect = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
      };

      const itemRect = {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height
      };

      if (isColliding(playerRect, itemRect)) {
        handleItemInteraction(item);
      }
    });
  };

  // Check if two rectangles are colliding
  const isColliding = (rect1: any, rect2: any) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  // Handle interaction with emergency items
  const handleItemInteraction = (item: EmergencyItem) => {
    const points = getItemPoints(item);
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + points
    }));

    // Add response to game responses
    const response = {
      questionId: item.id,
      question: `Interacted with ${item.type}`,
      answer: 'completed',
      correctAnswer: 'completed',
      isCorrect: true,
      timeSpent: 120 - gameState.timeLeft
    };

    setGameResponses(prev => [...prev, response]);

    // Deactivate item
    setEmergencyItems(prev => 
      prev.map(i => i.id === item.id ? { ...i, active: false } : i)
    );

    // Check if all items are completed
    const remainingItems = emergencyItems.filter(i => i.active && i.id !== item.id);
    if (remainingItems.length === 0) {
      setGameState(prev => ({ ...prev, completed: true }));
      completeGame();
    }
  };

  // Get points for item based on priority
  const getItemPoints = (item: EmergencyItem) => {
    const basePoints = config.items.find(i => i.type === item.type)?.points || 10;
    const priorityMultiplier = item.priority === 'high' ? 2 : item.priority === 'medium' ? 1.5 : 1;
    return Math.round(basePoints * priorityMultiplier);
  };

  // Complete the game
  const completeGame = () => {
    const timeSpent = 120 - gameState.timeLeft;
    onGameComplete(gameState.score, timeSpent, gameResponses);
  };

  // Draw the game
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw emergency items
    emergencyItems.forEach(item => {
      if (!item.active) return;

      ctx.fillStyle = getItemColor(item);
      ctx.fillRect(item.x, item.y, item.width, item.height);

      // Draw item icon
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(getItemIcon(item.type), item.x + item.width/2, item.y + item.height/2 + 7);
    });

    // Draw player
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw player icon
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👤', player.x + player.width/2, player.y + player.height/2 + 5);

    // Draw UI
    drawUI(ctx);
  };

  // Draw game UI
  const drawUI = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);

    // Draw lives
    ctx.fillText(`Lives: ${gameState.lives}`, 10, 60);

    // Draw time
    ctx.fillText(`Time: ${Math.ceil(gameState.timeLeft)}s`, 10, 90);

    // Draw level
    ctx.fillText(`Level: ${gameState.level}`, 10, 120);

    // Draw instructions
    if (currentInstruction < instructions.length) {
      ctx.fillStyle = '#ffff00';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(instructions[currentInstruction], canvas.width/2, 30);
    }
  };

  // Get item color based on priority
  const getItemColor = (item: EmergencyItem) => {
    switch (item.priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#888888';
    }
  };

  // Get item icon
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'fire': return '🔥';
      case 'smoke': return '💨';
      case 'person': return '👤';
      case 'exit': return '🚪';
      case 'fire_extinguisher': return '🧯';
      case 'alarm': return '🚨';
      default: return '❓';
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused) return;

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setPlayer(prev => ({ ...prev, direction: 'up' }));
          break;
        case 's':
        case 'arrowdown':
          setPlayer(prev => ({ ...prev, direction: 'down' }));
          break;
        case 'a':
        case 'arrowleft':
          setPlayer(prev => ({ ...prev, direction: 'left' }));
          break;
        case 'd':
        case 'arrowright':
          setPlayer(prev => ({ ...prev, direction: 'right' }));
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case 'enter':
          if (currentInstruction < instructions.length - 1) {
            setCurrentInstruction(prev => prev + 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.isPaused, currentInstruction, instructions.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 p-6">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={togglePause}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {gameState.isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={onGameExit}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Exit Game
            </button>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border-2 border-gray-300 rounded-lg bg-gray-100"
          />
        </div>

        {/* Game Instructions */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2">Game Instructions:</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p>• Use WASD or Arrow Keys to move your character (👤)</p>
            <p>• Move to emergency items and interact with them</p>
            <p>• High priority items (red) give more points</p>
            <p>• Press SPACE to pause/resume</p>
            <p>• Press ENTER to advance instructions</p>
            <p>• Complete all items before time runs out!</p>
          </div>
        </div>

        {/* Game Status */}
        {gameState.gameOver && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <h3 className="text-red-800 font-semibold">Game Over!</h3>
            <p className="text-red-700">Time ran out. Try again!</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Restart Game
            </button>
          </div>
        )}

        {gameState.completed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <h3 className="text-green-800 font-semibold">🎉 Drill Completed!</h3>
            <p className="text-green-700">Final Score: {gameState.score} points</p>
            <p className="text-green-700">Time: {Math.ceil(120 - gameState.timeLeft)} seconds</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{emergencyItems.filter(i => !i.active).length} / {emergencyItems.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(emergencyItems.filter(i => !i.active).length / emergencyItems.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDrillGame;
