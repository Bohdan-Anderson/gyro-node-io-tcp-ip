// var midi = require('midi');
// var output = new midi.output();
// console.log(output.getPortCount());

// console.log(output.getPortName(0));
//output.openPort(0);
// output.sendMessage([172,22,1]);
// output.closePort();

console.log("started");


var net = require('net');
var localServer = net.createServer(function(c){
	console.log('server connected');
	c.on('end',function(){
		console.log('server disconnected');
	});
	c.write("0 0 0\n");

	function deepPass(){
		console.log("got here!");
	}
	// this.deepPass = function(){
	// 	console.log("got here!");
	// }
	c.pipe(c);


	newServer(c);

});
localServer.listen(8125,function(){
	console.log("server bound");
});



function newServer(writeTo){

	var idCounter = 0;
	var http = require('http');
	var fs = require('fs');	

	var httpServer = http.createServer(function (req, res){
		fs.readFile(__dirname +'/index.html', 'utf8', function(err, data){
			if(err){
				res.writeHead(500);
				return res.end("error loading index.html")
			} else {
				res.writeHead(200,{'Content-Type':'text/html'});
				res.end(data);
			}
		});
	})

	var io = require('socket.io').listen(httpServer);
	httpServer.listen(8124);

	io.sockets.on('connection', function (socket) {
		console.log("connection");
		++idCounter;
		socket.emit('setup', { id:idCounter });
		socket.on('message', function (data) {
			console.log(data);
			writeTo.write(data.id+ " ");
			writeTo.write(Math.floor(data.x) + " ");
			writeTo.write(Math.floor(data.y) + "");
			writeTo.write("\n");			
			//console.log(data);
		});

	});
}	