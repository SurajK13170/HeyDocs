// src/components/Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider, db } from "../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import './style/Auth.css';


const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile with the name
            await updateProfile(user, { displayName: name });

            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name,
                email,
                createdAt: new Date()
            });
            navigate("/");

            // For example: window.location.href = "/chat";
        } catch (error) {
            setError("Failed to register. Please try again.");
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Store additional user data in Firestore if needed
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                createdAt: new Date()
            });
            navigate("/chat");
        } catch (error) {
            setError("Failed to register with Google.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleEmailRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button type="submit">Register with Email</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <div className="auth-buttons">
                <button onClick={handleGoogleRegister}>Register with Google</button>
            </div>
        </div>
    );
};

export default Register;
