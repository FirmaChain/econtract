const http = require('http');
const fs = require("fs")
const hostname = "localhost"
const port = 62436;

//temp webserver..
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  if(req.url == "/bundle.js"){
    let bundle = fs.readFileSync(__dirname+"/bundle.js")
    res.end(bundle);
  }else{
    let html = fs.readFileSync(__dirname+"/index.html")
    res.end(html);
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

export let WEB_SERVER_PORT = port;
