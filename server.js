const admin=require('firebase-admin')
const serviceAccount = require('./serviceConfig.json')
const https =require('https')
const express = require("express");
const fs =require('fs');
const app = express();
const path = require('path');

let lastMessage = {};

const server= https.createServer({
    cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem')),
    key:fs.readFileSync(path.join(__dirname,'cert','key.pem'))
},app)

const io= require('socket.io')(server)
const {v4: uuidv4}=require('uuid');
const {ExpressPeerServer}=require('peer');
const peerServer  = ExpressPeerServer(server,{
    debug:true
})


admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
})
const db = admin.firestore();

app.use(express.static('public'));
app.use('/peerjs',peerServer);
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
    
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room});
})


io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected",userId);
        
        
        
    })
    
    socket.on('message',(message,roomId)=>{
         db.collection('Rooms').doc('fabc').collection('messages').add({
            name:'Pranav',
            message:message,
            timestamp:admin.firestore.FieldValue.serverTimestamp()

        })
        setTimeout(() => {
            db.collection('Rooms').doc('fabc').collection('messages').orderBy('timestamp','desc').get().then(snapshot=>{
                let messages=snapshot.docs.map(doc=>doc.data())
                lastMessage=messages[0]
                io.in(roomId).emit('msg',lastMessage)
        })
        }, 200);
        
        
    })
})

server.listen(process.env.PORT||3030);


