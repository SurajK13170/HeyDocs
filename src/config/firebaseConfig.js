import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, onMessage, getToken } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyDJ6CMafNt8VuGAZHamk5wVgGNIprtCXwQ",
    authDomain: "heydocs-94331.firebaseapp.com",
    projectId: "heydocs-94331",
    storageBucket: "heydocs-94331.appspot.com",
    messagingSenderId: "1024095107551",
    appId: "1:1024095107551:web:579c53f508a815914eec6a",
    measurementId: "G-4PVGR9LVPZ"

  };

  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon,
    };

    new Notification(notificationTitle, notificationOptions);
});

const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");
            const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });

            if(token){
                console.log("FCM Token:", token);
            }else{
                console.log("Failed to get token.");
            }
        } else {
            console.log("Unable to get permission to notify.");
        }
    } catch (error) {
        console.error("Error getting notification permission:", error);
    }
};

// Track user online status
const updateUserStatus = (uid, status) => {
    setDoc(doc(db, "users", uid), {
        status,
        lastChanged: serverTimestamp(),
    }, { merge: true });
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        updateUserStatus(user.uid, 'online');
        window.addEventListener('beforeunload', () => updateUserStatus(user.uid, 'offline'));
        window.addEventListener('unload', () => updateUserStatus(user.uid, 'offline'));
    } else {
        // User is signed out
        if (user) {
            updateUserStatus(user.uid, 'offline');
        }
    }
});

export { auth, googleProvider, facebookProvider, db, storage, requestNotificationPermission };