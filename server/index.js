const express = require('express');
const bodyParser = require('body-parser');
const Artists = require('../database/index');
const path = require('path');
const cors = require('cors');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use( bodyParser.json() );
app.use(cors());
app.use(express.static(path.join(__dirname, '../public/')));


app.get('/artists/:id', function (req, res) {
  console.log('GET Req')
  let artistID = parseInt(req.params.id);
  console.log(artistID)
  //let artistID = parseInt(req.query.id, 10);
  Artists.findOne({id: req.params.id})
    .then(artist => res.json(artist))
    .catch(err => console.log(err));
});

app.get('/artists', function (req, res) {
  Artists.find({})
    .then(allArtists => res.json(allArtists))
    .catch(err => console.log(err));
});


// expect to receive {artistID, albumID, songID, added -> bool either 1 or 0}
app.put('/artists/:id', function (req, res) {
  let update = {};
  let artistID = parseInt(req.params.id, 10);
  var objProp = `albums.${req.body.albumID}.songs.${req.body.songID}.library`;
  update[objProp] = !!parseInt(req.body.added, 10);
  // Line 39 is old code. Line 40 is revised for SDC
  // Artists.findOneAndUpdate({id: req.body.artistID}, {$set:update})
  Artists.findOneAndUpdate({id: artistID}, {$set: update})
  // TO DO: get current boolean value from db and send back along with mssg
    .then(() => res.json({message: 'success', added: !!parseInt(req.body.added, 10)}))
    .catch(() => res.status(400).json({message: 'bad request'}));   
});

app.post('/artists', function (req, res) {
  var newArtist = {
    name: `${req.body.name}`,
    albums: `${req.body.albums}`
  };
  Artists.insertOne(
    `${newArtist}`
  )
    .then(() => res.json({message: 'success', added: `${newArtist}`}))
    .catch(() => res.status(400).json({message: 'bad request'}));
});

app.delete('/artists/:id', function (req, res) {
  let artistID = parseInt(req.params.id, 10);
  Artists.deleteOne({id: artistID})
    .then(delArtist => res.json(delArtist))
    .catch(err => console.log(err));
});

const PORT = 3003;

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});

