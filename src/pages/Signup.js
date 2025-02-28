import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../firebase"; // Firebase config
import { signInWithPopup } from "firebase/auth";
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState(""); // New state for gender
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = () => {
        if (!name || !email || !password || !confirmPassword || !gender) {
            alert("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const userData = { name, email, gender };
        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true"); // Set authentication flag
        navigate("/tutorial"); // Redirect to TutorialQuestions
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem("currentUser", JSON.stringify({ name: user.displayName, email: user.email }));
            localStorage.setItem("isAuthenticated", "true"); // Ensure authentication flag is set
            navigate("/tutorial");
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
        <div className="signup-page">
            <video autoPlay loop muted className="video-background">
                <source src="/neutral.mp4" type="video/mp4" />
            </video>

            <div className="signup-container">
                <h2>Sign Up</h2>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                {/* Gender Selection */}
                <select className="gender-box" value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

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

                <div className="password-container">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button className="signup-button" onClick={handleSignup}>Sign Up</button>

                <div className="google-signin" onClick={handleGoogleSignIn}>
                    <FcGoogle className="google-icon" />
                    <span>Sign in with Google</span>
                </div>

                <p className="login-text">
                    Already have an account? <span className="login-link" onClick={() => navigate("/login")}>Login here</span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
