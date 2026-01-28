import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory } from '../api';
import { useAuth } from '../context/AuthContext';

const ChatBox = ({ otherUser }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (otherUser) {
            fetchMessages();
            // Polling for new messages (simple implementation)
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [otherUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const data = await getChatHistory(otherUser.id);
            setMessages(data);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const msg = await sendMessage({ receiver_id: otherUser.id, content: newMessage });
            setMessages([...messages, msg]);
            setNewMessage('');
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!otherUser) return <div className="p-4 text-gray-500">Select a user to chat with.</div>;

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-lg shadow border">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Chat with {otherUser.name}</h3>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 capitalize">{otherUser.role}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                    <p className="text-center text-gray-400 text-sm mt-10">No messages yet. Say hello!</p>
                )}
                {messages.map((msg) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}>
                                <p>{msg.content}</p>
                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t bg-gray-50 flex gap-2">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                    type="submit"
                    className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 w-10 h-10 flex items-center justify-center"
                    disabled={!newMessage.trim()}
                >
                    ➤
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
