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
                        <a type="submit" href="/signin">Login</a>
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
  
        <CreateList></CreateList>
  
        <div class="space"></div>
        <h1>Public Lists</h1>
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
