import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Fonction utilitaire pour lire les variables d'environnement
// Vercel/Vite ne transmettent au navigateur que les variables commençant par VITE_
const getEnv = (key: string) => {
  // 1. Essayer via import.meta.env (Standard Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    const val = import.meta.env[`VITE_${key}`] || import.meta.env[key];
    if (val) return val;
  }
  
  // 2. Fallback pour compatibilité (Node/CRA)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[`VITE_${key}`] || process.env[`REACT_APP_${key}`] || process.env[key];
  }
  
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnv('FIREBASE_API_KEY'),
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('FIREBASE_APP_ID')
};

let app;
let auth;
let db;

// Vérification détaillée pour le débogage
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error("🔴 Erreur Configuration Firebase : Variables manquantes.");
  console.error("Il manque les clés suivantes (assurez-vous qu'elles commencent par VITE_ dans Vercel) :", missingKeys);
  console.warn("Config actuelle (partielle) :", firebaseConfig);
} else {
  try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log("✅ Firebase initialisé avec succès sur :", firebaseConfig.authDomain);
  } catch (error) {
      console.error("Erreur d'initialisation Firebase:", error);
  }
}

export { auth, db };