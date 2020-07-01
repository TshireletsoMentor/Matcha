const socket = io();

const chatForm = document.getElementById('chat-form');

//Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;
  const sender = e.target.elements.sender.value;
  const receiver = e.target.elements.receiver.value;

  if(message.length < 10000){
    console.log(message);
    console.log(sender);
    console.log(receiver);
  }

  //emit message to the server
  // socket.emit('chatMessage', msg);

  e.target.elements.message.value = '';
  e.target.elements.message.focus;

})