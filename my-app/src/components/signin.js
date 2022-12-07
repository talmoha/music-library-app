import './App.css';
import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, currentUser } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
    
        try {
          setError("")
          setLoading(true)
          await login(emailRef.current.value, passwordRef.current.value)
          //checkUser(emailRef.current.value); // to verify if user verified email
          //check if user is deleted 
          deleteUserCheck(emailRef.current.value); // to verify if user verified email
        } catch (error){
          setError("Failed to sign in")
        }
    
        setLoading(false)
    }

    //checks if user is in database
    function deleteUserCheck(email) {
      fetch(`/api/delete`)
      .then(res => res.json()
      .then(data => {
          //check name for each list element name
          const match = data.filter(element => {
              if (element.email == email) {
              return true;
              }
          });
          if (match.length == 0) {
            checkUser(emailRef.current.value); // to verify if user verified email
          } else if (match.length > 0) { //if user autenticated but not yet added to list
            console.log("delete user")
            setError("Deactivated account, contact admin for help: kobaxip254@cnogs.com")
          }
      }))
    }

    //delete user
    function deleteUser(email) {
      const newpart = {
        email: emailRef.current.value,
      }
      fetch('/api/delete', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newpart)
      })
      .then(console.log("deleted user"))
      .catch()

      }

    //checks if user is in database
    function checkUser(email) {
      fetch(`/api/users`)
      .then(res => res.json()
      .then(data => {
          //check name for each list element name
          const match = data.filter(element => {
              if (element.email == email) {
              return true;
              }
          });
          if (match.length > 0) {
            if (emailRef.current.value == "kobaxip254@cnogs.com") {
              history("/admin")
            } else {
              history("/Login")
            }
          } else if (currentUser.emailVerified && match.length == 0) { //if user autenticated but not yet added to list
            console.log("add user")
            history("/Login")
            //use post 
            const newpart = {
              email: currentUser.email,
            }
            fetch('/api/users', {
              method: 'POST',
              headers: {'Content-type': 'application/json'},
              body: JSON.stringify(newpart)
            })
            .then(console.log("yay"))
            .catch()

          } else {
            document.getElementById("visible").style.display = "block";
            setError("Not verified")
          }
      }))
  }


    //the code for the sign up form was taken from the snipped of https://www.youtube.com/watch?v=PKwu15ldZ7k&t=1
  return (
    <>
    <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign In</h2>
          {currentUser.email}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="visibility w-100 text-center mt-2" id="visible">
      Resend verification? <Link to="/verify">Verify</Link>
    </div>
      <div className="w-100 text-center mt-2">
      Need an account? <Link to="/register">Sign Up</Link>
    </div>
    </>
  )
}
