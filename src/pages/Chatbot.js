import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const Chatbot = () => {
    const [chats, setChats] = useState({});
    const [currentChatId, setCurrentChatId] = useState(null);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Load saved chats from localStorage
    useEffect(() => {
        const savedChats = JSON.parse(localStorage.getItem("chats")) || {};
        setChats(savedChats);
        if (Object.keys(savedChats).length > 0) {
            setCurrentChatId(Object.keys(savedChats)[0]);
        }
    }, []);

    // Scroll to the bottom of chat when messages update
    useEffect(() => {
        if (currentChatId) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [chats, currentChatId]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        const botMessage = { sender: "bot", text: "Let me think..." };

        setChats(prev => {
            const updatedChats = { ...prev };
            if (!updatedChats[currentChatId]) updatedChats[currentChatId] = [];
            updatedChats[currentChatId] = [...updatedChats[currentChatId], userMessage];

            setTimeout(() => {
                updatedChats[currentChatId] = [...updatedChats[currentChatId], botMessage];
                setChats({ ...updatedChats });
                setIsTyping(false);
                localStorage.setItem("chats", JSON.stringify(updatedChats));
            }, 1500);

            return updatedChats;
        });

        setInput("");
        setIsTyping(true);
    };

    const startNewChat = () => {
        const newChatId = Date.now().toString();
        const newChats = { ...chats, [newChatId]: [] };
        setChats(newChats);
        setCurrentChatId(newChatId);
        localStorage.setItem("chats", JSON.stringify(newChats));
    };

    return (
        <div className="chat-container">
            {/* Sidebar for multiple chats */}
            <div className="sidebar">
                <button className="new-chat-btn" onClick={startNewChat}>+ New Chat</button>
                <div className="chat-list">
                    {Object.keys(chats).map(chatId => (
                        <div key={chatId} className={`chat-item ${chatId === currentChatId ? "active" : ""}`} onClick={() => setCurrentChatId(chatId)}>
                            Chat {chatId.slice(-4)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat interface */}
            <div className="chatbot">
                <div className="chat-header">AI Financial Assistant</div>
                <div className="chat-history">
                    {currentChatId && chats[currentChatId]?.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <div className="bubble">{msg.text}</div>
                        </div>
                    ))}
                    {isTyping && <div className="message bot"><div className="bubble typing">...</div></div>}
                    <div ref={chatEndRef} />
                </div>

                {/* Input field */}
                <div className="chat-input">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message AI..." />
                    <button onClick={handleSend} className="send-btn">➤</button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
