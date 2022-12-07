import './App.css';
import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'
import GetTracks from './getTracks';
import GetArtists from './getArtists';
import GetAlbums from './getAlbums';
import CreateListAuth from './createListAuth';
import { useAuth } from '../contexts/AuthContext';
import AdminFunc from './adminFunctions';

function Admin () {
    const {currentUser} = useAuth()
  
    useEffect(() => { //automatically call at the beginning
        
    }, []); //empty dependencies array

    return (
        <div className="App">
            
            <div class="topnav">
                <a class="active" href="#home">Home</a>
                <div class="login-container">
                    <li class="no-bullet">
                        <a>Welcome Administrator</a>
                        <a type="submit" href="/signin" onClick={currentUser.email == ""}>Sign out</a>
                    </li>
                </div>
            </div>
        
        <div class="space"></div>
        <div class="admin">
            <h2>Hide a Review</h2>
            <span>
                List Name: <br></br>
                <input type="text" id="list-name-change"/>
                <br></br>Comment's author (username): 
                <br></br>
                <input type="text" id="review-author"/>
                <br></br>
                <button id="change-review"> Ok </button><br></br>
            </span>
            <span id="statusError"></span>

            <h2>Unhide a Review</h2>
            <span>
                List Name: <br></br>
                <input type="text" id="list-name-change1"/>
                <br></br>Comment's author (username): 
                <br></br>
                <input type="text" id="review-author1"/>
                <br></br>
                <button id="change-review1"> Ok </button><br></br>
            </span>
            <span id="statusError1"></span>

            <h2>Give Admin Previlige</h2>
            <span>
                User email: <br></br>
                <input type="text" id="admin-email"/>
                <br></br>Username: 
                <br></br>
                <input type="text" id="admin-username"/>
                <br></br>
                <button id="add-admin"> Ok </button><br></br>
            </span>
            <span id="statusError2"></span>

            <h2>Deactivate User</h2>
            <span>
                User email: <br></br>
                <input type="text" id="deactivate-email"/>
                <br></br>Username: 
                <br></br>
                <input type="text" id="deactivate-username"/>
                <br></br>
                <button id="deactivate"> Ok </button><br></br>
            </span>
            <span id="statusError2"></span>

            <h2>Reactivate User</h2>
            <span>
                User email: <br></br>
                <input type="text" id="reactivate-email"/>
                <br></br>Username: 
                <br></br>
                <input type="text" id="reactivate-username"/>
                <br></br>
                <button id="reactivate"> Ok </button><br></br>
            </span>
            <span id="statusError2"></span>
        </div><AdminFunc></AdminFunc>
        <div class="space"></div>
      </div>
    );
}

export default Admin
