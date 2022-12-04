import icon from './icon.png'
import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'

function GetArtists () {
    useEffect(() => {
        document.getElementById('get-artists').onclick = function() {
            artistRange()
        }
        //search bar for track
        var artist = document.getElementById('artist');
        //search results div
        const DivContainer1 = document.getElementById("new-div-artists");

        //input san. 
        function removeTags(str) {
            if ((str===null) || (str===''))
                return false;
            else
                str = str.toString();
                  
            //identify tags and replace them with just inner text
            return str.replace( /(<([^>]+)>)/ig, '');
        }
    
        //check range of input for artist search before getting artist
        function artistRange() {
            //clear out warning every call
            document.getElementById("artist-status").innerText = "";
            //clear out the new div everytime the function is called if it is empty
            const elementsToDelete = document.getElementsByClassName("div-created");
            while(elementsToDelete.length > 0){
                elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
            }
            var artistV = removeTags(artist.value); //input san.
            if (artistV.length > 20) { //if more than 20 then warn user
                document.getElementById("artist-status").innerText = `Warning: Input too long`;
            }
            else {
                getArtist();
            }
        }

        //function to get artists when you click search button for second search
        function getArtist() {
            //clear out the new div everytime the function is called if it is empty
            const elementsToDelete = document.getElementsByClassName("div-created");
            while(elementsToDelete.length > 0){
                elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
            }
            //fetch for artist data
            fetch("/api/artists")
            .then(res => res.json()
            .then(data => {
                var artistV = removeTags(artist.value); //input san.
                //check if input is empty, if not then populate with search results matching input (artist)
                if (artistV != "" ) {
                    const item = document.createElement('div');
                    DivContainer1.appendChild(item);
                    var ul = document.createElement('ul');
                    ul.classList.add('div-created');
                    item.appendChild(ul);
                    var i = 0;
                    data.forEach(e => { //grab each element (e) and make a list item for it
                        if ( i < 5 && e.name.toLowerCase().includes(artistV.toLowerCase())) {
                            var li=document.createElement('li');
                            li.appendChild(document.createTextNode( `Artist ID: ${e.id} Name: (${e.name}) Label: ${e.label}`));
                            ul.appendChild(li);
                            i++;
                        }
                    });            
                }
            }))
        }    
        //for space bar press
        artist.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              artistRange();
              }
            }
        );
       
    }, [])
    return (
      <div>
        <input id="artist" type="text" placeholder="Search by artist name..." name="number" required />
            <button id="get-artists" type="button" class="form-button"><img class='icon' src={icon}/></button>
            <span id="artist-status"></span>
            <div id="new-div-artists"></div>
      </div>  
    );
}

export default GetArtists