const faker = require('faker');
var fs = require('fs');
// const Artists = require('./index.js');
var chalk = require( 'chalk' );
var ndjson = require( 'ndjson' );
var mongoose = require('mongoose');
var count = 0;

// mongoose.connect('mongodb://localhost/artists');

// 100 artists - 3 albums - 10 songs
const mariadb = require('mariadb');
// const pool = mariadb.createPool({host: 'localhost', user: 'student', connectionLimit: 5});
// var db = mariadb.createConnection({
//   user: 'student',
//   host: '127.0.0.1',
//   password: 'student',
//   database: 'music'
// }).then(conn => {
//   conn.on('error', err => {
//     console.log(err)
//   });

var num = 1;



var Create = function(number) {
  this.number = number;
  this.arr = [];
  this.arr2 = [];
};

Create.prototype.scope = function(callback) {
  callback.call(this);
};

var makeFile = function() {
  for (var i = 1; i <= 10000; i++) {
    count++;
    let objA = {
      id: count,
      name: faker.lorem.word(),
      albums: [] 
    };

    for (var j = 0; j < 3; j++) {
      let objB = {
        id: j,
        name: faker.lorem.words(),
        img: 'https://s3-us-west-1.amazonaws.com/dotthen/', 
        publish: Math.floor(Math.random() * (2018 - 1920 + 1)) + 1920, // published between 2018 and 1920
        songs: []
      };

      for (var k = 0; k < 10; k++) {
        let objC = {
          id: k,
          name: faker.lorem.words(),
          streams: Math.floor(Math.random() * (250000000 - 50000000 + 1)) + 50000000, // streams between 50mm and 250mm
          length: Math.floor(Math.random() * (300 - 210 + 1)) + 210, // length between 5 min and 3.5 min
          popularity: Math.floor(Math.random() * 20) + 1, // popularity scale between 1 and 20 - used to select most popular songs
          library: Math.random() >= 0.5 // whether song has been added to users library
        };
        objB.songs.push(objC);
      }
      objA.albums.push(objB);
    }
    this.arr.push(objA);
   
  }
  var transformStream = ndjson.stringify();
  var outputStream = transformStream.pipe( fs.createWriteStream( __dirname + `/data${this.number}.ndjson`, {'flags': 'a'} ) );

  this.arr.forEach(
    function iterator( arr ) {
      transformStream.write( arr );
    });
  transformStream.end();

  outputStream.on(
    'finish',
    function handleFinish() {

      // When we read the file back into memory, ndjson will stream, buffer, and split
      // the content based on the newline character. It will then parse each newline-
      // delimited value as a JSON object and emit it from the TRANSFORM stream.
      var inputStream = fs.createReadStream( __dirname + `/data${this.number}.ndjson` );
      var transformStream = inputStream.pipe( ndjson.parse() );

      transformStream
      // Each "data" event will emit one item from our original record-set.
        .on(
          'data',
          function handleRecord( data ) {

            console.log( chalk.red( 'Record (event):' ), data );
            this.arr2.push(data);
          }
        )

      // Once ndjson has parsed all the input, let's indicate done.
        .on(
          'end',
          function handleEnd() {

            console.log( '- - - - - - - - - - - - - - - - - - - - - - -' );
            console.log( chalk.green( 'ndjson parsing complete!' ) );
            console.log(this.arr2.length);


          });
    });
};

var plz = async function(number) {

  var runMe = new Create(num);
  return runMe.scope(makeFile)
  
}



plz()
  .then(num++);












  



 
  








