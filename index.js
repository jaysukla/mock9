const express = require('express');
const {connection,User,Post} = require('./model/model')
var jwt = require('jsonwebtoken');
var cors = require('cors')
const bcrypt = require('bcrypt');
const app = express();
app.use(cors())
app.use(express.json())


app.get('/',(req,res)=>{
    res.send({"msg":"Api is Active"})
})

//signup

app.post('/api/register', async (req, res) => {
    let {name,email,password,dob,bio}=req.body;
      bcrypt.hash(password, 5, async function(err, hash) {
     let D = await User.insertMany([{name,email,'password':hash,dob,bio}])
    
    });
    
      res.status(201).send({"msg":"Registration successfull"});
    });
    
    // Route for user login
    app.post('/api/login',async (req, res) => {
    
    let {email,password} = req.body;
    let d= await User.find({email});
    let hash =d[0].password;
    
    bcrypt.compare(password, hash, function(err, result) {
     
    if(result==true){
      var token = jwt.sign({}, 'shhhhh');
      res.status(201).send({"msg":"login succes","token":token});
    }else{
        res.send({"msg":"Invalid Credentials"})
    }
    
    });
    
     
    
    
    });
    

    const WatchMan =(req,res,next)=>{
let token = req.headers.auth;
jwt.verify(token, 'shhhhh', function(err, decoded) {
   
if(decoded){
    next()
}else{
    res.status(401).send({"msg":"Login Please"})
}


  });

    }




app.get('/api/users',async (req,res)=>{

let data= await User.find()

res.status(200).send({"data":data})
})



app.get("/api/users/:id/friends",async (req,res)=>{

let UserId= req.params.id;

let user = await User.findById(UserId);

res.status(201).send({"friends":user.friends})

})


app.post("/api/users/:id/friends",WatchMan,async (req,res)=>{

    let data= req.body;
    let UserId= req.params.id;
    
    let user = await User.findById(UserId);
 
    user.friendRequests.push(data);

    let Update = await User.findByIdAndUpdate(UserId,user);
   
res.status(201).send({"data":Update});
    
    })
    


    app.put('/api/users/:id/friends/:friendId',WatchMan,async (req,res)=>{
        let UserId= req.params.id;
        let friendID = req.params.friendId;

        let user = await User.findById(UserId);
 

for(let i=0;i<(user.friendRequests).length ;i++){
    
    if((user.friendRequests)[i].id==friendID){
        (user.friendRequests).splice(i,1)
        break;
    }

}

console.log(user.friendRequests)

        user.friends.push({"id":friendID});
    
        let Update = await User.findByIdAndUpdate(UserId,user);
       



    res.status(204).send()



    })






app.get("/api/posts",async (req,res)=>{

let data= await Post.find();

res.status(200).send({"data":data})

})



app.post('/api/posts',WatchMan,async(req,res)=>{
let data= req.body;
let uid= data.user;
let d= await Post.insertMany([data]);

let user = await User.findById(uid);

user.posts.push({"id":d[0]._id})


let u= await User.findByIdAndUpdate(uid,user)


res.status(201).send({"data":u})

})



app.put('/api/posts/:id',WatchMan, async (req,res)=>{
let pid= req.params.id;
let data= req.body;

let d= await Post.findByIdAndUpdate(pid,data)


res.status(204).send()

})



app.delete("/api/posts/:id",WatchMan,async (req,res)=>{
let id = req.params.id;

let d= await Post.findByIdAndDelete(id)


let user = await User.findById(d.user)

for(let i=0;i<(user.posts).length;i++){
    if((user.posts)[i].id=id){
        (user.posts).splice(i,1)
        break;
    }
}
let u = await User.findByIdAndUpdate(d.user,user)



res.status(202).send()


})

 


app.post('/api/posts/:id/like',WatchMan,async (req,res)=>{
let id = req.params.id;
let data=req.body;

let post = await Post.findById(id);

post.likes.push(data);
    
let p= await Post.findByIdAndUpdate(id,post)


res.status(201).send({"data":p})

})





app.get("/api/posts/:id",async (req,res)=>{
let id= req.params.id;

let post = await Post.findById(id);

res.status(200).send({"data":post})

})




    app.listen(8080,()=>{
        try {
            
connection;
console.log("DB connection successfull")

        } catch (error) {
            console.log("Db connection failed",error)
        }

        console.log("Server is running on port 8080")
    })