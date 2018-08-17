var express=require('express');
var app=express();
var fs = require('fs');
var socket=require('socket.io');
var path = require("path");
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

var server=app.listen(process.env.PORT || 5000,function()
{
console.log("Server Started at Port "+process.env.PORT || 5000);
});

//
app.get('/merchant/:name', function(req, res){
	st_data="";
	//console.log("Here is Cookies");
	//console.log(req.cookies);
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
								})
							dt.reverse();
							//console.log(st_data);
							var html = "<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body>\n      <h1>"+req.params.name+"</h1>\n</br>"+st_data+"</body>\n</html>";
							
							//res.send(html);
							res.render('inbox', {
        dt: dt,
		name: req.params.name,
    });
							}
							catch (err)
							{
								
							var html = "<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body>\n      <h1>"+req.params.name+"</h1>\n</br>"+"No Chat For You"+"</body>\n</html>";
							res.send(html);
							//res.sendFile(path.join(__dirname+'/inbox.html'));
							
	
							
							}
						}
					
					});	
	

});
//live available users
values=[];
function check_key(ki)
{
	val=false;
	
	try{
	data1=fs.readFileSync('offline.json', 'utf8');
	obj1 = JSON.parse(data1);
	try{
	dt1=obj1["user_key"];
	
	dt1.forEach(function(daataa, index, object) {
		values.push(daataa['key']);
		
		})
	}
	catch (err)
	{
		console.log("keyss:");
	}
						
	//console.log("chkkk:"+values);
	
	values.forEach(function(data)
	{
	if (ki==data)
{
val=true;
}
	})
	}
	catch (err)
	{
		
	}
	
	return val;
}


var keyy=[];
app.get('/merchant/:name/live', function(req, res){
	//reading offline file
	keys=[];
	
	//console.log(check_key("thisiskey"));
	
	st_data="";
			fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
						if (err){
						}
						else
						{
							
							
						
						obj = JSON.parse(data);
							try{
							dt=obj[req.params.name];
							dt.forEach(function(daataa, index, object) {
								chq=check_key(daataa.key);
								console.log(chq);
								if (chq==true)
								{
									//console.log("h..");
									object.splice(index, 1);
								}
								//console.log(daataa.key);
								})
							dt.reverse();
							console.log(dt);
							var html = "<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body>\n      <h1>"+req.params.name+"</h1>\n</br>"+st_data+"</body>\n</html>";
							
							//res.send(html);
							res.render('inbox', {
								dt: dt,
								name: req.params.name,
							});
							}
							catch (err)
							{
								
							var html = "<!DOCTYPE html>\n<html>\n    <head>\n    </head>\n <body>\n      <h1>"+req.params.name+"</h1>\n</br>"+"No Chat For You"+"</body>\n</html>";
							res.send(html);
							//res.sendFile(path.join(__dirname+'/inbox.html'));
							
	
							
							}	
						}
							
						
						
						
					
					});	
	

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
var d = new Date().toLocaleString(); 

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


		
		
		//appending json
		fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
			if (err){
				//console.log(err);
				var obj = {};
				obj[mr]=[{user: group.name, key:group.rm ,tyme: d}];
				var json = JSON.stringify(obj);
				fs.writeFile('myjsonfile.json', json, 'utf8',function(err){
        console.log("Error :", err );
     });
				
				} 
			else {
		obj = JSON.parse(data); //now it an object
		try{
		obj[mr].push({user: group.name, key:group.rm, tyme: d });
		}
		catch (err){
			obj[mr]=[{user: group.name, key:group.rm , tyme: d}];
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
				obj = JSON.parse(data);
				try{
				dt=obj[userM];
				dt.forEach(function(daataa, index, object) {
						if (daataa.key == userKey)
						{
							//creating new file for keys
fs.readFile('offline.json', 'utf8', function readFileCallback(err, data){
if (err){
//console.log(err);
var obj = {};
obj["user_key"]=[{key: daataa.key }];
var json = JSON.stringify(obj);
fs.writeFile('offline.json', json, 'utf8',function(err){
console.log("Error :", err );
});
} 
else {
obj = JSON.parse(data); //now it an object
try{
obj["user_key"].push({key: daataa.key });
}
catch (err){
obj["user_key"]=[{key: daataa.key }];
}
var json = JSON.stringify(obj);
fs.writeFile('offline.json', json, 'utf8',function(err){
console.log("Error", err );
}); // write it back 
}});
							
							
							
							
						}
							
						});
				
				//save after removing user
				}
				catch (err)
				{
					console.log(err);
				}
				
				
						
			}
		
		});
		
		
		
		
		
		
		
    console.log('user disconnected');
    });
});
