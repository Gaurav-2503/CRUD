const { default: mongoose } = require("mongoose");

const student = mongoose.Schema(

    {
        name:{type:String, required:true },
        roll_no : {type:Number, required:true , unique:true },
        wad_marks : {type:Number, required:true },
        cc_marks : {type:Number, required:true },
        dsbda_marks : {type:Number, required:true },
        cns_marks : {type:Number, required:true },
        all_marks : {type:Number, required:true }
    }

)

module.exports = mongoose.model("Student" , student);