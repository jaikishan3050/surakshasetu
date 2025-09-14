import React, { useState, useEffect, useRef } from 'react';

// Types for Earthquake Survival Game
interface EarthquakeGameState {
  score: number;
  lives: number;
  timeLeft: number;
  level: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  completed: boolean;
  earthquakeIntensity: number;
  buildingStability: number;
}

interface BuildingElement {
  id: string;
  type: 'wall' | 'window' | 'door' | 'furniture' | 'safe_zone' | 'hazard';
  x: number;
  y: number;
  width: number;
  height: number;
  stable: boolean;
  priority: 'high' | 'medium' | 'low';
  action: 'avoid' | 'use' | 'secure' | 'evacuate';
}

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'idle';
  isDucking: boolean;
  isMoving: boolean;
}

interface EarthquakeGameProps {
  onGameComplete: (score: number, timeSpent: number, responses: any[]) => void;
  onGameExit: () => void;
}

const EarthquakeSurvivalGame: React.FC<EarthquakeGameProps> = ({ onGameComplete, onGameExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [gameState, setGameState] = useState<EarthquakeGameState>({
    score: 0,
    lives: 3,
    timeLeft: 180, // 3 minutes
    level: 1,
    isPlaying: false,
    isPaused: false,
    gameOver: false,
    completed: false,
    earthquakeIntensity: 0,
    buildingStability: 100
  });

  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: 200,
    width: 25,
    height: 25,
    speed: 3,
    direction: 'idle',
    isDucking: false,
    isMoving: false
  });

  const [buildingElements, setBuildingElements] = useState<BuildingElement[]>([]);
  const [gameResponses, setGameResponses] = useState<any[]>([]);
  const [instructions, setInstructions] = useState<string[]>([
    "🌍 Earthquake detected! Follow these steps:",
    "1. DROP to the ground",
    "2. COVER your head and neck",
    "3. HOLD ON to something sturdy",
    "4. Stay away from windows and heavy furniture",
    "5. Move to safe zones when shaking stops",
    "6. Evacuate through safe exits"
  ]);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  // Initialize game
  useEffect(() => {
    generateBuildingElements();
    startGame();
  }, []);

  // Generate building elements
  const generateBuildingElements = () => {
    const elements: BuildingElement[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Add walls
    elements.push(
      { id: 'wall1', type: 'wall', x: 0, y: 0, width: 20, height: canvasHeight, stable: true, priority: 'high', action: 'avoid' },
      { id: 'wall2', type: 'wall', x: canvasWidth - 20, y: 0, width: 20, height: canvasHeight, stable: true, priority: 'high', action: 'avoid' },
      { id: 'wall3', type: 'wall', x: 0, y: 0, width: canvasWidth, height: 20, stable: true, priority: 'high', action: 'avoid' },
      { id: 'wall4', type: 'wall', x: 0, y: canvasHeight - 20, width: canvasWidth, height: 20, stable: true, priority: 'high', action: 'avoid' }
    );

    // Add windows (hazards)
    elements.push(
      { id: 'window1', type: 'window', x: 50, y: 50, width: 40, height: 60, stable: false, priority: 'high', action: 'avoid' },
      { id: 'window2', type: 'window', x: canvasWidth - 90, y: 50, width: 40, height: 60, stable: false, priority: 'high', action: 'avoid' }
    );

    // Add doors (exits)
    elements.push(
      { id: 'door1', type: 'door', x: canvasWidth - 40, y: canvasHeight - 80, width: 20, height: 60, stable: true, priority: 'high', action: 'evacuate' },
      { id: 'door2', type: 'door', x: 20, y: canvasHeight - 80, width: 20, height: 60, stable: true, priority: 'high', action: 'evacuate' }
    );

    // Add furniture (hazards)
    elements.push(
      { id: 'furniture1', type: 'furniture', x: 150, y: 100, width: 60, height: 40, stable: false, priority: 'medium', action: 'avoid' },
      { id: 'furniture2', type: 'furniture', x: 300, y: 150, width: 80, height: 50, stable: false, priority: 'medium', action: 'avoid' },
      { id: 'furniture3', type: 'furniture', x: 200, y: 250, width: 70, height: 45, stable: false, priority: 'medium', action: 'avoid' }
    );

    // Add safe zones
    elements.push(
      { id: 'safe1', type: 'safe_zone', x: 100, y: 300, width: 80, height: 60, stable: true, priority: 'high', action: 'use' },
      { id: 'safe2', type: 'safe_zone', x: 400, y: 200, width: 80, height: 60, stable: true, priority: 'high', action: 'use' }
    );

    // Add hazards
    elements.push(
      { id: 'hazard1', type: 'hazard', x: 250, y: 100, width: 30, height: 30, stable: false, priority: 'high', action: 'avoid' },
      { id: 'hazard2', type: 'hazard', x: 350, y: 300, width: 30, height: 30, stable: false, priority: 'high', action: 'avoid' }
    );

    setBuildingElements(elements);
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
    // Simulate earthquake intensity changes
    const intensity = Math.sin(Date.now() * 0.001) * 50 + 50;
    setGameState(prev => ({ ...prev, earthquakeIntensity: intensity }));
    
    // Update shake intensity
    setShakeIntensity(intensity * 0.5);

    // Move player based on direction
    if (player.isMoving) {
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;

        switch (prev.direction) {
          case 'up':
            newY = Math.max(20, prev.y - prev.speed);
            break;
          case 'down':
            newY = Math.min(400 - prev.height - 20, prev.y + prev.speed);
            break;
          case 'left':
            newX = Math.max(20, prev.x - prev.speed);
            break;
          case 'right':
            newX = Math.min(600 - prev.width - 20, prev.x + prev.speed);
            break;
        }

        return { ...prev, x: newX, y: newY };
      });
    }

    // Check collisions
    checkCollisions();

    // Update building stability based on earthquake intensity
    if (intensity > 70) {
      setBuildingElements(prev => 
        prev.map(element => {
          if (element.type === 'furniture' || element.type === 'window') {
            return { ...element, stable: Math.random() > 0.3 };
          }
          return element;
        })
      );
    }
  };

  // Check collisions
  const checkCollisions = () => {
    buildingElements.forEach(element => {
      const playerRect = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
      };

      const elementRect = {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height
      };

      if (isColliding(playerRect, elementRect)) {
        handleElementInteraction(element);
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

  // Handle interaction with building elements
  const handleElementInteraction = (element: BuildingElement) => {
    let points = 0;
    let isCorrect = false;

    switch (element.action) {
      case 'avoid':
        if (element.type === 'window' || element.type === 'furniture' || element.type === 'hazard') {
          // Player should avoid these
          if (player.isDucking) {
            points = 50;
            isCorrect = true;
          } else {
            points = -20;
            setGameState(prev => ({ ...prev, lives: prev.lives - 1 }));
          }
        }
        break;
      case 'use':
        if (element.type === 'safe_zone') {
          points = 100;
          isCorrect = true;
        }
        break;
      case 'evacuate':
        if (element.type === 'door') {
          points = 200;
          isCorrect = true;
          setGameState(prev => ({ ...prev, completed: true }));
          completeGame();
        }
        break;
    }

    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score + points)
    }));

    // Add response
    const response = {
      questionId: element.id,
      question: `Interacted with ${element.type}`,
      answer: element.action,
      correctAnswer: element.action,
      isCorrect: isCorrect,
      timeSpent: 180 - gameState.timeLeft
    };

    setGameResponses(prev => [...prev, response]);
  };

  // Complete the game
  const completeGame = () => {
    const timeSpent = 180 - gameState.timeLeft;
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

    // Apply earthquake shake effect
    const shakeX = (Math.random() - 0.5) * shakeIntensity;
    const shakeY = (Math.random() - 0.5) * shakeIntensity;
    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Draw background
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw building elements
    buildingElements.forEach(element => {
      ctx.fillStyle = getElementColor(element);
      ctx.fillRect(element.x, element.y, element.width, element.height);

      // Draw element icon
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(getElementIcon(element.type), element.x + element.width/2, element.y + element.height/2 + 5);
    });

    // Draw player
    ctx.fillStyle = player.isDucking ? '#e74c3c' : '#3498db';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw player icon
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.isDucking ? '🛡️' : '👤', player.x + player.width/2, player.y + player.height/2 + 4);

    ctx.restore();

    // Draw UI
    drawUI(ctx);
  };

  // Draw game UI
  const drawUI = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 25);

    // Draw lives
    ctx.fillText(`Lives: ${gameState.lives}`, 10, 50);

    // Draw time
    ctx.fillText(`Time: ${Math.ceil(gameState.timeLeft)}s`, 10, 75);

    // Draw earthquake intensity
    ctx.fillText(`Intensity: ${Math.round(gameState.earthquakeIntensity)}%`, 10, 100);

    // Draw instructions
    if (currentInstruction < instructions.length) {
      ctx.fillStyle = '#f39c12';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(instructions[currentInstruction], canvas.width/2, 25);
    }

    // Draw status messages
    if (gameState.earthquakeIntensity > 70) {
      ctx.fillStyle = '#e74c3c';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🌍 STRONG SHAKING! DUCK AND COVER!', canvas.width/2, canvas.height - 20);
    } else if (gameState.earthquakeIntensity > 40) {
      ctx.fillStyle = '#f39c12';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ Moderate shaking - Stay alert!', canvas.width/2, canvas.height - 20);
    }
  };

  // Get element color
  const getElementColor = (element: BuildingElement) => {
    if (!element.stable) return '#e74c3c'; // Red for unstable
    
    switch (element.type) {
      case 'wall': return '#34495e';
      case 'window': return '#3498db';
      case 'door': return '#8b4513';
      case 'furniture': return '#95a5a6';
      case 'safe_zone': return '#27ae60';
      case 'hazard': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  // Get element icon
  const getElementIcon = (type: string) => {
    switch (type) {
      case 'wall': return '🧱';
      case 'window': return '🪟';
      case 'door': return '🚪';
      case 'furniture': return '🪑';
      case 'safe_zone': return '🛡️';
      case 'hazard': return '⚠️';
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
          setPlayer(prev => ({ ...prev, direction: 'up', isMoving: true }));
          break;
        case 's':
        case 'arrowdown':
          setPlayer(prev => ({ ...prev, direction: 'down', isMoving: true }));
          break;
        case 'a':
        case 'arrowleft':
          setPlayer(prev => ({ ...prev, direction: 'left', isMoving: true }));
          break;
        case 'd':
        case 'arrowright':
          setPlayer(prev => ({ ...prev, direction: 'right', isMoving: true }));
          break;
        case ' ':
          e.preventDefault();
          setPlayer(prev => ({ ...prev, isDucking: !prev.isDucking }));
          break;
        case 'enter':
          if (currentInstruction < instructions.length - 1) {
            setCurrentInstruction(prev => prev + 1);
          }
          break;
      }
    };

    const handleKeyRelease = (e: KeyboardEvent) => {
      setPlayer(prev => ({ ...prev, isMoving: false, direction: 'idle' }));
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyRelease);
    };
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
          <h2 className="text-2xl font-bold text-gray-900">🌍 Earthquake Survival Drill</h2>
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
            <p>• Use WASD or Arrow Keys to move your character</p>
            <p>• Press SPACE to duck and cover (🛡️)</p>
            <p>• Avoid windows (🪟) and furniture (🪑) during shaking</p>
            <p>• Move to safe zones (🛡️) when shaking stops</p>
            <p>• Exit through doors (🚪) to complete the drill</p>
            <p>• Press ENTER to advance instructions</p>
          </div>
        </div>

        {/* Game Status */}
        {gameState.gameOver && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <h3 className="text-red-800 font-semibold">Game Over!</h3>
            <p className="text-red-700">Time ran out or you lost all lives. Try again!</p>
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
            <p className="text-green-700">Time: {Math.ceil(180 - gameState.timeLeft)} seconds</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Building Stability</span>
            <span>{Math.round(gameState.buildingStability)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                gameState.buildingStability > 70 ? 'bg-green-600' :
                gameState.buildingStability > 40 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${gameState.buildingStability}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthquakeSurvivalGame;
