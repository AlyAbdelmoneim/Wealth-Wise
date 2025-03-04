import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../firebase"; // Firebase config
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login Error:", error);
            setError("Invalid email or password. Please try again.");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate("/dashboard");
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button className="login-button" onClick={handleLogin}>Login</button>

                <div className="google-signin" onClick={handleGoogleSignIn}>
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
