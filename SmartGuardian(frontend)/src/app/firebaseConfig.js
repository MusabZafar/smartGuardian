import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCYaAzFfg0uNRLgNP0w0NWCKu5jWJOqPkY",
    authDomain: "fir-react-firebase-b381b.firebaseapp.com",
    databaseURL: "https://fir-react-firebase-b381b-default-rtdb.firebaseio.com",
    projectId: "fir-react-firebase-b381b",
    storageBucket: "fir-react-firebase-b381b.appspot.com",
    messagingSenderId: "650253739339",
    appId: "1:650253739339:web:bd5541ca4e83543148b4ce",
    measurementId: "G-VGP0V897XJ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

// Function to create or update user document
const createOrUpdateUserDocument = async (username, userData) => {
  try {
    const userDocRef = doc(firestore, 'users', username);
    
    await setDoc(userDocRef, {
      profileData: {
        ...userData,
        lastUpdated: serverTimestamp()
      }
    }, { merge: true });

    console.log(`User document for ${username} created/updated successfully`);
  } catch (error) {
    console.error("Error creating/updating user document:", error);
  }
};

export { 
  app, 
  storage, 
  firestore,
  createOrUpdateUserDocument 
};