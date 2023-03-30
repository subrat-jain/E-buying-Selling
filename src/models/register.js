const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const loginSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    username:{
        type:String,
        require:true,
    },
    phone:{
        type:Number,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    confirmpassword:{
        type:String,
        require:true,
    },
    tokens:[{
        token:{
            type:String,
            require:true,
        },
    }],
})

loginSchema.methods.generateAuthToken = async function(){
    try {
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part"+error);
    }
}

loginSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // console.log(`the password is ${this.password}`);
        this.password=await bcrypt.hash(this.password,4);
        // console.log(`the current password is ${this.password}`);

        this.confirmpassword=await bcrypt.hash(this.password,4);

    }
    next();
})

const Register = new mongoose.model("Register",loginSchema);

module.exports=Register;