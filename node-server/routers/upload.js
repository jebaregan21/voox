const express = require('express')
const { route } = require('./video')
const router = express.Router()
const formidable = require('formidable')
const videoModel = require('../models/videoModel')
const userModel = require('../models/userAccountModel')
const fs = require('fs')

router.get('/upload',(req,res)=>{
    res.render('upload',{firstName : req.session.firstName, id:req.session.userId})
})

router.post('/upload', (req,res)=>{
    let formData = new formidable.IncomingForm()
    formData.maxFileSize = 5 * 1024 * 1024 * 1024
    formData.parse(req,(err,fields,files)=>{
        const title = fields.title
        const description = fields.description

        const video = new videoModel({
            title,
            description
        })
        video.save((err,data) =>{
            if(err){
                console.log(err)
                return
            }
            const id = data._id
            data.ownerId = req.session.userId
            data.ownerName = req.session.firstName

            try{
                if(files.video.size == 0 || files.image.size == 0 || files.video === undefined || files.image === undefined){
                    data.remove({},(err,product)=>{
                        if(err){console.log(err)}
                    })
                    return
                }
                const oldVideoPath = files.video.path
                const newVideoPath = "C:\\Users\\Jeba\\Desktop\\voox\\videos\\"+id+".mp4"
                fs.rename(oldVideoPath,newVideoPath,(err)=>{
                    if(err){
                        data.remove({},(err,product)=>{
                            if(err){console.log(err); return}
                        })
                        res.send('ok')
                    }
                })

                const oldImagePath = files.image.path
                const newImagePath = "C:\\Users\\Jeba\\Desktop\\voox\\images\\"+id+".jpg"
                fs.rename(oldImagePath,newImagePath, err =>{
                    if(err){
                        data.remove({},(err,product)=>{
                            if(err){console.log(err); return}
                        })
                        res.sendStatus(404)
                    }
                })
                data.save()

                userModel.findById(req.session.userId, (err,data)=>{
                    data.videos.push(id)
                    data.save()
                })
                res.redirect('/')
            }
            catch(e){
                //console.log(e)
                fs.unlinkSync("C:\\Users\\Jeba\\Desktop\\voox\\videos\\"+id+".mp4", err=>{if(err){
                    res.send("Don't reload the page while uploading")
                }})
                fs.unlinkSync("C:\\Users\\Jeba\\Desktop\\voox\\images\\"+id+".jpg", err=>{
                    if(err){
                        res.send("Don't reload when uploading")
                    }
                })
                data.remove({},(err,product)=>{
                    if(err){console.log(err); return}
                })
                res.send("not good")
                return
            }
            
        })
   
    })
})

module.exports = router