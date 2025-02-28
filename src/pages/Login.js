import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase"; // Firebase config
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem("currentUser"));

        if (storedUser && storedUser.email === email) {
            localStorage.setItem("isAuthenticated", "true");
            navigate("/chatbot");
        } else {
            alert("Invalid credentials! Please try again.");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem("currentUser", JSON.stringify({ name: user.displayName, email: user.email }));
            localStorage.setItem("isAuthenticated", "true");
            navigate("/chatbot");
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
        <div className="login-page">
            <video autoPlay loop muted className="video-background">
                <source src="/neutral.mp4" type="video/mp4" />
            </video>

            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button className="login-btn" type="submit">Login</button>
                </form>

                <div className="google-login" onClick={handleGoogleSignIn}>
                    <FcGoogle className="google-icon" />
                    <span>Sign in with Google</span>
                </div>

                <p className="signup-text">
                    Don't have an account? <span className="signup-link" onClick={() => navigate("/signup")}>Sign up here</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
