// src/components/Chat.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../config/firebaseConfig";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";
import { signOut } from "firebase/auth";
import { useAuth } from "./AuthProvider";
import './style/Chat.css';
import OnlineUsers from "./OnlineUser";

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingMessageText, setEditingMessageText] = useState("");
    const [file, setFile] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }

        const q = query(collection(db, "messages"), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages_ = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            if (messages_.length > messages.length) {
                const newMessage = messages_[messages_.length - 1];
                if (Notification.permission === 'granted') {
                  new Notification('New Message', {
                    body: 'adad',
                  });
                }
              }
            setMessages(messages_);
        });

        return () => unsubscribe();
    }, [user, navigate]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message && !file) return;

        let fileURL = null;
        if (file) {
            const storageRef = ref(storage, `files/${file.name}`);
            await uploadBytes(storageRef, file);
            fileURL = await getDownloadURL(storageRef);
            setFile(null);
        }

        await addDoc(collection(db, "messages"), {
            text: message,
            user: user.email,
            userName: user.displayName,
            createdAt: new Date(),
            fileURL,
        });
        setMessage("");
    };

    const handleDeleteMessage = async (id) => {
        await deleteDoc(doc(db, "messages", id));
    };

    const handleEditMessage = (id, text) => {
        setEditingMessageId(id);
        setEditingMessageText(text);
    };

    const handleUpdateMessage = async (id) => {
        await updateDoc(doc(db, "messages", id), {
            text: editingMessageText,
        });
        setEditingMessageId(null);
        setEditingMessageText("");
    };

    const handleSignOut = () => {
        signOut(auth);
        navigate("/");
    };

    return (
        <div className="chat-container">
            <header>
                <h1>Chat</h1>
                <button onClick={handleSignOut}>Sign Out</button>
            </header>
            <div className="chat-content">
                <div className="online-users-container">
                    <h2>Active Users</h2>
                    <OnlineUsers />
                </div>
                <div className="messages-container">
                    {messages.map((msg) => (
                        <div key={msg.id} className="message">
                            {editingMessageId === msg.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingMessageText}
                                        onChange={(e) => setEditingMessageText(e.target.value)}
                                    />
                                    <button onClick={() => handleUpdateMessage(msg.id)}>
                                        Update
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>{msg.userName || msg.user}</p> <p>{msg.text}</p>
                                    {msg.fileURL && (
                                        <div>
                                            <img src={msg.fileURL} alt="Uploaded file" />
                                            <a href={msg.fileURL} download={`downloaded_file_${Date.now()}`} target="_blank" rel="noopener noreferrer">Download</a>
                                        </div>
                                    )}
                                    <div className="message-actions">
                                        <button onClick={() => handleEditMessage(msg.id, msg.text)}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteMessage(msg.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <form className="message-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*"/>
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
