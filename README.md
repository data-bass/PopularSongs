# DataBass

> Emulation of Spotify's web app

## Related Projects

  - https://github.com/data-bass/mitchProxy
  - https://github.com/data-bass/mattproxy
  - https://github.com/data-bass/MalcolmSpotifyProxy
  - https://github.com/data-bass/RobProxy-BestProxy

## Table of Contents

1. [API](#API)
1. [Requirements](#requirements)
1. [Development](#development)

## API

Schema:
```sh
id: Number, 
  name: String,
  albums: [{
    id: Number, 
    name: String, 
    img: String,
    publish: Number, 
    songs: [{
      id: Number,
      name: String,
      streams: Number,
      length: Number, 
      popularity: Number, 
      library: Boolean
```

  * GET Requests
    * /artists
      * returns all artists
    * /artists/id
      * returns a specific artist
  * POST Requests
    * /artists
      * creates a new artist
  * PUT Requests
    * /artists/id
      * updates a specific artist
  * DELETE Requests
    * /artists/id
      * deletes a specific artist

## Requirements

- Node 6.13.0

## Development

Starting the server
```sh
npm start
```

Running webpack
```sh
npm run react-dev
```

### Installing Dependencies

From within the root directory:

```sh
npm install
```

