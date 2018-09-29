const faker = require('faker');

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

module.exports.createData = function(x) {
  var records = [];
  for (var entries = x; entries < x + 25000; entries++) {
    records.push(generateEntry(entries));    
  }
  return records;
};