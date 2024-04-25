const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
require('dotenv').config();

const app=express();
const port=5500;

//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const mongoURI=process.env.MONGO_URI;

//connecting to the database
mongoose.connect(mongoURI)
    .then(()=>console.log('connected to mongodb'))
    .catch(err=>console.error('error connecting to mongodb: ',err));

    //define a user schema
    const userSchema=new  mongoose.Schema({
        name: String,
        email: String,
        password: String
    });

const User=mongoose.model('User',userSchema);
app.get('/users',(req,res)=>{
    User.find({})
        .then(users=>res.json(users))
        .catch(err=>res.status(500).json({
            message: err.message
        }));
});

app.post('/users',(req,res)=>{
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });

    user.save()
        .then(newUser=>res.status(201).json(newUser))
        .catch(err=>res.status(400).json({
            message: err.message
        }));
});

app.put('/users/:id',(req,res)=>{
    const userId=req.params.id;
    const updateData={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    User.findByIdAndUpdate(userId,updateData,{new:true})
        .then(updateUser=>{
            if(!updateUser){
                return res.status(404).json({
                    message:"user not found"
                });
            }
            res.json(updateUser);
        })
        .catch(err=>res.status(400).json({
            message:err.message
        }));
});

app.delete('/users/:id',(req,res)=>{
    const userId=req.params.id;

    User.findByIdAndDelete(userId)
        .then(deleteUser=>{
            if(!deleteUser){
                return res.status(404).json({
                    message:"user not found"
                });
            }
            res.json({
                message:'user deleted successfully'
            })
        })
        .catch(err=>res.status(400).json({message:err.message}))
});

app.listen(port);

