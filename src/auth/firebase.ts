import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Load config from Vite env
const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = import.meta.env as Record<string, string | undefined>;
const { VITE_FIREBASE_MEASUREMENT_ID } = import.meta.env as Record<string, string | undefined>;

function ensure(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing env: ${name}. Create .env.local from .env.example`);
  }
  return value;
}

const firebaseConfig = {
  apiKey: ensure("VITE_FIREBASE_API_KEY", VITE_FIREBASE_API_KEY),
  authDomain: ensure("VITE_FIREBASE_AUTH_DOMAIN", VITE_FIREBASE_AUTH_DOMAIN),
  projectId: ensure("VITE_FIREBASE_PROJECT_ID", VITE_FIREBASE_PROJECT_ID),
  storageBucket: ensure("VITE_FIREBASE_STORAGE_BUCKET", VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: ensure(
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    VITE_FIREBASE_MESSAGING_SENDER_ID
  ),
  appId: ensure("VITE_FIREBASE_APP_ID", VITE_FIREBASE_APP_ID),
  // Opcional: necessário para Analytics
  ...(VITE_FIREBASE_MEASUREMENT_ID ? { measurementId: VITE_FIREBASE_MEASUREMENT_ID } : {}),
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Inicialização opcional do Analytics no cliente
export async function initAnalytics() {
  if (typeof window === "undefined") return;
  if (!VITE_FIREBASE_MEASUREMENT_ID) return;
  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    if (await isSupported()) {
      getAnalytics(app);
    }
  } catch (e) {
    // Ignora falhas de analytics para não impactar a aplicação
    console.warn("Firebase Analytics não inicializado:", (e as any)?.message ?? e);
  }
}

// Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Helpers
async function signInWithProvider(provider: GoogleAuthProvider | GithubAuthProvider) {
  try {
    await signInWithPopup(auth, provider);
  } catch (e: any) {
    const code = e?.code as string | undefined;
    if (code === "auth/popup-blocked") {
      // fallback automático para redirect quando popup é bloqueado pelo navegador
      await signInWithRedirect(auth, provider);
      return;
    }
    throw e;
  }
}

export const loginWithGoogle = () => signInWithProvider(googleProvider);
export const loginWithGithub = () => signInWithProvider(githubProvider);
export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
