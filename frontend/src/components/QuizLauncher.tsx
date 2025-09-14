import React, { useState } from 'react';
import EmergencyQuizGame from './EmergencyQuizGame';

interface QuizLauncherProps {
    onClose: () => void;
    studentId: string;
}

const QuizLauncher: React.FC<QuizLauncherProps> = ({ onClose, studentId }) => {
    const [showQuiz, setShowQuiz] = useState(false);

    const quizCategories = [
        {
            id: 'all',
            name: 'Complete Quiz',
            description: 'Test your knowledge across all emergency scenarios',
            icon: '🎯',
            color: 'from-purple-500 to-indigo-600',
            questions: 15,
            difficulty: 'Mixed'
        },
        {
            id: 'fire',
            name: 'Fire Safety',
            description: 'Learn about fire prevention and evacuation procedures',
            icon: '🔥',
            color: 'from-red-500 to-orange-600',
            questions: 3,
            difficulty: 'Easy to Hard'
        },
        {
            id: 'earthquake',
            name: 'Earthquake Safety',
            description: 'Master earthquake preparedness and response',
            icon: '🌍',
            color: 'from-yellow-500 to-amber-600',
            questions: 3,
            difficulty: 'Easy to Medium'
        },
        {
            id: 'flood',
            name: 'Flood Safety',
            description: 'Understand flood risks and safety measures',
            icon: '🌊',
            color: 'from-blue-500 to-cyan-600',
            questions: 3,
            difficulty: 'Easy to Hard'
        },
        {
            id: 'general',
            name: 'General Safety',
            description: 'Essential emergency preparedness knowledge',
            icon: '🛡️',
            color: 'from-green-500 to-emerald-600',
            questions: 3,
            difficulty: 'Easy'
        },
        {
            id: 'medical',
            name: 'Medical Emergency',
            description: 'First aid and medical emergency response',
            icon: '🏥',
            color: 'from-pink-500 to-rose-600',
            questions: 2,
            difficulty: 'Medium'
        },
        {
            id: 'security',
            name: 'Security Awareness',
            description: 'Security threats and response procedures',
            icon: '🚨',
            color: 'from-gray-500 to-slate-600',
            questions: 1,
            difficulty: 'Hard'
        }
    ];

    const handleQuizStart = () => {
        setShowQuiz(true);
    };

    if (showQuiz) {
        return <EmergencyQuizGame onClose={() => setShowQuiz(false)} studentId={studentId} />;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">🧠 Emergency Preparedness Quiz</h2>
                        <p className="text-gray-600 mt-1">Test your knowledge and improve your safety awareness</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        Close
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎓</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Your Learning Path</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Select a quiz category to test your knowledge and learn essential emergency preparedness skills. 
                        Each quiz includes detailed explanations to help you understand the correct procedures.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {quizCategories.map((category) => (
                        <div
                            key={category.id}
                            className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                            onClick={handleQuizStart}
                        >
                            <div className="text-center">
                                <div className="text-4xl mb-4">{category.icon}</div>
                                <h4 className="text-lg font-semibold mb-2">{category.name}</h4>
                                <p className="text-sm opacity-90 mb-4">{category.description}</p>
                                <div className="flex justify-between items-center text-xs opacity-80">
                                    <span>{category.questions} Questions</span>
                                    <span>{category.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">📚 Learning Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-700">
                                <span className="text-green-500 mr-2">✓</span>
                                Improve emergency response knowledge
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <span className="text-green-500 mr-2">✓</span>
                                Learn proper safety procedures
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <span className="text-green-500 mr-2">✓</span>
                                Build confidence in emergency situations
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-700">
                                <span className="text-green-500 mr-2">✓</span>
                                Track your learning progress
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <span className="text-green-500 mr-2">✓</span>
                                Earn achievement badges
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <span className="text-green-500 mr-2">✓</span>
                                Detailed explanations for each answer
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Note</h4>
                    <p className="text-sm text-yellow-700">
                        This quiz is for educational purposes only. In real emergency situations, always follow official emergency procedures 
                        and contact emergency services immediately. The information provided should supplement, not replace, 
                        professional emergency training.
                    </p>
                </div>

                <div className="text-center">
                    <button
                        onClick={handleQuizStart}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg transform hover:scale-105"
                    >
                        🚀 Start Learning Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizLauncher;
