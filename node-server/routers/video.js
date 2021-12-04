const express = require('express')
const router = express.Router()
const app = express()
const fs = require('fs')
const videoModel = require('../models/videoModel')
const mongoose = require('mongoose')
const path = require('path')

router.get('/video/:id', (req,res)=>{
    const id = req.params.id
    if(id){
        videoModel.findById(id,(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                const views = data.views+1
                data.views = views
                data.save()
                res.render('video',{id,title:data.title,
                    description:data.description,
                    firstName: req.session.firstName, 
                    views, 
                    ownerId : data.ownerId ,
                    ownerName : data.ownerName,
                    userId : req.session.userId
                })
            }
        })
        
    }
    else{
        res.send("404 page not found")
    }
})

router.get('/vid/:id',(req,res) => {
    const id = req.params.id
    const dir = path.join(__dirname+"/../videos/"+id+".mp4")
    const stat = fs.statSync(dir)
    const fileSize = stat.size
    const range = req.headers.range

    if(range){
        const parts = range.replace(/bytes=/,'').split('-')
        const start = parseInt(parts[0],10)
        const end = (parts[1]) ? parseInt(parts[1],10) : fileSize-1
        
        if(start>=fileSize){
            res.status(416).send('Requested range not available')
            return
        }
        
        const chunkSize = (end-start)+1
        const file = fs.createReadStream(dir, {start,end})
        const head = {
            'Content-Range' : `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges' : 'bytes',
            'Content-Length' : chunkSize,
            'Content-Type' : 'video/mp4',
        }
        res.writeHead(206,head)
        file.pipe(res)
    }
    else{
        
        const head = {
            'Content-Length' : fileSize,
            'Content-Type' : 'video/mp4',
        }
        res.writeHead(200,head)
        fs.createReadStream(dir).pipe(res)
    }
})

module.exports = router