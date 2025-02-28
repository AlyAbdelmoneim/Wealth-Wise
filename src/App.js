import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TutorialQuestions from "./pages/TutorialQuestions";


const App = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={isAuthenticated ? "/chatbot" : "/signup"} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/tutorial" element={isAuthenticated ? <TutorialQuestions /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
