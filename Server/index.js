const express = require('express')
const app = express();
const User = require('./models/User')
const Post = require('./models/Post');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use('/uploads',express.static(__dirname+'/uploads'));
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const salt = bcrypt.genSaltSync(10);
const secrete = "dsafdhthfd";

const fs = require('fs');

const multer = require('multer');
const uploadMiddleware = multer({dest:'uploads/'});

mongoose.connect('mongodb+srv://Name: Passwordh@cluster0.tjyxe6v.mongodb.net/?retryWrites=true&w=majority');


app.post('/register',async(req,res)=>{
    const {username,password} = req.body;
    try{
    const userDoc = await User.create({username,password:bcrypt.hashSync(password,salt)});
    res.json(userDoc);
    }
    catch(e){
        res.status(400).json(e);
    }
})

app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const pass = bcrypt.compareSync(password,userDoc.password);
    if(pass){
        //logged in
        jwt.sign({username,id:userDoc._id},secrete,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
            // res.json(token);
        });
    }
    else{
        res.status(400).json('wrong credentials')
    }
})

app.get('/profile', (req,res)=>{
    const{token}= req.cookies;
    jwt.verify(token, secrete, {}, (err,info)=>{
        if(err) throw err;
        res.json(info);
    })
    res.json(req.cookies);
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok'); 
})


app.post('/post', uploadMiddleware.single('file'),async (req,res)=>{
    const {originalname,path} = req.file;
    // res.json({files:req.file});
    const parts = originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath = path+'.'+ext;
    fs.renameSync(path,newPath);
    // res.json({ext});

    const{token}= req.cookies;
    jwt.verify(token, secrete, {},async (err,info)=>{
        if(err) throw err;
        //add to db
    const {title,summary,content} = req.body;
    const postDoc= await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
    });

    res.json({postDoc})
    })
});

app.get('/post',async (req,res)=>{
    res.json(await Post.find()
    .populate(('author'),['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
})

app.put('/post',uploadMiddleware.single('file'),async(req,res)=>{
    let newPath = null;
    if(req.file){
        const {originalname,path} = req.file;
        // res.json({files:req.file});
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];
         newPath = path+'.'+ext;
        fs.renameSync(path,newPath);
    }

    const {token} = req.cookies;

    jwt.verify(token, secrete, {},async (err,info)=>{
        if(err) throw err;
        //add to db
        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuth = JSON.stringify( postDoc.author) === JSON.stringify( info.id);
        if(!isAuth){
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne(
            {
                title,
                summary,
                content,
                cover:newPath? newPath: postDoc.cover,
            }
        )
        res.json(postDoc);
    });


})


app.get('/post/:id', async(req,res)=>{
    const {id} = req.params;
    const postDoc=await Post.findById(id).populate('author',['username']);
    res.json(postDoc)
})

app.listen(4000);

