import React, { useState, useEffect } from 'react';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: 'fire' | 'earthquake' | 'flood' | 'general' | 'medical' | 'security';
    difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizResult {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    category: string;
    completedAt: string;
}

interface EmergencyQuizGameProps {
    onClose: () => void;
    studentId: string;
}

const EmergencyQuizGame: React.FC<EmergencyQuizGameProps> = ({ onClose, studentId }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
    const [startTime, setStartTime] = useState<number>(0);

    const quizQuestions: QuizQuestion[] = [
        // Fire Safety Questions
        {
            id: 1,
            question: "What should you do if you discover a fire in your building?",
            options: [
                "Run to the nearest exit immediately",
                "Stay calm, activate the fire alarm, and evacuate using the nearest exit",
                "Try to put out the fire yourself",
                "Hide in a closet until help arrives"
            ],
            correctAnswer: 1,
            explanation: "Always stay calm, activate the fire alarm to alert others, and evacuate using the nearest safe exit. Never try to fight a fire yourself unless you're trained.",
            category: 'fire',
            difficulty: 'easy'
        },
        {
            id: 2,
            question: "What is the correct way to use a fire extinguisher?",
            options: [
                "Aim at the base of the fire and sweep side to side",
                "Aim at the top of the flames",
                "Spray in circles around the fire",
                "Aim directly at the center"
            ],
            correctAnswer: 0,
            explanation: "Remember PASS: Pull the pin, Aim at the base of the fire, Squeeze the trigger, and Sweep side to side.",
            category: 'fire',
            difficulty: 'medium'
        },
        {
            id: 3,
            question: "If you're trapped in a room during a fire, what should you do?",
            options: [
                "Break the window and jump out",
                "Stay low, seal the door with wet towels, and signal for help",
                "Run around the room looking for another exit",
                "Lie down and wait for rescue"
            ],
            correctAnswer: 1,
            explanation: "Stay low to avoid smoke, seal the door to prevent smoke entry, and signal for help at the window. Never jump from high floors.",
            category: 'fire',
            difficulty: 'hard'
        },

        // Earthquake Safety Questions
        {
            id: 4,
            question: "What is the correct position during an earthquake?",
            options: [
                "Stand in a doorway",
                "Drop, Cover, and Hold On",
                "Run outside immediately",
                "Stand against a wall"
            ],
            correctAnswer: 1,
            explanation: "Drop to your hands and knees, Cover your head and neck, and Hold on to something sturdy. Doorways are not necessarily the safest place.",
            category: 'earthquake',
            difficulty: 'easy'
        },
        {
            id: 5,
            question: "After an earthquake stops, what should you do first?",
            options: [
                "Check for injuries and call emergency services",
                "Immediately evacuate the building",
                "Turn on all lights to see damage",
                "Continue with your normal activities"
            ],
            correctAnswer: 0,
            explanation: "First check yourself and others for injuries, then call emergency services if needed. Only evacuate if the building is unsafe.",
            category: 'earthquake',
            difficulty: 'medium'
        },
        {
            id: 6,
            question: "What should you do if you're outdoors during an earthquake?",
            options: [
                "Run to the nearest building",
                "Stay in an open area away from buildings, trees, and power lines",
                "Stand under a tree for protection",
                "Lie flat on the ground"
            ],
            correctAnswer: 1,
            explanation: "Move to an open area away from buildings, trees, streetlights, and utility wires that could fall on you.",
            category: 'earthquake',
            difficulty: 'medium'
        },

        // Flood Safety Questions
        {
            id: 7,
            question: "What should you do if you're caught in a flash flood while driving?",
            options: [
                "Drive through the water quickly",
                "Turn around and find higher ground",
                "Stop the car and wait for help",
                "Drive to the nearest bridge"
            ],
            correctAnswer: 1,
            explanation: "Never drive through floodwaters. Turn around and find higher ground. Just 6 inches of water can cause you to lose control of your vehicle.",
            category: 'flood',
            difficulty: 'easy'
        },
        {
            id: 8,
            question: "If floodwaters are rising around your home, what should you do?",
            options: [
                "Stay inside and wait for rescue",
                "Move to higher ground immediately",
                "Try to swim to safety",
                "Stay in the basement"
            ],
            correctAnswer: 1,
            explanation: "Move to higher ground immediately. Don't wait for official evacuation orders if you can safely leave.",
            category: 'flood',
            difficulty: 'medium'
        },
        {
            id: 9,
            question: "What is the most dangerous aspect of floodwaters?",
            options: [
                "The cold temperature",
                "The depth of the water",
                "The speed and force of moving water",
                "The dirty appearance"
            ],
            correctAnswer: 2,
            explanation: "Moving water is extremely powerful. Just 6 inches of fast-moving water can knock you down, and 2 feet can sweep away most vehicles.",
            category: 'flood',
            difficulty: 'hard'
        },

        // General Emergency Questions
        {
            id: 10,
            question: "What should be in your emergency preparedness kit?",
            options: [
                "Only food and water",
                "Food, water, first aid supplies, flashlight, and important documents",
                "Just a first aid kit",
                "Only important documents"
            ],
            correctAnswer: 1,
            explanation: "A complete emergency kit should include food, water, first aid supplies, flashlight, batteries, important documents, and other essentials.",
            category: 'general',
            difficulty: 'easy'
        },
        {
            id: 11,
            question: "How often should you practice your family emergency plan?",
            options: [
                "Once a year",
                "Every 6 months",
                "Every 3 months",
                "Only when there's an emergency"
            ],
            correctAnswer: 1,
            explanation: "Practice your emergency plan every 6 months to ensure everyone knows what to do and to update any changes.",
            category: 'general',
            difficulty: 'medium'
        },
        {
            id: 12,
            question: "What is the most important thing to remember during any emergency?",
            options: [
                "Stay calm and follow your emergency plan",
                "Panic and run around",
                "Call everyone you know",
                "Take photos for social media"
            ],
            correctAnswer: 0,
            explanation: "Staying calm allows you to think clearly and follow your emergency plan effectively. Panic can lead to dangerous decisions.",
            category: 'general',
            difficulty: 'easy'
        },

        // Medical Emergency Questions
        {
            id: 13,
            question: "What should you do if someone is unconscious and not breathing?",
            options: [
                "Wait for medical professionals",
                "Start CPR immediately",
                "Give them water",
                "Shake them vigorously"
            ],
            correctAnswer: 1,
            explanation: "If someone is unconscious and not breathing, start CPR immediately. Every second counts in saving a life.",
            category: 'medical',
            difficulty: 'medium'
        },
        {
            id: 14,
            question: "What is the correct way to help someone who is choking?",
            options: [
                "Hit them on the back",
                "Perform the Heimlich maneuver",
                "Give them water to drink",
                "Wait for them to cough it out"
            ],
            correctAnswer: 1,
            explanation: "The Heimlich maneuver (abdominal thrusts) is the correct way to help someone who is choking and cannot speak or breathe.",
            category: 'medical',
            difficulty: 'medium'
        },

        // Security Questions
        {
            id: 15,
            question: "What should you do if you receive a bomb threat?",
            options: [
                "Ignore it as a prank",
                "Follow your organization's bomb threat procedures",
                "Tell everyone to panic",
                "Search for the bomb yourself"
            ],
            correctAnswer: 1,
            explanation: "Always take bomb threats seriously and follow your organization's established procedures for handling such threats.",
            category: 'security',
            difficulty: 'hard'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Categories', icon: '🎯', color: 'bg-purple-100 text-purple-700' },
        { id: 'fire', name: 'Fire Safety', icon: '🔥', color: 'bg-red-100 text-red-700' },
        { id: 'earthquake', name: 'Earthquake', icon: '🌍', color: 'bg-yellow-100 text-yellow-700' },
        { id: 'flood', name: 'Flood Safety', icon: '🌊', color: 'bg-blue-100 text-blue-700' },
        { id: 'general', name: 'General Safety', icon: '🛡️', color: 'bg-green-100 text-green-700' },
        { id: 'medical', name: 'Medical Emergency', icon: '🏥', color: 'bg-pink-100 text-pink-700' },
        { id: 'security', name: 'Security', icon: '🚨', color: 'bg-gray-100 text-gray-700' }
    ];

    const getFilteredQuestions = () => {
        if (selectedCategory === 'all') {
            return quizQuestions;
        }
        return quizQuestions.filter(q => q.category === selectedCategory);
    };

    const currentQuestions = getFilteredQuestions();
    const currentQuestion = currentQuestions[currentQuestionIndex];

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (quizStarted && !quizCompleted && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && !quizCompleted) {
            handleNextQuestion();
        }
        return () => clearTimeout(timer);
    }, [timeLeft, quizStarted, quizCompleted]);

    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);
        setShowExplanation(true);
        
        if (answerIndex === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setTimeLeft(30);
        } else {
            handleQuizComplete();
        }
    };

    const handleQuizComplete = () => {
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - startTime) / 1000);
        
        const result: QuizResult = {
            score: score,
            totalQuestions: currentQuestions.length,
            correctAnswers: score,
            timeSpent: timeSpent,
            category: selectedCategory,
            completedAt: new Date().toISOString()
        };
        
        setQuizResults(result);
        setQuizCompleted(true);
        
        // Submit results to backend
        submitQuizResults(result);
    };

    const submitQuizResults = async (result: QuizResult) => {
        try {
            const response = await fetch('http://localhost:5002/api/drills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: studentId,
                    type: 'quiz',
                    score: result.score,
                    totalQuestions: result.totalQuestions,
                    timeSpent: result.timeSpent,
                    category: result.category,
                    status: 'completed',
                    responses: []
                })
            });
            
            if (!response.ok) {
                console.error('Failed to submit quiz results');
            }
        } catch (error) {
            console.error('Error submitting quiz results:', error);
        }
    };

    const startQuiz = () => {
        setQuizStarted(true);
        setStartTime(Date.now());
        setTimeLeft(30);
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setTimeLeft(30);
        setQuizStarted(false);
        setQuizCompleted(false);
        setQuizResults(null);
    };

    const getScoreMessage = () => {
        const percentage = (score / currentQuestions.length) * 100;
        if (percentage >= 90) return { message: "Excellent! You're well prepared!", color: "text-green-600", emoji: "🏆" };
        if (percentage >= 70) return { message: "Good job! Keep learning!", color: "text-blue-600", emoji: "👍" };
        if (percentage >= 50) return { message: "Not bad! Review the explanations.", color: "text-yellow-600", emoji: "📚" };
        return { message: "Keep studying! Safety is important!", color: "text-red-600", emoji: "💪" };
    };

    if (!quizStarted && !quizCompleted) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">🧠 Emergency Preparedness Quiz</h2>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                            Close
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Test Your Emergency Knowledge</h3>
                        <p className="text-gray-600 mb-6">
                            Challenge yourself with questions about fire safety, earthquake preparedness, flood safety, and general emergency procedures.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Choose a Category:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                                        selectedCategory === category.id
                                            ? `${category.color} border-current shadow-lg`
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="text-2xl mb-2">{category.icon}</div>
                                    <div className="text-sm font-medium">{category.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-blue-800 mb-2">📋 Quiz Rules:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• You have 30 seconds per question</li>
                            <li>• Read explanations carefully to learn</li>
                            <li>• Your score will be saved automatically</li>
                            <li>• Focus on understanding, not just speed</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={startQuiz}
                            disabled={!selectedCategory}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {selectedCategory ? 'Start Quiz' : 'Select a Category First'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (quizCompleted && quizResults) {
        const scoreInfo = getScoreMessage();
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-2xl w-full p-6">
                    <div className="text-center">
                        <div className="text-6xl mb-4">{scoreInfo.emoji}</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                        <p className={`text-lg font-semibold ${scoreInfo.color} mb-4`}>{scoreInfo.message}</p>
                        
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">{score}</div>
                                    <div className="text-sm text-gray-600">Correct Answers</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-600">{currentQuestions.length}</div>
                                    <div className="text-sm text-gray-600">Total Questions</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">{Math.round((score / currentQuestions.length) * 100)}%</div>
                                    <div className="text-sm text-gray-600">Score</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-purple-600">{quizResults.timeSpent}s</div>
                                    <div className="text-sm text-gray-600">Time Spent</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 justify-center">
                            <button
                                onClick={resetQuiz}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Take Another Quiz
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Emergency Preparedness Quiz</h2>
                        <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {currentQuestions.length}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Time Left</div>
                        <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}`}>
                            {timeLeft}s
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                                width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` 
                            } as React.CSSProperties}
                        ></div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-2">
                            {currentQuestion.category === 'fire' ? '🔥' :
                             currentQuestion.category === 'earthquake' ? '🌍' :
                             currentQuestion.category === 'flood' ? '🌊' :
                             currentQuestion.category === 'medical' ? '🏥' :
                             currentQuestion.category === 'security' ? '🚨' : '🛡️'}
                        </span>
                        <span className="text-sm text-gray-600 capitalize">
                            {currentQuestion.category} • {currentQuestion.difficulty}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>
                </div>

                <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                                selectedAnswer === index
                                    ? index === currentQuestion.correctAnswer
                                        ? 'bg-green-100 border-green-500 text-green-800'
                                        : 'bg-red-100 border-red-500 text-red-800'
                                    : selectedAnswer !== null && index === currentQuestion.correctAnswer
                                    ? 'bg-green-100 border-green-500 text-green-800'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                            } disabled:cursor-not-allowed`}
                        >
                            <div className="flex items-center">
                                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold mr-3">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                            </div>
                        </button>
                    ))}
                </div>

                {showExplanation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Explanation:</h4>
                        <p className="text-blue-700">{currentQuestion.explanation}</p>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Score: {score}/{currentQuestions.length}
                    </div>
                    <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmergencyQuizGame;
