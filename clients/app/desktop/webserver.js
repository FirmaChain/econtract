const http = require('http');
const fs = require("fs")
const hostname = "localhost"
const port = 62436;

//webserver
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  if(req.url == "/bundle.js"){
    res.end( fs.readFileSync(`${__dirname}/bundle.js`) )
  }else{
    res.end( fs.readFileSync(`${__dirname}/index.html`) )
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

export let WEB_SERVER_PORT = port