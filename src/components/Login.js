// src/components/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebaseConfig";
import './style/Auth.css';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/chat");
        } catch (error) {
            setError("Failed to log in. Please check your email and password.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/chat");
            window.location="/chat";
        } catch (error) {
            setError("Failed to log in with Google.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleEmailLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login with Email</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <div className="auth-buttons">
                <button onClick={handleGoogleLogin}>Login with Google</button>
            </div>
        </div>
    );
};

export default Login;
