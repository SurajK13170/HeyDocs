import React, { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";


const OnlineUsers = ({ selectUser }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let usersArray = [];
            querySnapshot.forEach((doc) => {
                usersArray.push({ ...doc.data(), id: doc.id });
            });
            setOnlineUsers(usersArray);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="online-users-container">
            {onlineUsers.map((user) => (
                <div key={user.id} className="user-item" >
                    <h3 style={{color:"red"}}>{user.name}</h3>
                </div>
            ))}
        </div>
    );
};

export default OnlineUsers;
