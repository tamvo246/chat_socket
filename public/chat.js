var socket =io("http://localhost:3000/")
var username=document.getElementById('user-name')
var formchat=document.getElementById('form-chat')
var formlogin=document.getElementById('form-login')
var userlist=document.getElementById('show-user')
var btn=document.getElementById('submit')
var titlename=document.getElementById('title-user')
var logout=document.getElementById('log-out')



btn.addEventListener("click",function(){
    socket.emit('send-login',username.value)
    // console.log("asdasd")
})
socket.on('fail-login',()=>{
    alert("User name already exists")
})

socket.on('user-name',(data)=>{
    formlogin.style.display='none';
    formchat.style.transform='scale(1)';
    titlename.innerHTML= "Hello "+data
    // console.log(data)
})

socket.on('list-user',user=>{
    
    var string=''
    // user=user.slice()
    user.forEach(item => {
        string=string+"<div class='user'>"+item+"</div>"
    });
    userlist.innerHTML=string
})


logout.addEventListener("click",function(){
    socket.emit('log-out');
    formlogin.style.display='inline';
    formchat.style.transform='scale(0)';
})


document.getElementById('send').addEventListener("click",()=>{
    var message=document.getElementById('message').value
    socket.emit('text-message',message)
    document.getElementById('message').value=""

})

socket.on("server-text-message",data=>{
    console.log(data)
    let div = document.createElement('div');
    div.classList.add('show-message');
    let text = document.createTextNode(data.text);
    div.appendChild(text);
    document.getElementById('content').appendChild(div)
})

socket.on("server-text-message-lone",data=>{
    // console.log(data)
    let div = document.createElement('div');
    div.classList.add('show-message-right');

    let divChild=document.createElement('div')
    divChild.setAttribute("id", "message-right");
    let text = document.createTextNode(data.text);

    divChild.appendChild(text);
    div.appendChild(divChild)

    document.getElementById('content').appendChild(div)
})


document.getElementById('message').addEventListener('focus',()=>{
    socket.emit("chatting-in");
})
socket.on("chatting-in",()=>{
    document.getElementById('chatting').style.animationName="chat"
})
 
document.getElementById('message').addEventListener('blur',()=>{
    socket.emit("chatting-out");
})

socket.on("chatting-out",()=>{
    document.getElementById('chatting').style.animationName="none"
})








