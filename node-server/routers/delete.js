const express = require('express')
const router = express.Router()
const videoModel = require('../models/videoModel')
const user = require('../models/userAccountModel')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const { route } = require('./home')

router.get('/delete/:id',(req,res)=>{
    const id = req.session.userId
    const videoId = req.params.id
    videoModel.findById(videoId,(err,data)=>{
        if(data == null){
            res.send('No video found')
            return
        }
        if(data.ownerId == id){
            res.render('delete',{firstName:req.session.firstName,id,videoId})
        }
    })
})

router.post('/delete',(req,res)=>{
    const id = req.session.userId
    const password = req.body.password
    let videoId = req.body.videoId
    user.findById(id,(err,User)=>{
        if(bcrypt.compareSync(password, User.password)){
            const videoPath = `C:\\Users\\Jeba\\Desktop\\voox\\videos\\${videoId}.mp4`
            const imagePath = `C:\\Users\\Jeba\\Desktop\\voox\\images\\${videoId}.jpg`
            fs.unlinkSync(videoPath,err=>{})
            fs.unlinkSync(imagePath,err=>{})
            User.videos = User.videos.filter((video) => (video===videoId)?false:true)
            User.save(err =>{
                videoModel.deleteOne({_id:videoId},err=>{
                    res.json({check:true})
                })
            })
        }
        else{
            res.json({check:false})
        }
    })
})



module.exports = router