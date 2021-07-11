// import firebase from "firebase";
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB2q_riOU5lwf7U8VygUZAQiosnzaNSRNU",
  authDomain: "docs-clone-122e5.firebaseapp.com",
  projectId: "docs-clone-122e5",
  storageBucket: "docs-clone-122e5.appspot.com",
  messagingSenderId: "269416785424",
  appId: "1:269416785424:web:91c1f2cca4a51897bf0c95",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

// access db
const db = app.firestore();

export { db };
