import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'

function CreateList () {
    useEffect(() => {
        //button for closing tracks from lists
        const greatBtn = document.getElementById('greatBtn')
        var maximumPublicLists = 0;
        //getting the list when the page first loads
        getList();
        
        //function to display existing lists whenever a new list is added
        function getList() {
            const l = document.getElementById("list");
            //clear out the new div everytime the function is called if it is empty
            const elementsToDelete = document.getElementsByClassName("card");
            while(elementsToDelete.length > 0){
                elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
            } 
            fetch("/api/lists")
            .then(res => res.json()
            .then(data => {
                data.forEach(e => { //grab each element (e) and make a list item for it
                    if (e.status =="public"&& maximumPublicLists < 10) { //only display public playlists and display only 10 playlists
                        maximumPublicLists++;
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
                        
                        //for displaying the number of tracks
                        const eTracks = e.tracks;
                        const eTracksNew = eTracks.toString();
                        if (e.tracks !=0) {
                            if (eTracksNew.includes(',')) { //first check if it is a list of ids or just one, a list has a comma seperating ids
                                var chars = (e.tracks).split(',');
                                const goodIDs = []; //the ids that exist that will be sent to the back end and added to the list
                    
                                for (var i=0;i<chars.length;i++) {
                                    if (chars[i] == 2 || chars[i] ==3 || chars[i] ==5 || chars[i] ==10 || chars[i] ==20 || chars[i] ==26 || chars[i] ==30 || chars[i] ==46 || chars[i] ==48 || (chars[i]>=134 && chars[i]<=155320)) {
                                        goodIDs.push(chars[i]);
                                    }
                                }
                            item4.appendChild(document.createTextNode( `Tracks #: ` + goodIDs.length + "\n"));
                            }
                            else {
                                item4.appendChild(document.createTextNode( `Tracks #:1`));
                            }
                            item3.appendChild(item4);
                        }
                        else {
                            item4.appendChild(document.createTextNode( `Tracks #:0`));
                            item3.appendChild(item4);
                        }
                        //for the alert function
                        item.onclick = function() { //when clicking a list
                            fetch("/api/tracks")
                            .then(res => res.json()
                            .then(data1 => {
                                var countmins =0; //counting mins and sec in each track so it can be displayed for a list
                                var countsecs =0;

                                const eTracks = e.tracks;
                                const eTracksNew = eTracks.toString();

                                //check if list is empty, if not then match the id of tracks added to track name, artist, album, and play time
                                if (eTracksNew.includes(',')) {
                                    var chars = (e.tracks).split(',');
                                    var stringAlert ="";

                                    for (var i=0;i<chars.length;i++) {
                                        if (chars[i] != 0 ) {
                                            const match = data1.filter(element => {
                                                if (element.id.toLowerCase() == parseInt(chars[i])) {
                                                return true;
                                                }
                                            });
                                            if (match.length> 0) {
                                            stringAlert += "Track: " + match[0].title + " Album: " + match[0].album + " Artist: " + match[0].artistName + " Duration: " + match[0].duration + "\n";
                                            getTracks1(match[0].title);
                                            greatBtn.style.display = "block";
                                            var time = match[0].duration.split(':');
                                            countmins += parseInt(time[0]);
                                            countsecs += parseInt(time[1]);
                                            }       
                                        }
                                    }
                                    if (countsecs> 60) {
                                        countmins += parseInt(countsecs/60);
                                        countsecs = parseInt(countsecs%60);
                                    }
                                    var alertFinal = stringAlert + "\n" +"Duration: " + countmins + ":" + countsecs + "\n" + "Creator: " + e.creator + "\n" +"Description: " + e.description;
                                    alert(alertFinal); 

                                }
                                else {
                                    if (e.tracks != 0) {
                                        const match = data1.filter(element => {
                                            if (element.id.toLowerCase() == parseInt(e.tracks)) {
                                            return true;
                                            }
                                        });
                                        console.log(match)
                                        if (match.length> 0) {
                                            alertFinal = "Track: " + match[0].title + " Album: " + match[0].album + " Artist: " + match[0].artistName + "\n" +" Duration: " + match[0].duration + "\n" + "\n" + "Creator: " + e.creator + "\n" + "Description: " + e.description;
                                            getTracks1(match[0].title);
                                            if (greatBtn.style.display === "none") {
                                                greatBtn.style.display = "block";
                                            } else {
                                                greatBtn.style.display = "none";
                                            }
                                            getTracks1(match[0].title);
                                            greatBtn.style.display = "block";
                                            alert(alertFinal);
                                        }
                                        else {
                                            alert("empty");
                                        }        
                                    }
                                }
                            }))  
                        };
                    }
                });
            }))
        }
        //assigning the div that I want to append to when creating a new div for search results
        const DivContainer = document.getElementById("new-div-list");
        
        //making the tracks disspear 
        greatBtn.onclick = function() {
            //clear out the new div everytime the function is called if it is empty
            const elementsToDelete = document.getElementsByClassName("div-created");
            while(elementsToDelete.length > 0){
                elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
            }
            greatBtn.style.display = "none";
        }

        //function to get tracks when you click search button for first search
        function getTracks1(s) {
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
                var trackV = s;
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

       
    }, [])
    
    return (
      <div>
      </div>  
    );
}

export default CreateList
