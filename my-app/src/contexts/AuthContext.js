import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase" //auth function from firebase js file 
import { sendEmailVerification } from "firebase/auth"; 
import jwt_decode from 'jwt-decode'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState() //setting the state to the current user, with it being no user by default
  const [loading, setLoading] = useState(true) //by default loading

  function signup(email, password) { //signs up users, returns a promise to use in the sign ups page
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) { //signs in user using email and password
    function check() {
          currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          // Send token to your backend via HTTPS
          jwt_decode(idToken.email)
        }).catch(function(error) {
          // Handle error
        });
    }
    return auth.signInWithEmailAndPassword(email, password), check();
  }

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://www.example.com/finishSignUp?cartId=1234',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    },
    dynamicLinkDomain: 'example.page.link'
  };

  function verify() {
    return sendEmailVerification(currentUser);
  }

  function resetPassword(email) {//resets password using email
    return auth.sendPasswordResetEmail(email)
  }

  useEffect(() => { //stops listenings when settting user
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    resetPassword,
    verify
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}