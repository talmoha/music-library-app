document.getElementById('get-tracks').addEventListener('click', tracksRange); //getting button for tracks
document.getElementById('get-artists').addEventListener('click', artistRange); //getting button for artist
document.getElementById('get-albums').addEventListener('click', albumRange); //getting button for album

document.getElementById('add-list').addEventListener('click', checkListName);//variable for creating list
document.getElementById('add-list1').addEventListener('click', checkListName1);//var for adding tracks to list
document.getElementById('delete-list').addEventListener('click', checkListName2);//var for deleting list

getList(); //calling get list function at the beginning of each session to get existing lists right away
//assigning variables to track name input
var track = document.getElementById('track');
var artist = document.getElementById('artist');
var album = document.getElementById('album');

//assigning the div that I want to append to when creating a new div for search results
const DivContainer = document.getElementById("new-div-tracks");
const DivContainer1 = document.getElementById("new-div-artists");
const DivContainer2 = document.getElementById("new-div-albums");

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
        if (trackV != "" ) {
            const item = document.createElement('div');
            DivContainer.appendChild(item);
            var ul = document.createElement('ul');
            ul.classList.add('div-created');
            item.appendChild(ul);
            var i = 0;
            data.forEach(e => { //grab each element (e) and make a list item for it
                //to search by track name
                if ( i < 5 && e.title.toLowerCase().includes(trackV.toLowerCase())) {
                    var li=document.createElement('li');
                    li.appendChild(document.createTextNode( `Track ID: ${e.id} Name: (${e.title}) Album: ${e.album}`));
                    ul.appendChild(li);
                    i++;
                }
                //to search by album name
                else if ( i < 5 && e.album.toLowerCase().includes(trackV.toLowerCase())) {
                    var li=document.createElement('li');
                    li.appendChild(document.createTextNode( `Track ID: ${e.id} Name: (${e.title}) Album: ${e.album}`));
                    ul.appendChild(li);
                    i++;
                }
            });            
        }
    }))
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

//function to display existing lists at the beginning
function getList() {
    const l = document.getElementById("list");
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
            item3.appendChild(document.createTextNode( `${e.name}`));
            item2.appendChild(item3);
            const item4 = document.createElement('p');
            if (e.id !=0) {
                e.id = String(e.id);
                if (e.id.includes(',')) { //first check if it is a list of ids or just one, a list has a comma seperating ids
                    var chars = (e.id).split(',');
                    const goodIDs = []; //the ids that exist that will be sent to the back end and added to the list
        
                    for (i=0;i<chars.length;i++) {
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
            item.onclick = function() { //when clicking a list
                fetch("/api/tracks")
                .then(res => res.json()
                .then(data1 => {
                    var countmins =0; //counting mins and sec in each track so it can be displayed for a list
                    var countsecs =0;
                    //check if list is empty, if not then match the id of tracks added to track name, artist, album, and play time
                    if (e.id.includes(',')) {
                        var chars = (e.id).split(',');
                        var stringAlert ="";
                        
                        for (i=0;i<chars.length;i++) {
                            if (chars[i] != 0 ) {
                                const match = data1.filter(element => {
                                    if (element.id.toLowerCase() == parseInt(chars[i])) {
                                    return true;
                                    }
                                });
                                if (match.length> 0) {
                                stringAlert += "Track: " + match[0].title + " Album: " + match[0].album + " Artist: " + match[0].artistName + " Duration: " + match[0].duration + "\n";
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
                        alert(stringAlert + "\nDuration: " + countmins + ":" + countsecs); 
                    }
                    else {
                        if (e.id != 0) {
                            const match = data1.filter(element => {
                                if (element.id.toLowerCase() == parseInt(e.id)) {
                                  return true;
                                }
                            });
                            if (match.length> 0) {
                               alert("Track: " + match[0].title + " Album: " + match[0].album + " Artist: " + match[0].artistName + " Duration: " + match[0].duration + "\n");
                            }
                            else {
                                alert("empty");
                            }        
                        }
                        else {
                            alert("empty");
                        }
                    }
                }))  
            };
        });
    }))
}

//function to display existing lists whenever a new list is added
function getList1() {
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
            item3.appendChild(document.createTextNode( `${e.name}`));
            item2.appendChild(item3);
            const item4 = document.createElement('p');
            if (e.id !=0) {
                if (e.id.includes(',')) { //first check if it is a list of ids or just one, a list has a comma seperating ids
                    var chars = (e.id).split(',');
                    const goodIDs = []; //the ids that exist that will be sent to the back end and added to the list
        
                    for (i=0;i<chars.length;i++) {
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
            item.onclick = function() { //when clicking a list
                fetch("/api/tracks")
                .then(res => res.json()
                .then(data1 => {
                    var countmins =0; //counting mins and sec in each track so it can be displayed for a list
                    var countsecs =0;

                    //check if list is empty, if not then match the id of tracks added to track name, artist, album, and play time
                    if (e.id.includes(',')) {
                        var chars = (e.id).split(',');
                        var stringAlert ="";

                        for (i=0;i<chars.length;i++) {
                            if (chars[i] != 0 ) {
                                const match = data1.filter(element => {
                                    if (element.id.toLowerCase() == parseInt(chars[i])) {
                                    return true;
                                    }
                                });
                                if (match.length> 0) {
                                stringAlert += "Track: " + match[0].title + " Album: " + match[0].album + " Artist: " + match[0].artistName + " Duration: " + match[0].duration + "\n";
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
                        alert(stringAlert + "\nDuration: " + countmins + ":" + countsecs); 
                    }
                    else {
                        if (e.id != 0) {
                            const match = data1.filter(element => {
                                if (element.id.toLowerCase() == parseInt(e.id)) {
                                  return true;
                                }
                            });
                            if (match.length> 0) {
                               alert("Track: " + match[0].title + " Album: " + match[0].album + " Artist: " + match[0].artistName + " Duration: " + match[0].duration + "\n");
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

//function to add a list to existing lists
function addList() {
    var nameExistingList = document.getElementById('list-name');
    nameExistingList = removeTags(nameExistingList.value); //input sant.
    const newpart = {
        name: nameExistingList,
        id: 0
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
                getList1();
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

//function to add a track to an existing list
function addList1() {
    document.getElementById("status3").innerText = "";
    var listName = document.getElementById('list-name1').value; //getting input of list name
    listName = removeTags(listName);
    const listIDs = document.getElementById('track-id').value;
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
        if (listIDs.includes(',')) { //first check if it is a list of ids or just one, a list has a comma seperating ids
            var chars = (listIDs).split(',');
            const goodIDs = []; //the ids that exist that will be sent to the back end and added to the list
            const badIDs = []; //the ids that don't exist that wrongly inputted

            for (i=0;i<chars.length;i++) {
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
                id: document.getElementById('track-id').value
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
                            getList1();
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
                id: document.getElementById('track-id').value
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
                            getList1();
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
                        getList1();
                        document.getElementById("status2").innerText = `Deleted list`;
                    }
                    )
                    .catch(err => console.log('Failed to get json object'))  
                }
                else {
                    getList1();
                    document.getElementById("status2").innerText = `Deleted list`;
                }
            })
            .catch()
        }
    }))   

}

//functions for not allowing the enter key to reload the page for any of the input values
track.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      tracksRange();
      }
    }
);

artist.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      artistRange();
      }
    }
);

album.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      albumRange();
      }
    }
);

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

document.getElementById('track-id').addEventListener("keypress", function(event) {
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

//removing element tags for input sanitization
function removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
          
    //identify tags and replace them with just inner text
    return str.replace( /(<([^>]+)>)/ig, '');
}