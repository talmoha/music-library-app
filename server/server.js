const express = require('express'); //using express, set to var express
const app = express(); //app/router used
const port = 5000; //port number
const router = express.Router(); //router for genres
const router1 = express.Router(); //router for list
const router2 = express.Router(); //router for tracks
const router3 = express.Router(); //router for artists
const router4 = express.Router(); //router for albums

const csv = require('csv-parser'); //parser library
const fs = require('fs');//file stream
const genres = []; //to store data from genres csv file
const finalGenres = [];
var artist = []; //to store data from artist csv file
var finalArtist = [];
var track = []; //to store data from tracks csv file
var finalTrack = [];
var album = []; //to store data from tracks csv file
var finalAlbum = [];

//existing lists in the create list section
const list = [
    {name: 'Upbeat', id: 0, tracks: 0, creator: 'lucy', rating: 4, lastModified: '2021-01-11', description: "this is a playlist for happy times", status:"private", comments:"", numberOfRatings:1},
    {name: 'Sad', id: 1, tracks: "2,3", creator: 'adre', rating: 5, lastModified: '2020-01-11', description: "this is a playlist for sad times", status:"public", comment:"", numberOfRatings:1}
];

//setup serving front-end code
app.use('/', express.static('static'));

//setup middleware to do logging
app.use((req, res, next) => {
    console.log ( `${req.method} request for ${req.url}`);
    next(); //keep going
})

////////////////////////////////////////////////////////////////////////////for GENRES
//parse data in body as JSON
router.use(express.json());

//routes for /api/parts
router.route('/') //all the routes to the base prefix
    //get a list of all genres
    .get((req, res) => {
        res.send(finalGenres); //array of genres to display on URL localhost:3000/api/parts
    })
    
router.route('/:id') //all routes with a part ID
    //get details of a given part
    .get((req, res) => { //if you go to /api/parts/1 , it displays 1 on the page
        const partGenre = finalGenres.find(p => p.id === req.params.id);
        if (partGenre) {
            res.send(partGenre);
        }
        else {
            res.status(404).send(`Part ${req.params.id} was not found!`);
        }
    })

////////////////////////////////////////////////////////////////////////////for list
//parse data in body as JSON
router1.use(express.json());

//routes for /api/lists
router1.route('/') //all the routes to the base prefix
    //get a list of all lists
    .get((req, res) => {
        res.send(list); //array of genres to display on URL localhost:3000/api/list
    })

    //create a new part (post) if you give the body some json code
    .post((req, res) => {
        const newpart = req.body;
        if (newpart.name) {
            list.push(newpart);
            res.send(newpart);
        }
        else {
            res.status(400).send(`Missing name`);
        }
    })

router1.route('/:name') //routes with a part name
    //update details of a given part with given name
    .post((req, res) => {
    
        //find the part
        const part = list.findIndex(p => p.name === req.params.name);
    
        if (part < 0) { //not found
            res.status(404).send(`Part ${req.params.name} not found`);
        }
        else {//part exists, then change 
            list[part].status = req.body.status;
            list[part].tracks = req.body.tracks;
            list[part].description = req.body.description;
            list[part].lastModified = req.body.lastModified;
            list[part].comment = req.body.comment;
            list[part].rating = req.body.rating;
            list[part].numberOfRatings = req.body.numberOfRatings 
            res.send(list[part]);
        }
    })
    .delete((req, res) => {

        //find the part
        const part = list.findIndex(p => p.name === req.params.name);
        //if it doesn't exist
        if (part < 0) { //not found
            res.status(404).send(`List ${req.params.name} not found`);
        }
        //delete otherwise
        list.splice(part, 1);
        res.sendStatus(404);
    })

////////////////////////////////////////////////////////////////////////////for tracks
//parse data in body as JSON
router2.use(express.json());

//routes for /api/tracks
router2.route('/') //all the routes to the base prefix
    //get a list of all tracks
    .get((req, res) => {
        res.send(finalTrack); //array of tracks to display on URL localhost:3000/api/tracks
    })
    
