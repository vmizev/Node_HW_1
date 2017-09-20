var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
    switch (req.url) {
        case "/file": {
          switch (req.method){
            case "POST": {
              var chunks = [];
              req.on("data", function(chunk){
                  chunks.push(chunk);
                })
                .on("end", function(){
                  var data = Buffer.concat(chunks).toString();
                  fs.writeFile('file.txt', data, function (err) {
                    if (err) throw err;
                    console.log('Saved new data to file!');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end();
                  });
                })              
            } break;
            case "GET": {
              fs.readFile('file.txt','utf8', (err, data) => {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({
                  text: data
                }));
                res.end();
              });
            } break;
            case "DELETE": {
              fs.truncate('file.txt', 0, function(){
                console.log('Data Cleared!')
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end();
              })
            }break;
            case "PUT": {
              var chunks = [];
              req.on("data", function(chunk){
                chunks.push(chunk);
              })
              .on("end", function(){
                var data = Buffer.concat(chunks).toString();
                fs.appendFile('file.txt', data, function (err) {
                  if (err) throw err;
                  console.log('Added text to the end of file!');
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end();
                });
              });
            } break;
            default:{
              res.statusCode = 404;
              res.setHeader("Content-Type", "text/plain");
              res.end("Not found!");
            }
          }
        } break;
        default: {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain");
          res.end("Not found!");
        }
    }
  })
  .listen(3000, '127.0.0.1', function(){
      console.info('Server running at 127.0.0.1:3000')
  })