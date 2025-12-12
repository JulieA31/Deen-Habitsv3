import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration dynamique via les variables d'environnement (Vercel)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

let app;
let auth;
let db;

try {
    // Vérification basique pour voir si les clés sont présentes
    if (!firebaseConfig.apiKey) {
      console.warn("Les clés Firebase ne sont pas configurées dans les variables d'environnement.");
    } else {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
    }
} catch (error) {
    console.error("Erreur d'initialisation Firebase:", error);
}

export { auth, db };