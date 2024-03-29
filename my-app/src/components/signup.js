import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Signup() {
    const emailRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, currentUser } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
    
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match")
        }
    
        try {
          setError("")
          setLoading(true)
          await signup(emailRef.current.value, passwordRef.current.value)
          addUser(usernameRef.current.value, emailRef.current.value);
          history("/verify")
        } catch {
          setError("Failed to create an account")
        }
    
        setLoading(false)
    }

    //add user to backend database for unauthenticated users
    function addUser(username, email) {
      const newpart = {
        username: username,
        email: email,
      }
      fetch('/api/register', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newpart)
      })
      .then()
      .catch()
  }


    //the code for the sign up form was taken from the snipped of https://www.youtube.com/watch?v=PKwu15ldZ7k&t=1
  return (
    <>
    <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={usernameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
      Already have an account? <Link to="/signin">Log In</Link>
    </div>
    </>
  )
}
