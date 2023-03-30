var mongoose=require("mongoose");


const productSchema =new mongoose.Schema({
    adtitle:{
        type:String,
        require:true,
    },
    selectCategory:{
        type:String,
        require:true,
    },
    product:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    },
    phoneno:{
        type:Number,
        require:true,
    },
    year:{
        type:Number,
        require:true,
    },
    condition:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    }
})

const Product=new mongoose.model("Product",productSchema);

module.exports=Product;