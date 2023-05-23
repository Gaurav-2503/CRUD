const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const student = require('./models/User')
const dbConfig = require('./db/dbConfig')
const path = require('path')
const app = express()

const temppath = path.join(__dirname , '/views')
app.set('view engine' , 'ejs');
app.set('views' , temppath)

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

mongoose.connect(dbConfig.url , {useNewUrlParser:true}).then(() => {
    console.log("Database Connected Successfully !!")
}).catch((err) => {
    console.log("Some error happend " , err.message)
})

app.get('/' , (req , res) => {
    res.render('index');
})

app.get('/countall' , async (req , res) => {
    try{
        const students = await student.find();
        res.status(200).render('count' , {totalCount : students.length})
        res.end();
        
    }catch(err){
        console.log("some error ", err.message)
    }
})

const findStuds = student.find({});

app.post("/filldetails" ,  async (req, res) => {

    // validation 
    // if(!req.body.name && !req.body.roll_no && !req.body.wad_marks && !req.body.cc_marks && !req.body.cns_marks && !req.body.dsbda_marks){
    //     res.status(400).json({Error:"Some Fields are missing"})
    // }

    // const studentadded = new student({
    //     name:req.body.name,
    //     roll_no : req.body.roll_no,
    //     wad_marks :req.body.wad_marks,
    //     cc_marks : req.body.cc_marks,
    //     dsbda_marks : req.body.dsbda_marks,
    //     cns_marks : req.body.cns_marks,
    //     all_marks : req.body.wad_marks + req.body.cns_marks + req.body.dsbda_marks + req.body.cc_marks
    // });

    // await studentadded.save().then((data) => {
    //     res.send({message:"Student data has been added to record " , studentJustAdded:data})
    // }).catch((err) => {
    //     res.send({message:"Some Error has Occured : " , Error:err.message})
    //     console.log("Some error happened " , err.message);
    // })
    
    try{

        const student1 = new student({
            name : req.body.name,
            roll_no : req.body.roll_no,
            wad_marks : req.body.wad_marks,
            cc_marks : req.body.cc_marks,
            cns_marks : req.body.cns_marks,
            dsbda_marks : req.body.dsbda_marks,
            all_marks : parseInt(req.body.wad_marks) + parseInt(req.body.cc_marks) + parseInt(req.body.cns_marks) + parseInt(req.body.dsbda_marks)
        })

        await student1.save();

        findStuds.then((data) => {
            console.log(req.body);
            res.render('table' , {record : data});
        }).catch((err => {
            res.status(401).send(err.message);
        }))


    }catch(err){
        res.send({Message : "Some eror happened" , err : err})
        console.log(err.message)
    }

  
})

app.get('/gt20dsbda' , (req ,res) => {

    // student.find({ dsbda_marks: { $gt: 20 } })
    // .then((student1) => {
    //     names=[]
    //     student1.forEach(function(item){
    //        names.push(item.name);
    //     })
    //     res.send({List:"Students having marks grater than 20 in dsbda are :  ", name : names})
    // }).catch((err) => {
    //     res.json({ message: "err" });
    //   });

    student.find({dsbda_marks : {$gt:20}}).then((data)=>{
        res.render('table' , {record : data})
    }).catch((err) => {
        res.status(401).send(err.message);
    })
})

app.patch('/updatemarks/:id' , async (req , res) => {
    if(!req.body){
        res.status(400).res.send({Message : "Body can not be empty"});
    }

    const id = req.params.id;

    await student.findByIdAndUpdate(id , req.body , {useFindAndModify:false}).then((data) => {
        if(!data){
            res.status(404).send({Error : "No Users found with given id"});
        }else{
            res.send({Message : "User is Successfullt updated" , data:data})
        }


    }).catch((err) => {
        res.status(404).send({error : "Some Error Occured " , err : err})
    })


})

app.get('/gt20all' , (req , res) => {

    student.find({wad_marks : {$gt : 20} ,cc_marks : {$gt : 20} , cns_marks : {$gt : 20} ,dsbda_marks : {$gt : 20} }).then((data) => {
        res.render('table' , {record : data});
    }).catch((err)=> {
        res.status(401).send(err.message);
    })
})

app.delete('/removeStudent/:id' , (req , res) => {
    student.findByIdAndRemove(req.params.id).then((data) => {

        if(!data){
            res.status(400).send({Message:"User not found"})
        }else{
            res.status(200).send({Message:"Successfully deleted the student record" , data:data})
        }

    }).catch((err) => {
        res.status(400).send(err.message)
    })
})





app.listen(3000 , ()=>{
    console.log("Server started at port 3000")
})