
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Fonction utilitaire ultra-robuste pour lire les variables d'environnement
// Elle tente tous les préfixes possibles (VITE_, NEXT_PUBLIC_, REACT_APP_)
const getEnv = (key: string) => {
  const prefixes = ['VITE_', 'NEXT_PUBLIC_', 'REACT_APP_', ''];
  
  // 1. Essayer via import.meta.env (Standard Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    for (const prefix of prefixes) {
      // @ts-ignore
      const val = import.meta.env[`${prefix}${key}`];
      if (val) return val;
    }
  }
  
  // 2. Fallback pour compatibilité (Node/CRA/Vercel System Env)
  if (typeof process !== 'undefined' && process.env) {
    for (const prefix of prefixes) {
      const val = process.env[`${prefix}${key}`];
      if (val) return val;
    }
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
let auth: firebase.auth.Auth | undefined;
let db: firebase.firestore.Firestore | undefined;

// Vérification détaillée pour le débogage
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error("🔴 Erreur Configuration Firebase : Variables manquantes.");
  console.error("Il manque les clés suivantes (Vérifiez vos variables d'environnement Vercel) :", missingKeys);
  console.warn("Config actuelle (partielle) :", firebaseConfig);
} else {
  try {
      // Vérifie qu'il n'y a pas de valeurs "undefined" explicites
      if (!firebaseConfig.apiKey) throw new Error("API Key is missing/undefined");
      
      if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
      } else {
        app = firebase.app();
      }
      auth = firebase.auth();
      db = firebase.firestore();
      console.log("✅ Firebase initialisé avec succès ! Domaine:", firebaseConfig.authDomain);
  } catch (error) {
      console.error("Erreur critique d'initialisation Firebase:", error);
  }
}

export { auth, db, firebase };
