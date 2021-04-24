import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCOCKFgLXlJkyuUBPyhS-lhI-u7I1AOJsw",
    authDomain: "techjobs-46b44.firebaseapp.com",
    databaseURL: "https://techjobs-46b44.firebaseio.com",
    projectId: "techjobs-46b44",
    storageBucket: "techjobs-46b44.appspot.com",
    messagingSenderId: "1032749279364",
    appId: "1:1032749279364:web:8e9b3b52850e9e24697ad1",
    measurementId: "G-4HR24WCXW9"
};

try {
    firebase.initializeApp(firebaseConfig);
} catch (err) {
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack);
    }
}

const fire = firebase;
export default fire;
