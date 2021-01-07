

const socket = io('/');
const msg = document.getElementById('main__chat__window');
const videoGrid=document.getElementById('video-grid');
const myVideo=document.createElement('video');
myVideo.muted=true;

let myStream;






var peer=new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030'
});

var messages={};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true
}).then(stream =>{
    myStream=stream
    addVideoStream(myVideo,stream);

    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })


    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId,stream) ;
    })
    
})

socket.on('msg',(lastMessage)=>{
    displayMessage(lastMessage)
    scrollToBottom();
})
peer.on('open',id=>{
    
    socket.emit('join-room',ROOM_ID,id)
})




const connectToNewUser=(userId,stream)=>{
    
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
}




const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
         video.play();
    });
    videoGrid.append(video);
}
let text = $('input')
$('button').click(e=>{
    e.preventDefault();
    if(text.val().length !== 0){
        
        socket.emit('message',text.val(),ROOM_ID);
        text.val('')
        
        

    }
})


const displayMessage=(message)=>{
    if (message !== undefined){
        
        const div=document.createElement('div');
        div.setAttribute('class','message')
        const h6 =  document.createElement('h6');
        h6.append(message.name)
        const p = document.createElement('p');
        p.append(message.message)
        div.append(h6)
        div.append(p)
        msg.append(div)
    }
 }

const scrollToBottom=()=>{
    let d= $('.main__chat__window');
    d.scrollTop(d.prop('scrollHeight'));
}
const muteToggle = ()=>{
    const enabled = myStream.getAudioTracks()[0].enabled;

        if (enabled){
         myStream.getAudioTracks()[0].enabled=false;
         setUnmute()
   }
   
   else{
         myStream.getAudioTracks()[0].enabled=true
        setMute()
    }
     }
const toggleVideo=()=>{
    const enabled = myStream.getVideoTracks()[0].enabled
    if (enabled){
        myStream.getVideoTracks()[0].enabled=false
        stopVideo();
    }
    else{
        myStream.getVideoTracks()[0].enabled=true
        playVideo();
    }
}

const setMute=()=>{
    
    const html= `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML=html;
}
const setUnmute=()=>{
    
    const html= `
    <i class="fas fa-microphone-slash unmute"></i>
    <span>Unmute</span>
`
document.querySelector('.main__mute__button').innerHTML=html;
}
const playVideo = ()=>{
    const html=`
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;
}
const stopVideo=()=>{
    const html=`
        <i class="fas fa-video-slash stopVid"></i>
        <span>Start Video</span>
    `
    document.querySelector('.main__video__button').innerHTML=html;    
}