import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase" //auth function from firebase js file 

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

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
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
    login
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}