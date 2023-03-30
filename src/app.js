require('dotenv').config();
const { json } = require("body-parser");
const express =require("express");
const path=require("path");
const app=express();
const ejs=require("ejs");
const Register = require("./models/register");
const Product = require("./models/product");
const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const fileUpload=require("express-fileupload");
const cloudinary=require("cloudinary").v2;
require("./db/conn");
const cors = require('cors');
const { connect } = require('http2');
app.use(cors());

app.use(express.json())
cloudinary.config({ 
    cloud_name: process.env.CLOUDNAME, 
    api_key: process.env.APIKEY, 
    api_secret: process.env.APISECRET 
});

app.use(fileUpload({
    useTempFiles:true
}));

const hostname = '127.0.0.1';
const port=process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public/")

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));

app.use(express.static(static_path));
// app.use(require('connect').bodyParser());

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/viewcontact",async(req,res)=>{
    res.render("viewcontact");
})

app.post("/viewcontact",async(req,res)=>{
    res.render("index");
})

app.post("/register",async(req,res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){

            const registeruser=new Register({
                email:req.body.email,
                username:req.body.username,
                phone:req.body.phone,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword
            })

            const token=await registeruser.generateAuthToken();

            const registered=await registeruser.save();
            res.status(201).render("login");

        }else{
            res.send("Password are not matched");
        }

    } catch (error) {
        res.status(400).render("404");
    }
})

app.get("/GetAllProducts",async(req,res)=>{
    let allproduct=await Product.find();
    res.send(allproduct);
})

app.get("/product/:id",async(req,res)=>{
    productobj=await Product.findOne({_id:req.params.id});
    res.render("product",{product:productobj});
})

app.post("/login",async(req,res)=>{
    try {
        
        const email=req.body.email;
        const password=req.body.password;

        const useremail=await Register.findOne({email:email})

        const isMatch =await bcrypt.compare(password,useremail.password);
        const token=await useremail.generateAuthToken();

        if(isMatch){
            naam=useremail.username;
            res.status(201).render("home",{naam:naam});

            app.get("/logout",(req,res)=>{
                res.clearCookie('nToken');
                return res.redirect('/');
            });

            app.get("/home",(req,res)=>{
                // const naam=req.body.username;
                res.render("home",{naam:naam});
            })

            app.get("/product",(req,res)=>{
                res.render("product",{naam:naam});
            })

            app.get("/contactus",(req,res)=>{
                res.render("contactus",{naam:naam});
            })

            app.post("/contactus",(req,res)=>{
                res.render("home",{naam:naam});
            })
            
            app.get("/postad",(req,res)=>{
                res.render("postad",{naam:naam});
            })
            app.post("/postad",async(req,res)=>{
                const file =req.files.image;
                cloudinary.uploader.upload(file.tempFilePath,async(err,result)=>{
                    // console.log(result);
                    try {
                        const userProduct=new Product({
                            adtitle:req.body.adtitle,
                            selectCategory:req.body.selectCategory,
                            product:req.body.product,
                            price:req.body.price,
                            phoneno:req.body.phoneno,
                            year:req.body.year,
                            condition:req.body.condition,
                            image:result.url,
                            description:req.body.description
                        })
                        const useproduct=await userProduct.save();
                        res.status(201).render("home",{naam:naam});
                    } catch (error) {
                        res.status(400).render("404");
                    }
                })
            });
        }
        else{
            res.send(`invalid credentials`);
        }
        
    } catch (error) {
        res.status(400).render("404");
    }
});


app.listen(port,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
})
