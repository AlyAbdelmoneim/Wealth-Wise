import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const Chatbot = () => {
    const [chats, setChats] = useState({});
    const [currentChatId, setCurrentChatId] = useState(null);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [userEmail, setUserEmail] = useState("");

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

    return (
        <div className="chat-container">
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

            <div className="chatbot">
                <div className="chat-header">AI Financial Assistant</div>
                {!userEmail ? (
                    <div className="email-input">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <button onClick={() => setUserEmail(userEmail.trim())}>Set Email</button>
                    </div>
                ) : (
                    <>
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
                            />
                            <button onClick={handleSend} className="send-btn">➤</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chatbot;
