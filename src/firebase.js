import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCwfZEQ0AcRQuQiJmSMt6EZ2bAwb_7x1iY",
  authDomain: "netflix-clone-ee113.firebaseapp.com",
  databaseURL: "https://netflix-clone-ee113-default-rtdb.firebaseio.com",
  projectId: "netflix-clone-ee113",
  storageBucket: "netflix-clone-ee113.appspot.com",
  messagingSenderId: "1024421897798",
  appId: "1:1024421897798:web:24bafe47c9836e22738c47",
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { auth, createUserWithEmailAndPassword };
export default db;
