import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import SettingsPopup from "./SettingsPopup"; // Linking the settings pop-up

const Chatbot = () => {
    const [chats, setChats] = useState({});
    const [currentChatId, setCurrentChatId] = useState(null);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const savedChats = JSON.parse(localStorage.getItem("chats")) || {};
        setChats(savedChats);
        if (Object.keys(savedChats).length > 0) {
            setCurrentChatId(Object.keys(savedChats)[0]);
        }
    }, []);

    useEffect(() => {
        if (currentChatId) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [chats, currentChatId]);

    const handleSend = () => {
        if (!input.trim()) return;
    
        fetch("http://localhost:8000/chatbot-api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                user_email: "kareem.elfeel@gmail.com", // Replace with actual user email
                message: input,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                const botMessage = { sender: "bot", text: data.response || "No response from API" };
                setChats(prev => ({
                    ...prev,
                    [currentChatId]: [...(prev[currentChatId] || []), botMessage]
                }));
            })
            .catch((error) => console.error("Error:", error));
    
        setInput("");
    };


    const startNewChat = () => {
        const newChatId = Date.now().toString();
        const newChats = { ...chats, [newChatId]: [] };
        setChats(newChats);
        setCurrentChatId(newChatId);
        localStorage.setItem("chats", JSON.stringify(newChats));
    };

    const deleteChat = (chatId) => {
        const updatedChats = { ...chats };
        delete updatedChats[chatId];
        setChats(updatedChats);
        localStorage.setItem("chats", JSON.stringify(updatedChats));

        if (Object.keys(updatedChats).length > 0) {
            setCurrentChatId(Object.keys(updatedChats)[0]);
        } else {
            setCurrentChatId(null);
        }
    };

    return (
        <div className="chat-container">
            <video autoPlay loop muted className="fullpage-video">
                <source src="/neutral.mp4" type="video/mp4" />
            </video>

            <div className="sidebar">
                <button className="sidebar-btn" onClick={startNewChat}>+ New Chat</button>
                <button className="sidebar-btn">📊 Analytics</button>
                <button className="sidebar-btn" onClick={() => setIsSettingsOpen(true)}>⚙ Settings</button>
                <div className="chat-list">
                    {Object.keys(chats).map(chatId => (
                        <div key={chatId} className={`chat-item ${chatId === currentChatId ? "active" : ""}`} onClick={() => setCurrentChatId(chatId)}>
                            <span>Chat {chatId.slice(-4)}</span>
                            <button className="delete-chat-btn" onClick={(e) => { e.stopPropagation(); deleteChat(chatId); }}>✖</button>
                        </div>
                    ))}
                </div>
            </div>

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

                <div className="chat-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message AI..."
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button onClick={handleSend} className="send-btn">➤</button>
                </div>
            </div>

            {isSettingsOpen && <SettingsPopup onClose={() => setIsSettingsOpen(false)} />}
        </div>
    );
};

export default Chatbot;
