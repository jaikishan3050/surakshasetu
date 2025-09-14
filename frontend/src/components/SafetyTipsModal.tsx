import React, { useState } from 'react';

interface SafetyTip {
    id: string;
    category: 'fire' | 'earthquake' | 'flood' | 'medical' | 'security' | 'general';
    title: string;
    description: string;
    steps: string[];
    icon: string;
    priority: 'high' | 'medium' | 'low';
    tags: string[];
}

interface SafetyTipsModalProps {
    onClose: () => void;
}

const SafetyTipsModal: React.FC<SafetyTipsModalProps> = ({ onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const safetyTips: SafetyTip[] = [
        // Fire Safety Tips
        {
            id: 'fire-1',
            category: 'fire',
            title: 'Fire Prevention at Home',
            description: 'Essential steps to prevent fires in your home and workplace',
            steps: [
                'Install smoke detectors on every level of your home',
                'Test smoke detectors monthly and replace batteries annually',
                'Keep flammable materials away from heat sources',
                'Never leave cooking unattended',
                'Have a fire extinguisher in the kitchen and garage',
                'Create and practice a home fire escape plan',
                'Keep matches and lighters out of children\'s reach'
            ],
            icon: '🔥',
            priority: 'high',
            tags: ['prevention', 'smoke-detector', 'escape-plan']
        },
        {
            id: 'fire-2',
            category: 'fire',
            title: 'Fire Evacuation Procedures',
            description: 'What to do when a fire breaks out in your building',
            steps: [
                'Stay calm and don\'t panic',
                'Feel doors before opening - if hot, don\'t open',
                'Crawl low under smoke to avoid toxic fumes',
                'Use stairs, never elevators during a fire',
                'Close doors behind you to slow fire spread',
                'Meet at your designated assembly point',
                'Call emergency services from outside the building'
            ],
            icon: '🚨',
            priority: 'high',
            tags: ['evacuation', 'emergency', 'safety']
        },
        {
            id: 'fire-3',
            category: 'fire',
            title: 'Using Fire Extinguishers',
            description: 'Proper technique for using fire extinguishers safely',
            steps: [
                'Remember PASS: Pull, Aim, Squeeze, Sweep',
                'Pull the pin to break the tamper seal',
                'Aim low at the base of the fire',
                'Squeeze the handle to release the extinguishing agent',
                'Sweep from side to side until the fire is out',
                'Only use on small, contained fires',
                'Evacuate immediately if the fire grows'
            ],
            icon: '🧯',
            priority: 'medium',
            tags: ['fire-extinguisher', 'technique', 'safety']
        },

        // Earthquake Safety Tips
        {
            id: 'earthquake-1',
            category: 'earthquake',
            title: 'During an Earthquake',
            description: 'Critical actions to take when an earthquake occurs',
            steps: [
                'Drop to your hands and knees immediately',
                'Cover your head and neck with your arms',
                'Hold on to something sturdy if possible',
                'Stay away from windows, mirrors, and heavy objects',
                'If in bed, stay there and cover your head with a pillow',
                'If outdoors, move to an open area away from buildings',
                'If driving, pull over and stop in a safe location'
            ],
            icon: '🌍',
            priority: 'high',
            tags: ['drop-cover-hold', 'earthquake', 'safety']
        },
        {
            id: 'earthquake-2',
            category: 'earthquake',
            title: 'After an Earthquake',
            description: 'Important steps to take after the shaking stops',
            steps: [
                'Check yourself and others for injuries',
                'Look for and extinguish small fires',
                'Check for gas leaks and turn off gas if needed',
                'Listen to emergency broadcasts for information',
                'Be prepared for aftershocks',
                'Avoid damaged buildings and areas',
                'Help others if it\'s safe to do so'
            ],
            icon: '🏥',
            priority: 'high',
            tags: ['aftershock', 'safety-check', 'emergency']
        },
        {
            id: 'earthquake-3',
            category: 'earthquake',
            title: 'Earthquake Preparedness',
            description: 'How to prepare your home and family for earthquakes',
            steps: [
                'Secure heavy furniture to walls',
                'Store heavy items on lower shelves',
                'Install latches on cabinet doors',
                'Keep emergency supplies ready',
                'Practice earthquake drills with family',
                'Know how to turn off utilities',
                'Have a family communication plan'
            ],
            icon: '🏠',
            priority: 'medium',
            tags: ['preparedness', 'home-safety', 'family-plan']
        },

        // Flood Safety Tips
        {
            id: 'flood-1',
            category: 'flood',
            title: 'Flood Preparedness',
            description: 'How to prepare for potential flooding in your area',
            steps: [
                'Know your area\'s flood risk',
                'Purchase flood insurance if available',
                'Keep important documents in waterproof containers',
                'Create an emergency supply kit',
                'Plan evacuation routes',
                'Move valuables to higher ground',
                'Stay informed about weather conditions'
            ],
            icon: '🌊',
            priority: 'high',
            tags: ['preparedness', 'insurance', 'evacuation']
        },
        {
            id: 'flood-2',
            category: 'flood',
            title: 'During a Flood',
            description: 'Critical safety measures when flooding occurs',
            steps: [
                'Move to higher ground immediately',
                'Never walk or drive through floodwaters',
                'Avoid contact with floodwater - it may be contaminated',
                'Turn off electricity at the main breaker',
                'Listen to emergency broadcasts',
                'Evacuate if ordered to do so',
                'Help others if it\'s safe'
            ],
            icon: '⚠️',
            priority: 'high',
            tags: ['evacuation', 'safety', 'emergency']
        },
        {
            id: 'flood-3',
            category: 'flood',
            title: 'After a Flood',
            description: 'Safety steps to take after floodwaters recede',
            steps: [
                'Return home only when authorities say it\'s safe',
                'Check for structural damage before entering',
                'Wear protective clothing and boots',
                'Document damage for insurance claims',
                'Clean and disinfect everything that got wet',
                'Throw away food that may have been contaminated',
                'Be aware of electrical hazards'
            ],
            icon: '🔧',
            priority: 'medium',
            tags: ['recovery', 'cleanup', 'safety']
        },

        // Medical Emergency Tips
        {
            id: 'medical-1',
            category: 'medical',
            title: 'CPR Basics',
            description: 'Basic cardiopulmonary resuscitation techniques',
            steps: [
                'Check for responsiveness and breathing',
                'Call emergency services immediately',
                'Place hands in center of chest',
                'Push hard and fast (100-120 compressions per minute)',
                'Allow chest to fully recoil between compressions',
                'Continue until help arrives or person recovers',
                'Use AED if available and trained'
            ],
            icon: '❤️',
            priority: 'high',
            tags: ['cpr', 'life-saving', 'emergency']
        },
        {
            id: 'medical-2',
            category: 'medical',
            title: 'First Aid Essentials',
            description: 'Basic first aid techniques for common emergencies',
            steps: [
                'Keep a well-stocked first aid kit',
                'Learn to stop bleeding with direct pressure',
                'Know how to treat burns with cool water',
                'Learn the Heimlich maneuver for choking',
                'Know how to treat shock',
                'Learn to recognize signs of stroke',
                'Take a certified first aid course'
            ],
            icon: '🏥',
            priority: 'high',
            tags: ['first-aid', 'bleeding', 'burns']
        },
        {
            id: 'medical-3',
            category: 'medical',
            title: 'Emergency Medical Kit',
            description: 'Essential items for your emergency medical kit',
            steps: [
                'Bandages and gauze pads',
                'Antiseptic wipes and ointment',
                'Pain relievers and fever reducers',
                'Thermometer and tweezers',
                'Emergency blanket',
                'Flashlight with extra batteries',
                'Emergency contact information'
            ],
            icon: '🎒',
            priority: 'medium',
            tags: ['medical-kit', 'supplies', 'preparedness']
        },

        // Security Tips
        {
            id: 'security-1',
            category: 'security',
            title: 'Personal Security',
            description: 'Basic personal security measures for daily safety',
            steps: [
                'Be aware of your surroundings',
                'Trust your instincts - if something feels wrong, it probably is',
                'Keep doors and windows locked',
                'Don\'t share personal information with strangers',
                'Use well-lit areas when walking at night',
                'Keep emergency contacts easily accessible',
                'Report suspicious activity to authorities'
            ],
            icon: '🛡️',
            priority: 'medium',
            tags: ['awareness', 'personal-safety', 'prevention']
        },
        {
            id: 'security-2',
            category: 'security',
            title: 'Active Shooter Response',
            description: 'How to respond if you encounter an active shooter',
            steps: [
                'Run if you can safely do so',
                'Hide in a secure location if running isn\'t possible',
                'Lock and barricade doors',
                'Turn off lights and silence phones',
                'Stay quiet and out of view',
                'Fight only as a last resort',
                'Call emergency services when safe'
            ],
            icon: '🚨',
            priority: 'high',
            tags: ['active-shooter', 'run-hide-fight', 'emergency']
        },

        // General Safety Tips
        {
            id: 'general-1',
            category: 'general',
            title: 'Emergency Preparedness Kit',
            description: 'Essential items for your emergency preparedness kit',
            steps: [
                'Water (1 gallon per person per day for 3 days)',
                'Non-perishable food for 3 days',
                'First aid kit and medications',
                'Flashlight and extra batteries',
                'Radio (battery-powered or hand-crank)',
                'Important documents in waterproof container',
                'Cash in small bills and coins'
            ],
            icon: '🎒',
            priority: 'high',
            tags: ['emergency-kit', 'preparedness', 'supplies']
        },
        {
            id: 'general-2',
            category: 'general',
            title: 'Family Emergency Plan',
            description: 'Creating and maintaining a family emergency plan',
            steps: [
                'Identify meeting places inside and outside your home',
                'Choose an out-of-town contact person',
                'Plan evacuation routes from your home',
                'Practice your plan with all family members',
                'Update your plan regularly',
                'Include plans for pets',
                'Keep emergency contact numbers handy'
            ],
            icon: '👨‍👩‍👧‍👦',
            priority: 'high',
            tags: ['family-plan', 'communication', 'preparedness']
        },
        {
            id: 'general-3',
            category: 'general',
            title: 'Staying Informed',
            description: 'How to stay informed during emergencies',
            steps: [
                'Sign up for emergency alerts in your area',
                'Keep a battery-powered radio',
                'Follow official social media accounts',
                'Download emergency apps',
                'Know your local emergency numbers',
                'Understand different types of emergency warnings',
                'Have backup communication methods'
            ],
            icon: '📱',
            priority: 'medium',
            tags: ['communication', 'alerts', 'information']
        }
    ];

    const categories = [
        { id: 'all', name: 'All Tips', icon: '📚', color: 'bg-purple-100 text-purple-700' },
        { id: 'fire', name: 'Fire Safety', icon: '🔥', color: 'bg-red-100 text-red-700' },
        { id: 'earthquake', name: 'Earthquake', icon: '🌍', color: 'bg-yellow-100 text-yellow-700' },
        { id: 'flood', name: 'Flood Safety', icon: '🌊', color: 'bg-blue-100 text-blue-700' },
        { id: 'medical', name: 'Medical Emergency', icon: '🏥', color: 'bg-pink-100 text-pink-700' },
        { id: 'security', name: 'Security', icon: '🛡️', color: 'bg-gray-100 text-gray-700' },
        { id: 'general', name: 'General Safety', icon: '🛡️', color: 'bg-green-100 text-green-700' }
    ];

    const getFilteredTips = () => {
        let filtered = safetyTips;
        
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(tip => tip.category === selectedCategory);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(tip => 
                tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tip.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        return filtered;
    };

    const filteredTips = getFilteredTips();

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">📚 Safety Tips & Guidelines</h2>
                        <p className="text-gray-600 mt-1">Essential safety information for emergency preparedness</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        Close
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search safety tips..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                        selectedCategory === category.id
                                            ? `${category.color} border-2 border-current`
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="mr-1">{category.icon}</span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Safety Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTips.map((tip) => (
                        <div
                            key={tip.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-3xl">{tip.icon}</div>
                                <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(tip.priority)}`}>
                                    {tip.priority.toUpperCase()}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{tip.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{tip.description}</p>
                            
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-700 text-sm">Key Steps:</h4>
                                <ul className="space-y-1">
                                    {tip.steps.slice(0, 3).map((step, index) => (
                                        <li key={index} className="text-sm text-gray-600 flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            {step}
                                        </li>
                                    ))}
                                    {tip.steps.length > 3 && (
                                        <li className="text-xs text-blue-600 font-medium">
                                            +{tip.steps.length - 3} more steps...
                                        </li>
                                    )}
                                </ul>
                            </div>
                            
                            <div className="mt-4 flex flex-wrap gap-1">
                                {tip.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTips.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No tips found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">⚠️ Important Disclaimer</h4>
                    <p className="text-sm text-blue-700">
                        These safety tips are for educational purposes only. In real emergency situations, 
                        always follow official emergency procedures and contact emergency services immediately. 
                        Consider taking certified training courses for hands-on experience.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SafetyTipsModal;
