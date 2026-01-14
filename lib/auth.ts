import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  type User 
} from "firebase/auth";

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function login(email: string, pass: string) {
  return signInWithEmailAndPassword(auth, email, pass);
}

export async function logout() {
  return firebaseSignOut(auth);
}
