var socket = io();

var url_string = window.location.href;
var url = new URL(url_string);
var naam = url.searchParams.get("user");
var room = url.searchParams.get("key");
var merchant= url.searchParams.get("merchant");
//console.log(c);

var message=document.getElementById('message');
//var naam=prompt("Enter Your Name");

var btn=document.getElementById('send');
var output=document.getElementById('output');
var tipe=document.getElementById('tipe');
var neww=document.getElementById('neww');
//var room=document.getElementById('room');

//var group='ABC';
//creating room
//room.addEventListener('click',function()
function roomie(group)
{
  // group=prompt("Enter Group Name"); 
    // socket.on('connect', function() {
   socket.emit('group', group);
      //});
}//)

if(room.value="Public")
{
    socket.emit('default_group', "Public");
}

//Emiting event to create a new Group
socket.on('connect', function() {
	data={rm: room, name : naam,merch : merchant};
	roomie(data);
   // console.log("Sockk");
   //socket.emit('group', group);
      });


//Sending Name To All
socket.emit('neww',naam);

//Getting Name on New
socket.on('neww',function(data)
{
neww.innerHTML = data + " is connected to help you. </br>";
})

//Emiting Event

btn.addEventListener('click',function()
//function send()
{
//socket.emit('group', room.value);
socket.emit('chat',{
    name : naam,
    message : message.value
});
message.value="";
});

//Handling Event
var chk=0;
socket.on('chat',function(data)
{

	htmR='<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg">';
	var d = new Date().toLocaleString(); 
	msgR='<p>'+ data.message +'</p><div class="incoming_msg_img"> '+ data.name +' </div></div></div>';
	addR='</div>';
	htmS='<div class="outgoing_msg"><div class="sent_msg">';
	
	tipe.innerHTML = "";
    neww.innerHTML = "";
	if (chk == data.name)
	{
		output.innerHTML += htmR+msgR+addR ;
		chk=data.name;
	}
	else
	{
		output.innerHTML += htmS+msgR;
		chk=data.name;
	}
    
    //output.innerHTML += "<b>"+ data.name +" :</b> " + data.message + "</br> ";

})

//Typing Function
message.addEventListener('keypress',function()
{
socket.emit('typing',naam);    
})

//Typing Event Handle
socket.on('typing',function(data)
{
tipe.innerHTML = data+" is typing ";
})
