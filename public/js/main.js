const chatform=document.getElementById('chat-form');
const chatmessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//get username
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

const socket = io();

//join chatroom
socket.emit('joinroom',{username,room});

// get room and users
socket.on('roomusers', ({ room, users }) => {
  outputroomname(room);
  outputusers(users);
});

socket.on('message', message =>{
    outputMessage(message);
//scroll down to latest message
    chatmessages.scrollTop = chatmessages.scrollHeight;
});

chatform.addEventListener('submit', (e) => {
    e.preventDefault();
    //get msg text
    const msg = e.target.elements.msg.value;

    //emit msg to server
    socket.emit('chatmessage',msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//out msg to dom
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
      ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}
  
  // Add room name to DOM
  function outputroomname(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputusers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
  
  //Prompt the user before leave chat room
  document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });
  