var http = require("http");
var url = require("url");
var fs = require('fs');
var exec = require('child_process').exec;
var qs = require('querystring');

var id = '';
var sensor = '';

// command execute in shell
var commandVar = '. /opt/tinyos/setup.sh';  //Establecer variables de entorno
var command = ''; //Comando a enviar a la estación base 

function peticionServidor(req, resp) {

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
	  
	  body += data;
	  var post = qs.parse(body);  
	  console.log("VAR POST " + post['id']);
	  console.log("VAR POST " + post['sensor']);
	  
	  
          id = post['id'];
	  sensor = post['sensor']; 
	    
        });
        req.on('end', function () {
            /*if (body == "sensor=0") {
                console.log("Se ha seleccionado el Acelerometro: " + body);
	    }
            else {
                console.log("Se ha seleccionado el sensor de luz: " + body);    
	    }*/
	    
	child = exec(commandVar, function (error, stdout, stderr) {

		console.log('Comando enviado: ' + command);
    		// nodejs error
    		if (error !== null) {
      			console.log('exec error: ' + error);
    		}
    		else {
      		// save stdout to csv file
      			//fs.writeFile('example.csv', stdout, function (err) {
        		//if (err) {
          			//console.log(err);
        		//}
        		//else {
          			console.log('Enviada peticion ' + command + ' a estación base');
				console.log(stdout);
        		//}
      			//});
    		}
  	});
	

	console.log ('Este es mi sensor= ' + sensor);

	command = 'java ControlNewSense -comm serial@/dev/ttyUSB1:57600 ' + id + ' ' + sensor;
	child = exec(command, function (error, stdout, stderr) {

		console.log('Comando enviado: ' + command);
    		// nodejs error
    		if (error !== null) {
      			console.log('exec error: ' + error);
    		}
    		else {
      		// save stdout to csv file
      			//fs.writeFile('example.csv', stdout, function (err) {
        		//if (err) {
          			//console.log(err);
        		//}
        		//else {
          			console.log('Enviada peticion ' + command + ' a estación base');
				console.log(stdout);
        		//}
      			//});
    		}
  	});


	    
	    
	    
        });

        // Allow CORS
        resp.setHeader("Access-Control-Allow-Origin", "*");
        
        resp.writeHead(200, {'Content-Type': 'text/html'});
        resp.end('post received');
        
    }
    else
    {
        console.log("GET");
        //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
        //var html = fs.readFileSync('index.html');
        resp.writeHead(200, {'Content-Type': 'text/html'});
        resp.end('get received');
    }

};

http.createServer(peticionServidor).listen(10021);
console.log("Servidor creado");
