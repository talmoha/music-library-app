import { Component, useEffect } from 'react';
import React, {userEffect, useState} from 'react'

function CreateList () {
    useEffect(() => {
        //button for closing tracks from lists
        const greatBtn = document.getElementById('greatBtn')

        //getting the list when the page first loads
        getList();
        //for adding a new list
        document.getElementById('add-list').onclick = function() {
            checkListName()
        }
        //for adding tracks to a list
        document.getElementById('add-list1').onclick = function() {
            checkListName1()
        }
        //for deleting a list
        document.getElementById('delete-list').onclick = function() {
            checkListName2()
        }

        //input san. 
        function removeTags(str) {
            if ((str===null) || (str===''))
                return false;
            else
                str = str.toString();
                  
            //identify tags and replace them with just inner text
            return str.replace( /(<([^>]+)>)/ig, '');
        }
        
        //checking if list name exists when adding new list name
        function checkListName() {
            document.getElementById("status").innerText = "";
            var newList = document.getElementById('list-name').value;
            newList = removeTags(newList); //input sant.

            fetch("/api/lists")
            .then(res => res.json()
            .then(data => {
                //check name for each list element name
                const match = data.filter(element => {
                    if (element.name.toLowerCase() == newList.toLowerCase()) {
                    return true;
                    }
                });
                //check for input range
                if (newList.length > 20) { //if more than 20 then warn user
                    document.getElementById("status").innerText = `Warning: Input too long`;
                }
                else {
                    //if there is no match, then call addList function, if there is a match, then display error
                    if (match.length == 0)
                    {
                        addList();
                    }
                    else {
                        document.getElementById("status").innerText = `Name already exists`;
                    }
                }
            }))
        }

        //function to add a list to existing lists
        function addList() {
            var nameExistingList = document.getElementById('list-name');
            nameExistingList = removeTags(nameExistingList.value); //input sant.
            const newpart = {
                name: nameExistingList,
                tracks: 0
            }
            //use post 
            fetch('/api/lists', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(newpart)
            })
            .then(res => {
                if (res.ok) {
                    res.json()
                    .then(data => {
                        getList();
                        document.getElementById("status").innerText = `Created list: ${data.name}`;
                    }
                    )
                    .catch(err => console.log('Failed to get json object'))  
                }
                else {
                    console.log('Error:', res.status);
                    document.getElementById("status").innerText = `Failed to add`;
                }
            })
            .catch()
        }


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



        //checking if list name does not exist when adding tracks to it
        function checkListName1() {
            var newList1 = document.getElementById('list-name1').value;
            newList1 = removeTags(newList1); //input sant.

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
                    document.getElementById("status1").innerText = `Name doesn't exist`;
                }
                else {
                    addList1();
                }
            }))
        }

        //function to add a track to an existing list
        function addList1() {
            document.getElementById("status3").innerText = "";
            var listName = document.getElementById('list-name1').value; //getting input of list name
            listName = removeTags(listName);
            const listIDs = document.getElementById('track-id').value;
            const listIDsNew = listIDs.toString();
            fetch("/api/lists")
            .then(res => res.json()
            .then(data => {
                //check name for each list element name
                const match = data.filter(element => {
                    if (element.name.toLowerCase() == listName.toLowerCase()) {
                    return true;
                    }
                });
                //check if track ids are just numbers (within range of tracks ids in csv) & commas
                if (listIDsNew.includes(',')) { //first check if it is a list of ids or just one, a list has a comma seperating ids
                    var chars = (listIDs).split(',');
                    const goodIDs = []; //the ids that exist that will be sent to the back end and added to the list
                    const badIDs = []; //the ids that don't exist that wrongly inputted

                    for (var i=0;i<chars.length;i++) {
                        if (chars[i] == 2 || chars[i] ==3 || chars[i] ==5 || chars[i] ==10 || chars[i] ==20 || chars[i] ==26 || chars[i] ==30 || chars[i] ==46 || chars[i] ==48 || (chars[i]>=134 && chars[i]<=155320)) {
                            goodIDs.push(chars[i]);
                        }
                        else {
                            badIDs.push(chars[i]);
                        }
                    }
                    var newID = goodIDs.join(','); //the ids that exist that will be sent to the back end and added to the list
                    newID= String(newID);

                    const badIDsStatus = badIDs.join(','); //the ids that don't exist to alert the user that they were not added
                    
                    if (badIDs.length > 0) { //if there are bad ids then display warning
                        document.getElementById("status3").innerText = `\n*Following ID(s) inputted do not exist/invalid: ${badIDsStatus}`; //alerting user 
                    }

                    const newpart = { //sending json in req body
                        name: listName,
                        id: match[0].id,
                        tracks: newID
                    }

                    //if there is a match, then call post
                    if (match.length > 0) {
                        fetch(`/api/lists/${match[0].name}`, { //use post for match
                            method: 'POST',
                            headers: {'Content-type': 'application/json'},
                            body: JSON.stringify(newpart)
                        })
                        .then(res => {
                            if (res.ok) {
                                res.json()
                                .then(data => {
                                    getList();
                                    document.getElementById("status1").innerText = `Added track to list: ${data.name}`; //set status
                                }
                                )
                                .catch(err => console.log('Failed to get json object'))  
                            }
                            else {
                                document.getElementById("status").innerText = `Failed to add`;
                            }
                        })
                        .catch()
                    }
                }
                else if (listIDs == 2 || listIDs ==3 || listIDs ==5 || listIDs ==10 || listIDs ==20 || listIDs ==26 || listIDs ==30 || listIDs ==46 || listIDs ==48 || (listIDs>=134 && listIDs<=155320)) {
                    const newpart = { //sending json in req body
                        name: listName,
                        id: match[0].id,
                        tracks: listIDsNew
                    }

                    //if there is a match, then call post
                    if (match.length > 0) {
                        fetch(`/api/lists/${match[0].name}`, { //use post for match
                            method: 'POST',
                            headers: {'Content-type': 'application/json'},
                            body: JSON.stringify(newpart)
                        })
                        .then(res => {
                            if (res.ok) {
                                res.json()
                                .then(data => {
                                    getList();
                                    document.getElementById("status1").innerText = `Added track to list: ${data.name}`; //set status
                                }
                                )
                                .catch(err => console.log('Failed to get json object'))  
                            }
                            else {
                                document.getElementById("status").innerText = `Failed to add`;
                            }
                        })
                        .catch()
                    }
                } else {
                    document.getElementById("status1").innerText = ``; //keep "Added track.." status line empty
                    document.getElementById("status3").innerText = `\nPlease input valid ID(s)`; //alerting user
                }
            }))   
        }

        //checking if list name exist when deleting it
        function checkListName2() {
            var newList2 = document.getElementById('list-name2').value;
            newList2 = removeTags(newList2); //input sant.

            fetch("/api/lists")
            .then(res => res.json()
            .then(data => {
                //check name for each list element name
                const match = data.filter(element => {
                    if (element.name.toLowerCase() == newList2.toLowerCase()) {
                    return true;
                    }
                });

                //if there is a match, then delete, if there is a match, then display error
                if (match.length != 0)
                {
                    deleteList();
                }
                else {
                    document.getElementById("status2").innerText = `Name doesn't exist`;
                }
            }))
        }

        //function to delete list
        function deleteList() {
            var listName = document.getElementById('list-name2').value;
            listName = removeTags(listName);
            
            const newpart = {
                    name: listName,
            }

            fetch("/api/lists")
            .then(res => res.json()
            .then(data => {
                //check name for each list element name
                const match = data.filter(element => {
                    if (element.name.toLowerCase() == listName.toLowerCase()) {
                    return true;
                    }
                });
                if (match.length > 0) {
                    fetch(`/api/lists/` + match[0].name, {
                        method: 'DELETE',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify(newpart)
                    })
                    .then(res => {
                        if (res.ok) {
                            res.json()
                            .then(data => {
                                getList();
                                document.getElementById("status2").innerText = `Deleted list`;
                            }
                            )
                            .catch(err => console.log('Failed to get json object'))  
                        }
                        else {
                            getList();
                            document.getElementById("status2").innerText = `Deleted list`;
                        }
                    })
                    .catch()
                }
            }))   

        }

        //for space bar press
        document.getElementById('list-name').addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              checkListName();
              }
            }
        );
        
        document.getElementById('list-name1').addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              checkListName1();
              }
            }
        );
        
        
        document.getElementById('list-name2').addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              checkListName2();
              }
            }
        );
       
    }, [])
    
    return (
      <div>
        <span>
                Name: <input type="text" id="list-name"/>
                <button id="add-list"> Create</button>
        </span>
      </div>  
    );
}

export default CreateList