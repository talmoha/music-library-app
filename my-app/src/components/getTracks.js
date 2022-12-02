import icon from './icon.png'
import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'

function GetTracks () {
    useEffect(() => {
        document.getElementById('get-tracks').onclick = function() {
            tracksRange()
        }
        
        //search bar for track
        var track = document.getElementById('track');
        //assigning the div that I want to append to when creating a new div for search results
        const DivContainer = document.getElementById("new-div-tracks");
        
        //functions for not allowing the enter key to reload the page for any of the input values
        track.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
            event.preventDefault();
            tracksRange();
            }
            }
        );
        //input san. 
        function removeTags(str) {
            if ((str===null) || (str===''))
                return false;
            else
                str = str.toString();
                  
            //identify tags and replace them with just inner text
            return str.replace( /(<([^>]+)>)/ig, '');
        }

        //function to get tracks when you click search button for first search
        function getTracks() {
            //clear out the new div everytime the function is called if it is empty
            const elementsToDelete = document.getElementsByClassName("div-created");
            while(elementsToDelete.length > 0){
                elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
            }
            //fetch for tracks data
            fetch("/api/tracks")
            .then(res => res.json()
            .then(data => {
                //check if input is empty, if not then populate with search results matching input (track)
                var trackV = removeTags(track.value); ///input san.
                var trackV = trackV.trim(); //remove whitespace
                if (trackV != "" ) {
                    const item = document.createElement('div');
                    DivContainer.appendChild(item);
                    var ul = document.createElement('ul');
                    ul.classList.add('div-created');
                    item.appendChild(ul);
                    var i = 0;
                    var trackVArray = trackV.split(" ");
                    data.forEach(e => { //grab each element (e) and make a list item for it
                        //to search by track name
                        if ( i < 5 && trackVArray.some(v => e.title.toLowerCase().includes(v.toLowerCase()))) { //searches matching tracks even when words are missing or not correct
                            //track result button collapsed
                            var li=document.createElement('button');
                            li.setAttribute("type", "button");
                            li.classList.add('collapsible');
                            li.appendChild(document.createTextNode( `(${e.title})` + "\n"));
                            ul.appendChild(li);
                            //youtube button
                            var youtube=document.createElement('button');
                            youtube.setAttribute("type", "button");
                            youtube.appendChild(document.createTextNode("Youtube"));
                            //to get input as an array which splits song name and artist name's string with a + for every new word
                            var querySong= e.title.split(" ");
                            var queryName= e.artistName.split(" ");
                            var querySongJoined = querySong.join("+");
                            var queryNameJoined = queryName.join("+");
                            youtube.setAttribute("onclick", `window.open('https://www.youtube.com/results?search_query=${querySongJoined +"+"+ queryNameJoined}','_blank')`);
                            ul.appendChild(youtube);
                            
                            //creating collapsable content
                            var content = document.createElement('div');
                            content.classList.add('content');
                            li.appendChild(content);
                            var contentIn = document.createElement('p');
                            content.appendChild(contentIn);
                            contentIn.appendChild(document.createTextNode(`Track ID: ${e.id} Name: (${e.title}) Album: ${e.album}` + "\n"));
                            //when clicking on the button that says the track title, you can open up more details by making the content div visible
                            li.addEventListener("click", function() {
                                li.classList.toggle("active");
                                if (content.style.display === "block") {
                                    content.style.display = "none";
                                  } else {
                                    content.style.display = "block";
                                  }
                            })
                            i++;
                        }
                        //to search by album name
                        else if ( i < 5 && e.album.toLowerCase().includes(trackV.toLowerCase())) {
                            //track result button collapsed
                            var li=document.createElement('button');
                            li.setAttribute("type", "button");
                            li.classList.add('collapsible');
                            li.appendChild(document.createTextNode( `(${e.title})` + "\n"));
                            ul.appendChild(li);
                            //youtube button
                            var youtube=document.createElement('button');
                            youtube.setAttribute("type", "button");
                            youtube.appendChild(document.createTextNode("Youtube"));
                            //to get input as an array which splits song name and artist name's string with a + for every new word
                            var querySong= e.title.split(" ");
                            var queryName= e.artistName.split(" ");
                            var querySongJoined = querySong.join("+");
                            var queryNameJoined = queryName.join("+");
                            youtube.setAttribute("onclick", `window.open('https://www.youtube.com/results?search_query=${querySongJoined +"+"+ queryNameJoined}','_blank')`);
                            ul.appendChild(youtube);
                            
                            //creating collapsable content
                            var content = document.createElement('div');
                            content.classList.add('content');
                            li.appendChild(content);
                            var contentIn = document.createElement('p');
                            content.appendChild(contentIn);
                            contentIn.appendChild(document.createTextNode(`Track ID: ${e.id} Name: (${e.title}) Album: ${e.album}` + "\n"));
                            //when clicking on the button that says the track title, you can open up more details by making the content div visible
                            li.addEventListener("click", function() {
                                li.classList.toggle("active");
                                if (content.style.display === "block") {
                                    content.style.display = "none";
                                  } else {
                                    content.style.display = "block";
                                  }
                            })
                            i++;
                        }
                    });            
                }
            }))
        }

        //check range of input for tracks search before getting tracks
        function tracksRange() {
            //clear out warning every call
            document.getElementById("track-status").innerText = "";
            //clear out the new div everytime the function is called if it is empty
            const elementsToDelete = document.getElementsByClassName("div-created");
            while(elementsToDelete.length > 0){
                elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
            }
            var trackV = removeTags(track.value); //input san.
            if (trackV.length > 20) { //if more than 20 then warn user
                document.getElementById("track-status").innerText = `Warning: Input too long`;
            }
            else {
                getTracks();
            }
        }
    }, [])
    return (
      <div>
        <input id="track" type="text" placeholder="Search by track name..." name="name" required/>
            <button class="form-button" id="get-tracks" type="button" ><img class='icon' src={icon}/></button>
            <span id="track-status"></span>
            <div id="new-div-tracks"></div>
      </div>  
    );
}

export default GetTracks
