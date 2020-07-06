var socket = io();

//dashboard.ejs
var liked = document.getElementById('like');
var viewToken = document.getElementById('like')
if(viewToken !== '' && viewToken !== null){
  viewToken = viewToken.getAttribute('href').replace("/like/", "");
}

var session = document.getElementById('session');
if(session !== null){
  session = session.textContent.toLowerCase().replace("welcome ", "");  
}

//search.ejs
var liked4 = document.getElementById('like4');

var viewToken4 = document.getElementById('like4');
if(viewToken4 !== null){
  viewToken4 = viewToken4.getAttribute('href').replace("/like4/", "");
}

var session4 = document.getElementById('session4');
if(session4 !== null){
  session4 = session4.textContent.toLowerCase();
}

//myLikes
var dislike1 = document.getElementById('dislike1');

var viewToken2 = document.getElementById('dislike1');
if(viewToken2 !== null){
  viewToken2 = viewToken2.getAttribute('href').replace("/like2/", "");
}

var session2 = document.getElementById('session2');
if(session2 !== null){
  session2 = session2.textContent.toLowerCase();
}

socket.on('connect', () => {
  var id = socket.id;

  socket.emit('userJoin', {id, session});

  if(liked){  
    liked.addEventListener("click", () => {
      socket.emit('like', {session, viewToken });
    });
  }

  if(liked4){    
    liked4.addEventListener("click", () => {
      socket.emit('like1', {session4, viewToken4 });
    });    
  }

  if(dislike1){
    dislike1.addEventListener("click", () => {
      socket.emit('dislike1', {session2, viewToken2 });
    });   
  }
})

socket.on('notification', notif => {
  console.log(notif)
})