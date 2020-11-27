const socket = io('/')
const peer= new Peer(undefined,{
  host:'/',
  port: '3031'
})
 
socket.emit('join-room',ROOM_ID,10)

socket.on('user-connected',userId=>{
console.log('USer Connected: ' + userId)  
})