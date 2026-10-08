import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { createUserPrefs, getUserPrefs } from '../services/firestore';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setPrefs(null);
      setLoading(false);
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        let p = await getUserPrefs(u.uid);
        if (!p) {
          await createUserPrefs(u.uid, u.email, u.displayName || 'User');
          p = { darkMode: false, accessibilityMode: false, favourites: [] };
        }
        setPrefs(p);
      } else {
        setPrefs(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = (email, password) => {
    if (!auth) {
      return Promise.reject(new Error('Firebase authentication is not configured. Add the Firebase environment variables first.'));
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password, name) => {
    if (!auth) {
      throw new Error('Firebase authentication is not configured. Add the Firebase environment variables first.');
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await createUserPrefs(cred.user.uid, email, name);
    return cred;
  };

  const loginWithGoogle = () => {
    if (!auth || !googleProvider) {
      return Promise.reject(new Error('Google sign-in is unavailable because Firebase is not configured.'));
    }
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => (auth ? signOut(auth) : Promise.resolve());

  const isAdmin = user?.email === 'admin@example.com';

  const refreshPrefs = async () => {
    if (user && auth) {
      const p = await getUserPrefs(user.uid);
      setPrefs(p);
    }
  };

  return (
    <AuthContext.Provider value={{ user, prefs, loading, login, signup, loginWithGoogle, logout, isAdmin, refreshPrefs }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
