// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
//import "firebase/database";

//import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDLN_5ReJd8007w6YXKe-mT9R1AwMuIpBQ",
  authDomain: "momentics-e77d9.firebaseapp.com",
  databaseURL:
    "https://momentics-e77d9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "momentics-e77d9",
  storageBucket: "momentics-e77d9.appspot.com",
  messagingSenderId: "39920194326",
  appId: "1:39920194326:web:c1421dc21312386bd3f637",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const db = firebase.database();
// Folosesc firebase 8 -- Important
export { auth, db };
