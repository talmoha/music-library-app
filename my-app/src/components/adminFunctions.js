import './App.css';
import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'
import { useAuth } from '../contexts/AuthContext';

function AdminFunc() {
    const {currentUser} = useAuth()
    
    useEffect(() => {
        //for hiding a review 
        document.getElementById('change-review').onclick = function() {
            checkList()
        }
        //for unhiding a review
        document.getElementById('change-review1').onclick = function() {
            checkList1()
        }
        //adding admin
        document.getElementById('add-admin').onclick = function() {
            checkList2()
        }
        //deactiviating user
        document.getElementById('deactivate').onclick = function() {
            //checkList3()
        }
        //reactivating user
        document.getElementById('reactivate').onclick = function() {
            //checkList4()
        }
    }, [])
    

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
                        console.log("ok")
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

    //adding user as admin
    function checkList2() {
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
                        console.log("ok")
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
  
    useEffect(() => { //automatically call at the beginning
        
    }, []); //empty dependencies array

    return (
        <div className="App">
      </div>
    );
}

export default AdminFunc
