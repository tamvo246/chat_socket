var express =require('express')
var app=express()
var server=require('http').createServer(app)
// const PORT=3000
app.set('view engine', 'ejs');
app.set('views','./views')
app.use(express.static("public"))
var user=[]
const io = require('socket.io')(server)


var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const multer  = require('multer')
const upload = multer({ dest: './public/uploads/' })

app.post('/',upload.single('avatar'),(req,res)=>{
    var avatar=req.file.path;
    avatar=avatar.replace("\\",'/');
    avatar=avatar.replace("\\",'/').split("/").slice(1).join("/");
    console.log(avatar)
    res.sendStatus(200);


})


io.on("connection",(socket)=>{
    console.log("socket connected")
    // socket.emit('list-user',user)
    socket.on('send-login',(data)=>{
        if(user.indexOf(data)>=0){
            socket.emit('fail-login')
        }
        else{
            socket.username=data;
            user.push(data);
            socket.emit('user-name',data);
            io.emit('list-user',user)
        }
    })
    socket.on('log-out',()=>{
        console.log(socket.username)
        user.splice(user.indexOf(socket.username),1)
        socket.broadcast.emit('list-user',user)
        // console.log(user)
    })
    socket.on('text-message',text=>{
        socket.broadcast.emit("server-text-message",{user:socket.username,text:text})
        socket.emit("server-text-message-lone",{user:socket.username,text:text})
        // console.log(text)
    })
    socket.on("chatting-in",()=>{
        socket.broadcast.emit("chatting-in")
    })

    socket.on("chatting-out",()=>{
        socket.broadcast.emit("chatting-out")
    })


})

const PORT =process.env.PORT||3000

server.listen(PORT,()=>{
    console.log('connect with PORT : ',PORT)
})
app.get('/',(req,res)=>{
    res.render('index')
})
