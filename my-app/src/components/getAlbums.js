import icon from './icon.png'
import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'

function GetAlbums () {
    useEffect(() => {
        document.getElementById('get-albums').onclick = function() {
            albumRange()
        }
        //search bar for track
        var album = document.getElementById('album');
        //search results div
        const DivContainer2 = document.getElementById("new-div-albums");

        //input san. 
        function removeTags(str) {
            if ((str===null) || (str===''))
                return false;
            else
                str = str.toString();
                  
            //identify tags and replace them with just inner text
            return str.replace( /(<([^>]+)>)/ig, '');
        }
        
        //check range of input for album search before getting album
        function albumRange() {
            //clear out warning every call
            document.getElementById("album-status").innerText = "";
            //clear out the new div everytime the function is called if it is empty
            const elementsToDelete = document.getElementsByClassName("div-created");
            while(elementsToDelete.length > 0){
                elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
            }
            var albumtV = removeTags(album.value); //input san.
            if (albumtV.length > 20) { //if more than 20 then warn user
                document.getElementById("album-status").innerText = `Warning: Input too long`;
            }
            else {
                getAlbum();
            }
        }

        //function to get album when you click search button for second search
        function getAlbum() {
            //clear out the new div everytime the function is called if it is empty
            const elementsToDelete = document.getElementsByClassName("div-created");
            while(elementsToDelete.length > 0){
                elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
            }
            //fetch for album data
            fetch("/api/albums")
            .then(res => res.json()
            .then(data => {
                var albumtV = removeTags(album.value); //input san.
                //check if input is empty, if not then populate with search results matching input (album)
                if (albumtV != "" ) {
                    const item = document.createElement('div');
                    DivContainer2.appendChild(item);
                    var ul = document.createElement('ul');
                    ul.classList.add('div-created');
                    item.appendChild(ul);
                    var i = 0;
                    data.forEach(e => { //grab each element (e) and make a list item for it
                        if ( i < 5 && e.title.toLowerCase().includes(albumtV.toLowerCase())) {
                            var li=document.createElement('li');
                            li.appendChild(document.createTextNode( `Album ID: ${e.id} Title: (${e.title}) Artist: ${e.artistName}`));
                            ul.appendChild(li);
                            i++;
                        }
                    });            
                }
            }))
        }
        //for space bar press
        album.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              albumRange();
              }
            }
        );

       
    }, [])
    return (
      <div>
        <input id="album" type="text" placeholder="Search by album name..." name="number" required />
            <button id="get-albums" type="button" class="form-button"><img class='icon' src={icon}/></button>
            <span id="album-status"></span>
            <div id="new-div-albums"></div>
      </div>  
    );
}

export default GetAlbums
