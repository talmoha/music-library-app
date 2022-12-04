import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Verify() {

    const { signup, currentUser } = useAuth()
    const { verify } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useNavigate()
    const [message, setMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
    
        try {
          setMessage("")
          setError("")
          setLoading(true)
          await verify();
          setMessage("Check your inbox for verification")
        } catch (error){
          setError(error+ " Already sent email")
        }
    
        setLoading(false)
    }


    //the code for the sign up form was taken from the snipped of https://www.youtube.com/watch?v=PKwu15ldZ7k&t=1
  return (
    <>
    <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
                <Form.Label>You need to verify your email: {currentUser && currentUser.email}</Form.Label>
                <Button disabled={loading} className="w-100" type="submit">
                    Send email verification
                </Button>
          </Form>
        </Card.Body>
        <Button disabled={loading} className="w-50" href="/signin">
                Back to Sign in
          </Button>
      </Card>

    </>
  )
}
