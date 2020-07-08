const moment = require('moment');

function formatMessage(sender, receiver, message){
  return{
    sender,
    receiver,
    message,
    date: moment().format('MMM D, h:mm a')
  }
}

function findRoom(sender, receiver, rooms){
  return rooms.findIndex(room => room.match(sender) && room.match(receiver))
}

function findUser(username, users){
  return users.findIndex(user => user.username == username)
}


module.exports = {
  findRoom,
  formatMessage,
  findUser
}