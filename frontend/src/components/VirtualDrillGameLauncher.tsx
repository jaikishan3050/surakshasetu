import React, { useState } from 'react';
import EmergencyDrillGame from './EmergencyDrillGame';
import EarthquakeSurvivalGame from './EarthquakeSurvivalGame';

// Types for the Virtual Drill Game Launcher
interface GameLauncherProps {
  onClose: () => void;
  studentId?: string;
}

interface DrillGameResult {
  score: number;
  timeSpent: number;
  responses: any[];
  drillType: string;
}

const VirtualDrillGameLauncher: React.FC<GameLauncherProps> = ({ onClose, studentId }) => {
  const [selectedDrillType, setSelectedDrillType] = useState<string>('');
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameResults, setGameResults] = useState<DrillGameResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const drillTypes = [
    {
      id: 'fire',
      name: 'Fire Emergency Drill',
      icon: '🔥',
      description: 'Learn fire safety procedures and evacuation protocols',
      difficulty: 'Intermediate',
      duration: '2-3 minutes',
      gameComponent: EmergencyDrillGame
    },
    {
      id: 'earthquake',
      name: 'Earthquake Survival Drill',
      icon: '🌍',
      description: 'Practice earthquake safety and building evacuation',
      difficulty: 'Advanced',
      duration: '3-4 minutes',
      gameComponent: EarthquakeSurvivalGame
    },
    {
      id: 'flood',
      name: 'Flood Emergency Drill',
      icon: '🌊',
      description: 'Learn flood safety and evacuation procedures',
      difficulty: 'Beginner',
      duration: '2-3 minutes',
      gameComponent: EmergencyDrillGame
    },
    {
      id: 'general_emergency',
      name: 'General Emergency Drill',
      icon: '🚨',
      description: 'Practice general emergency response procedures',
      difficulty: 'Beginner',
      duration: '2-3 minutes',
      gameComponent: EmergencyDrillGame
    }
  ];

  const handleStartGame = (drillType: string) => {
    setSelectedDrillType(drillType);
    setIsGameActive(true);
  };

  const handleGameComplete = async (score: number, timeSpent: number, responses: any[]) => {
    const result: DrillGameResult = {
      score,
      timeSpent,
      responses,
      drillType: selectedDrillType
    };
    
    setGameResults(result);
    setIsGameActive(false);
    
    // Submit results to backend
    await submitDrillResults(result);
  };

  const handleGameExit = () => {
    setIsGameActive(false);
    setSelectedDrillType('');
  };

  const submitDrillResults = async (result: DrillGameResult) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5002/api/drills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId || 'demo-student',
          drillType: result.drillType,
          score: Math.round((result.score / 1000) * 100), // Convert to percentage
          status: 'completed',
          duration: result.timeSpent,
          responses: result.responses,
          notes: `Virtual drill game completed with ${result.score} points`,
          difficultyLevel: drillTypes.find(d => d.id === result.drillType)?.difficulty || 'beginner'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Drill results submitted successfully:', data);
      } else {
        console.error('Failed to submit drill results:', data.message);
      }
    } catch (error) {
      console.error('Error submitting drill results:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderGameComponent = () => {
    if (!isGameActive || !selectedDrillType) return null;

    const drillType = drillTypes.find(d => d.id === selectedDrillType);
    if (!drillType) return null;

    const GameComponent = drillType.gameComponent;

    return (
      <GameComponent
        drillType={selectedDrillType as any}
        onGameComplete={handleGameComplete}
        onGameExit={handleGameExit}
      />
    );
  };

  if (isGameActive) {
    return renderGameComponent();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">🎮 Virtual Emergency Drill Games</h2>
            <p className="text-gray-600 mt-2">Practice emergency procedures through interactive 2D games</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>

        {/* Game Results */}
        {gameResults && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 font-semibold mb-2">🎉 Drill Completed Successfully!</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Score:</span>
                <p className="text-green-700">{gameResults.score} points</p>
              </div>
              <div>
                <span className="font-medium">Time:</span>
                <p className="text-green-700">{Math.ceil(gameResults.timeSpent)} seconds</p>
              </div>
              <div>
                <span className="font-medium">Actions:</span>
                <p className="text-green-700">{gameResults.responses.length} completed</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p className="text-green-700">
                  {isSubmitting ? 'Submitting...' : 'Submitted ✓'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Game Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drillTypes.map((drill) => (
            <div
              key={drill.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{drill.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{drill.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                      {drill.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{drill.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>⏱️ {drill.duration}</span>
                <span>🎯 Interactive 2D Game</span>
              </div>

              <button
                onClick={() => handleStartGame(drill.id)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
              >
                Start {drill.name}
              </button>
            </div>
          ))}
        </div>

        {/* Game Features */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎮 Game Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold mb-2">Interactive Learning</h4>
              <p className="text-sm text-gray-600">Learn emergency procedures through hands-on gameplay</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold mb-2">Progress Tracking</h4>
              <p className="text-sm text-gray-600">Track your performance and improvement over time</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-semibold mb-2">Achievement System</h4>
              <p className="text-sm text-gray-600">Earn points and badges for completing drills</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📋 How to Play</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Select a drill type to start the game</li>
            <li>• Use keyboard controls to navigate and interact</li>
            <li>• Follow on-screen instructions for each emergency scenario</li>
            <li>• Complete all objectives within the time limit</li>
            <li>• Your performance will be automatically saved</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VirtualDrillGameLauncher;
