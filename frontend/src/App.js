import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; 
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TutorialQuestions from "./pages/TutorialQuestions";
import Chatbot from "./pages/Chatbot";
import UpdateData from "./pages/UpdateData";
import Analytics from "./pages/Analytics";
import AddMembers from "./pages/AddMembers";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={isAuthenticated ? "/chatbot" : "/signup"} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/tutorial" element={isAuthenticated ? <TutorialQuestions /> : <Navigate to="/login" />} />
                <Route path="/chatbot" element={isAuthenticated ? <Chatbot /> : <Navigate to="/login" />} />
                <Route path="/update-data" element={isAuthenticated ? <UpdateData /> : <Navigate to="/login" />} />
                <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
                <Route path="/add-members" element={isAuthenticated ? <AddMembers /> : <Navigate to="/login" />} /> 
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
