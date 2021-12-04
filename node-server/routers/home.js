const express = require('express')
const router = express.Router()
const videoModel = require('../models/videoModel')

router.get('/', (req,res) => {
    videoModel.find({},(err,data)=>{
        if(err){
            console.log(err)
            res.send("Oops something went wrong")
        }
        else{
            if(req.session.userId == undefined){
                res.render('home',{movies:data, check:false})
            }
            else{
                const firstName = req.session.firstName
                const id = req.session.userId
                res.render('home',{movies:data, check:true, firstName, id})
            }
            
        }
    })
})

router.post('/',(req,res) =>{
    const search = req.body.search.trim()
    if(search != ""){
        videoModel.find({title:{ $regex: search, $options: "i" }}, (err,data) =>{
            if(err){console.log(err)
                return
            }
                if(req.session.userId == undefined){
                    res.render('home',{movies:data, check:false})
                }
                else{
                    const firstName = req.session.firstName
                    res.render('home',{movies:data, check:true, firstName})
                }
        })
    }
    else{
        res.redirect('/')
    }
})

module.exports = router