router2.route('/:id') //all routes with a part ID
    //get details of a given part
    .get((req, res) => { //if you go to /api/tracks/1 , it displays track1 on the page
        const partTrack = finalTrack.find(p => p.id === req.params.id);
        if (partTrack) {
            res.send(partTrack);
        }
        else {
            res.status(404).send(`Track ${req.params.id} was not found!`);
        }
    })


////////////////////////////////////////////////////////////////////////////for artists
//parse data in body as JSON
router3.use(express.json());

//routes for /api/artists
router3.route('/') //all the routes to the base prefix
    //get a list of all artists
    .get((req, res) => {
        res.send(finalArtist); //array of artist to display on URL localhost:3000/api/artists
    })    

router3.route('/:id') //all routes with a part ID
    //get details of a given part
    .get((req, res) => { //if you go to /api/artist/1 , it displays 1 on the page
        const partArtist = finalArtist.find(p => p.id === req.params.id);
        if (partArtist) {
            res.send(partArtist);
        }
        else {
            res.status(404).send(`Part ${req.params.id} was not found!`);
        }
    })

////////////////////////////////////////////////////////////////////////////for albums
//parse data in body as JSON
router4.use(express.json());

//routes for /api/albums
router4.route('/') //all the routes to the base prefix
    //get a list of all albums
    .get((req, res) => {
        res.send(finalAlbum); //array of albums to display on URL localhost:3000/api/albums
    })   


//parse data in genre file
fs.createReadStream('genres.csv')
    .pipe(csv({}))
    .on('data', (data) => genres.push(data))
    .on('end', () => { //output data
        for (var {genre_id: id, parent: p, title: t} of genres) {
            finalGenres.push({id, p, t}); //push only the id, name, and parent of genres
        }
    });

//parse data in artist file
fs.createReadStream('raw_artists.csv')
    .pipe(csv({}))
    .on('data', (data) => artist.push(data))
    .on('end', () => { //output data
        for (var {artist_id: id, artist_active_year_begin: bYear, artist_active_year_end: eYear, artist_associated_labels: label, artist_name: name, artist_comments: comments, artist_handle: handle} of artist) {
            finalArtist.push({id, bYear, eYear, label, name, comments, handle});
        }
        finalArtist = finalArtist.slice(0,10);
    });

//parse data in track file
fs.createReadStream('raw_tracks.csv')
    .pipe(csv({}))
    .on('data', (data) => track.push(data))
    .on('end', () => { //output data
        for (var { track_id: id, album_title: album, artist_id: artistID, artist_name: artistName, tags: t, track_date_created: dateCreated, track_date_recorded: dateRecorded, track_duration: duration, track_genres: genres, track_number: number, track_title: title} of track) {
            finalTrack.push({id, album, artistID, artistName, t, dateCreated, dateRecorded, duration, genres, number, title});
        }
        finalTrack = finalTrack.slice(0,10); //slicing for now to make number of tracks more manageable
    });

//parse data in album file
fs.createReadStream('raw_albums.csv')
.pipe(csv({}))
.on('data', (data) => album.push(data))
.on('end', () => { //output data
    for (var { album_id: id, album_date_released: release, album_title: title, artist_name: artistName} of album) {
        finalAlbum.push({id, release, title, artistName});
    }
    finalAlbum = finalAlbum.slice(0,10); //slicing for now to make number of tracks more manageable
});

//get for root
app.get('/', (req, res) => {
    res.send(part);
});


//for GENRES: install router at /api/parts & we can use router instead of app
app.use('/api/parts', router)

//for LISTS: install router at /api/lists & we can use router1 instead of app
app.use('/api/lists', router1)

//for TRACKS: install router at /api/tracks & we can use router2 instead of app
app.use('/api/tracks', router2)

//for ARTISTS: install router at /api/artists & we can use router3 instead of app
app.use('/api/artists', router3)

//for ALBUMS: install router at /api/albums & we can use router4 instead of app
app.use('/api/albums', router4)

app.listen(port, () => console.log(`Listening on port ${port}...`)) //display this msg on console