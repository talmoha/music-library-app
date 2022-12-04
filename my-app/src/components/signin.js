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
          if (currentUser.emailVerified) {
            console.log(currentUser.emailVerified)
            history("/Login")
          } else if (currentUser.emailVerified == false){
            console.log(currentUser.emailVerified)
            document.getElementById("visible").style.display = "block";
            setError("Not verified")
            window.location.reload(false);
          }
        } catch (error){
          setError("Failed to sign in")
        }
    
        setLoading(false)
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
