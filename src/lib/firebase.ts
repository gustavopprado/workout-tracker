import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
export const auth = getAuth(app)

// ─────────────────────────────────────────────
// Auth — login anônimo automático
// ─────────────────────────────────────────────
export function initAuth(): Promise<string> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user.uid)
      } else {
        const cred = await signInAnonymously(auth)
        resolve(cred.user.uid)
      }
    })
  })
}

// ─────────────────────────────────────────────
// Estrutura Firestore:
//
// workouts/
//   {uid}/
//     sessions/
//       {week}_{day}/          ex: "3_Seg"
//         exercises: [
//           [                  índice = exercício
//             { kg, reps },    série 1
//             { kg, reps },    série 2
//             { kg, reps },    série 3
//           ]
//         ]
//         completedAt: timestamp | null
// ─────────────────────────────────────────────

type Serie = { kg: string; reps: string }
type SessionData = {
  exercises: Serie[][]
  completedAt: string | null
}

function sessionId(week: number, day: string) {
  return `${week}_${day}`
}

export async function loadSession(
  uid: string,
  week: number,
  day: string
): Promise<SessionData | null> {
  const ref = doc(db, 'workouts', uid, 'sessions', sessionId(week, day))
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as SessionData) : null
}

export async function saveSession(
  uid: string,
  week: number,
  day: string,
  data: SessionData
): Promise<void> {
  const ref = doc(db, 'workouts', uid, 'sessions', sessionId(week, day))
  // Only save exercises — never overwrite completedAt set by markSessionComplete
  await setDoc(ref, { exercises: data.exercises }, { merge: true })
}

export async function markSessionComplete(
  uid: string,
  week: number,
  day: string,
  exercises: Serie[][]
): Promise<void> {
  const ref = doc(db, 'workouts', uid, 'sessions', sessionId(week, day))
  await setDoc(ref, {
    exercises,
    completedAt: new Date().toISOString(),
  })
}

export async function loadAllWeekSessions(
  uid: string,
  week: number
): Promise<Record<string, SessionData>> {
  const colRef = collection(db, 'workouts', uid, 'sessions')
  const snap = await getDocs(colRef)
  const result: Record<string, SessionData> = {}
  snap.forEach((d) => {
    if (d.id.startsWith(`${week}_`)) {
      const day = d.id.replace(`${week}_`, '')
      result[day] = d.data() as SessionData
    }
  })
  return result
}
