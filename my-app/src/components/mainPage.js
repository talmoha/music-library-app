import './App.css';
import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'
import GetTracks from './getTracks';
import GetArtists from './getArtists';
import GetAlbums from './getAlbums';
import CreateList from './createList';

function MainPage () {
  
    useEffect(() => { //automatically call at the beginning
        
    }, []); //empty dependencies array

    return (
        <div className="App">
            <div class="topnav">
                <a class="active" href="#home">Home</a>
                <div class="login-container">
                    <li class="no-bullet">
                        <a type="submit" href="/Login">Login</a>
                    </li>
                </div>
            </div>
        <h1>Music Archive</h1>
        <p>This website is for searching for music, please login from the upper right button</p>
        <form id="form" class="example">
            <GetTracks></GetTracks>
        </form>
        <form id="form1" class="example">
            <GetArtists></GetArtists>
        </form>
        <form id="form1" class="example">
            <GetAlbums></GetAlbums>
        </form>
  
        <div class="admin">
            <h2>Create List</h2>
            <CreateList></CreateList>
            <span id="status"></span>
        </div>
        <div class="space"></div>
        <div class="admin">
            <h2 class="spaceTop">Add Tracks to Existing List</h2>
            <h1 class="smaller">(Insert tracks seperated by commas)</h1>
            <span>
                Name: <input type="text" id="list-name1"/>
                Track IDs: <input type="text" id="track-id"/>
                <button id="add-list1"> Add</button>
            </span>
            <span id="status1"></span>
            <span id="status3"></span>
        </div>
        <div class="space"></div>
        <div class="admin">
            <h2>Delete List</h2>
            <span>
                Name: <input type="text" id="list-name2"/>
                <button id="delete-list"> Delete</button>
            </span>
            <span id="status2"></span>
        </div>
  
        <div class="space"></div>
        <h1>Lists</h1>
        <div id="new-div-lists"></div>
        <ul id="list">
        </ul> 
        <div id="new-div-list"></div>
        <button id="greatBtn" class="dissapear">close</button>
        <div class="space"></div>
      </div>
    );
}

export default MainPage
