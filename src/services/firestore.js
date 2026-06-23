import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove,
  collection, query, orderBy, limit, onSnapshot,
  addDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ── User preferences ────────────────────────────────────────────────────────

export const getUserPrefs = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const createUserPrefs = (uid, email, displayName) =>
  setDoc(doc(db, 'users', uid), {
    email, displayName,
    darkMode: false,
    accessibilityMode: false,
    favourites: [],
  }, { merge: true });

export const updateUserPrefs = (uid, data) =>
  updateDoc(doc(db, 'users', uid), data);

export const addFavourite = (uid, locationId) =>
  updateDoc(doc(db, 'users', uid), { favourites: arrayUnion(locationId) });

export const removeFavourite = (uid, locationId) =>
  updateDoc(doc(db, 'users', uid), { favourites: arrayRemove(locationId) });

// ── Announcements ────────────────────────────────────────────────────────────

export const subscribeAnnouncements = (callback) => {
  const q = query(
    collection(db, 'announcements'),
    orderBy('timestamp', 'desc'),
    limit(10)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const addAnnouncement = (title, body, priority = 'normal') =>
  addDoc(collection(db, 'announcements'), {
    title, body, priority,
    timestamp: serverTimestamp(),
  });

export const deleteAnnouncement = (id) =>
  deleteDoc(doc(db, 'announcements', id));
