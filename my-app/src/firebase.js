import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import 'firebase/firestore';

const app = firebase.initializeApp({
    apiKey: "AIzaSyDxYAx3zrEI7E7XGbAZkKRAeBURJai-8S0",
    authDomain: "lab4-3c867.firebaseapp.com",
    projectId: "lab4-3c867",
    storageBucket: "lab4-3c867.appspot.com",
    messagingSenderId: "42539710328",
    appId: "1:42539710328:web:bf5c3033b7383e846f3a8d"

})

export const auth = app.auth()
export default app