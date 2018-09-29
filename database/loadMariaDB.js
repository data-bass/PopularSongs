const _ = require('lodash');
const bluebird = require('bluebird');
const faker = require('faker');
// const createData = require('./seeding.js');
const mariadb = require('mariadb');
const concurrency = 5;
const batch = 25000;

var db = mariadb.createPool({
  user: 'student',
  host: '127.0.0.1',
  password: 'student',
  database: 'music',
  rowAsArray: true,
  connectionLimit: 10
})

var generateEntry = function(n) {
  var arr = [];
  let objA = {
    id: n,
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
  arr.push(objA);  
  return arr[0];  
};

const createData = function(x) {
  var records = [];
  for (var entries = x; entries < x + 25000; entries++) {
    records.push(generateEntry(entries));    
  }
  return records;
};

/* 
the usage of createPool instead of createConnection and async/await allows
for the data to be generated and inserted directly into the database
no memory cap increase is needed

total runtime for 10M entries is ~1 hour
*/
const insertDB = async () => {
  for (var i = batch; i <= 10000000; i+= batch) {
    var info = createData(batch)
    var records = Array(batch).fill().map((e,ind)=>[`${info[ind].name}`, `${JSON.stringify(info[ind].albums)}`]);
    const conn = await db;
    const query = `insert into artists(name, albums) values (?,?)`
    await bluebird.map(_.chunk(records, 1), task => {
        return conn.query(query, task[0])
    }, { concurrency })   
  }
  await conn.end()
}

insertDB();