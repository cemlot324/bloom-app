'use client';
import { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';

type Message = {
    text: string;
    isBot: boolean;
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hi! How can I help you today?", isBot: true }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // Add user message
        const userMessage: Message = { text: inputText, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(inputText);
            setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
        }, 1000);
    };

    const getBotResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();
        
        if (input.includes('hello') || input.includes('hi')) {
            return "Hello! How can I assist you today?";
        }
        if (input.includes('price') || input.includes('cost')) {
            return "Our products range from £10 to £59.99, check out what we have in our product page!";
        }
        if (input.includes('delivery')) {
            return "We offer next day delivery for orders placed before 2 PM local time.";
        }
        if (input.includes('discount') || input.includes('coupon')) {
            return "Use code WELCOME20 for 20% off your first purchase!";
        }
        return "I'm here to help! Feel free to ask about our products, delivery, or special offers.";
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
            >
                {isOpen ? <FaTimes size={20} /> : <FaComments size={20} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
                    {/* Chat Header */}
                    <div className="bg-black text-white p-4">
                        <h3 className="font-bold">Bloomed Chat Support</h3>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                        message.isBot
                                            ? 'bg-gray-100'
                                            : 'bg-black text-white'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <div className="border-t p-3">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:border-black"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 