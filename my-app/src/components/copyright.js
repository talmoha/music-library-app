import './App.css';
import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom"
import PDF from './DMCA.pdf'

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
        //for hiding a review 
        document.getElementById('change-review').onclick = function() {
            checkList()
        }
        //for unhiding a review
        document.getElementById('change-review1').onclick = function() {
            checkList1()
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

    //checking if list name does not exist when deleting a review from a list
    function checkList() {
        document.getElementById("statusError").innerText = "";
        var newList1 = document.getElementById('list-name-change').value;
        var review = document.getElementById('review-author').value;
        review = review.toLowerCase();

        fetch("/api/lists")
        .then(res => res.json()
        .then(data => {
            //check name for each list element name
            const match = data.filter(element => {
                if (element.name.toLowerCase() == newList1.toLowerCase()) {
                return true;
                }
            });

            //if there is no match, then call addList function, if there is a match, then display error
            if (match.length == 0)
            {
                document.getElementById("statusError").innerText = `List doesn't exist`;
                console.log(`List doesn't exist`)
            }
            else if (!match[0].comment.includes(review.toLowerCase())){
                document.getElementById("statusError").innerText = "List doesn't have review from this user";
                
            } else {
                var commentByAuthor = match[0].comment; //get the comment from that author and remove it from the rest of the comments, store in in deleted comments database
                var authorLength = ` -${review}`
                var mySubString = commentByAuthor.substring(
                    commentByAuthor.indexOf(`\n - From: ${review}`), 
                    commentByAuthor.lastIndexOf(` -${review}`) + authorLength.length,
                );
                commentByAuthor = commentByAuthor.replace(mySubString, "");
                document.getElementById("statusError").innerText = "Deleted " + mySubString;

                const newpart = { //sending json in req body
                    name: match[0].name,
                    id: match[0].id,
                    tracks: match[0].tracks,
                    creator: match[0].creator,
                    lastModified: match[0].lastModified,
                    rating: match[0].rating,
                    status: match[0].status,
                    description: match[0].status,
                    comment: commentByAuthor
                }

                //delete that comment from the lists comment
                fetch(`/api/lists/${match[0].name}`, { //use post for match
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

                //add to hidden reviews
                const newpart1 = { //sending json in req body
                    listName: match[0].name,
                    userName: review,
                    review: mySubString
                }
                fetch(`/api/unhide`, { //use post for match
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify(newpart1)
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

    //checking if list name does not exist when adding review to list
    function checkList1() {
        document.getElementById("statusError1").innerText = "";
        var newList1 = document.getElementById('list-name-change1').value;
        var review = document.getElementById('review-author1').value;
        review = review.toLowerCase();

        fetch("/api/unhide")
        .then(res => res.json()
        .then(data => {
            //check name for each list element name
            const match = data.filter(element => { //match to the hidden reviews
                if (element.listName.toLowerCase() == newList1.toLowerCase() && element.userName.toLowerCase() == review) {
                return true;
                }
            });

            //if there is no match, then call addList function, if there is a match, then display error
            if (match.length == 0)
            {
                document.getElementById("statusError1").innerText = `Unhidden review doesn't exist`;
            }
            else if (match.length > 0) {
                document.getElementById("statusError1").innerText = `Review is unhidden`;
                fetch("/api/lists")
                .then(res => res.json()
                .then(data => {
                    //check name for each list element name
                    const match1 = data.filter(element => { //match of the hidden review to the lists
                        if (element.name.toLowerCase() == newList1.toLowerCase()) {
                        return true;
                        }
                    });

                    //if there is no match, then then display error
                    if (match1.length == 0)
                    {
                        document.getElementById("statusError1").innerText = `Error`;
                    }
                    else {
                        const newpart = { //sending json in req body
                            name: match1[0].name,
                            id: match1[0].id,
                            tracks: match1[0].tracks,
                            creator: match1[0].creator,
                            lastModified: match1[0].lastModified,
                            rating: match1[0].rating,
                            status: match1[0].status,
                            description: match1[0].status,
                            comment: match1[0].comment + match[0].review //adding back the review to the lists reviews
                        }

                        //add back that comment from the lists comment
                        fetch(`/api/lists/${match1[0].name}`, { //use post for match
                            method: 'POST',
                            headers: {'Content-type': 'application/json'},
                            body: JSON.stringify(newpart)
                        })
                        .then(res => {
                            if (res.ok) {
                                res.json()
                                console.log("ok")
                            }
                        })
                        .catch()
                    }
                }))
                const newpart2 = { //sending json in req body
                    userName: match[0].userName,
                    listName: match[0].listName,
                }
                //delete it from hidden reviews
                fetch(`/api/unhide/`, {
                        method: 'DELETE',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify(newpart2)
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

            <div class="space"></div>
            <div class="space"></div>
            <a href={PDF}>Workflow and usage of tools</a>
            <div class="space"></div>
            <h2>Record takedown request</h2>
            <div class="space"></div>
            <span>
                Username:<input type="text"/>
                Date: <input type="text"/>
                Content Details: <input type="text"/>
                <button> Ok </button><br></br>
            </span>
            <div class="space"></div>
            <h2>Record infringement notices</h2>
            <div class="space"></div>
            <span>
                Username:<input type="text"/>
                Date: <input type="text"/>
                Content Details: <input type="text"/>
                <button> Ok </button><br></br>
            </span>
            <div class="space"></div>
            <h2>Record dispute claims</h2>
            <div class="space"></div>
            <span>
                Username:<input type="text"/>
                Date: <input type="text"/>
                Content Details: <input type="text"/>
                <button> Ok </button><br></br>
            </span>

            <div class="space"></div>
            <h2>Hide a Review</h2>
            <span>
                List Name:
                <input type="text" id="list-name-change"/>Comment's author (username): 
                <input type="text" id="review-author"/>
                <button id="change-review"> Ok </button>
            </span>
            <span id="statusError"></span>

            <h2>Unhide a Review</h2>
            <span>
                List Name:
                <input type="text" id="list-name-change1"/>
                Comment's author (username): 
                <input type="text" id="review-author1"/>
                <button id="change-review1"> Ok </button>
            </span>
            <span id="statusError1"></span>
        </div>
        
        <div class="space"></div>
        <Link to="/policies">View Policies</Link>
      </div>
    );
}

export default Copyright
