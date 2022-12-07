import './App.css';
import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom"

function Copyright () {
    const {currentUser} = useAuth()
  
    useEffect(() => { //automatically call at the beginning
        //create each policy
        document.getElementById('create-policy').onclick = function() {
            createPolicy("Security and privacy policy", document.getElementById("copyright").value, "1")
        }
        document.getElementById('create-policy1').onclick = function() {
            createPolicy("DMCA notice & takedown policy", document.getElementById("DMCA").value, "2")
        }
        document.getElementById('create-policy2').onclick = function() {
            createPolicy("Acceptable use policy", document.getElementById("AUP").value, "3")
        }
        //to update policies
        document.getElementById('update-policy').onclick = function() {
            updatePolicy("Security and privacy policy", document.getElementById("copyright").value, "1")
        }
        document.getElementById('update-policy1').onclick = function() {
            updatePolicy("DMCA notice & takedown policy", document.getElementById("DMCA").value, "2")
        }
        document.getElementById('update-policy2').onclick = function() {
            updatePolicy("Acceptable use policy", document.getElementById("AUP").value, "3")
        }
        
    }, []); //empty dependencies array


    function createPolicy(name, value, error) {
        document.getElementById(`policyError${error}`).innerText = "";
        var content = value;
        var policyName = name;

        if (content == "") {
            document.getElementById(`policyError${error}`).innerText = `Please input text`;
        }
        else {
            fetch("/api/policies")
                .then(res => res.json()
                .then(data => {
                //check if user isnt already an edmin
                const match = data.filter(element => {
                    if (element.name == policyName) {
                    return true;
                }
                });
                //if there is a match then display error
                if (match.length > 0)
                {
                    document.getElementById(`policyError${error}`).innerText = `Policy already exists`;
                }
                else {
                    document.getElementById(`policyError${error}`).innerText = `Policy created`;
                    const newpart = {
                        name: policyName,
                        content: content
                        }
                        fetch('/api/policies', {
                            method: 'POST',
                            headers: {'Content-type': 'application/json'},
                            body: JSON.stringify(newpart)
                        })
                        .then(res => {
                            if (res.ok) {
                                res.json()
                            }
                        })
                        .catch()
                }
            }))
        }
    }

    function updatePolicy(name, value, error) {
        document.getElementById(`policyError${error}`).innerText = "";
        var content = value;
        var policyName = name;

        if (content == "") {
            document.getElementById(`policyError${error}`).innerText = `Please input text`;
        }
        else {
            fetch(`/api/policies`)
                .then(res => res.json()
                .then(data => {
                //check if user isnt already an edmin
                const match = data.filter(element => {
                    if (element.name == policyName) {
                    return true;
                }
                });
                //if there is a match then display error
                if (match.length == 0)
                {
                    document.getElementById(`policyError${error}`).innerText = `Policy doesn't exist`;
                }
                else {
                    document.getElementById(`policyError${error}`).innerText = `Policy updated`;
                    const newpart = {
                        name: policyName,
                        content: content
                        }
                        fetch(`/api/policies/${match[0].name}`, {
                            method: 'POST',
                            headers: {'Content-type': 'application/json'},
                            body: JSON.stringify(newpart)
                        })
                        .then(res => {
                            if (res.ok) {
                                res.json()
                            }
                        })
                        .catch()
                }
            }))
        }
    }

    return (
        <div className="App">
            
            <div class="topnav">
                <a class="active" href="#home">Home</a>
                <div class="login-container">
                    <li class="no-bullet">
                        <a type="submit" href="/admin">Back</a>
                    </li>
                </div>
                <div class="login-container">
                    <li class="no-bullet">
                        <a type="submit" href="/Login">Website</a>
                    </li>
                </div>
                <div class="login-container">
                    <li class="no-bullet">
                        <a>Welcome Administrator</a>
                        <a type="submit" href="/signin" onClick={currentUser.email == ""}>Sign out</a>
                    </li>
                </div>
            </div>
        
        <div class="space"></div>
        <div class="admin">
            <h2>Policies</h2>
            <span>
                Security and privacy policy: <br></br>
                <textarea id="copyright" name="w3review" rows="4" cols="50"></textarea>
                <br></br>
                <button id="create-policy"> Create </button><button id="update-policy"> Update </button><br></br>
            </span>
            <span id="policyError1"></span><br></br>

            <span>
                DMCA notice & takedown policy: <br></br>
                <textarea id="DMCA" name="w3review" rows="4" cols="50"></textarea>
                <br></br>
                <button id="create-policy1"> Create </button><button id="update-policy1"> Update </button><br></br>
            </span>
            <span id="policyError2"></span><br></br>

            <span>
                Acceptable use policy: <br></br>
                <textarea id="AUP" name="w3review" rows="4" cols="50"></textarea>
                <br></br>
                <button id="create-policy2"> Create </button><button id="update-policy2"> Update </button><br></br>
            </span>
            <span id="policyError3"></span>

            <span>
                Acceptable use policy: <br></br>
                <textarea id="AUP" name="w3review" rows="4" cols="50"></textarea>
                <br></br>
                <button id="create-policy2"> Create </button><button id="update-policy2"> Update </button><br></br>
            </span>
            <span id="policyError3"></span>

        </div>
        <div class="space"></div>
        <Link to="/policies">View Policies</Link>
      </div>
    );
}

export default Copyright
