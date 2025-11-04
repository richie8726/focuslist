// src/firebase.js
// Rellena con tu config de Firebase. Si no querés usar Firebase,
// dejá este archivo con la plantilla y la app seguirá funcionando localmente.

import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

let db = null;
let auth = null;
let unsub = null;
let userUid = null;

export function initFirebase() {
  // Reemplazá los valores por los de tu proyecto
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    // ...
  };

  if (!getApps().length) {
    try {
      initializeApp(firebaseConfig);
      auth = getAuth();
      db = getFirestore();
    } catch (e) {
      console.warn("Firebase init error (check config):", e);
    }
  } else {
    // ya inicializado
  }
}

export async function enableCloudSync() {
  if (!auth) throw new Error("Firebase no inicializado. Revisá src/firebase.js");
  const res = await signInAnonymously(auth);
  userUid = res.user.uid;
  return userUid;
}

export function disableCloudSync() {
  if (unsub) {
    unsub();
    unsub = null;
  }
  userUid = null;
}

export async function startCloudSync(setTasksLocal) {
  if (!db || !auth) {
    console.warn("Firebase no inicializado o no autenticado.");
    return;
  }
  if (!userUid) {
    try {
      await enableCloudSync();
    } catch (e) {
      console.warn("anonymous sign-in failed:", e);
      return;
    }
  }
  const tasksCol = collection(db, "users", userUid, "tasks");
  // listener: cuando cambian los docs sincroniza localmente
  unsub = onSnapshot(tasksCol, (snapshot) => {
    const arr = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      arr.push({ id: docSnap.id, ...data });
    });
    // orden simple: fecha creación desc
    arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setTasksLocal(arr);
  });
}

export function stopCloudSync() {
  if (unsub) {
    unsub();
    unsub = null;
  }
}

// push tasks completos (overwrite simple approach)
export async function pushTasksToCloud(tasks) {
  if (!db || !userUid) return;
  const batchPromises = tasks.map((t) =>
    setDoc(doc(db, "users", userUid, "tasks", t.id), t)
  );
  await Promise.all(batchPromises);
}
