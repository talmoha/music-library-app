import './App.css';
import { useEffect } from 'react';
import React, {userEffect, useState} from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom"

function Policies () {
    const {currentUser} = useAuth()
  
    useEffect(() => { //automatically call at the beginning
        //populate the policies
        getPolicies();
    }, []); //empty dependencies array

    //function to display existing lists whenever a new list is added
    function getPolicies() {
        const l = document.getElementById("list");
        //clear out the new div everytime the function is called if it is empty
        const elementsToDelete = document.getElementsByClassName("card");
        while(elementsToDelete.length > 0){
            elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
        } 
        fetch("/api/policies")
        .then(res => res.json()
        .then(data => {
            data.forEach(e => { //grab each element (e) and make a list item for it
                if (true) { 
                    const item = document.createElement('li');
                    l.appendChild(item);
                    const item1 = document.createElement('div');
                    item1.classList.add('card');
                    item.appendChild(item1);
                    const item2 = document.createElement('div');
                    item2.classList.add('container');
                    item1.appendChild(item2);
                    const item3 = document.createElement('p');
                    item3.append(document.createTextNode( `${e.name}`));
                    item2.appendChild(item3);
                    const item4 = document.createElement('p');
                    item4.appendChild(document.createTextNode( e.content))
                    item3.append(item4);
                }
        })}))
    }

    return (
        <div>
            <div className="App">
                
                <div class="topnav">
                    <a class="active" href="#home">Home</a>
                    <div class="login-container">
                    </div>
                </div>
            
            <div class="space"></div>
            <div class="admin">
                <h2>Website's Policies</h2>
                <ul id="list">
                </ul> 
            </div>
            <div class="space"></div>
            
        </div>
        <div class="bottom">
            <p>Contact admin to send any notices of infringement at <Link>kobaxip254@cnogs.com</Link></p>
        </div>
      </div>
    );
}

export default Policies
