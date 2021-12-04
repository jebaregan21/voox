const express = require('express')
const router = express.Router()
const user = require('../models/userAccountModel')
const videoModel = require('../models/videoModel')

router.get('/account/:id',(req,res)=>{
    const id = req.params.id
    let firstName = null
    let description = null
    let movies = null
    let permission = false
    user.findById(id,(err,data)=>{
        if(data == null){
            res.send('No user found')
            return
        }
        firstName = data.firstname
        description = data.description
        videoModel.find({ownerId : id},(err,data)=>{
            movies = data
            if(id == req.session.userId){
                permission = true
            }
            res.render('account',{firstName,description,movies,permission, userName : req.session.firstName})
        })
    })
 
})

module.exports = router