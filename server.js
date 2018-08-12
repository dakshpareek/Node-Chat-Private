var express=require('express');
var app=express();
var fs = require('fs');
var socket=require('socket.io');
var server=app.listen(process.env.PORT || 3000,function()
{
console.log("Server Started at Port "+process.env.PORT || 3000);
});

//
app.get('/merchant/:name', function(req, res){
	st_data="";
	//check how many chat requests are there
			fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
						if (err){
						}
						else
						{
							obj = JSON.parse(data);
							try{
							dt=obj[req.params.name];
							dt.forEach(function(daataa, index, object) {
								if (req.params.name != daataa.user)
								{
								st_data+=`<a target='_blank' href='/?user=${req.params.name}&key=${daataa.key}&merchant=${req.params.name}'>${daataa.user}</a></br>`;
								}
							})
							//console.log(st_data);
							var html = "<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body>\n      <h1>"+req.params.name+"</h1>\n</br>"+st_data+"</body>\n</html>";
							res.send(html);
							}
							catch (err)
							{
							var html = "<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body>\n      <h1>"+req.params.name+"</h1>\n</br>"+"No Chat For You"+"</body>\n</html>";
							res.send(html);
							}
						}
					
					});	
	
	
	
	//console.log(st_data);
	
	//console.log(html);
   
   //res.sendFile(path.join(__dirname + '/merchant.html'));
});

//Static Files
app.use(express.static('public'));

//Connecting with socket
var io= socket(server);

io.on('connection',function(socket)
{

var userKey;
var userM;
console.log("Socket Connected");

var gp="Public";
//Creating New Group and adding this socket to it
  socket.on('group', function(group) {
		//{rm: room, name: naam,merch : merchant}
        console.log("New Group:"+ group.rm);
        socket.leave("Public");
        socket.join(group.rm);
        userKey=gp=group.rm;
        userM=mr=group.merch;
		console.log(mr);
		console.log(gp);
		console.log(group.name);
		//storing in json
		

		
		
		//appending json
		fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
			if (err){
				//console.log(err);
				var obj = {};
				obj[mr]=[{user: group.name, key:group.rm}];
				var json = JSON.stringify(obj);
				fs.writeFile('myjsonfile.json', json, 'utf8',function(err){
        console.log("Error :", err );
     });
				
				} 
			else {
		obj = JSON.parse(data); //now it an object
		try{
		obj[mr].push({user: group.name, key:group.rm});
		}
		catch (err){
			obj[mr]=[{user: group.name, key:group.rm}];
		}
		var json = JSON.stringify(obj);
    fs.writeFile('myjsonfile.json', json, 'utf8',function(err){
        console.log("Error", err );
     }); // write it back 
}});
		
		
		
		
    });

     socket.on('default_group', function(group) {
        console.log("Default Group:"+group);
        socket.join(group);
        gp=group;
        
    });
/*
var roster = io.sockets.clients('thisiskey');

roster.forEach(function(client) {
    console.log('Username: ' + client.nickname);
});

io.of('/').in('thisiskey').clients(function(error,clients){
        var numClients=clients.length;
		console.log(numClients);
    });
*/

	
/*//Dislay all connected sockets
Object.keys(io.sockets.sockets).forEach(function(id) {
    console.log("ID:",id)  // socketId
})
*/
socket.on('neww',function(data)
{
    socket.to(gp).emit('neww',data);
    //socket.broadcast.emit('neww',data);
})


//Process Event
socket.on('chat',function(data)
{
    io.sockets.in(gp).emit('chat',data);
    //io.sockets.emit('chat',data);
})

//Typing Event Handle
socket.on('typing',function(data)
{
    socket.to(gp).emit('typing',data);
    //io.socket.to('gp').emit('typing',data);
    //socket.broadcast.emit('typing',data);
}
)

  //Automatically Disconnect with socket when a user exit
    socket.on('disconnect', function(){
		
		fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
			if (err){
			}
			else
			{
				/*
				obj = JSON.parse(data);
				dt=obj[userM];
				dt.forEach(function(daataa, index, object) {
						if (daataa.key == userKey)
						{
							object.splice(index, 1);
						}
							//console.log("dada: "+daataa.key);
						});
						console.log("now..");
						console.log(dt);
				//console.log(obj[userM]);
			*/
			}
		
		});
		
		
		
		
		
		
		
    console.log('user disconnected');
    });
});
