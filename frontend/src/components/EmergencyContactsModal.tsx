import React, { useState } from 'react';

interface EmergencyContact {
    id: string;
    name: string;
    number: string;
    type: 'police' | 'fire' | 'medical' | 'campus' | 'family' | 'utility' | 'other';
    description: string;
    icon: string;
    priority: 'high' | 'medium' | 'low';
    available24h: boolean;
    location?: string;
}

interface EmergencyContactsModalProps {
    onClose: () => void;
}

const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({ onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const emergencyContacts: EmergencyContact[] = [
        // Police & Security
        {
            id: 'police-1',
            name: 'Police Emergency',
            number: '100',
            type: 'police',
            description: 'Emergency police response for crimes, accidents, and immediate threats',
            icon: '🚔',
            priority: 'high',
            available24h: true
        },
        {
            id: 'police-2',
            name: 'Police Non-Emergency',
            number: '101',
            type: 'police',
            description: 'Non-emergency police services, reporting, and general inquiries',
            icon: '👮',
            priority: 'medium',
            available24h: true
        },
        {
            id: 'campus-1',
            name: 'Campus Security',
            number: 'Ext. 911',
            type: 'campus',
            description: 'Campus security for emergencies, suspicious activity, and safety concerns',
            icon: '🏫',
            priority: 'high',
            available24h: true,
            location: 'Campus'
        },

        // Fire & Rescue
        {
            id: 'fire-1',
            name: 'Fire Department',
            number: '102',
            type: 'fire',
            description: 'Fire emergencies, rescue operations, and fire safety incidents',
            icon: '🚒',
            priority: 'high',
            available24h: true
        },
        {
            id: 'fire-2',
            name: 'Fire Non-Emergency',
            number: '103',
            type: 'fire',
            description: 'Fire safety inspections, non-emergency fire services',
            icon: '🔥',
            priority: 'low',
            available24h: false
        },

        // Medical Emergency
        {
            id: 'medical-1',
            name: 'Medical Emergency',
            number: '108',
            type: 'medical',
            description: 'Ambulance services, medical emergencies, and life-threatening situations',
            icon: '🚑',
            priority: 'high',
            available24h: true
        },
        {
            id: 'medical-2',
            name: 'Poison Control',
            number: '1800-116-117',
            type: 'medical',
            description: 'Poisoning emergencies, drug overdoses, and toxic exposure',
            icon: '☠️',
            priority: 'high',
            available24h: true
        },
        {
            id: 'medical-3',
            name: 'Mental Health Crisis',
            number: '1800-599-0019',
            type: 'medical',
            description: 'Mental health emergencies, suicide prevention, and crisis support',
            icon: '🧠',
            priority: 'high',
            available24h: true
        },
        {
            id: 'medical-4',
            name: 'Campus Medical Center',
            number: 'Ext. 2222',
            type: 'medical',
            description: 'Campus medical services, first aid, and health consultations',
            icon: '🏥',
            priority: 'medium',
            available24h: false,
            location: 'Campus Medical Center'
        },

        // Utility Services
        {
            id: 'utility-1',
            name: 'Electricity Emergency',
            number: '1912',
            type: 'utility',
            description: 'Power outages, electrical emergencies, and electrical safety issues',
            icon: '⚡',
            priority: 'medium',
            available24h: true
        },
        {
            id: 'utility-2',
            name: 'Gas Emergency',
            number: '1906',
            type: 'utility',
            description: 'Gas leaks, gas emergencies, and gas safety concerns',
            icon: '⛽',
            priority: 'high',
            available24h: true
        },
        {
            id: 'utility-3',
            name: 'Water Emergency',
            number: '1911',
            type: 'utility',
            description: 'Water main breaks, water emergencies, and water safety issues',
            icon: '💧',
            priority: 'medium',
            available24h: true
        },

        // Family & Personal Contacts
        {
            id: 'family-1',
            name: 'Emergency Contact 1',
            number: '+91-98765-43210',
            type: 'family',
            description: 'Primary family emergency contact',
            icon: '👨‍👩‍👧‍👦',
            priority: 'high',
            available24h: true
        },
        {
            id: 'family-2',
            name: 'Emergency Contact 2',
            number: '+91-98765-43211',
            type: 'family',
            description: 'Secondary family emergency contact',
            icon: '👨‍👩‍👧‍👦',
            priority: 'medium',
            available24h: true
        },

        // Other Important Contacts
        {
            id: 'other-1',
            name: 'Disaster Management',
            number: '108',
            type: 'other',
            description: 'Natural disasters, emergency management, and disaster response',
            icon: '🌪️',
            priority: 'high',
            available24h: true
        },
        {
            id: 'other-2',
            name: 'Child Helpline',
            number: '1098',
            type: 'other',
            description: 'Child protection, abuse reporting, and child welfare services',
            icon: '👶',
            priority: 'high',
            available24h: true
        },
        {
            id: 'other-3',
            name: 'Women Helpline',
            number: '181',
            type: 'other',
            description: 'Women safety, domestic violence, and women protection services',
            icon: '👩',
            priority: 'high',
            available24h: true
        },
        {
            id: 'other-4',
            name: 'Cyber Crime',
            number: '1930',
            type: 'other',
            description: 'Cyber crimes, online fraud, and digital security incidents',
            icon: '💻',
            priority: 'medium',
            available24h: true
        }
    ];

    const categories = [
        { id: 'all', name: 'All Contacts', icon: '📞', color: 'bg-purple-100 text-purple-700' },
        { id: 'police', name: 'Police & Security', icon: '🚔', color: 'bg-blue-100 text-blue-700' },
        { id: 'fire', name: 'Fire & Rescue', icon: '🚒', color: 'bg-red-100 text-red-700' },
        { id: 'medical', name: 'Medical Emergency', icon: '🚑', color: 'bg-green-100 text-green-700' },
        { id: 'campus', name: 'Campus Services', icon: '🏫', color: 'bg-yellow-100 text-yellow-700' },
        { id: 'utility', name: 'Utility Services', icon: '⚡', color: 'bg-orange-100 text-orange-700' },
        { id: 'family', name: 'Family Contacts', icon: '👨‍👩‍👧‍👦', color: 'bg-pink-100 text-pink-700' },
        { id: 'other', name: 'Other Services', icon: '🆘', color: 'bg-gray-100 text-gray-700' }
    ];

    const getFilteredContacts = () => {
        let filtered = emergencyContacts;
        
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(contact => contact.type === selectedCategory);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(contact => 
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.number.includes(searchTerm) ||
                contact.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    };

    const filteredContacts = getFilteredContacts();

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const handleCall = (number: string) => {
        // Create a clickable phone link
        const phoneLink = `tel:${number}`;
        window.open(phoneLink, '_self');
    };

    const handleCopyNumber = (number: string) => {
        navigator.clipboard.writeText(number);
        // You could add a toast notification here
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">📞 Emergency Contacts</h2>
                        <p className="text-gray-600 mt-1">Quick access to all emergency and important contact numbers</p>
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
                                placeholder="Search contacts..."
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

                {/* Emergency Contacts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-3xl">{contact.icon}</div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(contact.priority)}`}>
                                        {contact.priority.toUpperCase()}
                                    </span>
                                    {contact.available24h && (
                                        <div className="text-xs text-green-600 mt-1">24/7 Available</div>
                                    )}
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{contact.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{contact.description}</p>
                            
                            <div className="mb-4">
                                <div className="text-2xl font-bold text-blue-600 mb-2">{contact.number}</div>
                                {contact.location && (
                                    <div className="text-sm text-gray-500">📍 {contact.location}</div>
                                )}
                            </div>
                            
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleCall(contact.number)}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                                >
                                    📞 Call Now
                                </button>
                                <button
                                    onClick={() => handleCopyNumber(contact.number)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                                >
                                    📋 Copy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredContacts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No contacts found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4">🚨 Quick Emergency Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => handleCall('100')}
                            className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                        >
                            🚔 Call Police (100)
                        </button>
                        <button
                            onClick={() => handleCall('102')}
                            className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
                        >
                            🚒 Call Fire (102)
                        </button>
                        <button
                            onClick={() => handleCall('108')}
                            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                            🚑 Call Medical (108)
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Save these numbers in your phone for quick access</li>
                        <li>• In life-threatening emergencies, call the appropriate emergency number immediately</li>
                        <li>• Keep your phone charged and accessible at all times</li>
                        <li>• Update family emergency contacts regularly</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EmergencyContactsModal;
